import { convertTextToPath } from "@/components/Utils/vectorFunction";
import { usePaper } from "@/context/PaperContext";
import { useRaphaelElements } from "@/hooks/useRaphaelElements";
import { useTransformUtils } from "@/hooks/useTransformUtils";
import { addStackElement } from "@/redux/features/stackOrderSlice";
import { useAppSelector } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const TextElement = () => {
    const { paper, lastAddedElement, setSelectedItem, setLastAddedElement, setFTEndData } = usePaper();
    const { addPathElement, addTextElement } = useRaphaelElements(paper);
    const { addOrRemoveTransform } = useTransformUtils();

    const dispatch = useDispatch();

    const textPreviews = useAppSelector((state) => state.text.texts);    

    useEffect(() => {
        if (paper) {
            const paperCenter = { x: paper.width / 2, y: paper.height / 2 };

            textPreviews?.forEach((text: any, index: number) => {

                convertTextToPath(text)
                    .then((pathData) => {                        
                        const textObject = {
                            id: text.id,
                            x: 500,
                            y: 300,
                            text: text.text,
                            pathData: pathData,
                            attrs: {
                                cursor: "move",
                                fill: text.fill || '',
                                stroke: text.stroke || 'red',
                                "stroke-width": text.strokeWidth || 0,
                                "font-size": text.fontSize || 48,
                                "font-family": text.fontFamily || 'Arial',                                
                                "class": "so-textpath"
                            },
                            type: "text",
                            category: "text"
                        };

                        const pathElement = addPathElement(textObject);                       

                        if (pathElement) {
                            const bbox = pathElement.getBBox();
                            const elCenter = { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 };
                            const translation = { x: paperCenter.x - elCenter.x, y: paperCenter.y - elCenter.y };

                            pathElement.translate(translation.x, translation.y)
                           
                            addOrRemoveTransform(pathElement);
                                 
                            // setLastAddedElement(element);
                            
                            pathElement && dispatch(addStackElement(pathElement.id))                          
                        }

                    })
                    .catch((error:any) => {
                        console.error('Error converting text to path:', error);
                    }).finally(() => {

                        dispatch(addStackElement(text.id))
                    })               


            });
        }
    }, [paper, setLastAddedElement, textPreviews, addTextElement, addPathElement, dispatch, setFTEndData, setSelectedItem, addOrRemoveTransform]);


    useEffect(() => {
        if (lastAddedElement) {
            setSelectedItem(lastAddedElement)           
        }
    }, [lastAddedElement, setSelectedItem]);


    return null
}

export default TextElement