import React, { useCallback, useEffect, useRef, useState } from 'react';
import Raphael from 'raphael';
import '@/lib/raphael.free_transform'; // Ensure this path is correct
import { CustomTransform } from './CustomTransform'; // Adjust the import path as needed
import { useRaphaelElements } from '@/hooks/useRaphaelElements'; // Adjust the import path

import { useAppSelector } from '@/redux/store';
import RangeSlider from "../Customize/child/Input/RangeSlider";
import Image from 'next/image';
import VectorFrame from './CanvasFrame';
import { BoundingBox, Frame } from '@/types/types';
import { calculateFrameEdges, isObjectInsideFrame } from '@/components/Utils/functions';
import Spinner from '@/components/Utils/Spinner';
import { fontDieCutFunction } from '@/components/Utils/fontDieCutFunction';
import { imageDieCutFunction } from '@/components/Utils/imageDieCutFunction';
import { useDispatch } from 'react-redux';
import { deleteImage, updateElementAttributes, updateImagePosition } from '@/redux/features/imagePreviewSlice';
import { removeText, updateTextElementAttributes } from '@/redux/features/textSlice';
import { removeImage } from '@/redux/features/insideFrameSlice';
import { clearAllHistories, deleteHistoryById } from '@/redux/features/historySlice';

interface ExtendedRaphaelPaper {
    width: number;
    height: number;
    forEach(callback: (el: any) => void): void;
    rect: (x: number, y: number, width: number, height: number, round?: number) => void;
    circle: (x: number, y: number, radius: number) => void;
    path: (d: string) => void;
}

