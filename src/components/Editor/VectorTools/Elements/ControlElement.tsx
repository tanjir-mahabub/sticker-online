import { Tooltip } from "@/components/Utils/ToolTips"
import RangeSlider from "../../Customize/child/Input/RangeSlider"
import ButtonControl from "../../lib/ButtonControll"
import { usePaper } from "@/context/PaperContext";
import { useDispatch } from "react-redux";
import { useTransformUtils } from "@/hooks/useTransformUtils";
import { deleteImage, updateElementAttributes } from "@/redux/features/imagePreviewSlice";
import { removeText } from "@/redux/features/textSlice";
import { addedToHistory, clearAllHistories, deleteHistoryById } from "@/redux/features/historySlice";
import { useCallback, useEffect, useState } from "react";
import { isElementInsideFrame } from "../elementUtils";
import { useAppSelector } from "@/redux/store";
import { createDieCut, extractDAttributeValue, generateSVGImageData } from "@/components/Utils/DieCutFunction";
import { convertJpgToBase64, defaultOptions, FTitemVisibility, handleFrameAdjustment, handleFreeTransform, hideFreeTransform, pixelToCm, showFreeTransform, svgStringToNode } from "@/components/Utils/vectorFunction";
import materialStore from '@/store/materialStore';
import { addStackElement, clearStackOrder, removeStackElement, sendBack, sendBackward, sendForward, sendFront } from "@/redux/features/stackOrderSlice";
import { setCategoryToRemove } from "@/redux/features/categoryToRemove";
import { setCanvasProperties } from "@/redux/features/canvasSlice";
import { FrameAdjustment } from "@/components/Utils/FrameAdjustment";
import { debounce } from "lodash";


