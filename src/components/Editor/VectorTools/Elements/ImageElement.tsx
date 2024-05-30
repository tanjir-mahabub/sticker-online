import { defaultOptions, hideFreeTransform, showFreeTransform } from "@/components/Utils/vectorFunction";
import { usePaper } from "@/context/PaperContext";
import { useRaphaelElements } from "@/hooks/useRaphaelElements";
import { addStackElement } from "@/redux/features/stackOrderSlice";
import { useAppSelector } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const ImageElements = () => {
    const { paper, setSelectedItem, setLastAddedElement, setFTEndData } = usePaper();
    const { addImageElement } = useRaphaelElements(paper);

    const dispatch = useDispatch();

    const imagePreviews = useAppSelector((state) => state.imagePreview.images);   
    const histories = useAppSelector((state) => state.history.objectHistories);   
    const stackOrder = useAppSelector(state => state.stackOrder);


    useEffect(() => {
        if (paper) {
            const paperCenter: { x: number, y: number } = { x: paper.width / 2, y: paper.height / 2 };

            imagePreviews.forEach((image, index) => {
                console.log('images', image);
                const element = addImageElement({
                    id: image.id,
                    src: image.src,
                    x: image.x || 0,
                    y: image.y || 0,
                    scaleX: image.scaleX || 0,
                    scaleY: image.scaleY || 0,
                    rotate: image.rotate || 0,
                    width: image.width,
                    height: image.height,
                    status: image.status,
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

                    if(!element.scaleX || !element.scaleY) {
                        const scaleFactor = Math.min(paper.width / bbox.width, paper.height / bbox.height) * 0.70;
                        console.log(scaleFactor);
                        element.scale(scaleFactor, scaleFactor) 
                    } 

                    // if(!element)
                    
                    // console.log(element.data()); 
                  
                    console.log(element);                                                

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
                            
                            const bbox = element.getBBox();
                            console.log(bbox, '<pre></pre>', ft);

                            ft && setFTEndData({
                                id: ft.subject.id,
                                category: ft.subject.data().data,
                                position: {
                                    x: bbox.x,
                                    y: bbox.y,
                                    width: bbox.width,
                                    height: bbox.height,                                      
                                    center: ft.attrs.center,
                                    translate: ft.attrs.translate,
                                    scaleX: ft.attrs.scale.x,
                                    scaleY: ft.attrs.scale.y,
                                    rotate: ft.attrs.rotate,
                                }
                            })
                        }

                        if(events.includes("scale end") || events.includes("rotate end")) {
                            const bbox = element.getBBox();

                            ft && setFTEndData({
                                id: ft.subject.id,
                                category: ft.subject.data().data,
                                position: {
                                    x: bbox.x,
                                    y: bbox.y,
                                    width: bbox.width,
                                    height: bbox.height,                                        
                                    center: ft.attrs.center,                   
                                    translate: ft.attrs.translate,     
                                    scaleX: ft.attrs.scale.x,
                                    scaleY: ft.attrs.scale.y,
                                    rotate: ft.attrs.rotate,
                                }
                            })
                        }
                    })                        
                                     
                    ft && hideFreeTransform(ft)      
                         
                    // setLastAddedElement(element);
                    
                    element && dispatch(addStackElement(element.id))
                    
                }
            });
        }
    }, [paper, setLastAddedElement, setSelectedItem, imagePreviews, addImageElement, dispatch, histories, setFTEndData]);   


    return null
}

export default ImageElements