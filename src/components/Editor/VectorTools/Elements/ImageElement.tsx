import { usePaper } from "@/context/PaperContext";
import { useRaphaelElements } from "@/hooks/useRaphaelElements";
import { useTransformUtils } from "@/hooks/useTransformUtils";
import { useAppSelector } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const ImageElements = () => {
    const { paper, lastAddedElement, setSelectedItem, setLastAddedElement, setStackOrder, currentFtRef, isLoading } = usePaper();
    const { addImageElement } = useRaphaelElements(paper);

    const dispatch = useDispatch();

    const imagePreviews = useAppSelector((state) => state.imagePreview.images);

    const { handleElementInteraction, reapplyFreeTransform } = useTransformUtils(dispatch, currentFtRef, setSelectedItem);


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
                    attrs: { opacity: 0.5, cursor: 'move' },
                    type: (image.category === "image") ? "image" : "motiv", // Example attributes
                });

                if (element) {
                    const bbox = element.getBBox();
                    const elCenter = { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 };
                    const translation = { x: paperCenter.x - elCenter.x, y: paperCenter.y - elCenter.y };

                    element.attr({ x: translation.x, y: translation.y });

                    element.click(() => handleElementInteraction(element));

                    setLastAddedElement(element);
                }
            });
        }
    }, [paper, setLastAddedElement, imagePreviews, addImageElement, handleElementInteraction]);

    useEffect(() => {
        if (lastAddedElement) {
            setSelectedItem(lastAddedElement)
            handleElementInteraction(lastAddedElement);
            reapplyFreeTransform(lastAddedElement)
        }
    }, [lastAddedElement, setSelectedItem, handleElementInteraction, reapplyFreeTransform]);

    return null
}

export default ImageElements