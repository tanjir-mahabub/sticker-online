import React, { useCallback, useEffect, useRef, useState } from 'react';
import Raphael from 'raphael';
import '@/lib/raphael.free_transform'; // Ensure this path is correct
import { CustomTransform } from './CustomTransform'; // Adjust the import path as needed
import { RaphaelPaper, useRaphaelElements } from '@/hooks/useRaphaelElements'; // Adjust the import path

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
import { removeText } from '@/redux/features/textSlice';
import { removeImage } from '@/redux/features/insideFrameSlice';

interface ExtendedRaphaelPaper extends RaphaelPaper {
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
    const { addImage, addText } = useRaphaelElements(paper);

    const StickerSelected = useAppSelector(state => state.sticker);

    const CanvasProperties = useAppSelector(state => state.canvas);
    const { centerX, centerY, frameWidth, frameHeight, bredd, hojd, grow } = CanvasProperties;


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

            const circle = paperInstance.circle(centerX, centerY, frameWidth / 2.5)
                /** @ts-ignore */
                .attr({
                    fill: "white",
                    stroke: "rgba(0,0,0,0.4)"
                })

            circle.hide();
            setCircleEl(circle);

            const rect = paperInstance.rect(centerX - frameWidth / 2, centerY - frameHeight / 2, frameWidth, frameHeight)
                /** @ts-ignore */
                .attr({
                    fill: "white",
                    stroke: "rgba(0,0,0,0.4)"
                })

            rect.hide();
            setRectEl(rect);