const Vector = () => {
    const raphaelRef = useRef<HTMLDivElement | null>(null);
    const [paper, setPaper] = useState<ExtendedRaphaelPaper | null>(null);
    const [StickerWrapper, setStickerWrapper] = useState<HTMLDivElement | null>(null);
    const [rectEl, setRectEl] = useState<HTMLDivElement | null>(null);
    const [circleEl, setCircleEl] = useState<HTMLDivElement | null>(null);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);


    const dispatch = useDispatch();

    const imagePreviews = useAppSelector((state) => state.imagePreview.images);
    const textPreviews = useAppSelector((state) => state.text.texts);

    const currentFtRef = useRef<any>(null);
    const { addImageElement, addTextElement } = useRaphaelElements(paper);

    const ElementHistories = useAppSelector((state) => state.history.objectHistories);
    const StickerSelected = useAppSelector(state => state.sticker);

    const CanvasProperties = useAppSelector(state => state.canvas);
    const { centerX, centerY, frameWidth, frameHeight, bredd, hojd, grow } = CanvasProperties;

    /**
     * Paper Initialized
     */
    useEffect(() => {
        if (typeof window !== "undefined" && raphaelRef.current && !paper) {
            const width = raphaelRef.current.clientWidth;
            const height = raphaelRef.current.clientHeight;
            const paperInstance = new Raphael(raphaelRef.current, width, height);
            const svgElement = paperInstance.canvas;
            svgElement.id = "VECTORSVGId";

            const StickerMainWrapper = paperInstance.rect(0, 0, width, height).attr({
                fill: "transparent",
                stroke: "none"
            });

            const circleRadius = Math.min(frameWidth, frameHeight) / 2;
            const circle = paperInstance.circle(centerX, centerY, circleRadius)
                /** @ts-ignore */
                .attr({
                    fill: "white",
                    stroke: "rgba(0,0,0,0.4)"
                })

            circle.click(() => deselect())
            circle.hide();
            setCircleEl(circle);

            const rect = paperInstance.rect(centerX - frameWidth / 2, centerY - frameHeight / 2, frameWidth, frameHeight)
                /** @ts-ignore */
                .attr({
                    fill: "white",
                    stroke: "rgba(0,0,0,0.4)"
                })

            rect.click(() => deselect())
            rect.hide();
            setRectEl(rect);

            setPaper(paperInstance);
            setStickerWrapper(StickerMainWrapper);
        }
    }, [paper, centerX, centerY, frameWidth, frameHeight, StickerSelected])


    /**
     * Form Customize Logic
     */
    useEffect(() => {
        if (paper) {
            if (StickerSelected.id === 1) {
                // @ts-ignore
                rectEl?.hide();
                // @ts-ignore
                circleEl?.hide();
            } else if (StickerSelected.id === 2) {
                // @ts-ignore
                rectEl?.show();
                // @ts-ignore
                rectEl?.attr({ r: 0 });
                // @ts-ignore
                circleEl?.hide();
            } else if (StickerSelected.id === 3) {
                // @ts-ignore
                rectEl?.hide();
                // @ts-ignore
                circleEl?.show();
            } else if (StickerSelected.id === 4) {
                // @ts-ignore
                rectEl?.show();
                // @ts-ignore
                rectEl?.attr({ r: 10 });
                // @ts-ignore
                circleEl?.hide();
            }
        }

        if (rectEl) {
            // @ts-ignore
            rectEl.animate({ x: centerX - frameWidth / 2, y: centerY - frameHeight / 2, width: frameWidth, height: frameHeight }, 300, 'easeInOut');
        }

        if (circleEl) {
            const circleRadius = Math.min(frameWidth, frameHeight) / 2;
            // @ts-ignore
            circleEl.animate({ cx: centerX, cy: centerY, r: circleRadius }, 300, 'easeInOut');
        }
    }, [paper, centerX, centerY, frameWidth, frameHeight, StickerSelected, circleEl, rectEl]);





    const handleElementInteraction = useCallback((el: any) => {
        if (currentFtRef.current && currentFtRef.current.subject.id !== el.id) {
            currentFtRef.current.unplug();
        }
        setSelectedItem(el);
        el.toFront();
        const ft = CustomTransform(el, {}, dispatch);
        currentFtRef.current = ft;

    }, [dispatch, setSelectedItem, currentFtRef]);

    /**
     * Free Transform Logic
     * 
     * @param el any
     */
    const reapplyFreeTransform = useCallback((el: any) => {
        if (currentFtRef.current) {
            currentFtRef.current.unplug(); // Remove current free transform
        }
        const ft = CustomTransform(el, {}, dispatch); // Reapply with new settings
        currentFtRef.current = ft;
    }, [dispatch]);

    useEffect(() => {
        if (paper) {
            imagePreviews.forEach((image, index) => {
                const element = addImageElement({
                    id: image.id,
                    src: image.src,
                    x: image.x || index * 200,
                    y: image.y || 50,
                    width: image.width || 220,
                    height: image.height || 180,
                    attrs: { opacity: 0.5, cursor: 'move' },
                    type: (image.category === "image") ? "image" : "motiv", // Example attributes
                });
                // Attach event listeners or transformations to element here
                element.click(() => handleElementInteraction(element));

            });
        }
    }, [paper, imagePreviews, addImageElement, handleElementInteraction]);


    useEffect(() => {
        if (paper) {
            textPreviews?.forEach((text: any, index: number) => {
                const element = addTextElement({
                    id: text.id,
                    text: text.text,
                    x: (index + 1) * 200,
                    y: 300,
                    attrs: {
                        cursor: "move",
                        fill: text.fill || '',
                        "font-size": text.fontSize || 24,
                        "font-family": text.fontFamily || 'Arial',
                        opacity: 0.3
                    },
                    type: "text"
                });
                // Attach event listeners or transformations to element here
                element.click(() => handleElementInteraction(element));

            });
        }
    }, [paper, textPreviews, addTextElement, handleElementInteraction]);


    // History snippet
    useEffect(() => {
        if (selectedItem) {
            const objectId = selectedItem.id;
            const objectHistory = ElementHistories.find(history => history.objectId === objectId);
            const historyStep = objectHistory ? objectHistory.historyStep : 0;
            ElementHistories.map((item) => {
                // console.log('history item', item);
            })


        }
    })


    /**
     * Elements cleanup tasks from the paper
     */
    useEffect(() => {
        if (paper) {
            const elementsToRemove: any = [];
            const newImageElements: any = [];
            const newTextElements: any = [];

            paper.forEach(element => {
                if (isElementInsideFrame(element, centerX, centerY, frameWidth, frameHeight)) {
                    element.attr({ opacity: 1 });
                } else {
                    element.attr({ opacity: 0.3 });
                }

                const data = element.data().data;
                if (data === "image" || data === "motiv") {
                    newImageElements.push(element);
                }
                if (data === "text") {
                    newTextElements.push(element);
                }
            });

            const newImageArray = newImageElements.filter((img: any) => imagePreviews.some((item: any) => item.id === img.id));
            const newTextArray = newTextElements.filter((img: any) => textPreviews.some((item: any) => item.id === img.id));

            // Remove elements not present in the new image array
            paper.forEach((el: any) => {
                const data = el.data().data;
                if ((data === "image" || data === "motiv") && !newImageArray.some((item: any) => item.id === el.id)) {
                    elementsToRemove.push(el);
                } else if ((data === "text") && !newTextArray.some((item: any) => item.id === el.id)) {
                    elementsToRemove.push(el);
                }
            });

            elementsToRemove.forEach((el: any) => el.remove());
            deselect();

        }
    }, [paper, centerX, centerY, frameWidth, frameHeight, imagePreviews, textPreviews]);





    const deselect = () => {
        if (currentFtRef.current) {
            currentFtRef.current.unplug(); // Assuming unplug method exists to remove transformation
            currentFtRef.current = null;
        }
        setSelectedItem(null);
    };


    useEffect(() => {
        /** @ts-ignore */
        StickerWrapper && StickerWrapper.click(deselect);
    });


    // useEffect(() => {
    //     // Define the function that should run before unload
    //     const handleBeforeUnload = (e: Event) => {
    //         // updateAllTextTransforms();

    //         console.log('Saving text transformations before refresh or page navigation');
    //     };

    //     // Attach the event listener to the window object
    //     window.addEventListener('beforeunload', handleBeforeUnload);

    //     // Return a cleanup function that removes the event listener
    //     return () => {
    //         window.removeEventListener('beforeunload', handleBeforeUnload);
    //     };
    // }, [updateAllTextTransforms]);

    // useEffect(() => {
    //     ElementHistories && console.log(ElementHistories);
    // }, [ElementHistories])


    const isElementInsideFrame = (
        element: any,
        centerX: number,
        centerY: number,
        frameWidth: number,
        frameHeight: number
    ): boolean => {

        const frameX = centerX - frameWidth / 2;
        const frameY = centerY - frameHeight / 2;
        const frameX2 = frameX + frameWidth;
        const frameY2 = frameY + frameHeight;

        const frame: Frame = { centerX, centerY, frameWidth, frameHeight };
        const frameEdges = calculateFrameEdges(frame);
        const imagePosition: BoundingBox = element.getBBox();
        const inside = isObjectInsideFrame(imagePosition, frameEdges);

        return inside
    }


    const handleFlipX = () => {
        if (selectedItem && paper) {
            const bbox = selectedItem.getBBox(true);
            // Apply flipping by scaling
            selectedItem.transform(`...s-1,1,${bbox.x + bbox.width / 2},${bbox.y + bbox.height / 2}`);
            reapplyFreeTransform(selectedItem); // Reapply free transform
        }
    };

    const handleFlipY = () => {
        if (selectedItem && paper) {
            const bbox = selectedItem.getBBox(true);
            // Apply flipping by scaling
            selectedItem.transform(`...s1,-1,${bbox.x + bbox.width / 2},${bbox.y + bbox.height / 2}`);
            reapplyFreeTransform(selectedItem); // Reapply free transform
        }
    };

    const handleDelete = () => {
        if (selectedItem && paper) {
            if (currentFtRef.current) {
                currentFtRef.current.unplug(); // Proper cleanup
            }

            // console.log("Deleting item with ID:", selectedItem.id);

            selectedItem.type === "image" && dispatch(deleteImage(selectedItem.id)) && dispatch(deleteHistoryById(selectedItem.id))
            selectedItem.type === "text" && dispatch(removeText(selectedItem.id)) && dispatch(deleteHistoryById(selectedItem.id))


            selectedItem.remove(); // Remove the element            
            deselect();
            setSelectedItem(null); // Reset selection
        }
    };

    const centerElements = () => {
        if (paper) {
            const paperCenter = { x: paper.width / 2, y: paper.height / 2 };

            paper.forEach((el) => {
                // Check if the element has been marked as centerable
                if (el.data('isCenterable')) {
                    const bbox = el.getBBox();
                    const elCenter = { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 };
                    const translation = { x: paperCenter.x - elCenter.x, y: paperCenter.y - elCenter.y };

                    el.transform(`...T${translation.x},${translation.y}`);

                    if (isElementInsideFrame(el, centerX, centerY, frameWidth, frameHeight)) {
                        el.attr({ opacity: 1 })
                        // console.log("The element is inside the frame.");
                    } else {
                        el.attr({ opacity: 0.3 })
                        // console.log("The element is outside the frame.");
                    }


                    reapplyFreeTransform(el)
                }
            });
        }
    };

    const handleCenterEL = () => {
        if (paper && selectedItem) {
            const paperCenter = { x: paper.width / 2, y: paper.height / 2 };
            const el = selectedItem;

            if (el.data('isCenterable')) {
                const bbox = el.getBBox();
                const elCenter = { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 };
                const translation = { x: paperCenter.x - elCenter.x, y: paperCenter.y - elCenter.y };

                // Apply translation to center the element
                el.transform(`...T${translation.x},${translation.y}`);

                // Check if the element is inside the frame and adjust opacity accordingly
                if (isElementInsideFrame(el, centerX, centerY, frameWidth, frameHeight)) {
                    el.attr({ opacity: 1 });
                } else {
                    el.attr({ opacity: 0.3 });
                }

                // Reapply free transformation if necessary
                reapplyFreeTransform(el);
            }
        }
    };



    const handleDieCut = async () => {

        // add all images and text inside frame
        // if images then call imageDieCutFunction

        // setIsLoading(true);
        // // console.log('Die cut applying...', grow);

        // try {
        //     const selectedText = ("Sample Text").replace(/\s+/g, '');

        //     const newPathData = await fontDieCutFunction(selectedText, "/fonts/Ropa_Sans/RopaSans-Regular.ttf", 170, 1920, 300, "red", "red")
        //     // console.log('New Path Data:', newPathData);

        //     if (newPathData) {
        //         const pathEL = paper?.path(newPathData)
        //         /** @ts-ignore */
        //         pathEL?.attr({
        //             fill: "red",
        //             stroke: "rgba(0,0,0,0.3)"
        //         })

        //     }

        //     // const url = '/editor/sidebar/spiderman.png';
        //     // const pathData = await imageDieCutFunction(url);
        //     //console.log('Path Data:', pathData);

        //     setIsLoading(false);
        // } catch (error) {
        //     console.error('Error:', error);
        // }
    }


    useEffect(() => {
        if (selectedItem && paper) {
            if (selectedItem && currentFtRef.current && paper) {

                // Define drag functions
                const onMove = function (dx: number, dy: number) {

                };

                const onStart = function () {

                };

                const onEnd = function () {
                    // console.log('Drag end');

                    if (isElementInsideFrame(selectedItem, centerX, centerY, frameWidth, frameHeight)) {
                        selectedItem.attr({ opacity: 1 })
                        console.log(selectedItem);

                        // console.log("The element is inside the frame.");
                    } else {
                        selectedItem.attr({ opacity: 0.3 })
                        currentFtRef.current.opts.attrs.opacity = 0.3
                        // currentFtRef.current.attrs({ opacity: 0.3 })
                        // console.log("The element is outside the frame.");
                    }
                };


                selectedItem.drag(onMove, onStart, onEnd);
            }

        }
    }, [paper, selectedItem, centerX, centerY, frameWidth, frameHeight]);



    return (
        <div className="relative w-full h-full">

            {isLoading && <Spinner />}

            <VectorFrame />
            <div ref={raphaelRef} className="absolute left-0 top-0 z-50 w-full h-full mx-auto"></div>

            <div className='absolute z-50 left-0 bottom-0 w-full h-fit'>
                {(StickerSelected.id === 1) && (
                    <div className="absolute bottom-1.5 left-0 w-fit mx-auto h-3 flex justify-start items-end gap-5 z-50">
                        <div className="flex gap-3 p-4 space-y-3 w-60">
                            <RangeSlider minValue={0} maxValue={100} step={1} defaultValue={0} label="Kantlinje" />
                            <button onClick={handleDieCut} className='bg-white border border-black/20 rounded-full px-2.5 py-1.5'>Apply</button>
                        </div>
                    </div>
                )}

                {selectedItem && (
                    <div className="absolute bottom-2 left-0 w-full mx-auto h-3 flex justify-start items-end gap-5 z-40">
                        <div className="flex justify-center items-center w-full">
                            <div className='flex justify-center items-center bg-white shadow-sm border border-black/20 rounded-full overflow-hidden'>
                                <div onClick={handleFlipY} className='flex justify-center items-center h-full pl-3 pr-1 py-2 hover:bg-so-deep-gray cursor-pointer'>
                                    <Image src="/mirrorUpDownIcon.svg" width="20" height="20" alt="mirror-up-down-icon" />
                                </div>
                                <div onClick={handleFlipX} className='flex justify-center items-center h-full px-1.5 py-2 hover:bg-so-deep-gray cursor-pointer'>
                                    <Image src="/mirrorSideIcon.svg" width="20" height="20" alt="mirror-side-icon" />
                                </div>
                                <div onClick={handleCenterEL} className='flex justify-center items-center h-full px-1.5 py-2 hover:bg-so-deep-gray cursor-pointer'>
                                    <Image src="/centerIcon.svg" width="20" height="20" alt="center-icon" />
                                </div>
                                <div onClick={handleDelete} className='flex justify-center items-center h-full pr-3 pl-1 py-2 hover:bg-so-deep-gray cursor-pointer'>
                                    <Image src="/trash.svg" width="20" height="20" alt="trash" />
                                </div>

                            </div>
                        </div>
                    </div>
                )}

                {/* <div onClick={handleCenterEL} className='absolute right-3 bottom-3 cursor-pointer z-50'>
                    <Image src="/centerIcon.svg" width="20" height="20" alt="center-icon" />
                </div> */}
            </div>
        </div>
    );
};

export default Vector;
