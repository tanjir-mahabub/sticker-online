import { usePaper } from "@/context/PaperContext";
import { useRaphaelElements } from "@/hooks/useRaphaelElements";
import { useTransformUtils } from "@/hooks/useTransformUtils";
import { addStackElement } from "@/redux/features/stackOrderSlice";
import { useAppSelector } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const ImageElements = () => {
    const { paper, setSelectedItem, setLastAddedElement, setFTEndData } = usePaper();
    const { addImageElement } = useRaphaelElements(paper);
    const { addOrRemoveTransform } = useTransformUtils();

    const dispatch = useDispatch();

    const imagePreviews = useAppSelector((state) => state.imagePreview.images);   
    const histories = useAppSelector((state) => state.history.objectHistories);           


    useEffect(() => {
        if (paper) {
            const paperCenter: { x: number, y: number } = { x: paper.width / 2, y: paper.height / 2 };

            imagePreviews?.forEach((image, index) => {                
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
                    if(!element.scaleX && !element.scaleY) {
                        const scaleFactor = Math.min(paper.width / bbox.width, paper.height / bbox.height) * 0.60;                        
                        !isNaN(scaleFactor) && scaleFactor !== Infinity && element.scale(scaleFactor, scaleFactor) 
                    } 


                    // if(!element)
                    
                        
                    element.hide()                                                                                                                                             

                    addOrRemoveTransform(element)
                         
                    // setLastAddedElement(element);
                    
                    element && dispatch(addStackElement(element.id))
                    
                }
            });
        }
    }, [paper, setLastAddedElement, setSelectedItem, imagePreviews, addImageElement, dispatch, histories, setFTEndData, addOrRemoveTransform]);   


    return null
}

export default ImageElements