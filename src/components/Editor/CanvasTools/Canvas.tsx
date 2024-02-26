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
import GroupImagesComponent, { GroupImagesComponentProps } from './GroupImagesComponent';


interface CanvasProps {
    width?: number;
    height?: number;
    frameWidth?: number;
    frameHeight?: number;
    centerX?: number,
    centerY?: number,
    scale?: number
}

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
    const { rectangles, setRectangles, images, setImages, dieCutImages, setDieCutImages, motives, setMotives, selectedTexts, setSelectedTexts, selectedId, setSelectedId } = useCanvasState();

    const stageRef = useRef<Konva.Stage>(null);
    const frameRef = useRef<Konva.Rect>(null);
    const circleRef = useRef<Konva.Circle>(null);
    const groupRef = useRef<Konva.Group>(null);

    const [isRectHovered, setIsRectHovered] = useState(false);
    const [isCircleHovered, setIsCircleHovered] = useState(false);


    useEffect(() => {
        if (stageRef.current) {
            setReadyState(true);
        }

    }, [stageRef, dispatch])


    const { data: previewImages } = useImageStorage('imageStore');
    const FileState = useAppSelector(state => state.file)
    const insideFrameCheck = useAppSelector(state => state.insideFrame)

    const [selectedShapes, setSelectedShapes] = useState<Konva.Shape[]>([]);

    const [selected, setSelected] = useState<boolean>(false);
    const [isRectSelected, setIsRectSelected] = useState(false);
    const [isCircleSelected, setIsCircleSelected] = useState(false);
    const [imageAttrs, setImageAttrs] = useState<GroupImagesComponentProps>();
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

    useEffect(() => {
        // Convert each ImageData object to its corresponding file string
        const filesToAdd = previewImages.map(imageData => imageData.file);
        dispatch(addFiles(filesToAdd));
    }, [dispatch, previewImages]);



    // console.log('inside image check canvas', insideFrameCheck);
    interface ImageInfo {
        id: string;
        file: string;
    }
    const [imagesInsideFrame, setImagesInsideFrame] = useState<ImageInfo[]>()

    useEffect(() => {
        if (insideFrameCheck.images) {

            const filteredStates = FileState.filter((fileState) =>
                insideFrameCheck.images.some((image) => image.id === fileState.id)
            );
            setImagesInsideFrame(filteredStates);
        }
    }, [insideFrameCheck.images, previewImages, FileState]);

    useEffect(() => {
        setImageAttrs({
            width: width,
            height: height,
            isSelected: selected,
            onSelect: () => setSelected(true),
            onChange: (newAttrs) => console.log('Image attributes changed:', newAttrs),
        })
    }, [previewImages, selected, insideFrameCheck, imagesInsideFrame, width, height]);


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
                        imageAttrs && insideFrameCheck && (
                            <DieCutImage
                                {...imageAttrs}
                            />
                        )
                    )} */}

                    {imagesInsideFrame && insideFrameCheck && (StickerSelected.id === 1) && imageAttrs && <GroupImagesComponent imagesInsideFrame={imagesInsideFrame} {...imageAttrs} />}

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
