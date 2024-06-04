import { Tooltip } from "@/components/Utils/ToolTips"
import RangeSlider from "../../Customize/child/Input/RangeSlider"
import ButtonControl from "../../lib/ButtonControl"
import { usePaper } from "@/context/PaperContext";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/store";
import { removeStackElement } from "@/redux/features/stackOrderSlice";
import { setCategoryToRemove } from "@/redux/features/categoryToRemove";
import { useDieCut } from "@/hooks/useDieCut";
import { useControlButton } from "@/hooks/useControlButton";



const ControlElement = () => {    
    const { paper, selectedItem, setSelectedItem, elementActive, setElementActive, setIsShowError } = usePaper();
    const { handleDownloadSVG, handleDieCut } = useDieCut();
    const { handleFlipX, handleFlipY, handleSendFront, handleSendBack, handleSendForward, handleSendBackward, handleDelete, handleCenterEL } = useControlButton();
    
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

    const { grow } = CanvasProperties;

    const dispatch = useDispatch();

    
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

    useEffect(() => {
        const newStack: any = [];
        if (CategoryToRemove) {
            // dispatch(clearStackOrder())            
            console.log(CategoryToRemove, stackOrder);
            stackOrder?.forEach((id: any) => {
                const element = paper?.getById(id);
                if(element) {
                    const { data } = element?.data();
                    if (data === CategoryToRemove) {
                        //console.log(element);
                        newStack.push(element.id);
                        setElementActive((prev: any) => prev.filter((item: any) => item.id !== element.id));
                    }
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

    // useEffect(() => {
    //     if(selectedItem) {
    //         showFreeTransform(selectedItem.freeTransform)
    //     }        
    // })

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
                {(StickerSelected.id ) && (
                    <div className="absolute bottom-0 left-0 w-fit mx-auto h-3 hidden lg:flex justify-start items-end gap-5 z-50">
                        <div className="flex gap-3 p-4 space-y-3 w-60">
                            <RangeSlider minValue={20} maxValue={120} step={1} defaultValue={grow} label="Kantlinje" />
                            <Tooltip message='Die Cut Effect' direction="up">
                                <button onClick={handleDieCut} className='text-sm font-semibold bg-white hover:bg-so-deep-gray cursor-pointer border border-black/20 hover:border-black/50 shadow-sm hover:shadow-lg rounded-full px-2 pt-1 pb-1.5'>Apply</button>
                            </Tooltip>

                            <button onClick={handleDownloadSVG} className='text-sm font-semibold bg-white hover:bg-so-deep-gray cursor-pointer border border-black/20 hover:border-black/50 shadow-sm hover:shadow-lg rounded-full px-2 pt-1 pb-1.5'>Download</button>

                        </div>
                    </div>
                )}

                {selectedItem ? (
                    <div className="absolute bottom-20 lg:bottom-2 left-0 w-full mx-auto h-3 flex justify-start items-end gap-5 z-40">
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