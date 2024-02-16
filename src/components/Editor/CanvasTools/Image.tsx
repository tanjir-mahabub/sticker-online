import Konva from 'konva';
import { Image as KonvaImage, Transformer } from 'react-konva';
import React, { useEffect, useRef } from 'react';
import { drawImage } from '@/components/Utils/functions';
import { useSelector } from 'react-redux';
import { RootState, useAppSelector } from '@/redux/store';
import CustomTransformer from '@/components/Utils/CustomTransformer';
import { useImageStorage } from '@/hooks/useImageStorage';

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

    const canvasProperties = useSelector((state: RootState) => state.canvas);

    const { centerX, centerY, frameWidth, frameHeight } = canvasProperties;

    const imagePosition = imageRef.current?.getClientRect();

    const StickerSelected = useAppSelector(state => state.sticker);

    const { data: previewImages } = useImageStorage('imageStore');

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

                    // console.log('from image', StickerSelected);
                    // Set the image dimensions and position
                    if (StickerSelected.id === 1) {

                        const imageWithDieCutEffect = await drawImage(img, 100, 'white');

                        const finaleImage = imageWithDieCutEffect && await drawImage(imageWithDieCutEffect, 5, 'magenta');

                        imageRef.current.image(finaleImage);
                        imageRef.current.width(img.width * scaleFactor);
                        imageRef.current.height(img.height * scaleFactor);
                        imageRef.current.x(centerX - (img.width * scaleFactor) / 2);
                        imageRef.current.y(centerY - (img.height * scaleFactor) / 2);
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

    }, [imageProps.src, centerX, centerY, frameWidth, frameHeight, StickerSelected]);

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

    return (
        <>
            <KonvaImage
                name="image"
                image={undefined}
                draggable
                {...imageProps}
                ref={imageRef}
                onDragEnd={(e) => {
                    onChange({
                        ...imageProps,
                        x: e.target.x(),
                        y: e.target.y(),
                    });
                }}
                onTransformEnd={(e) => {
                    const node = imageRef.current;
                    if (node) {
                        const scaleX = node.scaleX();
                        const scaleY = node.scaleY();
                        node.scaleX(1);
                        node.scaleY(1);
                        onChange({
                            ...imageProps,
                            x: node.x(),
                            y: node.y(),
                            width: Math.max(5, node.width() * scaleX),
                            height: Math.max(5, node.height() * scaleY),
                        });
                    }
                }}
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
