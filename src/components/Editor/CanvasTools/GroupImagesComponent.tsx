import CustomTransformer from '@/components/Utils/CustomTransformer';
import { drawCustomImage } from '@/components/Utils/functions';
import { setCanvasProperties } from '@/redux/features/canvasSlice';
import { useAppSelector } from '@/redux/store';
import { ImageInfo } from '@/types/types';
import Konva from 'konva';
import React, { useEffect, useRef, useState } from 'react';
import { Image as KonvaImage } from 'react-konva';
import { useDispatch } from 'react-redux';

export interface GroupImagesComponentProps {
    imagesInsideFrame?: ImageInfo[];
    width: number;
    height: number;
    isSelected: boolean;
    onSelect: () => void;
    onChange: (newAttrs: Konva.ImageConfig) => void;
    onClick?: () => void;
}

const GroupImagesComponent: React.FC<GroupImagesComponentProps> = ({ imagesInsideFrame, width, height, isSelected, onSelect, onChange, onClick }) => {
    // Initialize with undefined to match the expected type
    const dieCutImgRef = useRef<Konva.Image>(null);
    const trRef = useRef<Konva.Transformer>(null);

    const [konvaImageObj, setKonvaImageObj] = useState<HTMLImageElement | undefined>(undefined);

    const canvasProperties = useAppSelector(state => state.canvas);

    const { centerX, centerY, frameWidth, frameHeight, grow } = canvasProperties;

    const insideFrameCheck = useAppSelector(state => state.insideFrame)

    const [imgProperties, setImgProperties] = useState({});

    const dispatch = useDispatch();

    useEffect(() => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        if (!context) {
            console.error("Failed to get canvas context");
            return;
        }

        const loadImage = (src: string): Promise<HTMLImageElement> =>
            new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = 'Anonymous'; // Handle potential CORS issues
                img.onload = () => resolve(img);
                img.onerror = (error) => reject(new Error(`Failed to load image ${src}: ${error}`));
                img.src = src;
            });

        const drawImages = async () => {
            if (!imagesInsideFrame) return;
            for (const imageInfo of imagesInsideFrame) {
                try {
                    const img = await loadImage(imageInfo.src);
                    const image = await drawCustomImage(img, grow, 'white')

                    const info = insideFrameCheck.images.filter(item => item.id === imageInfo.id)

                    info.map((item, i) => {
                        context.drawImage(image, item.x, item.y, item.width, item.height);
                    });

                } catch (error) {
                    console.error("Error loading image", error);
                }
            }

            const konvaImage = new window.Image();
            konvaImage.src = canvas.toDataURL();

            konvaImage.onload = () => setKonvaImageObj(konvaImage);
        };

        drawImages();
    }, [imagesInsideFrame, width, height, centerX, centerY, frameWidth, frameHeight, grow, insideFrameCheck]);

    useEffect(() => {
        if (isSelected && trRef.current && dieCutImgRef.current && konvaImageObj) {
            trRef.current.nodes([dieCutImgRef.current]);
            trRef.current.getLayer()?.batchDraw();
        }
    }, [isSelected, konvaImageObj]);

    // useEffect(() => {
    //     if (insideFrameCheck.totalWidth || insideFrameCheck.totalHeight) {
    //         dispatch(setCanvasProperties({ frameWidth: insideFrameCheck.totalWidth, frameHeight: insideFrameCheck.totalHeight }))
    //     }
    // })

    const handleTransform = () => {
        if (dieCutImgRef.current && trRef.current) {
            const imageNode = dieCutImgRef.current;
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

    const handleSelect = (e: Konva.KonvaEventObject<MouseEvent> | Konva.KonvaEventObject<TouchEvent>) => {
        onSelect();

        dispatch(setCanvasProperties({ selectionCancel: true }))
    };

    const imagePreviews = useAppSelector(state => state.imagePreview)
    const matchingImage = imagesInsideFrame?.find(frameImage =>
        imagePreviews?.images.some(previewImage => previewImage.id === frameImage.id)
    );


    return (
        <>
            <KonvaImage
                name="die-cut-image"
                image={konvaImageObj} // This is now always either an HTMLImageElement or undefined
                ref={dieCutImgRef}
                // width={frameWidth}
                // height={frameHeight}
                // x={centerX - frameWidth / 2}
                // y={centerY - frameHeight / 2}    
                // x={matchingImage?.x || 0}
                // y={matchingImage?.y || 0}
                // width={matchingImage?.width}
                // height={matchingImage?.height}
                // scaleX={matchingImage?.scaleX}
                // scaleY={matchingImage?.scaleY}
                // rotation={matchingImage?.rotation}
                shadowEnabled
                shadowBlur={15}
                shadowColor='gray'
                draggable={false}
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

            {/* {isSelected && (
                <CustomTransformer
                    shapeRef={dieCutImgRef}
                    isSelected={isSelected}
                    rotateEnabled={false}
                    enabledAnchors={[
                        'top-left',
                        'top-right',
                        'bottom-left',
                        'bottom-right',
                    ]}
                />
            )} */}
        </>
    );
};

export default GroupImagesComponent;
