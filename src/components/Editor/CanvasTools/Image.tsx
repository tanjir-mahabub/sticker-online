import Konva from 'konva';
import { Image as KonvaImage, Transformer } from 'react-konva';
import React, { useEffect, useRef } from 'react';
import { drawImage } from '@/components/Utils/functions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, useAppSelector } from '@/redux/store';
import CustomTransformer from '@/components/Utils/CustomTransformer';
import { useImageStorage } from '@/hooks/useImageStorage';
import { addedToHistory } from '@/redux/features/historySlice';

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

    const dispatch = useDispatch();

    const canvasProperties = useSelector((state: RootState) => state.canvas);

    const { centerX, centerY, frameWidth, frameHeight } = canvasProperties;

    const imagePosition = imageRef.current?.getClientRect();

    const StickerSelected = useAppSelector(state => state.sticker);

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
                    const scaleFactor = 0.9; // 20% smaller
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

                    // console.log('from image', StickerSelected);
                    // Set the image dimensions and position
                    if (StickerSelected.id === 1) {

                        const imageWithDieCutEffect = await drawImage(img, 50, 'white');

                        const finaleImage = imageWithDieCutEffect && await drawImage(imageWithDieCutEffect, 1.3, 'magenta');

                        imageRef.current.image(finaleImage);
                        imageRef.current.width(img.width * scaleFactor);
                        imageRef.current.height(img.height * scaleFactor);
                        imageRef.current.x(centerX - (img.width * scaleFactor) / 2);
                        imageRef.current.y(centerY - (img.height * scaleFactor) / 2);

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
                        // console.log(canvasProperties);
                    }

                    if (StickerSelected.id !== 1) {
                        imageRef.current.image(img);
                        imageRef.current.width(newWidth);
                        imageRef.current.height(newHeight);
                        imageRef.current.x(xPosition);
                        imageRef.current.y(yPosition);
                        imageRef.current.getLayer()?.batchDraw();
                    }

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

    }, [imageProps, centerX, centerY, frameWidth, frameHeight, StickerSelected, dispatch]);

    const isOutsideFrame = (node: Konva.Node, frameWidth: number, frameHeight: number) => {
        const x = node.x();
        const y = node.y();
        const width = node.width();
        const height = node.height();

        return x < 0 || y < 0 || x + width > frameWidth || y + height > frameHeight;
    };

    // useEffect(() => {
    //     if (imagePosition) {
    //         const { x, y, width, height } = imagePosition;
    //         const imageStartX = x - width / 2;
    //         const imageStartY = y - width / 2;
    //         const imageEndX = x + width / 2;
    //         const imageEndY = y + height / 2;
    //         const frameStartX = centerX - frameWidth / 2;
    //         const frameStartY = centerY - frameHeight / 2;
    //         const frameEndX = centerX + frameWidth / 2;
    //         const frameEndY = centerY + frameHeight / 2;
    //         console.log('Image xPosition', imageStartX, imageEndX, width, 'imgX', x);
    //         console.log('Image yPosition', imageStartY, imageEndY, height, 'imgY', y);
    //         console.log('xPosition', frameStartX, frameEndX, frameWidth, 'imgX', x);
    //         console.log('yPosition', frameStartY, frameEndY, frameHeight, 'imgY', y);

    //         if (imageStartX >= frameStartX && imageEndX <= frameEndX) {
    //             console.log('inside');
    //         } else {
    //             console.log('outside');
    //         }
    //     }

    // }, [centerX, centerY, frameWidth, frameHeight, imagePosition])  


    // const { history, historyStep } = useAppSelector((state: RootState) => state.history);
    // const position = history[historyStep];

    const handleDragEnd = (e: Konva.KonvaEventObject<Event>) => {
        const node = e.currentTarget;
        const updatePosition = {
            x: node.attrs.x,
            y: node.attrs.y,
            width: node.attrs.width,
            height: node.attrs.height,
            scaleX: node.attrs.scaleX,
            scaleY: node.attrs.scaleY
        }
        console.log('update posititon', updatePosition);

        dispatch(addedToHistory({ objectId: node.id(), position: updatePosition }))
    }

    // console.log(position);

    const objectHistories = useAppSelector((state: RootState) => state.history.objectHistories);
    const objectId = imageProps.id; // The objectId you want to find the historyStep for
    const objectHistory = objectHistories.find(history => history.objectId === objectId);

    // Check if the objectHistory is found and if so, get its historyStep
    const historyStep = objectHistory ? objectHistory.historyStep : 0;


    console.log('XXXX', objectHistories.find(history => history.objectId === imageProps.id)?.history[historyStep]?.x);
    console.log('Width', objectHistories.find(history => history.objectId === imageProps.id)?.history[historyStep]?.width);
    console.log('ScaleX', objectHistories.find(history => history.objectId === imageProps.id)?.history[historyStep]?.scaleX);
    return (
        <>
            <KonvaImage
                name="image"
                image={undefined}
                draggable
                shadowEnabled={(StickerSelected.id === 1) && true}
                shadowBlur={15}
                shadowColor='gray'
                // {...imageProps}
                // x={position?.x}
                // y={position?.y}
                // width={position?.width}
                // height={position?.height}           
                id={imageProps.id}
                x={objectHistories.find(history => history.objectId === imageProps.id)?.history[historyStep]?.x}
                y={objectHistories.find(history => history.objectId === imageProps.id)?.history[historyStep]?.y}
                width={objectHistories.find(history => history.objectId === imageProps.id)?.history[historyStep]?.width}
                height={objectHistories.find(history => history.objectId === imageProps.id)?.history[historyStep]?.height}
                scaleX={objectHistories.find(history => history.objectId === imageProps.id)?.history[historyStep]?.scaleX || 1}
                scaleY={objectHistories.find(history => history.objectId === imageProps.id)?.history[historyStep]?.scaleY || 1}
                ref={imageRef}

                key={imageProps.id}
                // onDragEnd={(e) => {
                //     onChange({
                //         ...imageProps,
                //         x: e.target.x(),
                //         y: e.target.y(),
                //     });
                // }}
                onTransformEnd={(e) => {
                    const node = imageRef.current;
                    if (node) {
                        console.log('node from transform', node);

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
                    }
                }}
                onDragEnd={handleDragEnd}
                // onTransformEnd={handleObject}
                onClick={onSelect}
                onTap={onSelect}
                alt=""
                aspectRatio={true}
            />
            {isSelected && (
                <CustomTransformer shapeRef={imageRef} isSelected={isSelected} />
            )}
        </>
    );
};

export default ImageComponent;
