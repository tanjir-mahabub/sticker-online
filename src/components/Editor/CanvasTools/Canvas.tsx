import React, { useEffect, useRef, useState } from 'react';
import Konva from 'konva';
import { Stage, Layer, Rect, Circle, Group } from 'react-konva';
import { RectangleProps } from './Rectangle';
import { ImageProps } from './Image';
import CanvasElementsRenderer from './CanvasELementRenderer';
import { checkDeselect, handleRectChange, handleImageChange, handleTextChange, handleMotiveChange } from '@/components/Utils/canvasOperation';
import CanvasFrame from './CanvasFrame';
import { useDispatch } from 'react-redux';
import { useCanvasState } from '@/hooks/useCanvasState';
import { useAppSelector } from '@/redux/store';
import { useImageStorage } from '@/hooks/useImageStorage';
import CustomTransformer from '@/components/Utils/CustomTransformer';
import { addFiles } from '@/redux/features/fileUploadSlice';
import GroupImagesComponent, { GroupImagesComponentProps } from './GroupImagesComponent';
import { CanvasProps, ImageInfo } from '@/types/types';
import { setCanvasProperties } from '@/redux/features/canvasSlice';
import { TextProps } from './TextComponent';


const NewCanvas: React.FC<CanvasProps> = ({
    width = 0,
    height = 0,
    frameWidth = 0,
    frameHeight = 0,
    centerX = 0,
    centerY = 0,
    scale = 0
}) => {

    const StickerSelected = useAppSelector(state => state.sticker);

    const dispatch = useDispatch();
    const [readyState, setReadyState] = useState(false);
    const { rectangles, setRectangles, images, setImages, motives, setMotives, selectedTexts, setSelectedTexts, selectedId, setSelectedId } = useCanvasState();

    const stageRef = useRef<Konva.Stage>(null);
    const layerRef = useRef<Konva.Layer>(null);
    const frameRef = useRef<Konva.Rect>(null);
    const rectFrameRef = useRef<Konva.Rect>(null);
    const circleRef = useRef<Konva.Circle>(null);
    const groupRef = useRef<Konva.Group>(null);

    useEffect(() => {
        if (stageRef.current) {
            setReadyState(true);
        }

    }, [stageRef, dispatch])


    const { data: previewImages } = useImageStorage('imageStore');
    const { data: previewTexts } = useImageStorage('textStore');

    const [imagesInsideFrame, setImagesInsideFrame] = useState<ImageInfo[]>()

    const insideFrameCheck = useAppSelector(state => state.insideFrame)

    const imageState = useAppSelector(state => state.imagePreview)

    const textState = useAppSelector(state => state.text)

    const [selectedShapes, setSelectedShapes] = useState<Konva.Shape[]>([]);

    const [selected, setSelected] = useState<boolean>(false);
    const [isRectSelected, setIsRectSelected] = useState(false);
    const [isCircleSelected, setIsCircleSelected] = useState(false);
    const [imageAttrs, setImageAttrs] = useState<GroupImagesComponentProps>();

    const handleClickOnStage = () => {
        if (selectedShapes.length > 0) {
            // Deselect all shapes
            setSelectedShapes([]);
        }

        selected && setSelected(false);
        isRectSelected && setIsRectSelected(false)
        isCircleSelected && setIsCircleSelected(false)
    }

    useEffect(() => {
        if (insideFrameCheck.images) {

            const filteredStates = imageState.images.filter((prevImage) =>
                insideFrameCheck.images.some((image) => image.id === prevImage.id)
            );
            setImagesInsideFrame(filteredStates);
        }
    }, [insideFrameCheck.images, imageState.images]);

    useEffect(() => {
        setImageAttrs({
            width: width,
            height: height,
            isSelected: selected,
            onSelect: () => setSelected(true),
            onChange: (newAttrs) => console.log('Image attributes changed:', newAttrs),
        })
    }, [previewImages, selected, insideFrameCheck, imagesInsideFrame, width, height]);

    useEffect(() => {

        (rectFrameRef.current) && (StickerSelected.id === 4) ? rectFrameRef.current?.cornerRadius(20) : rectFrameRef.current?.cornerRadius(0)

    }, [StickerSelected.id]);

    useEffect(() => {
        const group = new Konva.Group();
        const layer = layerRef.current;
        const dieCutImgs = layer?.find('.image');

        if (dieCutImgs) {
            dieCutImgs.map((img: any) => {
                group.add(img);
            });
        }

        // Assuming you want to add the group to the layer
        layer?.add(group);
        layer?.batchDraw();

        // console.log('group width', group.children.map(child => child.attrs));
    })

    // console.log(frameWidth, frameHeight);    
    console.log('canvas', previewTexts);

    return (
        <>

            {readyState && (
                <CanvasFrame stage={stageRef.current} />
            )}


            <Stage
                width={width} height={height} ref={stageRef}
                onClick={handleClickOnStage}
                onMouseDown={(e: Konva.KonvaEventObject<MouseEvent>) => checkDeselect(e, setSelectedId)}
                onTouchStart={(e: Konva.KonvaEventObject<TouchEvent>) => checkDeselect(e, setSelectedId)}
            >
                <Layer ref={layerRef}>
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
                                strokeWidth={1}
                                ref={rectFrameRef}
                                // onMouseEnter={() => setIsRectHovered(true)}
                                // onMouseLeave={() => setIsRectHovered(false)}
                                onClick={() => setIsRectSelected(!isRectSelected)}
                            />

                            <CustomTransformer
                                shapeRef={rectFrameRef}
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
                                strokeWidth={1}
                                ref={circleRef}
                                // onMouseEnter={() => setIsCircleHovered(true)}
                                // onMouseLeave={() => setIsCircleHovered(false)}
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

                    {imagesInsideFrame && insideFrameCheck && (StickerSelected.id === 1) && imageAttrs && <GroupImagesComponent imagesInsideFrame={imagesInsideFrame} {...imageAttrs} />}

                    <CanvasElementsRenderer
                        rectangles={rectangles}
                        images={imageState.images}
                        motives={motives}
                        texts={textState.selectedTexts}
                        selectedId={selectedId}
                        setSelectedId={setSelectedId} // Pass setSelectedId here
                        handleRectChange={(index: number, newAttrs: Partial<RectangleProps['shapeProps']>) => handleRectChange(index, newAttrs, rectangles, setRectangles)}
                        handleImageChange={(index: number, newAttrs: Partial<ImageProps['imageProps']>) => handleImageChange(index, newAttrs, images, setImages)}
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
