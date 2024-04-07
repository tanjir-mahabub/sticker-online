import { Tooltip } from "@/components/Utils/ToolTips"
import RangeSlider from "../../Customize/child/Input/RangeSlider"
import ButtonControl from "../../lib/ButtonControll"
import { usePaper } from "@/context/PaperContext";
import { useDispatch } from "react-redux";
import { useTransformUtils } from "@/hooks/useTransformUtils";
import { deleteImage } from "@/redux/features/imagePreviewSlice";
import { removeText } from "@/redux/features/textSlice";
import { deleteHistoryById } from "@/redux/features/historySlice";
import { useCallback, useEffect } from "react";
import { isElementInsideFrame } from "../elementUtils";
import { useAppSelector } from "@/redux/store";
import { fontDieCutFunction } from "@/components/Utils/fontDieCutFunction";
import { imageDieCutFunction } from "@/components/Utils/imageDieCutFunction";
import { generateSVGImageData, pixelsToCm } from "@/components/Utils/vectorFunction";
import { setCanvasProperties } from "@/redux/features/canvasSlice";
import { setBreddDefaultValue, setHojdDefaultValue } from "@/redux/features/formSlice";
import { BoundingBox } from "@/types/types";

const ControlElement = () => {
    const { paper, selectedItem, setSelectedItem, lastAddedElement, setLastAddedElement, stackOrder, setStackOrder, currentFtRef, isLoading, setIsLoading } = usePaper();

    const StickerSelected = useAppSelector(state => state.sticker);
    const CanvasProperties = useAppSelector(state => state.canvas);
    const { centerX, centerY, frameWidth, frameHeight, grow, backgroundColor } = CanvasProperties;

    const dispatch = useDispatch();

    const { reapplyFreeTransform } = useTransformUtils(dispatch, currentFtRef, setSelectedItem);

    const { deselect } = useTransformUtils(dispatch, currentFtRef, setSelectedItem);

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
            selectedItem.transform(`...s1,-1,${bbox.x + bbox.width / 2},${bbox.y + bbox.height / 2}`);
            reapplyFreeTransform(selectedItem);
        }
    };

    const handleSendFront = () => {
        if (selectedItem && paper && stackOrder.length > 0) {
            if (selectedItem.type !== "rect" && selectedItem.type !== "circle") {
                const currentIndex = stackOrder.indexOf(selectedItem);
                if (currentIndex < stackOrder.length - 1) {
                    const lastElement = stackOrder[stackOrder.length - 1];
                    selectedItem?.insertAfter(lastElement);
                    setStackOrder(prevOrder => {
                        const newOrder = [...prevOrder];
                        newOrder.splice(currentIndex, 1); // Remove selectedItem from its current position
                        newOrder.push(selectedItem); // Append selectedItem to the end of the array
                        return newOrder;
                    });
                    reapplyFreeTransform(selectedItem);
                }
            }
        }
    };

    const handleSendBack = () => {
        if (selectedItem && paper && stackOrder.length > 0) {
            console.log(selectedItem, stackOrder);
            if (selectedItem.type !== "rect" && selectedItem.type !== "circle") {
                const currentIndex = stackOrder.indexOf(selectedItem);
                if (currentIndex > 0) {
                    const firstElement = stackOrder[0];
                    selectedItem?.insertBefore(firstElement);
                    setStackOrder(prevOrder => {
                        const newOrder = [...prevOrder];
                        newOrder.splice(currentIndex, 1); // Remove selectedItem from its current position
                        newOrder.unshift(selectedItem); // Add selectedItem to the beginning of the array
                        return newOrder;
                    });
                    reapplyFreeTransform(selectedItem);
                }
            }
        }
    };


    const handleSendForward = () => {
        if (selectedItem && paper && stackOrder.length > 0) {
            if (selectedItem.type !== "rect" && selectedItem.type !== "circle") {
                const currentIndex = stackOrder.indexOf(selectedItem);
                if (currentIndex < stackOrder.length - 1) {
                    const nextElement = stackOrder[currentIndex + 1];
                    selectedItem.insertAfter(nextElement);
                    setStackOrder(prevOrder => {
                        const newOrder = [...prevOrder];
                        newOrder.splice(currentIndex, 1); // Remove from current position
                        newOrder.splice(currentIndex + 1, 0, selectedItem); // Insert after next element
                        return newOrder;
                    });
                    reapplyFreeTransform(selectedItem);
                }
            }
        }
    };

    const handleSendBackward = () => {
        if (selectedItem && paper && stackOrder.length > 0) {
            if (selectedItem.type !== "rect" && selectedItem.type !== "circle") {
                const currentIndex = stackOrder.indexOf(selectedItem);
                if (currentIndex > 0) {
                    const prevElement = stackOrder[currentIndex - 1];
                    selectedItem.insertBefore(prevElement);
                    setStackOrder(prevOrder => {
                        const newOrder = [...prevOrder];
                        newOrder.splice(currentIndex, 1); // Remove from current position
                        newOrder.splice(currentIndex - 1, 0, selectedItem); // Insert before previous element
                        return newOrder;
                    });
                    reapplyFreeTransform(selectedItem);
                }
            }
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
            dispatch(deleteHistoryById(selectedItem.id)) // delete history
            deselect();
            setSelectedItem(null); // Reset selection
        }
    };

    const centerElements = () => {
        if (paper) {
            const paperCenter = { x: paper.width / 2, y: paper.height / 2 };

            paper.forEach((el: any) => {
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
        setIsLoading(true);

        try {
            const imageUrl: string = selectedItem.attrs.src;

            // Generate SVG image data with the specified growth factor
            const svgImageData: string = await generateSVGImageData(imageUrl, frameWidth, frameHeight, grow);

            // Calculate the position for centering the dieCutImage within the frame
            const dieCutX: number = centerX - frameWidth / 2;
            const dieCutY: number = centerY - frameHeight / 2;

            // Create the dieCutImage using the generated SVG image data
            const dieCutImage = paper?.image("data:image/svg+xml," + encodeURIComponent(svgImageData), dieCutX, dieCutY, frameWidth, frameHeight);

            // Set additional attributes for the dieCutImage
            dieCutImage?.attr({
                opacity: selectedItem.attr('opacity'), // Set opacity
                // Add any other necessary attributes
            });

            paper.forEach((element: any) => {
                const { data } = element.data();
                const isRectOrCircle = data === "frame-rect" || data === "frame-circle";
                const isCircle = data === "frame-circle";

                console.log('testing', isRectOrCircle, isCircle);

                if (isRectOrCircle) {
                    dieCutImage.insertAfter(element);

                }
            })
            const bbox = dieCutImage.getBBox();

            console.log(bbox);


            // Set the canvas properties width and height to match the dieCutImage dimensions
            // dispatch(setCanvasProperties({ frameWidth: dieCutWidth, frameHeight: dieCutHeight }));

            const dpi = 96; // Example DPI value
            const widthInCm = pixelsToCm(bbox.width, dpi);
            const heightInCm = pixelsToCm(bbox.height, dpi);
            console.log(`${bbox.width} pixels is approximately ${widthInCm.toFixed(1)} cm at ${dpi} DPI.`);
            console.log(`${bbox.height} pixels is approximately ${heightInCm.toFixed(1)} cm at ${dpi} DPI.`);

            dispatch(setBreddDefaultValue(widthInCm))
            dispatch(setHojdDefaultValue(heightInCm))


            // Set loading state to false after completion
            setIsLoading(false);
        } catch (error: any) {
            console.error('Error:', error);
        }
    }

    /**
     * Svg export function
     */
    const handleDownloadSVG = () => {
        deselect()
        if (paper) {
            const svgData = paper.toSVG(centerX - frameWidth / 2, centerY - frameHeight / 2, frameWidth, frameHeight);

            // Create a Blob from the SVG data
            const blob = new Blob([svgData], { type: 'image/svg+xml' });

            // Create a URL for the Blob
            const url = window.URL.createObjectURL(blob);

            // Create a temporary anchor element
            const a = document.createElement('a');
            a.href = url;
            a.download = 'image.svg'; // Set the download filename
            document.body.appendChild(a);

            // Trigger a click event on the anchor to start the download
            a.click();

            // Cleanup
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }
    };


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
    }, [paper, currentFtRef, selectedItem, centerX, centerY, frameWidth, frameHeight]);



    const buttons = [
        { onClick: handleFlipY, iconSrc: "/mirrorUpDownIcon.svg", tooltip: "Flip Vertically", borderClasses: "border-r-0 border-black/20 rounded-l-full", borderRadiusClasses: "pl-3 pr-1" },
        { onClick: handleFlipX, iconSrc: "/mirrorSideIcon.svg", tooltip: "Flip Horizontally", borderClasses: "border-x-0 border-black/20", borderRadiusClasses: "px-1.5" },
        { onClick: handleSendFront, disabled: stackOrder.length === 1 && true, iconSrc: "/sendFront.svg", tooltip: "Send to Front", borderClasses: "border-x-0 border-black/20", borderRadiusClasses: "px-1.5" },
        { onClick: handleSendBack, disabled: stackOrder.length === 1 && true, iconSrc: "/sendBack.svg", tooltip: "Send to Back", borderClasses: "border-x-0 border-black/20", borderRadiusClasses: "px-1.5" },
        { onClick: handleSendForward, disabled: stackOrder.length === 1 && true, iconSrc: "/forward.svg", tooltip: "Send Forward", borderClasses: "border-x-0 border-black/20", borderRadiusClasses: "px-1.5" },
        { onClick: handleSendBackward, disabled: stackOrder.length === 1 && true, iconSrc: "/backward.svg", tooltip: "Send Backward", borderClasses: "border-x-0 border-black/20", borderRadiusClasses: "px-1.5" },
        { onClick: handleCenterEL, iconSrc: "/centerIcon.svg", tooltip: "Center Element", borderClasses: "border-x-0 border-black/20", borderRadiusClasses: "px-1.5" },
        { onClick: handleDelete, iconSrc: "/trash.svg", tooltip: "Delete Element", borderClasses: "border-l-0 border-black/20 rounded-r-full", borderRadiusClasses: "pr-3 pl-1" },
    ];


    return (
        <>
            <div className='absolute z-50 left-0 bottom-0 w-full h-fit'>
                {(StickerSelected.id) && (
                    <div className="absolute bottom-0 left-0 w-fit mx-auto h-3 flex justify-start items-end gap-5 z-50">
                        <div className="flex gap-3 p-4 space-y-3 w-60">
                            <RangeSlider minValue={1} maxValue={100} step={1} defaultValue={1} label="Kantlinje" />
                            <Tooltip message='Die Cut Effect'>
                                <button onClick={handleDieCut} className='text-sm font-semibold bg-white hover:bg-so-deep-gray cursor-pointer border border-black/20 hover:border-black/50 shadow-sm hover:shadow-lg rounded-full px-2 pt-1 pb-1.5'>Apply</button>
                            </Tooltip>

                            {/* <button onClick={handleDownloadSVG} className='text-sm font-semibold bg-white hover:bg-so-deep-gray cursor-pointer border border-black/20 hover:border-black/50 shadow-sm hover:shadow-lg rounded-full px-2 pt-1 pb-1.5'>Download</button> */}

                        </div>
                    </div>
                )}

                {selectedItem ? (
                    <div className="absolute bottom-2 left-0 w-full mx-auto h-3 flex justify-start items-end gap-5 z-40">
                        <div className="flex justify-center items-center w-full">
                            <div className='flex justify-center items-center bg-white shadow-sm border rounded-full'>
                                {buttons.map((button, index) => (
                                    <ButtonControl key={index} {...button} />
                                ))}
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </>
    )
}

export default ControlElement