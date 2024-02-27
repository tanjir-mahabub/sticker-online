import React, { useEffect, useState } from 'react';
import Rectangle from './Rectangle';
import ImageComponent from './Image';
import Text from './Text';
import Loading from '@/components/Utils/Loading';

interface CanvasElementsRendererProps {
    rectangles: any[];
    images: any[];
    motives: any[];
    texts: any[];
    selectedId: string | null;
    setSelectedId: React.Dispatch<React.SetStateAction<string | null>>; // Define setSelectedId prop
    handleRectChange: (index: number, newAttrs: any) => void;
    handleImageChange: (index: number, newAttrs: any) => void;
    handleMotiveChange: (index: number, newAttrs: any) => void;
    handleTextChange: (index: number, newAttrs: any) => void;
}

const CanvasElementsRenderer: React.FC<CanvasElementsRendererProps> = ({
    rectangles,
    images,
    motives,
    texts,
    selectedId,
    setSelectedId,
    handleRectChange,
    handleImageChange,
    handleMotiveChange,
    handleTextChange,
}) => {

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


            {!images ? (
                <Loading />
            ) : (
                <>
                    {images.map((imgProps, i) => (
                        <ImageComponent
                            key={i}
                            imageProps={imgProps}
                            isSelected={imgProps.id === selectedId}
                            onSelect={() => setSelectedId(imgProps.id)} // Use setSelectedId here
                            onChange={(newAttrs) => handleImageChange(i, newAttrs)}
                        />
                    ))}
                </>
            )}

            {motives.map((motive, i) => (
                <ImageComponent
                    key={i}
                    imageProps={motive}
                    isSelected={motive.id === selectedId}
                    onSelect={() => setSelectedId(motive.id)} // Use setSelectedId here
                    onChange={(newAttrs) => handleMotiveChange(i, newAttrs)}
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
