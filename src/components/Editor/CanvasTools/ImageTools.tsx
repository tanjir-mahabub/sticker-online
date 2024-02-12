import { useLocalStorage } from '@/hooks/useLocalStorage';
import Konva from 'konva';
import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva';

const ImageTools = () => {
    const { data: previewImages } = useLocalStorage('imageStore');
    const [images, setImages] = useState<Konva.Image[]>([]);
    const [selectedImage, setSelectedImage] = useState<number | null>(null);
    const transformerRef = useRef<Konva.Transformer | null>(null);

    const drawImage = (test: string) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d'),
            img = new Image;
        var dArr = [-1, -1, 0, -1, 1, -1, -1, 0, 1, 0, -1, 1, 0, 1, 1, 1], // offset array
            s = 5,  // thickness scale
            i = 0,  // iterator
            x = 5,  // final position
            y = 5;

        // draw images at offsets from the array scaled by s
        if (ctx) {
            for (; i < dArr.length; i += 2)
                ctx.drawImage(img, x + dArr[i] * s, y + dArr[i + 1] * s);

            // fill with color
            ctx.globalCompositeOperation = "source-in";
            ctx.fillStyle = "red";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // draw original image in normal mode
            ctx.globalCompositeOperation = "source-over";
            ctx.drawImage(img, x, y);
        }

        return canvas.toDataURL();

    }

    useEffect(() => {
        // Load images from previewImages
        const loadImages = () => {
            const loadedImages = previewImages.map((imageDataString, index) => {
                const konvaImage = new window.Image();
                let image = drawImage(imageDataString)
                console.log(image);
                konvaImage.src = imageDataString;

                const konvaImageObj = new Konva.Image({
                    image: konvaImage,
                    x: index * 100, // Set the x-coordinate based on the index
                    y: 0,
                    width: 100,
                    height: 100,
                    draggable: true,
                });

                return konvaImageObj;
            });

            // Update state with the loaded images
            setImages(loadedImages);
        };

        loadImages();

    }, [previewImages]); // Only run this effect once on mount

    const handleSelectImage = (index: number) => {
        setSelectedImage(index);
    };

    const handleDeselectImage = () => {
        setSelectedImage(null);
    };


    return (
        <>

            {images.map((image, index) => (
                <React.Fragment key={index}>
                    {/* Wrap the KonvaImage with Transformer */}
                    <Transformer
                        ref={transformerRef}
                        boundBoxFunc={(oldBox, newBox) => {
                            // Keep the aspect ratio of the image while transforming
                            newBox.width = Math.max(30, newBox.width);
                            newBox.height = Math.max(30, newBox.height);
                            return newBox;
                        }}
                        enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                    />
                    <KonvaImage
                        image={image.image()}
                        x={image.x()}
                        y={image.y()}
                        width={image.width()}
                        height={image.height()}
                        draggable
                        onClick={() => handleSelectImage(index)}
                    />
                </React.Fragment>
            ))}
        </>
    );
};

export default ImageTools;
