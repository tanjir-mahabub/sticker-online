import React, { useEffect, useRef, useState } from 'react';
import Konva from 'konva';
import { Stage, Layer, Rect, Circle, Group } from 'react-konva';
import { RectangleProps } from './Rectangle';
import { ImageProps } from './Image';
import { TextProps } from './Text';
import CanvasElementsRenderer from './CanvasELementRenderer';
import { checkDeselect, handleRectChange, handleImageChange, handleTextChange, handleMotiveChange, handleDieCutImageChange } from '@/components/Utils/canvasOperation';
import CanvasFrame from './CanvasFrame';
import { useDispatch } from 'react-redux';
import { setCanvasProperties } from '@/redux/features/canvasSlice';
import { useCanvasState } from '@/hooks/useCanvasState';
import { useAppSelector } from '@/redux/store';
import { useImageStorage } from '@/hooks/useImageStorage';
import DieCutImage, { DieCutImageProps } from './DieCutImageBG';
import CustomTransformer from '@/components/Utils/CustomTransformer';
import { Node, NodeConfig } from 'konva/lib/Node';
import { Shape, ShapeConfig } from 'konva/lib/Shape';
import { addFiles } from '@/redux/features/fileUploadSlice';
import { addedToHistory } from '@/redux/features/historySlice';


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

    const StickerSelected = useAppSelector(state => state.sticker);

    const dispatch = useDispatch();
    const [readyState, setReadyState] = useState(false);
    const { rectangles, setRectangles, images, setImages, dieCutImages, setDieCutImages, motives, setMotives, selectedTexts, setSelectedTexts, selectedId, setSelectedId } = useCanvasState();

    const stageRef = useRef<Konva.Stage>(null);
    const frameRef = useRef<Konva.Rect>(null);
    const circleRef = useRef<Konva.Circle>(null);
    const groupRef = useRef<Konva.Group>(null);

    const [isRectHovered, setIsRectHovered] = useState(false);
    const [isCircleHovered, setIsCircleHovered] = useState(false);

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


    const { data: previewImages } = useImageStorage('imageStore');
    const FileState = useAppSelector(state => state.file)

    const [selectedShapes, setSelectedShapes] = useState<Konva.Shape[]>([]);

    const [selected, setSelected] = useState<boolean>(false);
    const [isRectSelected, setIsRectSelected] = useState(false);
    const [isCircleSelected, setIsCircleSelected] = useState(false);
    const [imageAttrs, setImageAttrs] = useState<DieCutImageProps>();
    const [dieCutKey, setDieCutKey] = useState(0);

    const [imageUpdated, setImageUpdated] = useState([])

    const handleClickOnStage = () => {
        if (selectedShapes.length > 0) {
            // Deselect all shapes
            setSelectedShapes([]);
        }


        selected && setSelected(false);
        isRectSelected && setIsRectSelected(false)
        isCircleSelected && setIsCircleSelected(false)
    }



    // useEffect(() => {
    //     setImageAttrs({
    //         imageUrl: previewImages[0],
    //         isSelected: selected,
    //         onSelect: () => setSelected(true),
    //         onChange: (newAttrs) => console.log('Image attributes changed:', newAttrs),
    //     })
    // }, [previewImages, selected]);


    // useEffect(() => {
    //     const frame = frameRef.current;
    //     if (!frame) return; // Ensure frameRef is defined

    //     const frameRect = frame.getClientRect();
    //     if (!frameRect) return; // Ensure frameRect is defined

    //     const shapes = stageRef.current?.getStage().getChildren();
    //     if (!shapes) return; // Ensure shapes is defined

    //     // Function to handle shape position change
    //     const handleShapeMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    //         const shape = e.target;
    //         if (!shape) return;

    //         const shapeRect = shape.getClientRect();
    //         if (!shapeRect) return; // Ensure shapeRect is defined

    //         const intersects = Konva.Util.haveIntersection(frameRect, shapeRect);
    //         console.log(`Shape intersects frame: ${intersects}`);
    //     };

    //     // Add event listener to each shape for dragmove event
    //     shapes.forEach(shape => {
    //         shape.on('dragmove', handleShapeMove);
    //     });

    //     // Cleanup function to remove event listeners
    //     return () => {
    //         shapes.forEach(shape => {
    //             shape.off('dragmove', handleShapeMove);
    //         });
    //     };
    // }, [stageRef, frameRef]);


    // useEffect(() => {
    //     const frame = frameRef.current;
    //     if (!frame) return; // Ensure frameRef is defined

    //     const frameRect = frame.getClientRect();
    //     if (!frameRect) return; // Ensure frameRect is defined

    //     const stage = stageRef.current?.getStage();
    //     if (!stage) return; // Ensure stage is defined

    //     // Create a temporary layer to hold the intersecting shapes
    //     const tempLayer = new Konva.Layer();

    //     // Find intersecting shapes and add them to the temporary layer
    //     const nodes = stage.find<Shape<NodeConfig>>(node => {
    //         const shapeNode = node as Shape<NodeConfig>;
    //         const nodeRect = shapeNode.getClientRect();
    //         return nodeRect && Konva.Util.haveIntersection(frameRect, nodeRect);
    //     });

    //     // Filter the nodes to ensure they are shapes before adding them to the layer
    //     const shapes = nodes.filter(node => node instanceof Konva.Shape);

    //     // Add the valid shapes to the temporary layer
    //     shapes.forEach(shape => tempLayer.add(shape));



    //     // Add the temporary layer to the stage (to ensure shapes are drawn)
    //     stage.add(tempLayer);

    //     // Create a new canvas element to draw the shapes
    //     const canvas = document.createElement('canvas');
    //     const context = canvas.getContext('2d');
    //     if (!context) return;

    //     // Set canvas size equal to stage size
    //     canvas.width = stage.width();
    //     canvas.height = stage.height();

    //     // Draw the temporary layer onto the canvas
    //     tempLayer.draw();

    //     // Convert the canvas to an image
    //     const image = new Image();
    //     image.src = canvas.toDataURL();
    //     console.log(image);
    //     localStorage.setItem('canvasImage', image.src);
    //     // Optionally, save or display the image
    //     // For example:
    //     // document.body.appendChild(image);
    //     // Or save the image using browser APIs

    //     // Clean up temporary resources
    //     tempLayer.destroy();

    // }, [stageRef, frameRef]);


    // Add 'shapes' as a dependency





    // useEffect(() => {
    //     if (stageRef.current) {
    //         // Create a group of selected shapes
    //         if (selectedShapes.length > 0) {
    //             const group = new Konva.Group();
    //             selectedShapes.forEach(shape => {
    //                 group.add(shape);
    //             });
    //             groupRef.current.current = group; // Use .current to mutate the ref's value
    //         } else {
    //             groupRef.current.current = null; // Use .current to mutate the ref's value
    //         }
    //     }
    // }, [selectedShapes]);  

    useEffect(() => {
        // Convert each ImageData object to its corresponding file string
        const filesToAdd = previewImages.map(imageData => imageData.file);
        dispatch(addFiles(filesToAdd));
    }, [dispatch, previewImages]);

    // const addToHistory = (newAttrs: any) => {
    //     dispatch(addedToHistory(newAttrs));
    // }


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
                onClick={handleClickOnStage}
                onMouseDown={(e: Konva.KonvaEventObject<MouseEvent>) => checkDeselect(e, setSelectedId)}
                onTouchStart={(e: Konva.KonvaEventObject<TouchEvent>) => checkDeselect(e, setSelectedId)}
            >
                <Layer>
                    {(StickerSelected.id === 2 || StickerSelected.id === 4) ? (
                        <>
                            <Rect
                                name='frame'
                                width={frameWidth}
                                height={frameHeight}
                                x={centerX - frameWidth / 2}
                                y={centerY - frameHeight / 2}
                                fill="white"
                                shadowEnabled
                                shadowBlur={15}
                                shadowColor='gray'
                                stroke={(isRectHovered && !isRectSelected) ? "black" : (!isRectHovered && !isRectSelected) ? "gray" : "magenta"}
                                strokeWidth={1}
                                cornerRadius={(StickerSelected.id === 4) ? 20 : 0}
                                ref={frameRef}
                                onMouseEnter={() => setIsRectHovered(true)}
                                onMouseLeave={() => setIsRectHovered(false)}
                                onClick={() => setIsRectSelected(!isRectSelected)}
                            />

                            <CustomTransformer
                                shapeRef={frameRef}
                                isSelected={isRectSelected}
                                rotateEnabled={false}
                                enabledAnchors={[
                                    'top-left',
                                    'top-right',
                                    'bottom-left',
                                    'bottom-right',
                                ]}
                            />
                        </>
                    ) : (
                        <Rect
                            name='frame-transparent'
                            width={frameWidth}
                            height={frameHeight}
                            x={centerX - frameWidth / 2}
                            y={centerY - frameHeight / 2}
                            fill="transparent"
                            ref={frameRef}
                        />
                    )}

                    {(StickerSelected.id === 3) && (
                        <>
                            <Circle
                                name='frame-circle'
                                x={centerX}
                                y={centerY}
                                radius={frameWidth / 2.5}
                                fill="white"
                                shadowEnabled
                                shadowBlur={15}
                                shadowColor='gray'
                                stroke={(isCircleHovered && !isCircleSelected) ? "black" : (!isCircleHovered && !isCircleSelected) ? "gray" : "magenta"}
                                strokeWidth={1}
                                ref={circleRef}
                                onMouseEnter={() => setIsCircleHovered(true)}
                                onMouseLeave={() => setIsCircleHovered(false)}
                                onClick={() => setIsCircleSelected(!isCircleSelected)}
                            />

                            <CustomTransformer
                                shapeRef={circleRef}
                                isSelected={isCircleSelected}
                                rotateEnabled={false}
                                enabledAnchors={[
                                    'top-left',
                                    'top-right',
                                    'bottom-left',
                                    'bottom-right',
                                ]}
                            />
                        </>
                    )}

                    {/* {(StickerSelected.id === 1) && (
                        imageAttrs && imageAttrs.imageUrl && (
                            <DieCutImage
                                {...imageAttrs}
                            />
                        )
                    )} */}

                    <CanvasElementsRenderer
                        rectangles={rectangles}
                        images={images}
                        motives={motives}
                        texts={selectedTexts}
                        selectedId={selectedId}
                        setSelectedId={setSelectedId} // Pass setSelectedId here
                        handleRectChange={(index: number, newAttrs: Partial<RectangleProps['shapeProps']>) => handleRectChange(index, newAttrs, rectangles, setRectangles)}
                        handleImageChange={(index: number, newAttrs: Partial<ImageProps['imageProps']>) => handleImageChange(index, newAttrs, images, setImages)}
                        handleDieCutImageChange={(index: number, newAttrs: Partial<ImageProps['imageProps']>) => handleDieCutImageChange(index, newAttrs, dieCutImages, setDieCutImages)}
                        handleMotiveChange={(index: number, newAttrs: Partial<ImageProps['imageProps']>) => handleMotiveChange(index, newAttrs, motives, setMotives)}
                        handleTextChange={(index: number, newAttrs: Partial<TextProps['textProps']>) => handleTextChange(index, newAttrs, selectedTexts, setSelectedTexts)}
                    />

                    {groupRef.current && (
                        <Group ref={groupRef} />
                    )}
                </Layer>
            </Stage>
        </>
    );
};

export default NewCanvas;
