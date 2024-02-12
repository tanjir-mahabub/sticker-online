import React, { useEffect } from 'react';
import Rectangle from './Rectangle';
import ImageComponent from './Image';
import Text from './Text';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useCanvasState } from '@/hooks/useCanvasState';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface CanvasElementsRendererProps {
    rectangles: any[];
    images: any[];
    texts: any[];
    selectedId: string | null;
    setSelectedId: React.Dispatch<React.SetStateAction<string | null>>; // Define setSelectedId prop
    handleRectChange: (index: number, newAttrs: any) => void;
    handleImageChange: (index: number, newAttrs: any) => void;
    handleTextChange: (index: number, newAttrs: any) => void;
}

const CanvasElementsRenderer: React.FC<CanvasElementsRendererProps> = ({
    rectangles,
    images,
    texts,
    selectedId,
    setSelectedId,
    handleRectChange,
    handleImageChange,
    handleTextChange,
}) => {

    const { data: textSelected } = useLocalStorage('selectedTextData');
    const canvasProperties = useSelector((state: RootState) => state.canvas);
    const { centerX, centerY, frameWidth, frameHeight } = canvasProperties;

    useEffect(() => {

    }, [centerX, centerY, frameWidth, frameHeight, textSelected])

    return (
        <>
            {/* {rectangles.map((rectProps, i) => (
                <Rectangle
                    key={i}
                    shapeProps={rectProps}
                    isSelected={rectProps.id === selectedId}
                    onSelect={() => setSelectedId(rectProps.id)} // Use setSelectedId here
                    onChange={(newAttrs) => handleRectChange(i, newAttrs)}
                />
            ))} */}
            {images.map((imgProps, i) => (
                <ImageComponent
                    key={i}
                    imageProps={imgProps}
                    isSelected={imgProps.id === selectedId}
                    onSelect={() => setSelectedId(imgProps.id)} // Use setSelectedId here
                    onChange={(newAttrs) => handleImageChange(i, newAttrs)}
                />
            ))}
            {texts.length > 0 &&
                texts.map((textProps, i) => (
                    <Text
                        key={i}
                        textProps={textProps}
                        isSelected={textProps.id === selectedId}
                        onSelect={() => setSelectedId(textProps.id)} // Use setSelectedId here
                        onChange={(newAttrs) => handleTextChange(i, newAttrs)}
                    />
                ))}
        </>
    );
};

export default CanvasElementsRenderer;