            setPaper(paperInstance);
            setStickerWrapper(StickerMainWrapper);
        }
    }, [paper, centerX, centerY, frameWidth, frameHeight, StickerSelected])

    useEffect(() => {
        if (paper) {
            /** @ts-ignore */
            StickerSelected.id === 1 && rectEl?.hide() & circleEl?.hide();
            /** @ts-ignore */
            StickerSelected.id === 2 && rectEl?.show() & rectEl?.attr({ r: 0 }) & circleEl?.hide();
            /** @ts-ignore */
            StickerSelected.id === 3 && rectEl?.hide() & circleEl?.show();
            /** @ts-ignore */
            StickerSelected.id === 4 && rectEl?.show() & rectEl?.attr({ r: 10 }) & circleEl?.hide();
        }
    }, [paper, centerX, centerY, frameWidth, frameHeight, StickerSelected, circleEl, rectEl])


    const handleElementInteraction = useCallback((el: any) => {
        if (currentFtRef.current && currentFtRef.current.subject.id !== el.id) {
            currentFtRef.current.unplug();
        }
        setSelectedItem(el);
        el.toFront();
        const ft = CustomTransform(el, {}, dispatch);
        currentFtRef.current = ft;

    }, [dispatch, setSelectedItem, currentFtRef]);

    useEffect(() => {
        if (paper) {
            imagePreviews.forEach((image) => {
                const element = addImage({
                    id: image.id,
                    src: image.src,
                    x: image.x || 0,
                    y: image.y || 0,
                    width: image.width || 350,
                    height: image.height || 280,
                    attrs: { opacity: 0.5, cursor: 'move' }, // Example attributes
                });
                // Attach event listeners or transformations to element here
                element.click(() => handleElementInteraction(element));

            });
        }
    }, [paper, imagePreviews, addImage, handleElementInteraction]);


    useEffect(() => {
        if (paper) {
            textPreviews.forEach((text) => {
                const element = addText({
                    id: text.id,
                    text: text.text,
                    x: text.x || 0, // Default to 0 if undefined
                    y: text.y || 0, // Default to 0 if undefined
                    rotate: 0, // Assuming default rotation of 0
                    scaleX: 1, // Assuming default scaleX of 1
                    scaleY: 1, // Assuming default scaleY of 1
                    attrs: {
                        cursor: "move",
                        fill: text.fill || '', // Default to empty string if undefined
                        "font-size": text.fontSize || 12, // Default font size if undefined
                        "font-family": text.fontFamily || 'Arial', // Default font family if undefined
                        opacity: 0.3
                    }
                });
                // Attach event listeners or transformations to element here
                element.click(() => handleElementInteraction(element));

            });
        }
    }, [paper, textPreviews, addText, handleElementInteraction]);





    useEffect(() => {
        if (selectedItem && paper) {
            const ft = CustomTransform(selectedItem, {}, dispatch);
            currentFtRef.current = ft;
        }
    }, [selectedItem, paper, dispatch]);

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

    console.log(textPreviews);

    // Assuming you have a function to reinitialize the free transform on an element
    const reapplyFreeTransform = (el: any) => {
        if (currentFtRef.current) {
            currentFtRef.current.unplug(); // Remove current free transform
        }
        const ft = CustomTransform(el, {}, dispatch); // Reapply with new settings
        currentFtRef.current = ft;
    };

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

            console.log("Deleting item with ID:", selectedItem.id);

            selectedItem.type === "image" && dispatch(deleteImage(selectedItem.id))
            selectedItem.type === "text" && dispatch(removeText(selectedItem.id))


            deselect();
            selectedItem.remove(); // Remove the element
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
        if (paper) {
            const paperCenter = { x: paper.width / 2, y: paper.height / 2 };
            const el = selectedItem;

            console.log(paper, el);
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


    const updatePositionFromTransform = (transformations: any) => {
        let translation = transformations.find((trans: any) => trans[0] === 'T');
        if (!translation) return { x: 0, y: 0 }; // Default to no movement if no translation found

        // Translation found, extract the dx and dy values
        let dx = translation[1];
        let dy = translation[2];

        // Assuming you have the initial position stored or accessible
        let initialX = 0; // Replace with the actual initial X position of your element
        let initialY = 0; // Replace with the actual initial Y position of your element

        // Calculate new position by applying the translation to the initial position
        const newX = initialX + dx;
        const newY = initialY + dy;

        return { newX, newY };
    };


    function getTransformValues(el: any) {
        let matrix = el.matrix;
        let scaleX = Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b);
        let scaleY = Math.sqrt(matrix.c * matrix.c + matrix.d * matrix.d);
        let rotation = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI); // In degrees
        let translateX = matrix.e;
        let translateY = matrix.f;

        return {
            x: translateX,
            y: translateY,
            width: el.attrs.width * scaleX, // Assuming el.attrs.width is the original width
            height: el.attrs.height * scaleY, // Assuming el.attrs.height is the original height
            scaleX: scaleX,
            scaleY: scaleY,
            rotation: rotation
        };
    }


    const handleEndOfTransformation = useCallback((element: any) => {
        // Example of how to get bbox which gives us x, y, width, and height
        const bbox = element.getBBox();

        console.log(`New Position: x=${bbox.x}, y=${bbox.y}`);


        // Example of extracting the transformation matrix for scale and rotation (if applicable)
        const matrix = element.matrix;
        const scaleX = Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b);
        const scaleY = Math.sqrt(matrix.c * matrix.c + matrix.d * matrix.d);
        const rotation = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI); // Rotation in degrees

        // Dispatch update to Redux store
        dispatch(updateElementAttributes({
            id: element.id,
            attributes: {
                x: bbox.x,
                y: bbox.y,
                width: bbox.width,
                height: bbox.height,
                scaleX: scaleX,
                scaleY: scaleY,
                rotate: rotation,
            }
        }));
    }, [dispatch]);


    const onEndFN = useCallback(() => {

        if (currentFtRef.current && typeof currentFtRef.current.updateHandles === 'function') {
            currentFtRef.current.updateHandles();
        }

        handleEndOfTransformation(selectedItem)



        if (isElementInsideFrame(selectedItem, centerX, centerY, frameWidth, frameHeight)) {
            selectedItem.attr({ opacity: 1 })
            // console.log("The element is inside the frame.");
        } else {
            selectedItem.attr({ opacity: 0.3 })
            // console.log("The element is outside the frame.");
        }

    }, [centerX, centerY, frameWidth, frameHeight, selectedItem, handleEndOfTransformation])

    useEffect(() => {
        if (selectedItem && paper) {
            if (selectedItem && paper) {
                let startX = 0; // Initial X position
                let startY = 0; // Initial Y position

                // Define drag functions
                const onMove = function (dx: number, dy: number) {
                    // Applying translation relative to the initial drag start position plus the delta
                    const newTransform = `T${startX + dx},${startY + dy}`;
                    selectedItem.transform(newTransform);
                };

                const onStart = function () {
                    // Extracting the current translation from the element's total transformation
                    const currentTransform = selectedItem.transform().local;
                    const translate = /T([\d.+-]+),([\d.+-]+)/.exec(currentTransform);
                    if (translate) {
                        startX = parseFloat(translate[1]);
                        startY = parseFloat(translate[2]);
                    } else {
                        startX = 0;
                        startY = 0;
                    }
                    console.log('Drag start at:', startX, startY);
                };

                const onEnd = function () {
                    console.log('Drag end');
                    onEndFN();
                };

                selectedItem.undrag(); // Remove previous drag handlers if any
                selectedItem.drag(onMove, onStart, onEnd);
            }

        }
    }, [onEndFN, paper, selectedItem, centerX, centerY, frameWidth, frameHeight]);



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
