import Konva from 'konva';
import { Image as KonvaImage, Transformer } from 'react-konva';
import React, { useEffect, useRef } from 'react';
import { drawImage, drawImageCircle, drawImageRectangle, drawImageRounded } from '@/components/Utils/functions';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export interface ImageProps {
    imageProps: {
        x: number;
        y: number;
        width: number;
        height: number;
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

                if (imageRef.current) {
                    const { centerX, centerY, frameWidth, frameHeight } = canvasProperties;
                    const scaleFactorX = frameWidth / img.width;
                    const scaleFactorY = frameHeight / img.height;
                    const scaleFactor = Math.min(scaleFactorX, scaleFactorY);

                    // const imageWithDieCutEffect = await drawImage(img, 70, 'white');
                    // const imageWithDieCutEffect = await drawImageRectangle(img, 70, 'white');
                    // const imageWithDieCutEffect = await drawImageRounded(img, 70, 'white');
                    const imageWithDieCutEffect = await drawImageCircle(img, 70, 'white');
                    const finaleImage = imageWithDieCutEffect && await drawImage(imageWithDieCutEffect, 3, 'magenta');

                    if (finaleImage) {
                        imageRef.current.image(finaleImage);
                        imageRef.current.width(img.width * scaleFactor);
                        imageRef.current.height(img.height * scaleFactor);
                        imageRef.current.x(centerX - (img.width * scaleFactor) / 2);
                        imageRef.current.y(centerY - (img.height * scaleFactor) / 2);
                        imageRef.current.getLayer()?.batchDraw();
                        // console.log(canvasProperties);
                    }
                }
            }
        };

        loadImage();
    }, [imageProps.src, canvasProperties]);


    return (
        <>
            <KonvaImage
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
                onClick={onSelect} // Ensure onSelect is called when the image is clicked
                onTap={onSelect} // Ensure onSelect is called when the image is tapped
                alt="" // Add alt prop with an empty string for decorative images
            />
            {isSelected && (
                <Transformer
                    ref={trRef}
                    rotateEnabled={true}
                    keepRatio={true} // Set keepRatio to false to always show the anchors
                    boundBoxFunc={(oldBox, newBox) => {
                        if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}
        </>
    );
};

export default ImageComponent;
