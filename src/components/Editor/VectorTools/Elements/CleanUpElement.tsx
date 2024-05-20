import { useEffect } from "react";
import { usePaper } from "@/context/PaperContext";
import { useAppSelector } from "@/redux/store";
import { isElementInsideFrame } from "../elementUtils";
import { useDispatch } from "react-redux";
import { useTransformUtils } from "@/hooks/useTransformUtils";

interface CleanUpElementProps { }

const CleanUpElement: React.FC<CleanUpElementProps> = () => {
    const { paper, selectedItem, setSelectedItem, currentFtRef, isLoading } = usePaper();
    const imagePreviews = useAppSelector((state) => state.imagePreview.images);
    const textPreviews = useAppSelector((state) => state.text.texts);
    const { centerX, centerY, frameWidth, frameHeight } = useAppSelector((state) => state.canvas); 


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

            // element.attr({ opacity: isVisible ? 1 : 0.3 });

            if ((isImageOrMotiv && !newImageIds.has(element.id)) || (isText && !newTextIds.has(element.id))) {
                elementsToRemove.push(element);
            }
        });

        elementsToRemove.forEach((el) => el.remove());       
        console.log('deleted', elementsToRemove); 
    }, [paper, centerX, centerY, frameWidth, frameHeight, imagePreviews, textPreviews, isLoading]);


    return null;
};

export default CleanUpElement;
