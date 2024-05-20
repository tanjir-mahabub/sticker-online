import { defaultOptions, hideFreeTransform, showFreeTransform } from "@/components/Utils/vectorFunction";
import { usePaper } from "@/context/PaperContext";
import { useRaphaelElements } from "@/hooks/useRaphaelElements";
import { useTransformUtils } from "@/hooks/useTransformUtils";
import { addStackElement } from "@/redux/features/stackOrderSlice";
import { useAppSelector } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const ImageElements = () => {
    const { paper, lastAddedElement, selectedItem, setSelectedItem, setLastAddedElement, currentFtRef, isLoading } = usePaper();
    const { addImageElement } = useRaphaelElements(paper);

    const dispatch = useDispatch();

    const imagePreviews = useAppSelector((state) => state.imagePreview.images);   
    const histories = useAppSelector((state) => state.history.objectHistories);   
    const stackOrder = useAppSelector(state => state.stackOrder);


    useEffect(() => {
        if (paper) {
            const paperCenter: { x: number, y: number } = { x: paper.width / 2, y: paper.height / 2 };

            imagePreviews.forEach((image, index) => {
                const element = addImageElement({
                    id: image.id,
                    src: image.src,
                    x: image.x || 0,
                    y: image.y || 0,
                    width: image.width || 220,
                    height: image.height || 180,
                    attrs: { opacity: 1, cursor: 'move' },
                    type: (image.category === "image") ? "image" : "motiv",
                    stackNum: image.stackNum || index                   
                });

                if (element) {
                    const bbox = element.getBBox();
                    const elCenter = { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 };
                    const translation = { x: paperCenter.x - elCenter.x, y: paperCenter.y - elCenter.y };

                    if(!element.x && !element.y) {
                        element.attr({ x: translation.x, y: translation.y });
                    }    

                    element.hide()
                    
                  //  console.log(element);
                    // if(histories && element.x) {
                    //     histories.forEach((history: any) => {
                    //         if(history.objectId === element.id) {
                    //             element.attr(history.history[history.historyStep])
                    //         }
                    //     })
                    // }
                    const ft = paper?.freeTransform(element, `freeTransform stickerHandle-${element.id}`, defaultOptions, (ft: any, events: any) => {
                                                
                        if(events.includes("drag start")) {                            
                            // setSelectedItem(null)
                            ft && hideFreeTransform(ft, paper)
                        }

                        if(events.includes("drag end")) {                            
                            // setLastAddedElement(ft.subject);
                            ft && setSelectedItem(ft.subject)
                            ft && showFreeTransform(ft)
                        }
                    })
                                     
                    ft && hideFreeTransform(ft)      
                         
                    // setLastAddedElement(element);
                    
                    dispatch(addStackElement(element.id))
                    
                }
            });
        }
    }, [paper, setLastAddedElement, setSelectedItem, imagePreviews, addImageElement, dispatch, histories]);


    return null
}

export default ImageElements