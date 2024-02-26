import Konva from 'konva';
import { Image as KonvaImage, Transformer } from 'react-konva';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { calculateFrameEdges, drawImage, isObjectInsideFrame } from '@/components/Utils/functions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, useAppSelector } from '@/redux/store';
import CustomTransformer from '@/components/Utils/CustomTransformer';
import { useImageStorage } from '@/hooks/useImageStorage';
import { addedToHistory } from '@/redux/features/historySlice';
import { Frame } from '@/types/types';
import { addOrUpdateImage, removeImage, calculateTotalDimensions } from '@/redux/features/insideFrameSlice';

export interface ImageProps {
    imageProps: {
        x: number;
        y: number;
        width?: number;
        height?: number;
        src: string;
        id: string;
    };
    isSelected: boolean;
    onSelect: () => void;
    onChange: (newAttrs: Partial<ImageProps['imageProps']>) => void;
}

const ImageComponent: React.FC<ImageProps> = ({ imageProps, isSelected, onSelect, onChange }) => {
    const imageRef = useRef<Konva.Image>(null);
    const trRef = useRef<Konva.Transformer>(null);

    const [isInside, setIsInside] = useState(false);

    const dispatch = useDispatch();

    const canvasProperties = useAppSelector(state => state.canvas);


    const { centerX, centerY, frameWidth, frameHeight, grow } = canvasProperties;

    const StickerSelected = useAppSelector(state => state.sticker);



    const checkInsideAndUpdate = useCallback((node: Konva.Node) => {
        const frame: Frame = { centerX, centerY, frameWidth, frameHeight };
        const frameEdges = calculateFrameEdges(frame);
        const imagePosition = node?.getClientRect();
        const inside = isObjectInsideFrame(imagePosition, frameEdges);
        if (inside) {
            dispatch(addOrUpdateImage({
                id: imageProps.id,
                x: imagePosition.x,
                y: imagePosition.y,
                width: imagePosition.width,
                height: imagePosition.height,
                insideFrame: inside,
            }));
            setIsInside(true);
            console.log('inside');
        } else {
            dispatch(removeImage(imageProps.id));
            setIsInside(false);
            console.log('outside');
        }
    }, [centerX, centerY, frameWidth, frameHeight, dispatch, imageProps.id]);

    useEffect(() => {
        dispatch(calculateTotalDimensions());
    }, [dispatch]);

    useEffect(() => {
        if (isSelected && imageRef.current && trRef.current) {
            trRef.current.nodes([imageRef.current]);
            trRef.current.getLayer()?.batchDraw();
        }
    }, [isSelected]);

    useEffect(() => {
        const loadImage = async () => {
            const svgImageData = await imageProps.src;
            if (svgImageData) {
                const img = new window.Image();
                img.src = svgImageData;
                await new Promise(resolve => {
                    img.onload = resolve;
                });

                if (imageRef.current && StickerSelected) {

                    // Calculate the new width and height
                    const scaleFactor = 1; // 20% smaller
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

                    if (StickerSelected.id === 1) {

                        const imageWithDieCutEffect = await drawImage(img, grow * 2, '');

                        // const finaleImage = imageWithDieCutEffect && await drawImage(imageWithDieCutEffect, 1.3, 'magenta');

                        imageRef.current.image(imageWithDieCutEffect);
                        // imageRef.current.width(img.width * scaleFactor);
                        // imageRef.current.height(img.height * scaleFactor);
                        // imageRef.current.x(centerX - (img.width * scaleFactor) / 2);
                        // imageRef.current.y(centerY - (img.height * scaleFactor) / 2);

                        const updatePosition = {
                            x: imageRef.current.x(),
                            y: imageRef.current.y(),
                            width: imageRef.current.width(),
                            height: imageRef.current.height(),
                            scaleX: 1,
                            scaleY: 1
                        }

                        dispatch(addedToHistory({ objectId: imageProps.id, position: updatePosition }))
                        imageRef.current.getLayer()?.batchDraw();
                    }

                    if (StickerSelected.id !== 1) {
                        imageRef.current.image(img);
                        // imageRef.current.width(newWidth);
                        // imageRef.current.height(newHeight);
                        // imageRef.current.x(xPosition);
                        // imageRef.current.y(yPosition);
                        imageRef.current.getLayer()?.batchDraw();
                    }

                    checkInsideAndUpdate(imageRef.current)
                    // imageRef.current.image(img);
                    // imageRef.current.width(newWidth);
                    // imageRef.current.height(newHeight);
                    // imageRef.current.x(xPosition);
                    // imageRef.current.y(yPosition);
                    // imageRef.current.getLayer()?.batchDraw();
                }
            }
        };

        loadImage();

    }, [imageProps, centerX, centerY, frameWidth, frameHeight, grow, StickerSelected, dispatch, checkInsideAndUpdate]);




    const handleDragEnd = (e: Konva.KonvaEventObject<Event>) => {
        const node = e.currentTarget;

        checkInsideAndUpdate(node);

        const updatePosition = {
            x: node.attrs.x,
            y: node.attrs.y,
            width: node.attrs.width,
            height: node.attrs.height,
            scaleX: node.attrs.scaleX,
            scaleY: node.attrs.scaleY
        }
        // console.log('update posititon', updatePosition);

        dispatch(addedToHistory({ objectId: node.id(), position: updatePosition }))
        dispatch(calculateTotalDimensions());
    }

    const objectHistories = useAppSelector((state: RootState) => state.history.objectHistories);
    const objectId = imageProps.id;
    const objectHistory = objectHistories.find(history => history.objectId === objectId);
    const historyStep = objectHistory ? objectHistory.historyStep : 0;

    return (
        <>
            <KonvaImage
                id={imageProps.id}
                key={imageProps.id}
                ref={imageRef}
                name="image"
                image={undefined}
                draggable
                opacity={isInside ? 1 : 0.5}
                x={objectHistories.find(history => history.objectId === imageProps.id)?.history[historyStep]?.x}
                y={objectHistories.find(history => history.objectId === imageProps.id)?.history[historyStep]?.y}
                width={objectHistories.find(history => history.objectId === imageProps.id)?.history[historyStep]?.width}
                height={objectHistories.find(history => history.objectId === imageProps.id)?.history[historyStep]?.height}
                scaleX={objectHistories.find(history => history.objectId === imageProps.id)?.history[historyStep]?.scaleX || 1}
                scaleY={objectHistories.find(history => history.objectId === imageProps.id)?.history[historyStep]?.scaleY || 1}
                onTransformEnd={(e) => {
                    const node = imageRef.current;
                    if (node) {
                        const updatePosition = {
                            x: node.attrs.x,
                            y: node.attrs.y,
                            width: node.attrs.width,
                            height: node.attrs.height,
                            scaleX: node.attrs.scaleX,
                            scaleY: node.attrs.scaleY
                        }

                        dispatch(
                            addedToHistory({ objectId: node.id(), position: updatePosition })
                        )

                        dispatch(calculateTotalDimensions());
                    }
                }}
                onDragEnd={handleDragEnd}
                onClick={onSelect}
                onTap={onSelect}
                aspectRatio={true}
            />
            {isSelected && (
                <CustomTransformer shapeRef={imageRef} isSelected={isSelected} />
            )}
        </>
    );
};

export default ImageComponent;
