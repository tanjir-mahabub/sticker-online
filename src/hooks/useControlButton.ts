import { defaultOptions, hideFreeTransform, showFreeTransform } from "@/components/Utils/vectorFunction";
import { usePaper } from "@/context/PaperContext";
import { useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { removeStackElement, sendBack, sendBackward, sendForward, sendFront } from "@/redux/features/stackOrderSlice";
import { deleteImage } from "@/redux/features/imagePreviewSlice";
import { removeText } from "@/redux/features/textSlice";
import { isElementInsideFrame } from "@/components/Editor/VectorTools/elementUtils";
import { useTransformUtils } from "./useTransformUtils";
import { useCallback } from "react";

export const useControlButton = () => {
    const CanvasProperties = useAppSelector(state => state.canvas);
    const { centerX, centerY, frameWidth, frameHeight } = CanvasProperties;
    const stackOrder = useAppSelector(state => state.stackOrder);
    const dispatch = useDispatch();

    const { paper, selectedItem, setSelectedItem, currentFtRef, elementActive, setElementActive, setIsShowError, historyDispatch } = usePaper();
    const { addOrRemoveTransform } = useTransformUtils();

    const handleFlipX = () => {
        if (selectedItem && paper) {
            const bbox = selectedItem.getBBox(true);
            // Apply flipping by scaling
            selectedItem.transform(`...s-1,1,${bbox.x + bbox.width / 2},${bbox.y + bbox.height / 2}`);

            const oldFt = selectedItem?.freeTransform
            oldFt?.unplug()
            
            addOrRemoveTransform(selectedItem, true)               
        }
    }

    const handleFlipY = () => {
        if (selectedItem && paper) {
            const bbox = selectedItem.getBBox(true);
            selectedItem.transform(`...s1,-1,${bbox.x + bbox.width / 2},${bbox.y + bbox.height / 2}`);

            const oldFt = selectedItem?.freeTransform
            oldFt?.unplug()
            
            addOrRemoveTransform(selectedItem, true)                        

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
                                      
                    addOrRemoveTransform(selectedItem, true)   
                    setSelectedItem(presentItem)
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
                    
                    addOrRemoveTransform(selectedItem, true)   
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
                                               
                        addOrRemoveTransform(selectedItem, true)   
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
                                               
                        addOrRemoveTransform(selectedItem, true)   
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
            selectedItem.type === "image" && dispatch(deleteImage(selectedItem.id)) && historyDispatch({
                type: 'deleteHistoryById',
                payload: selectedItem.id
            });
            category === "text" && dispatch(removeText(selectedItem.id)) && historyDispatch({
                type: 'deleteHistoryById',
                payload: selectedItem.id
            });

            const oldFt = selectedItem.freeTransform
            oldFt.unplug()

            dispatch(removeStackElement(selectedItem.id));
            setElementActive((prev: any) => prev.filter((item: any) => item.id !== selectedItem.id));

            selectedItem.remove(); // Remove the element            
            dispatch(deleteImage(selectedItem.id)) // delete history   
            historyDispatch({
                type: 'deleteHistoryById',
                payload: selectedItem.id
            });

            elementActive?.forEach((el: any) => {
                const oldFt = el?.freeTransform
                oldFt?.unplug()
            })

            setIsShowError(false)
        }
    };   

    const handleCenterEL = useCallback(() => {
        if (paper && selectedItem) {
            const paperCenter = { x: paper.width / 2, y: paper.height / 2 };
            const el = selectedItem;

            if (el.data('isCenterable')) {
                const bbox = el.getBBox();
                const elCenter = { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 };
                const translation = { x: paperCenter.x - elCenter.x, y: paperCenter.y - elCenter.y };

                el.transform(`...T${translation.x}, ${translation.y}`);

                const oldFt = el?.freeTransform
                oldFt?.unplug()

                addOrRemoveTransform(el, true)                

                // Check if the element is inside the frame and adjust opacity accordingly
                if (isElementInsideFrame(el, centerX, centerY, frameWidth, frameHeight)) {
                    el.attr({ opacity: 1 });
                } else {
                    el.attr({ opacity: 1 }); //0.3
                }
            }
        }
    }, [addOrRemoveTransform, centerX, centerY, frameWidth, frameHeight, paper, selectedItem]);


    return { handleFlipX, handleFlipY, handleSendFront, handleSendBack, handleSendForward, handleSendBackward, handleDelete, handleCenterEL }
}