import { usePaper } from "@/context/PaperContext";
import { useRaphaelElements } from "@/hooks/useRaphaelElements";
import { useTransformUtils } from "@/hooks/useTransformUtils";
import { useAppSelector } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const TextElement = () => {
    const { paper, lastAddedElement, setSelectedItem, setLastAddedElement, setStackOrder, currentFtRef, isLoading } = usePaper();
    const { addTextElement } = useRaphaelElements(paper);

    const dispatch = useDispatch();

    const textPreviews = useAppSelector((state) => state.text.texts);

    const { handleElementInteraction, reapplyFreeTransform } = useTransformUtils(dispatch, currentFtRef, setSelectedItem);

    useEffect(() => {
        if (paper) {
            const paperCenter = { x: paper.width / 2, y: paper.height / 2 };

            textPreviews?.forEach((text: any, index: number) => {
                const element = addTextElement({
                    id: text.id,
                    text: text.text,
                    x: text.x || 0,
                    y: text.y || 0,
                    width: text.width,
                    height: "auto",
                    attrs: {
                        cursor: "move",
                        fill: text.fill || '',
                        "font-size": text.fontSize || 24,
                        "font-family": text.fontFamily || 'Arial',
                        opacity: 0.3
                    },
                    type: "text"
                });

                if (element) {
                    const bbox = element.getBBox();
                    const elCenter = { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 };
                    const translation = { x: paperCenter.x - elCenter.x, y: paperCenter.y - elCenter.y };

                    element.attr({ x: translation.x, y: translation.y, width: bbox.width, height: bbox.height });

                    element.click(() => handleElementInteraction(element));

                    setLastAddedElement(element);
                    reapplyFreeTransform(element)
                }

            });
        }
    }, [paper, setLastAddedElement, textPreviews, addTextElement, handleElementInteraction, reapplyFreeTransform]);

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