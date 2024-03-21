import React, { use, useCallback, useEffect, useRef, useState } from 'react';
import Raphael from 'raphael';
import '@/lib/raphael.free_transform'; // Ensure this path is correct
import { CustomTransform } from './CustomTransform'; // Adjust the import path as needed
import { RaphaelPaper, useRaphaelElements } from '@/hooks/useRaphaelElements'; // Adjust the import path
import { useImageStorage } from '@/hooks/useImageStorage';
import { useTextStorage } from '@/hooks/useTextStorage';
import { useAppSelector } from '@/redux/store';
import RangeSlider from "../Customize/child/Input/RangeSlider";
import Image from 'next/image';
import VectorFrame from './CanvasFrame';
import { BoundingBox, Frame } from '@/types/types';
import { calculateFrameEdges, isObjectInsideFrame } from '@/components/Utils/functions';
import Spinner from '@/components/Utils/Spinner';
import { fontDieCutFunction } from '@/components/Utils/fontDieCutFunction';
import { imageDieCutFunction } from '@/components/Utils/imageDieCutFunction';

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

    const currentFtRef = useRef<any>(null);
    const { addImages, addTexts } = useRaphaelElements(paper);


    const StickerSelected = useAppSelector(state => state.sticker);
    const FileState = useAppSelector(state => state.file);
    const TextState = useAppSelector(state => state.text);
    const CanvasProperties = useAppSelector(state => state.canvas);
    const { centerX, centerY, frameWidth, frameHeight, bredd, hojd, grow } = CanvasProperties;

    const { data: previewImages } = useImageStorage('imageStore')
    const { data: previewTexts } = useTextStorage('textStore');


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

    useEffect(() => {
        if (paper) {

            const images: any = [];
            const texts: any = [];
            previewImages?.map((image, i) => {
                let img = {
                    src: image.src,
                    x: 10 * (i + 1), y: 10 * (i + 1), width: 350, height: 300,
                    attrs: { "opacity": 0.3, "cursor": "move" }
                }
                images.push(img)
            })

            previewTexts.map((text, i) => {
                let txt = {
                    x: text.x, y: text.y, text: text.text,
                    attrs: { "cursor": "move", "fill": text.fill, "font-size": text.fontSize, "font-family": text.fontFamily, "opacity": 0.3 }
                }
                texts.push(txt)
            })

            const elements = addImages(images).concat(addTexts(texts));

            elements.forEach(el => {
                el.click(() => {
                    if (currentFtRef.current && currentFtRef.current.subject.id !== el.id) {
                        currentFtRef.current.unplug();
                    }
                    setSelectedItem(el);
                    el.toFront();
                    const ft = CustomTransform(el, {});
                    currentFtRef.current = ft;
                });
            });
        }
    }, [paper, addImages, addTexts, previewImages, previewTexts]);

    useEffect(() => {
        if (paper) {

            const images: any = [];
            console.log('motive', FileState);
            FileState?.map((image, i) => {
                let img = {
                    src: image.src,
                    x: 10 * (i + 1), y: 10 * (i + 1), width: 350, height: 300,
                    attrs: { "opacity": 0.3, "cursor": "move" }
                }
                images.push(img)
            })

            console.log(images);
            const elements = addImages(images)

            elements.forEach(el => {
                el.click(() => {
                    if (currentFtRef.current && currentFtRef.current.subject.id !== el.id) {
                        currentFtRef.current.unplug();
                    }
                    setSelectedItem(el);
                    el.toFront();
                    const ft = CustomTransform(el, {});
                    currentFtRef.current = ft;
                });
            });
        }
    }, [paper, addImages, FileState]);

    useEffect(() => {
        if (paper) {
            const texts: any = [];

            TextState.selectedTexts.map((text, i) => {
                let txt = {
                    x: text.x, y: text.y, text: text.text,
                    attrs: { "cursor": "move", "fill": text.fill, "font-size": text.fontSize, "font-family": text.fontFamily, "opacity": 0.3 }
                }
                texts.push(txt)
            })

            const elements = addTexts(texts)

            elements.forEach(el => {
                el.click(() => {
                    if (currentFtRef.current && currentFtRef.current.subject.id !== el.id) {
                        currentFtRef.current.unplug();
                    }
                    setSelectedItem(el);
                    el.toFront();
                    const ft = CustomTransform(el, {});
                    currentFtRef.current = ft;
                });
            });
        }
    }, [paper, addTexts, TextState]);

    useEffect(() => {
        if (selectedItem && paper) {
            const ft = CustomTransform(selectedItem, {});
            currentFtRef.current = ft;
        }
    }, [selectedItem, paper]);

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



    useEffect(() => {
        if (selectedItem && paper) {

            // if (isElementInsideFrame(selectedItem, centerX, centerY, frameWidth, frameHeight)) {
            //     selectedItem.attr({ opacity: 0.7 })
            //     // console.log("The element is inside the frame.");
            // } else {
            //     selectedItem.attr({ opacity: 0.3 })
            //     // console.log("The element is outside the frame.");
            // }

            // Example of setting up drag on an element
            selectedItem.drag(
                // onmove
                function (dx: number, dy: number) {

                },
                // onstart
                function () {

                    console.log('running on start');
                },
                // onend
                function () {

                    if (isElementInsideFrame(selectedItem, centerX, centerY, frameWidth, frameHeight)) {
                        selectedItem.attr({ opacity: 1 })
                        // console.log("The element is inside the frame.");
                    } else {
                        selectedItem.attr({ opacity: 0.3 })
                        // console.log("The element is outside the frame.");
                    }
                }
            );

        }
    });



    // Assuming you have a function to reinitialize the free transform on an element
    const reapplyFreeTransform = (el: any) => {
        if (currentFtRef.current) {
            currentFtRef.current.unplug(); // Remove current free transform
        }
        const ft = CustomTransform(el, {}); // Reapply with new settings
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
                                <div onClick={handleDelete} className='flex justify-center items-center h-full pr-3 pl-1 py-2 hover:bg-so-deep-gray cursor-pointer'>
                                    <Image src="/trash.svg" width="20" height="20" alt="trash" />
                                </div>

                            </div>
                        </div>
                    </div>
                )}

                <div onClick={centerElements} className='absolute right-3 bottom-3 cursor-pointer z-50'>
                    <Image src="/centerIcon.svg" width="20" height="20" alt="center-icon" />
                </div>
            </div>
        </div>
    );
};

export default Vector;
