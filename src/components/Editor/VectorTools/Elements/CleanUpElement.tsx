import { useEffect, useCallback } from "react";
import { usePaper } from "@/context/PaperContext";
import { useAppSelector } from "@/redux/store";
import { isElementInsideFrame } from "../elementUtils";
import { useDispatch } from "react-redux";
import { useTransformUtils } from "@/hooks/useTransformUtils";

interface CleanUpElementProps { }

const CleanUpElement: React.FC<CleanUpElementProps> = () => {
    const { paper, selectedItem, setSelectedItem, currentFtRef, isLoading, setStackOrder } = usePaper();
    const imagePreviews = useAppSelector((state) => state.imagePreview.images);
    const textPreviews = useAppSelector((state) => state.text.texts);
    const { centerX, centerY, frameWidth, frameHeight } = useAppSelector((state) => state.canvas);

    const dispatch = useDispatch();
    const { deselect } = useTransformUtils(dispatch, currentFtRef, setSelectedItem);

    useEffect(() => {
        if (paper && imagePreviews && textPreviews) {
            const elements = new Set(); // Use a Set to ensure uniqueness
            paper.forEach((el: any) => {
                const { data } = el.data()
                // console.log(el);
                if ((el.type === "image" || el.type === "path") && data !== "dieCutImage") {
                    elements.add(el); // Add elements to the Set
                }
            });

            console.log('stackOrder', textPreviews, elements);
            elements && setStackOrder(Array.from(elements)); // Convert Set back to array and set the stack order
        }
    }, [paper, setStackOrder, imagePreviews, textPreviews]);


    useEffect(() => {
        if (!paper || isLoading) return;

        const elementsToRemove: any[] = [];
        const newImageIds = new Set(imagePreviews.map((item) => item.id));
        const newTextIds = new Set(textPreviews.map((item) => item.id));

        paper.forEach((element: any) => {
            const { data } = element.data();
            const isImageOrMotiv = data === "image" || data === "motiv";
            const isText = data === "text";

            const isVisible = isElementInsideFrame(element, centerX, centerY, frameWidth, frameHeight);

            element.attr({ opacity: isVisible ? 1 : 0.3 });

            if ((isImageOrMotiv && !newImageIds.has(element.id)) || (isText && !newTextIds.has(element.id))) {
                elementsToRemove.push(element);
            }
        });

        elementsToRemove.forEach((el) => el.remove());
        deselect();
    }, [paper, centerX, centerY, frameWidth, frameHeight, imagePreviews, textPreviews, isLoading, deselect]);


    return null;
};

export default CleanUpElement;