const ControlElement = () => {
    const [dieCutResult, setDieCutResult] = useState<string | null>(null);
    const { paper, selectedItem, setSelectedItem, currentFtRef, isLoading, setIsLoading, lastAddedElement, setLastAddedElement, elementActive, setElementActive, setIsShowError } = usePaper();

    const materialDefault = useAppSelector(state => state.formValues.materialLastSelected);
    const stackOrder = useAppSelector(state => state.stackOrder);
    const StickerSelected = useAppSelector(state => state.sticker);
    const History = useAppSelector((state) => state.history.objectHistories);  
    const CanvasProperties = useAppSelector(state => state.canvas);
    const CategoryToRemove = useAppSelector(state => state.categoryToRemove);

    const [sendFrontBTN, setSendFrontBTN] = useState(true)
    const [sendBackBTN, setSendBackBTN] = useState(true)
    const [sendForwardBTN, setSendForwardBTN] = useState(true)
    const [sendBackwardBTN, setSendBackwardBTN] = useState(true)
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    const { canvasX, canvasY, canvasWidth, canvasHeight, centerX, centerY, frameWidth, frameHeight, grow, backgroundColor } = CanvasProperties;

    const dispatch = useDispatch();

    const handleFlipX = () => {
        if (selectedItem && paper) {
            const bbox = selectedItem.getBBox(true);
            // Apply flipping by scaling
            selectedItem.transform(`...s-1,1,${bbox.x + bbox.width / 2},${bbox.y + bbox.height / 2}`);
            
            const oldFt = selectedItem.freeTransform
            oldFt.unplug()
           
            const ft = paper?.freeTransform(selectedItem, `freeTransform stickerHandle-${selectedItem.id}`, defaultOptions, (ft: any, events: any) => {
                                            
                if(events.includes("drag start")) {                                                    
                    ft && hideFreeTransform(ft, paper)
                }

                if(events.includes("drag end")) {                                                    
                    ft && setSelectedItem(ft.subject)
                    ft && showFreeTransform(ft)
                }
            })
            ft && hideFreeTransform(ft)                  
            ft && showFreeTransform(ft)
        }
    };
/// working tomorrow
    // useEffect(() => {
    //     if(selectedItem?.freeTransform) {
    //         console.log('selectedItem', selectedItem);
    //               dispatch(updateElementAttributes( {id: selectedItem.id, attributes: {...selectedItem.freeTransform.attrs}}))
    //               console.log('selectedItem.subject.attrs', selectedItem.freeTransform.attrs);
    //                 dispatch(addedToHistory({
    //                     objectId: selectedItem.freeTransform.id,
    //                     category: selectedItem.data().data || '',
    //                     position: {...selectedItem.freeTransform.attrs}
    //                 }));
    //     }
    // }, [selectedItem, dispatch])

    const handleFlipY = () => {
        if (selectedItem && paper) {
            const bbox = selectedItem.getBBox(true);
            selectedItem.transform(`...s1,-1,${bbox.x + bbox.width / 2},${bbox.y + bbox.height / 2}`);
            
            const oldFt = selectedItem.freeTransform
            oldFt.unplug()
           
            const ft = paper?.freeTransform(selectedItem, `freeTransform stickerHandle-${selectedItem.id}`, defaultOptions, (ft: any, events: any) => {
                                            
                if(events.includes("drag start")) {                                                    
                    ft && hideFreeTransform(ft, paper)
                }

                if(events.includes("drag end")) {                                                    
                    ft && setSelectedItem(ft.subject)
                    ft && showFreeTransform(ft)
                }
            })
            ft && hideFreeTransform(ft)                  
            ft && showFreeTransform(ft)

        }
    };

    const handleSendFront = () => {
        if (selectedItem && paper && stackOrder.length > 0) {
            if (selectedItem.type !== "rect" && selectedItem.type !== "circle") {                
                const presentItem = elementActive?.find((item: any) => item.id === selectedItem.id)
                const currentIndex = stackOrder.indexOf(selectedItem.id);
                console.log(currentIndex);
                if (currentIndex < stackOrder.length - 1) {
                    const lastElement = stackOrder[stackOrder.length - 1];
                    const element = elementActive?.find((el: any) => el.id === lastElement)
                    selectedItem?.insertAfter(element);                    
                    dispatch(sendFront(selectedItem.id));
                    // setSelectedItem(presentItem)
                }
            }
        }
    };

    const handleSendBack = () => {
        if (selectedItem && paper && stackOrder.length > 0) {
            console.log("from send back", selectedItem, stackOrder);
            if (selectedItem.type !== "rect" && selectedItem.type !== "circle") {                
                const presentItem = elementActive?.find((item: any) => item.id === selectedItem.id)
                const currentIndex = stackOrder.indexOf(selectedItem.id);                
                console.log(currentIndex, presentItem);
                if (currentIndex > 0) {
                    const firstElement = stackOrder[0];
                    const element = elementActive?.find((el: any) => el.id === firstElement);
                    console.log('present element', presentItem);
                    selectedItem?.insertBefore(element);
                    dispatch(sendBack(selectedItem.id));                    
                    // setSelectedItem(presentItem)
                    // elementActive?.forEach((el: any) => {
                    //     hideFreeTransform(el.freeTransform)
                    // })
                }
            }
        }
    };

    const handleSendForward = () => {
        if (selectedItem && paper && stackOrder.length > 0) {
            if (selectedItem.type !== "rect" && selectedItem.type !== "circle") {
                const currentIndex = stackOrder.indexOf(selectedItem.id);
                console.log(stackOrder[currentIndex]);
                if (currentIndex < stackOrder.length - 1) {
                    const nextElementId = stackOrder[currentIndex + 1];
                    console.log(nextElementId);
                    const nextElement = elementActive.find((el: any) => el.id === nextElementId);
                    console.log(nextElement);
                    if (nextElement) {
                        selectedItem.insertAfter(nextElement);
                        dispatch(sendForward(selectedItem.id));
                    }
                }
            }
        }
    };
    
    const handleSendBackward = () => {
        if (selectedItem && paper && stackOrder.length > 0) {
            if (selectedItem.type !== "rect" && selectedItem.type !== "circle") {
                const currentIndex = stackOrder.indexOf(selectedItem.id);
                if (currentIndex > 0) {
                    const prevElementId = stackOrder[currentIndex - 1];
                    console.log(prevElementId);
                    const prevElement = elementActive.find((el: any) => el.id === prevElementId);
                    console.log(prevElement);
                    if (prevElement) {
                        selectedItem.insertBefore(prevElement);
                        dispatch(sendBackward(selectedItem.id));
                    }
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
            
            setIsShowError(false)
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
                
                el.transform(`...T${translation.x}, ${translation.y}`);

                const oldFt = el.freeTransform
                oldFt.unplug()
               
                const ft = paper?.freeTransform(el, `freeTransform stickerHandle-${el.id}`, defaultOptions, (ft: any, events: any) => {
                                                
                    if(events.includes("drag start")) {                                                    
                        ft && hideFreeTransform(ft, paper)
                    }

                    if(events.includes("drag end")) {                                                    
                        ft && setSelectedItem(ft.subject)
                        ft && showFreeTransform(ft)
                    }
                })
                ft && hideFreeTransform(ft)                  
                ft && showFreeTransform(ft)
                
                // Check if the element is inside the frame and adjust opacity accordingly
                if (isElementInsideFrame(el, centerX, centerY, frameWidth, frameHeight)) {
                    el.attr({ opacity: 1 });
                } else {
                    el.attr({ opacity: 1 }); //0.3
                }                
            }
        }
    };

    const debouncedHandleDieCut = debounce(async () => {
        setIsLoading(true);
        elementActive?.forEach((el: any) => {
            el?.freeTransform?.hideHandles({ undrag: false })
        });
    
        setSelectedItem(null);
    
        try {
            const svgData = await paper.toSVG(0, 0, paper.width, paper.height, "", true);
    
            if (svgData) {
                const modifiedSVG = await generateSVGImageData(svgData, paper.width, paper.height, grow, "white");
                const dAttributeValue = await extractDAttributeValue(modifiedSVG);
    
                if (dAttributeValue) {
                    createDieCut(paper, dAttributeValue, CanvasProperties)
                    setDieCutResult(dAttributeValue);
                    setIsLoading(false);
                }
            }
        } catch (error: any) {
            console.error('Error:', error);
        }
    }, 300);

    const handleDieCut = async () => {
        debouncedHandleDieCut();        
    }

    // Die cut integration
    useEffect(() => {

        if (paper && dieCutResult && backgroundColor && materialDefault) {
            const dieCutX: number = centerX - frameWidth / 2;
            const dieCutY: number = centerY - frameHeight / 2;

            // Remove existing dieCutImage if it exists
            paper?.forEach((element: any) => {
                const { data } = element.data();
                if (data === "dieCutImage") {
                    element?.unplug?.();
                    element?.clear?.();
                    element?.freeTransform?.unplug?.();
                    element?.attr?.({ href: null, src: null });
                    element.remove();
                }
            });

            // Create the dieCutImage using the generated SVG image data                    
            const dieCutImage = paper.path(dieCutResult)

            const strokeColor = "rgba(0,0,0,0.3)";

            dieCutImage?.attr({
                stroke: strokeColor
            })

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
            
            
            if(dieCutImage) {
                const viewBoxModule = FrameAdjustment(paper, dieCutImage, 0, 0, paper.width, paper.height, 1,  0.65); 
                console.log(viewBoxModule, 'llll', viewBoxModule.getViewBox());                
                                
                elementActive.forEach((el:any) => {
                    el.freeTransform?.unplug()  
                    
                    const ft = paper?.freeTransform(el, `freeTransform stickerHandle-${el.id}`, defaultOptions, (ft: any, events: any) => {
                                            
                        if(events.includes("drag start")) {                                                    
                            ft && hideFreeTransform(ft, paper)
                        }
        
                        if(events.includes("drag end")) {                                                    
                            ft && setSelectedItem(ft.subject)
                            ft && showFreeTransform(ft)
                        }
                    })
                    ft && hideFreeTransform(ft)                  
                    // ft && showFreeTransform(ft)
                })

                // Adjust frame ratio by die cut image
                const bbox = dieCutImage?.getBBox();
                if(bbox) {
                    const { x, y, width, height } = bbox;
                    dispatch(setCanvasProperties({                       
                        centerX: x,
                        centerY: y,                 
                        frameWidth: width,
                        frameHeight: height,
                        bredd: pixelToCm(width),
                        hojd: pixelToCm(height)
                    }))

                    const paperCenter: { x: number, y: number } = { x: paper.width / 2, y: paper.height / 2 };
                    const elCenter = { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 };
                    const translation = { x: paperCenter.x - elCenter.x, y: paperCenter.y - elCenter.y };
                    dieCutImage.attr({ x: translation.x, y: translation.y });
                // paper?.setViewBox(0, 0, width, height, true);
                
                console.log(bbox);
                    console.log( centerX - width/2,  centerY - height/2, y, centerX, centerY);   
                }      
            
            }
        }
    }, [dieCutResult, backgroundColor, centerX, centerY, frameWidth, frameHeight, paper, materialDefault, dispatch, elementActive, setSelectedItem])


    // useEffect(() => {
    //     lastAddedElement && stackOrder?.forEach((id: string) => {
    //         const element = paper?.getById(id);
    //         if (element) {
    //             const isUnique = !elementActive.some((item: any) => item.id === element.id);
    //             if (isUnique) {
    //                 setElementActive((prev: any) => [...prev, element]);
    //             }
    //         }
    //     });
    //     //console.log(elementActive, 'stackOrder', stackOrder);
    // }, [paper, stackOrder, elementActive, setElementActive, lastAddedElement]);    

    useEffect(() => {
        const newStack: any = [];
        if (CategoryToRemove) {
            // dispatch(clearStackOrder())            
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
            setIsShowError(false);
        }
        return () => {
            dispatch(setCategoryToRemove(""))
        };
    }, [paper, stackOrder, CategoryToRemove, dispatch, setElementActive, setSelectedItem, setIsShowError]);



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

        if (paper) {

            elementActive?.forEach((el: any) => el?.freeTransform?.hideHandles({ undrag: false }))

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

    // useEffect(() =>{
    //     if(paper) {
    //         const w= 1400;          
    //         const h= 700;
    //         const x = 0;
    //         const y = 0;
    //         const fit = true;
    //         paper.setViewBox(x, y, w, h, fit)
    //         paper.setSize("100%", "100%")
    //     }
    // })

    // useEffect(() => {
    //     if (paper && canvasWidth && canvasWidth && frameWidth && frameHeight) {
    //         const svgWidth = canvasWidth;
    //         const svgHeight = canvasWidth;
            
    //         // Calculate the target width and height for the dieCutImage (75% of paper dimensions)
    //         const targetWidth = svgWidth * 0.75;
    //         const targetHeight = svgHeight * 0.75;
    
    //         // Calculate the scale factor based on the aspect ratio of dieCutImage and target size
    //         const scaleFactor = Math.min(targetWidth / frameWidth, targetHeight / frameHeight);
    
    //         // Calculate new dimensions of dieCutImage
    //         const newWidth = frameWidth * scaleFactor;
    //         const newHeight = frameHeight * scaleFactor;
    
    //         // Calculate new x and y to center dieCutImage within the paper
    //         const newX = (svgWidth - newWidth) / 2;
    //         const newY = (svgHeight - newHeight) / 2;
    
    //         // Set the viewBox to fit the resized dieCutImage in the center of the paper
    //         paper?.setViewBox(newX, newY, newWidth, newHeight, true);
    //        console.log('paper adjustment', newX, newY, newWidth, newHeight, true);
    //         // paper?.setSize(newWidth, newHeight);
    //     }
    // }, [paper,frameWidth, frameHeight, canvasWidth, canvasHeight ]);

    // useEffect(() => {
    //     if(paper && elementActive) {
    //         elementActive.forEach((el: any) => {
    //             const bbox = el?.getBBox();
    //             console.log(bbox);
    //         })
    //     }
    // }, [paper, elementActive])

    // useEffect(() => {
    //     if (stackOrder && elementActive) {
    //         const lastElement = elementActive.find((item: any) => item.id === stackOrder[stackOrder.length - 1]) 
    //         setSelectedItem(lastElement)                 
    //     }
    // }, [stackOrder, elementActive, setSelectedItem]);

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

    useEffect(() => {
        if (stackOrder && paper) {
            const newElementActive = stackOrder
                .map((id) => paper?.getById(id))
                .filter(Boolean); 
            setElementActive(newElementActive);
        }
    }, [stackOrder, paper, setElementActive]);

    
    useEffect(() => {        
        if (elementActive.length > 0) {
            elementActive.forEach((el: any, index: number) => {
                if (index === 0) {
                    el.toFront(); 
                } else {
                    const prevElement = elementActive[index - 1];
                    el.insertAfter(prevElement); 
                }
                el.show(); 
            });                       
        } 
                
    }, [elementActive]);

    // useEffect(() => {
    //     if(stackOrder && elementActive) {
    //         handleDieCut()
    //     }
    // }, [elementActive, stackOrder, handleDieCut]);

    useEffect(() => {
        if(selectedItem) {
            showFreeTransform(selectedItem.freeTransform)
        }        
    })

    useEffect(() => {
        if (isFirstLoad && stackOrder.length > 0 && paper) {
            const lastElementId = stackOrder[stackOrder.length - 1];
            const lastElement = paper.getById(lastElementId);
            if (lastElement) {
                setSelectedItem(lastElement)
                setIsFirstLoad(false);
            }
        }
    }, [isFirstLoad, stackOrder, paper, setSelectedItem, setIsFirstLoad]);

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
            <div className='absolute z-50 left-0 bottom-0 w-full h-fit transition duration-500 delay-300 ease-in-out'>
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