import { Tooltip } from "@/components/Utils/ToolTips"
import RangeSlider from "../../Customize/child/Input/RangeSlider"
import ButtonControl from "../../lib/ButtonControll"
import { usePaper } from "@/context/PaperContext";
import { useDispatch } from "react-redux";
import { useTransformUtils } from "@/hooks/useTransformUtils";
import { deleteImage } from "@/redux/features/imagePreviewSlice";
import { removeText } from "@/redux/features/textSlice";
import { deleteHistoryById } from "@/redux/features/historySlice";
import { useEffect, useState } from "react";
import { isElementInsideFrame } from "../elementUtils";
import { useAppSelector } from "@/redux/store";
import { generateSVGImageData } from "@/components/Utils/DieCutFunction";
import { convertJpgToBase64, defaultOptions, handleFreeTransform } from "@/components/Utils/vectorFunction";
import materialStore from '@/store/materialStore';
import { addStackElement, clearStackOrder, removeStackElement, sendBack, sendBackward, sendForward, sendFront } from "@/redux/features/stackOrderSlice";
import { setCategoryToRemove } from "@/redux/features/categoryToRemove";


const ControlElement = () => {
    const [dieCutResult, setDieCutResult] = useState<string | null>(null);
    const { paper, selectedItem, setSelectedItem, currentFtRef, setIsLoading, lastAddedElement, elementActive, setElementActive } = usePaper();

    const materialDefault = useAppSelector(state => state.formValues.materialLastSelected);
    const stackOrder = useAppSelector(state => state.stackOrder);
    const StickerSelected = useAppSelector(state => state.sticker);
    const ImagePreview = useAppSelector(state => state.imagePreview);
    const CanvasProperties = useAppSelector(state => state.canvas);
    const CategoryToRemove = useAppSelector(state => state.categoryToRemove);

    const [sendFrontBTN, setSendFrontBTN] = useState(true)
    const [sendBackBTN, setSendBackBTN] = useState(true)
    const [sendForwardBTN, setSendForwardBTN] = useState(true)
    const [sendBackwardBTN, setSendBackwardBTN] = useState(true)

    const { centerX, centerY, frameWidth, frameHeight, grow, backgroundColor } = CanvasProperties;

    const dispatch = useDispatch();

    const { deselect, reapplyFreeTransform, handleElementInteraction } = useTransformUtils(dispatch, currentFtRef, setSelectedItem);

    const handleFlipX = () => {
        if (selectedItem && paper) {
            const bbox = selectedItem.getBBox(true);
            // Apply flipping by scaling
            selectedItem.transform(`...s-1,1,${bbox.x + bbox.width / 2},${bbox.y + bbox.height / 2}`);
            
            const oldFt = selectedItem.freeTransform
            oldFt.unplug()
           
            const handleTransform = (ft: any, events: any) => {
                const transformedItem = handleFreeTransform(ft, events);
    
                transformedItem && setSelectedItem(transformedItem)
            }
            const newFt = paper?.freeTransform(selectedItem, `freeTransform stickerHandle-${selectedItem.id}`, defaultOptions, handleTransform);
            if (newFt.handles) {
                if (newFt.handles.x.line) newFt.handles.x.line.hide();

                if (newFt.handles.x.disc) newFt.handles.x.disc.hide();
            }
        }
    };

    const handleFlipY = () => {
        if (selectedItem && paper) {
            const bbox = selectedItem.getBBox(true);
            selectedItem.transform(`...s1,-1,${bbox.x + bbox.width / 2},${bbox.y + bbox.height / 2}`);
            
            const oldFt = selectedItem.freeTransform
            oldFt.unplug()
           
            const handleTransform = (ft: any, events: any) => {
                const transformedItem = handleFreeTransform(ft, events);
    
                transformedItem && setSelectedItem(transformedItem)
            }
            const newFt = paper?.freeTransform(selectedItem, `freeTransform stickerHandle-${selectedItem.id}`, defaultOptions, handleTransform);
            if (newFt.handles) {
                if (newFt.handles.x.line) newFt.handles.x.line.hide();

                if (newFt.handles.x.disc) newFt.handles.x.disc.hide();
            }

        }
    };

    const handleSendFront = () => {
        if (selectedItem && paper && stackOrder.length > 0) {
            if (selectedItem.type !== "rect" && selectedItem.type !== "circle") {
                dispatch(sendFront(selectedItem.id));
                const currentIndex = stackOrder.indexOf(selectedItem.id);
                console.log(currentIndex);
                if (currentIndex < stackOrder.length - 1) {
                    const lastElement = stackOrder[stackOrder.length - 1];
                    const element = elementActive.filter((el: any) => el.id === lastElement)
                    selectedItem?.insertAfter(element);

                }
            }
        }
    };

    const handleSendBack = () => {
        if (selectedItem && paper && stackOrder.length > 0) {
            //console.log(selectedItem, stackOrder);
            if (selectedItem.type !== "rect" && selectedItem.type !== "circle") {
                dispatch(sendBack(selectedItem.id));
                const currentIndex = stackOrder.indexOf(selectedItem.id);
                console.log(currentIndex);
                if (currentIndex > 0) {
                    const firstElement = stackOrder[0];
                    console.log(firstElement);
                    const element = elementActive.filter((el: any) => el.id === firstElement);
                    selectedItem?.insertBefore(element);
                    // dispatch(sendBack(selectedItem.id));                    
                }
            }
        }
    };

    const handleSendForward = () => {
        if (selectedItem && paper && stackOrder.length > 0) {
            if (selectedItem.type !== "rect" && selectedItem.type !== "circle") {
                dispatch(sendForward(selectedItem.id));
                const currentIndex = stackOrder.indexOf(selectedItem.id);
                console.log(stackOrder[currentIndex]);
                if (currentIndex < stackOrder.length - 1) {
                    const nextElement = stackOrder[currentIndex + 1];
                    console.log(nextElement);
                    const element = elementActive.filter((el: any) => el.id === nextElement);
                    console.log(element);
                    selectedItem.insertAfter(element);
                }
            }
        }
    };

    const handleSendBackward = () => {
        if (selectedItem && paper && stackOrder.length > 0) {
            if (selectedItem.type !== "rect" && selectedItem.type !== "circle") {
                dispatch(sendBackward(selectedItem.id));
                const currentIndex = stackOrder.indexOf(selectedItem.id);
                if (currentIndex > 0) {
                    const prevElement = stackOrder[currentIndex - 1];
                    console.log(prevElement);
                    const element = elementActive.filter((el: any) => el.id === prevElement);
                    console.log(element);
                    selectedItem.insertBefore(element);
                }
            }
        }
    };


    const handleDelete = () => {
        if (selectedItem && paper) {
            if (currentFtRef.current) {
                currentFtRef.current.unplug(); // Proper cleanup
            }

            const { category } = selectedItem.data()
            selectedItem.type === "image" && dispatch(deleteImage(selectedItem.id)) && dispatch(deleteHistoryById(selectedItem.id))
            category === "text" && dispatch(removeText(selectedItem.id)) && dispatch(deleteHistoryById(selectedItem.id))

            const oldFt = selectedItem.freeTransform
            oldFt.unplug()

            dispatch(removeStackElement(selectedItem.id));
            setElementActive((prev: any) => prev.filter((item: any) => item.id !== selectedItem.id));

            selectedItem.remove(); // Remove the element            
            dispatch(deleteImage(selectedItem.id)) // delete history   
            dispatch(deleteHistoryById(selectedItem.id)) // delete history   
            
            elementActive?.forEach((el: any) => {
                const oldFt = el?.freeTransform
                oldFt?.unplug()
            })
            
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

                    el.transform(`...T${translation.x}, ${translation.y}`);

                    if (isElementInsideFrame(el, centerX, centerY, frameWidth, frameHeight)) {
                        el.attr({ opacity: 1 })
                        // console.log("The element is inside the frame.");
                    } else {
                        el.attr({ opacity: 1 }) // 0.3
                        // console.log("The element is outside the frame.");
                    }


                    // reapplyFreeTransform(el)
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
                
                el.transform(`...T${translation.x}, ${translation.y}`);

                const oldFt = el.freeTransform
                oldFt.unplug()
               
                const handleTransform = (ft: any, events: any) => {
                    const transformedItem = handleFreeTransform(ft, events);
        
                    transformedItem && setSelectedItem(transformedItem)
                }
                const newFt = paper?.freeTransform(el, `freeTransform stickerHandle-${el.id}`, defaultOptions, handleTransform);
                if (newFt.handles) {
                    if (newFt.handles.x.line) newFt.handles.x.line.hide();

                    if (newFt.handles.x.disc) newFt.handles.x.disc.hide();
                }

                // Check if the element is inside the frame and adjust opacity accordingly
                if (isElementInsideFrame(el, centerX, centerY, frameWidth, frameHeight)) {
                    el.attr({ opacity: 1 });
                } else {
                    el.attr({ opacity: 1 }); //0.3
                }

                // Reapply free transformation if necessary
                // reapplyFreeTransform(el);
            }
        }
    };

    const extractDAttributeValue = async (svgUrl: string): Promise<string | null> => {
        try {
            // Fetch SVG content from the Blob URL
            const response = await fetch(svgUrl);
            const svgString = await response.text();

            // Ensure the SVG string starts with "<svg>" tag
            const formattedSvgString = svgString.startsWith("<svg>") ? svgString : `<svg xmlns="http://www.w3.org/2000/svg"> ${svgString}</>`;

            const parser = new DOMParser();
            const doc = parser.parseFromString(formattedSvgString, "image/svg+xml");

            const pathElement = doc.querySelector('path');
            return pathElement ? pathElement.getAttribute('d') : null;
        } catch (error) {
            console.error('Error parsing SVG:', error);
            return null;
        }
    };

    const handleDieCut = async () => {
        setIsLoading(true);

        try {
            const svgData = await paper.toSVG(centerX - frameWidth / 2, centerY - frameHeight / 2, frameWidth, frameHeight, "", true);

            if (svgData) {

                const modifiedSVG = await generateSVGImageData(svgData, frameWidth, frameHeight, grow, "white")

                const dAttributeValue = await extractDAttributeValue(modifiedSVG);

                if (dAttributeValue) {
                    //console.log(dAttributeValue);

                    setDieCutResult(dAttributeValue)

                    setIsLoading(false);
                }
            }
        } catch (error: any) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {

        if (paper && dieCutResult && backgroundColor && materialDefault) {
            const dieCutX: number = centerX - frameWidth / 2;
            const dieCutY: number = centerY - frameHeight / 2;

            // Remove existing dieCutImage if it exists
            paper?.forEach((element: any) => {
                const { data } = element.data();
                if (data === "dieCutImage") {
                    element.remove();
                }
            });

            // Create the dieCutImage using the generated SVG image data                    
            const dieCutImage = paper.path(dieCutResult)

            const strokeColor = "rgba(0,0,0,0.3)";

            dieCutImage?.attr({
                stroke: strokeColor
            })

            dieCutImage.translate(dieCutX, dieCutY);

            dieCutImage?.data('data', 'dieCutImage');

            const selectedMaterial = materialStore.find(material => material.id === materialDefault);
            // console.log(selectedMaterial);

            //pattern add
            selectedMaterial && selectedMaterial.src ? convertJpgToBase64(selectedMaterial.src)
                .then((base64Data) => {
                    // console.log('Base64-encoded data:', base64Data);
                    // Handle the base64-encoded data as needed
                    dieCutImage.attr({ fill: `url(${base64Data})` });
                })
                .catch((error) => {
                    console.error('Error converting JPG to base64:', error);
                }) : (
                (selectedMaterial?.value === "clear") ? dieCutImage.attr({ fill: "transparent" }) : dieCutImage.attr({ fill: backgroundColor })
            )

            paper.forEach((element: any) => {
                const { data } = element.data();
                const isRectOrCircle = data === "frame-rect" || data === "frame-circle";
                const isCircle = data === "frame-circle";

                if (isRectOrCircle) {
                    dieCutImage.insertAfter(element);
                    // testImage.insertAfter(element);

                }
            })
        }
    }, [dieCutResult, backgroundColor, centerX, centerY, frameWidth, frameHeight, paper, materialDefault])


    useEffect(() => {
        lastAddedElement && stackOrder?.forEach((id: string) => {
            const element = paper?.getById(id);
            if (element) {
                const isUnique = !elementActive.some((item: any) => item.id === element.id);
                if (isUnique) {
                    setElementActive((prev: any) => [...prev, element]);
                }
            }
        });
        console.log(elementActive, 'stackOrder', stackOrder);
    }, [paper, stackOrder, elementActive, setElementActive, lastAddedElement]);


    useEffect(() => {
        const newStack: any = [];
        if (CategoryToRemove) {
            console.log(CategoryToRemove, stackOrder);
            stackOrder?.forEach((id: any) => {
                const element = paper?.getById(id);
                const { data } = element?.data();
                if (data === CategoryToRemove) {
                    //console.log(element);
                    newStack.push(element.id);
                    setElementActive((prev: any) => prev.filter((item: any) => item.id !== element.id));
                }
            });

            newStack?.forEach((id: any) => {
                const item = paper?.getById(id);
                item?.freeTransform.unplug();
                setSelectedItem(null)
                dispatch(removeStackElement(id));

            });
            //console.log('newStack', newStack, stackOrder);
        }
        return () => {
            dispatch(setCategoryToRemove(""))
        };
    }, [paper, stackOrder, CategoryToRemove, dispatch, setElementActive, setSelectedItem]);



    // const dimension = dieCutImage.getBBox()

    //         if (dimension) {
    //             console.log(dimension);
    //             dispatch(setBreddDefaultValue(dimension.width)); // Set default value for bredd input
    //             dispatch(setHojdDefaultValue(dimension.height));
    //         }

    /**
     * Svg export function
     */
    const handleDownloadSVG = async (): Promise<void> => {
        deselect();

        if (paper) {

            const strokeColor = "rgba(255,0,255, 1)";
            // Proceed with SVG export and download
            const svgData = paper.toSVG(centerX - frameWidth / 2, centerY - frameHeight / 2, frameWidth, frameHeight, strokeColor, false);

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


    // useEffect(() => {
    //     if (selectedItem && paper) {
    //         if (selectedItem && currentFtRef.current && paper) {

    //             // Define drag functions
    //             const onMove = function (dx: number, dy: number) {

    //             };

    //             const onStart = function () {

    //             };

    //             const onEnd = function () {
    //                 // console.log('Drag end');

    //                 if (isElementInsideFrame(selectedItem, centerX, centerY, frameWidth, frameHeight)) {
    //                     selectedItem.attr({ opacity: 1 })
    //                     // console.log(selectedItem);

    //                     // console.log("The element is inside the frame.");
    //                 } else {
    //                     selectedItem.attr({ opacity: 0.3 })
    //                     currentFtRef.current.opts.attrs.opacity = 0.3
    //                     // currentFtRef.current.attrs({ opacity: 0.3 })
    //                     // console.log("The element is outside the frame.");
    //                 }
    //             };


    //             selectedItem.drag(onMove, onStart, onEnd);
    //         }

    //     }
    // }, [paper, currentFtRef, selectedItem, centerX, centerY, frameWidth, frameHeight]);

    // useEffect(() => {
    //     if(lastAddedElement && paper) {            
    //         const paperCenter: { x: number, y: number } = { x: paper.width / 2, y: paper.height / 2 };
    //         const bbox = lastAddedElement?.getBBox();
    //         console.log(bbox);
    //                 const elCenter = { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 };
    //                 const translation = { x: paperCenter.x - elCenter.x, y: paperCenter.y - elCenter.y };

    //                 lastAddedElement?.attr({ x: translation.x, y: translation.y });
    //                 if(lastAddedElement) {

    //                 // const oldFt = lastAddedElement?.freeTransform
    //                 //     oldFt.unplug()
                    
    //                 const handleTransform = (ft: any, events: any) => {
    //                     const transformedItem = handleFreeTransform(ft, events);
                        
    //                     transformedItem && setSelectedItem(transformedItem)
    //                 }
    //                 const newFt = paper?.freeTransform(lastAddedElement, `freeTransform stickerHandle-${lastAddedElement.id}`, defaultOptions, handleTransform);
    //                 if (newFt.handles) {
    //                     if (newFt.handles.x.line) newFt.handles.x.line.hide();
                        
    //                     if (newFt.handles.x.disc) newFt.handles.x.disc.hide();
    //                 }

    //                 newFt.apply()
    //             }
    //     }
    // })

    
    useEffect(() =>{
        if(selectedItem) {
            if(stackOrder.length === 1 && selectedItem) {
                setSendFrontBTN(true)
                setSendBackBTN(true)
                setSendForwardBTN(true)
                setSendBackwardBTN(true)
            }
    
            if (stackOrder[0] === selectedItem.id && stackOrder.length !== 1) {
                setSendFrontBTN(false)
                setSendBackBTN(true)
                setSendForwardBTN(false)
                setSendBackwardBTN(true)
            }
            
            const lastIndex = stackOrder.length - 1;
            if(stackOrder[lastIndex] === selectedItem.id && stackOrder.length !== 1) {
                setSendFrontBTN(true)
                setSendBackBTN(false)
                setSendForwardBTN(true)
                setSendBackwardBTN(false)
            }

            if (stackOrder[0] !== selectedItem.id && stackOrder[lastIndex] !== selectedItem.id && stackOrder.length !== 1) {              
                setSendFrontBTN(false)
                setSendBackBTN(false)
                setSendForwardBTN(false)
                setSendBackwardBTN(false)
            }                              
            
        }

    }, [stackOrder, selectedItem])

    const buttons = [
        { onClick: handleFlipY, iconSrc: "/mirrorUpDownIcon.svg", tooltip: "Flip Vertically", borderClasses: "border-r-0 border-black/20 rounded-l-full", borderRadiusClasses: "pl-3 pr-1" },
        { onClick: handleFlipX, iconSrc: "/mirrorSideIcon.svg", tooltip: "Flip Horizontally", borderClasses: "border-x-0 border-black/20", borderRadiusClasses: "px-1.5" },
        { onClick: handleSendFront, disabled: sendFrontBTN, iconSrc: "/sendFront.svg", tooltip: "Send to Front", borderClasses: "border-x-0 border-black/20", borderRadiusClasses: "px-1.5" },
        { onClick: handleSendBack, disabled: sendBackBTN, iconSrc: "/sendBack.svg", tooltip: "Send to Back", borderClasses: "border-x-0 border-black/20", borderRadiusClasses: "px-1.5" },
        { onClick: handleSendForward, disabled: sendForwardBTN, iconSrc: "/forward.svg", tooltip: "Send Forward", borderClasses: "border-x-0 border-black/20", borderRadiusClasses: "px-1.5" },
        { onClick: handleSendBackward, disabled: sendBackwardBTN, iconSrc: "/backward.svg", tooltip: "Send Backward", borderClasses: "border-x-0 border-black/20", borderRadiusClasses: "px-1.5" },
        { onClick: handleCenterEL, iconSrc: "/centerIcon.svg", tooltip: "Center Element", borderClasses: "border-x-0 border-black/20", borderRadiusClasses: "px-1.5" },
        { onClick: handleDelete, iconSrc: "/trash.svg", tooltip: "Delete Element", borderClasses: "border-l-0 border-black/20 rounded-r-full", borderRadiusClasses: "pr-3 pl-1" },
    ];


    return (
        <>
            <div className='absolute z-50 left-0 bottom-0 w-full h-fit'>
                {(StickerSelected.id) && (
                    <div className="absolute bottom-0 left-0 w-fit mx-auto h-3 flex justify-start items-end gap-5 z-50">
                        <div className="flex gap-3 p-4 space-y-3 w-60">
                            <RangeSlider minValue={20} maxValue={120} step={1} defaultValue={grow} label="Kantlinje" />
                            <Tooltip message='Die Cut Effect'>
                                <button onClick={handleDieCut} className='text-sm font-semibold bg-white hover:bg-so-deep-gray cursor-pointer border border-black/20 hover:border-black/50 shadow-sm hover:shadow-lg rounded-full px-2 pt-1 pb-1.5'>Apply</button>
                            </Tooltip>

                            <button onClick={handleDownloadSVG} className='text-sm font-semibold bg-white hover:bg-so-deep-gray cursor-pointer border border-black/20 hover:border-black/50 shadow-sm hover:shadow-lg rounded-full px-2 pt-1 pb-1.5'>Download</button>

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