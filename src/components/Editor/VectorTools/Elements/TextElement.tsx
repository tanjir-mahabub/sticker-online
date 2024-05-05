import { convertTextToPath } from "@/components/Utils/vectorFunction";
import { usePaper } from "@/context/PaperContext";
import { useRaphaelElements } from "@/hooks/useRaphaelElements";
import { useTransformUtils } from "@/hooks/useTransformUtils";
import { useAppSelector } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const TextElement = () => {
    const { paper, lastAddedElement, setSelectedItem, setLastAddedElement, setStackOrder, currentFtRef, isLoading } = usePaper();
    const { addPathElement } = useRaphaelElements(paper);

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

                        const element = addPathElement({
                            id: text.id,
                            pathData: pathData,
                            attrs: {
                                cursor: "move",
                                fill: text.fill || '',
                                stroke: text.stroke || 'red',
                                "stroke-width": text.strokeWidth || 0,
                                "font-size": text.fontSize || 48,
                                "font-family": text.fontFamily || 'Arial'
                            },
                            type: "text",
                            category: "text"
                        });

                        if (element) {
                            const bbox = element.getBBox();
                            const elCenter = { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 };
                            const translation = { x: paperCenter.x - elCenter.x, y: paperCenter.y - elCenter.y };

                            // element.attr({ x: translation.x, y: translation.y, width: bbox.width, height: bbox.height });
                            element.translate(translation.x, translation.y)

                            element.click(() => handleElementInteraction(element));

                            setLastAddedElement(element);
                            reapplyFreeTransform(element)
                        }

                    })
                    .catch((error) => {
                        console.error('Error converting text to path:', error);
                    });

            });
        }
    }, [paper, setLastAddedElement, textPreviews, addPathElement, handleElementInteraction, reapplyFreeTransform]);

    useEffect(() => {
        if (lastAddedElement) {
            setSelectedItem(lastAddedElement)
            handleElementInteraction(lastAddedElement);
            reapplyFreeTransform(lastAddedElement)
        }
    }, [lastAddedElement, setSelectedItem, handleElementInteraction, reapplyFreeTransform]);


    return null
}

export default TextElement