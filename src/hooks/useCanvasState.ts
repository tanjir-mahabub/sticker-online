import { useEffect, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { RectangleProps } from "@/components/Editor/CanvasTools/Rectangle";
import { ImageProps } from "@/components/Editor/CanvasTools/Image";
import { TextProps } from "@/components/Editor/CanvasTools/Text";
import { initialRectangles, initialTexts } from "@/store/canvasStore";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export const useCanvasState = () => {

    const { data: previewImages } = useLocalStorage('imageStore');   

    const { data: previewTexts } = useLocalStorage('textStore'); 

    const [rectangles, setRectangles] = useState<RectangleProps['shapeProps'][]>(initialRectangles);
    const [images, setImages] = useState<ImageProps['imageProps'][]>([]);
    const [texts, setTexts] = useState<TextProps['textProps'][]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const canvasProperties = useSelector((state: RootState) => state.canvas);

    useEffect(() => {
        if (typeof window !== 'undefined' && previewImages.length > 0) {
            const imagesArray = previewImages.map((imageSrc, index) => ({
                x: 300 + index * 50, // Adjust x position for each image
                y: 50,
                width: 200,
                height: 200,
                src: imageSrc,
                id: `img${index + 1}`, // Generate unique ID for each image
            }));
            
            setImages(imagesArray);            
        }
    }, [previewImages, canvasProperties]);
    

    useEffect(() => {
        if (previewTexts && typeof previewTexts === 'object') {
            const { selectedTextId, selectedTextName } = previewTexts; // Access selectedTextName from the object
            if (selectedTextName) {
                const textArray = [
                    {
                        x: 50,
                        y: 300,
                        text: "Sample Text",
                        fontSize: 36,
                        fontFamily: selectedTextName,
                        fill: 'blue',
                        id: `text${selectedTextId}`, // Assuming selectedTextId exists
                        width: 350,
                        height: 80,
                        padding: 20
                    }
                ];
                setTexts(textArray);
            }
        }
    }, [previewTexts]);
    
    
    

    return {
        rectangles,
        setRectangles,
        images,
        setImages,
        texts,
        setTexts,
        selectedId,
        setSelectedId,
        canvasState: canvasProperties.canvasUpdated
    };
};