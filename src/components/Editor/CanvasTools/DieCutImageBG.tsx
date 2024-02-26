import React, { useEffect, useRef, useState } from 'react';
import { Image, Transformer } from 'react-konva';
import Konva from 'konva';
import { drawCustomImage, drawImage } from '@/components/Utils/functions';
import { useAppSelector } from '@/redux/store';
import RotationIcon from '/public/rotateIcon.svg';
import { useImageStorage } from '@/hooks/useImageStorage';

export interface DieCutImageProps {
    imagesId: string[];
    isSelected: boolean;
    onSelect: () => void;
    onChange: (newAttrs: Konva.ImageConfig) => void;
    onClick?: () => void; // Add onClick prop
}

const DieCutImage: React.FC<DieCutImageProps> = ({
    imagesId,
    isSelected,
    onSelect,
    onChange,
    onClick // Receive onClick prop
}) => {
    const canvasProperties = useAppSelector(state => state.canvas);

    const { data: previewImages } = useImageStorage('imageStore');

    const layerRef = useRef<Konva.Layer>(null);



    const { centerX, centerY, frameWidth, frameHeight } = canvasProperties;

    const [imageObj, setImageObj] = useState<HTMLImageElement | undefined>();
    const imageRef = useRef<Konva.Image>(null);
    const trRef = useRef<Konva.Transformer>(null);

    const handleTransform = () => {
        if (imageRef.current && trRef.current) {
            const imageNode = imageRef.current;
            const transformerNode = trRef.current;

            // Get the new position and size of the image after transformation
            const newAttrs = transformerNode.getClientRect();
            const { x, y, width, height } = newAttrs;

            // Update the position and size of the image
            imageNode.setAttrs({
                x: x + width / 2 - frameWidth / 2,
                y: y + height / 2 - frameHeight / 2,
                width: frameWidth,
                height: frameHeight,
            });

            // Update the transformer
            transformerNode.getLayer()?.batchDraw();
        }
    };

    const handleSelect = () => {
        onSelect();
    };

    useEffect(() => {
        const loadImage = async () => {
            const imagesInsideFrame = previewImages.filter(image => imagesId.includes(image.id));
            console.log('Filtered Images: ', imagesInsideFrame); // Check filtered images

            const loadedImages = await Promise.all(
                imagesInsideFrame.map(image =>
                    new Promise<HTMLImageElement>((resolve, reject) => {
                        const img = new window.Image();
                        img.crossOrigin = "anonymous"; // Handle CORS
                        img.src = image.file;
                        img.onload = () => resolve(img);
                        img.onerror = reject; // Handle loading errors
                    })
                )
            );

            const offscreenCanvas = document.createElement('canvas');
            offscreenCanvas.width = frameWidth;
            offscreenCanvas.height = frameHeight;
            const ctx = offscreenCanvas.getContext('2d');

            loadedImages.forEach((img, index) => {
                console.log('Drawing Image: ', img.src); // Verify image is ready to draw
                ctx?.drawImage(img, 0, 0); // Simplified for demonstration
            });

            const dataURL = offscreenCanvas.toDataURL();
            console.log('Data URL: ', dataURL); // Check the data URL

            const imageObj = new window.Image();
            imageObj.src = dataURL;
            imageObj.onload = () => {
                console.log('Image Object Loaded'); // Verify image object is loaded
                setImageObj(imageObj);
            };
        };

        loadImage();
    }, [imagesId, centerX, centerY, frameWidth, frameHeight, previewImages]);




    console.log(imageObj);

    // useEffect(() => {
    //     const loadImage = async () => {
    //         const imagesInsideFrame = previewImages.filter(image => imagesId.includes(image.id))
    //         // const svgImageData = await imageUrl;

    //         // if (svgImageData) {
    //         //     const img = new window.Image();
    //         //     img.src = svgImageData;


    //         //     await new Promise((resolve) => {
    //         //         img.onload = () => resolve(img);
    //         //     });

    //         //     const newImg = await drawCustomImage(img, 20, 'white');

    //         //     let finaleImage = await drawImage(newImg, 3, isSelected ? 'magenta' : 'gray');

    //         //     finaleImage && setImageObj(finaleImage);
    //         // }


    //     };

    //     loadImage();

    // }, [centerX, centerY, frameWidth, frameHeight, isSelected, imagesId, previewImages]);

    useEffect(() => {
        if (isSelected && trRef.current && imageRef.current && imageObj) {
            trRef.current.nodes([imageRef.current]);
            trRef.current.getLayer()?.batchDraw();
        }
    }, [isSelected, imageObj]);

    return (
        <>
            {imageObj && (
                <Image
                    width={frameWidth}
                    height={frameHeight}
                    x={centerX - frameWidth / 2}
                    y={centerY - frameHeight / 2}
                    image={imageObj && imageObj}
                    draggable={false}
                    ref={imageRef}
                    onClick={handleSelect} // Pass onClick prop here
                    onTap={handleSelect}
                    onTransform={handleTransform}
                    onDragEnd={(e) => {
                        const newAttrs = {
                            ...e.target.attrs,
                            x: e.target.x(),
                            y: e.target.y(),
                        };
                        onChange(newAttrs);
                    }}
                    alt="die-cut"
                    aspectRatio={true}
                />
            )}

            {isSelected && (
                <Transformer
                    ref={trRef}
                    rotateEnabled={true}
                    keepRatio={true}
                    anchorFill={'white'}
                    anchorStrokeWidth={1}
                    anchorCornerRadius={100}
                    anchorStroke={'black'}
                    anchorSize={15}
                    // rotateAnchorCursor={''}                    
                    borderDash={[2, 2]}
                    borderStroke={'gray'}
                    boundBoxFunc={(oldBox, newBox) => {
                        // Restrict transformer to the frame
                        newBox.width = Math.max(10, newBox.width);
                        newBox.height = Math.max(10, newBox.height);
                        newBox.x = Math.max(0, Math.min(frameWidth - newBox.width, newBox.x));
                        newBox.y = Math.max(0, Math.min(frameHeight - newBox.height, newBox.y));
                        return newBox;
                    }}
                />
            )}
        </>
    );
};

export default DieCutImage;
