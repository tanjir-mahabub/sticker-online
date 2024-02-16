import { useEffect, useState } from "react";
import { useImageStorage } from "./useImageStorage";
import { RectangleProps } from "@/components/Editor/CanvasTools/Rectangle";
import { ImageProps } from "@/components/Editor/CanvasTools/Image";
import { TextProps } from "@/components/Editor/CanvasTools/Text";
import { initialRectangles } from "@/store/canvasStore";
import { useDispatch, useSelector } from "react-redux";
import { RootState, useAppSelector } from "@/redux/store";
import { useTextStorage } from "./useTextStorage";
import { setText } from "@/redux/features/textSlice";

export const useCanvasState = () => {

    const dispatch = useDispatch()

    const selectedText = useAppSelector((state: RootState) => state.text.selectedText);

    const [textUpdated, setTextUpdated] = useState(false);

    const { data: previewImages } = useImageStorage('imageStore');   
    
    const { data: previewMotives } = useImageStorage('motivStore');   

    const { data: previewTexts } = useTextStorage('textStore'); 

    const [rectangles, setRectangles] = useState<RectangleProps['shapeProps'][]>(initialRectangles);
    const [images, setImages] = useState<ImageProps['imageProps'][]>([]);
    const [dieCutImages, setDieCutImages] = useState<ImageProps['imageProps'][]>([]);
    const [motives, setMotives] = useState<ImageProps['imageProps'][]>([]);
    const [selectedTexts, setSelectedTexts] = useState<TextProps['textProps'][]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const canvasProperties = useSelector((state: RootState) => state.canvas);

    const { centerX, centerY, frameWidth, frameHeight } = canvasProperties;
    const canvasDiemensionSet = (img: HTMLImageElement) => {
    // Calculate the new width and height
    const scaleFactor = 0.8; // 20% smaller
    const scaledWidth = frameWidth * scaleFactor;
    const scaledHeight = frameHeight * scaleFactor;

    // Determine the scaling factor for maintaining aspect ratio
    const widthScaleFactor = scaledWidth / img.width;
    const heightScaleFactor = scaledHeight / img.height;
    const minScaleFactor = Math.min(widthScaleFactor, heightScaleFactor);

    // Calculate the scaled dimensions while maintaining aspect ratio
    const newWidth = img.width * minScaleFactor;
    const newHeight = img.height * minScaleFactor;

    // Calculate the position for centering the image
    const xPosition = centerX - newWidth / 2;
    const yPosition = centerY - newHeight / 2;
    }

    useEffect(() => {
        if (typeof window !== 'undefined' && previewImages.length > 0) {
            const imagesArray = previewImages.map((imageSrc, index) => ({
                x: centerX - frameWidth / 2, // Adjust x position for each image
                y: centerY - frameHeight / 2,
                // width: frameWidth * .8,
                // height: frameHeight,
                src: imageSrc,
                id: `img${index + 1}`, // Generate unique ID for each image
            }));
            
            setImages(imagesArray);  
            setDieCutImages(imagesArray);
        }
    }, [previewImages, centerX, centerY, frameWidth, frameHeight]);

    useEffect(() => {
        if (typeof window !== 'undefined' && previewMotives.length > 0) {
            const MotivesArray = previewMotives.map((motivesSrc, index) => ({
                x: centerX - frameWidth / 2, // Adjust x position for each image
                y: centerY - frameHeight / 2,
                // width: frameWidth * .8,
                // height: frameHeight,
                src: motivesSrc,
                id: `motiv${index + 1}`, // Generate unique ID for each image
            }));
            
            setMotives(MotivesArray);            
        }
    }, [previewMotives, centerX, centerY, frameWidth, frameHeight]);
    

    useEffect(() => {
        if (previewTexts && typeof previewTexts === 'object') {
            const { id, name } = previewTexts;            
            if (name) {
                const textArray = [
                    {
                        x: centerX - frameWidth / 2, 
                        y: centerY - frameHeight / 2,
                        text: "Sample Text",
                        fontSize: 36,                        
                        fill: 'blue',
                        id: `text${id}`,
                        // width: 350,
                        // height: 80,
                        padding: 20
                    }
                ];
                
                setSelectedTexts(textArray);

                dispatch(setText({ id, name }));
                                
            }
        }
    }, [previewTexts, centerX, centerY, frameWidth, frameHeight, dispatch, textUpdated]);
    
    
    useEffect(() => {        
        selectedText && setTextUpdated(true);
    }, [selectedText])
    

    return {
        rectangles,
        setRectangles,
        images,
        setImages,
        dieCutImages,
        setDieCutImages,
        motives,
        setMotives,
        selectedTexts,
        setSelectedTexts,
        selectedId,
        setSelectedId,
        canvasState: canvasProperties.canvasUpdated
    };
};