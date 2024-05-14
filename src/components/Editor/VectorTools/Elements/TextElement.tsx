import { convertTextToPath } from "@/components/Utils/vectorFunction";
import { usePaper } from "@/context/PaperContext";
import { useRaphaelElements } from "@/hooks/useRaphaelElements";
import { useTransformUtils } from "@/hooks/useTransformUtils";
import { addStackElement } from "@/redux/features/stackOrderSlice";
import { useAppSelector } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const TextElement = () => {
    const { paper, lastAddedElement, setSelectedItem, setLastAddedElement, currentFtRef, isLoading } = usePaper();
    const { addPathElement, addTextElement } = useRaphaelElements(paper);

    const dispatch = useDispatch();

    const textPreviews = useAppSelector((state) => state.text.texts);

    const { handleElementInteraction, reapplyFreeTransform } = useTransformUtils(dispatch, currentFtRef, setSelectedItem);

    useEffect(() => {
        if (paper) {
            const paperCenter = { x: paper.width / 2, y: paper.height / 2 };

            textPreviews?.forEach((text: any, index: number) => {

                convertTextToPath(text)
                    .then((pathData) => {
                        // console.log('Text converted to path successfully.', pathData);
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
                                "pointer-events": "bounding-box"
                            },
                            type: "text",
                            category: "text"
                        };

                        const pathElement = addPathElement(textObject);

                        pathElement.attr({
                            "pointer-events": "bounding-box"
                        })
                        // const textElement = addTextElement(textObject);

                        if (pathElement) {
                            const bbox = pathElement.getBBox();
                            const elCenter = { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 };
                            const translation = { x: paperCenter.x - elCenter.x, y: paperCenter.y - elCenter.y };

                            pathElement.translate(translation.x, translation.y)

                            //pathElement.click(() => handleElementInteraction(pathElement));

                            setLastAddedElement(pathElement);
                            // reapplyFreeTransform(textElement)
                        }

                    })
                    .catch((error) => {
                        console.error('Error converting text to path:', error);
                    }).finally(() => {

                        dispatch(addStackElement(text.id))
                    })

            });
        }
    }, [paper, setLastAddedElement, textPreviews, addTextElement, addPathElement, handleElementInteraction, reapplyFreeTransform, dispatch]);


    useEffect(() => {
        if (lastAddedElement) {
            setSelectedItem(lastAddedElement)
            // handleElementInteraction(lastAddedElement);
            // reapplyFreeTransform(lastAddedElement)
        }
    }, [lastAddedElement, setSelectedItem, handleElementInteraction, reapplyFreeTransform]);


    return null
}

export default TextElement