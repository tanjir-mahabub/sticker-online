import React, { useEffect, useRef, useState } from 'react';
import Konva from 'konva';
import { Stage, Layer, Rect } from 'react-konva';
import { RectangleProps } from './Rectangle';
import { ImageProps } from './Image';
import { TextProps } from './Text';
import CanvasElementsRenderer from './CanvasELementRenderer';
import { checkDeselect, handleRectChange, handleImageChange, handleTextChange } from '@/components/Utils/canvasOperation';
import CanvasFrame from './CanvasFrame';
import { useDispatch } from 'react-redux';
import { setCanvasProperties } from '@/redux/features/canvasSlice';
import { useCanvasState } from '@/hooks/useCanvasState';


interface CanvasProps {
    width?: number;
    height?: number;
    originalWidth?: number;
    originalHeight?: number;
}

const NewCanvas: React.FC<CanvasProps> = ({
    width = 0,
    height = 0,
    originalWidth = 6.5,
    originalHeight = 5,
}) => {

    const dispatch = useDispatch();
    const [readyState, setReadyState] = useState(false);
    const { rectangles, setRectangles, images, setImages, texts, setTexts, selectedId, setSelectedId, canvasState } = useCanvasState();

    const stageRef = useRef<Konva.Stage>(null);
    const transformerRef = useRef<Konva.Transformer | null>(null);
    const frameRef = useRef<Konva.Rect>(null);

    const dpi = 300;
    const cmToPx = (cm: number, dpi: number) => (cm / 2.54) * dpi;

    const widthInPixels = cmToPx(originalWidth, dpi);
    const heightInPixels = cmToPx(originalHeight, dpi);

    const centerX = width / 2;
    const centerY = height / 2;

    const frameWidth = widthInPixels * 0.7;
    const frameHeight = heightInPixels * 0.7;


    useEffect(() => {
        if (stageRef.current) {
            setReadyState(true);
            dispatch(setCanvasProperties({ centerX: centerX, centerY: centerY, frameWidth: frameWidth, frameHeight: frameHeight }));
        }

    }, [stageRef, dispatch, centerX, centerY, frameWidth, frameHeight])

    useEffect(() => {
        dispatch(setCanvasProperties({ canvasUpdated: true }));
        console.log('uploaded from canvas');

        return () => {
            dispatch(setCanvasProperties({ canvasUpdated: false }));
            console.log('uploaded from canvas return');
        }

    }, [canvasState, dispatch]);

    return (
        <>

            {readyState && (
                <CanvasFrame
                    stage={stageRef.current}
                    centerX={centerX}
                    centerY={centerY}
                    frameWidth={frameWidth}
                    frameHeight={frameHeight}
                />
            )}


            <Stage
                width={width} height={height} ref={stageRef}
                onMouseDown={(e: Konva.KonvaEventObject<MouseEvent>) => checkDeselect(e, setSelectedId)}
                onTouchStart={(e: Konva.KonvaEventObject<TouchEvent>) => checkDeselect(e, setSelectedId)}
            >
                <Layer>
                    <Rect
                        width={frameWidth}
                        height={frameHeight}
                        x={centerX - frameWidth / 2}
                        y={centerY - frameHeight / 2}
                        fill="transparent"
                        stroke="black"
                        strokeWidth={0.2}
                        ref={frameRef} // Use frameRef directly
                    />
                    <CanvasElementsRenderer
                        rectangles={rectangles}
                        images={images}
                        texts={texts}
                        selectedId={selectedId}
                        setSelectedId={setSelectedId} // Pass setSelectedId here
                        handleRectChange={(index: number, newAttrs: Partial<RectangleProps['shapeProps']>) => handleRectChange(index, newAttrs, rectangles, setRectangles)}
                        handleImageChange={(index: number, newAttrs: Partial<ImageProps['imageProps']>) => handleImageChange(index, newAttrs, images, setImages)}
                        handleTextChange={(index: number, newAttrs: Partial<TextProps['textProps']>) => handleTextChange(index, newAttrs, texts, setTexts)}
                    />
                </Layer>
            </Stage>
        </>
    );
};

export default NewCanvas;
