import CustomTransformer from '@/components/Utils/CustomTransformer';
import { generateUniqueId } from '@/components/Utils/functions';
import { useTextStorage } from '@/hooks/useTextStorage';
import { setCanvasProperties } from '@/redux/features/canvasSlice';
import { addImage } from '@/redux/features/imagePreviewSlice';
import { RootState, useAppSelector } from '@/redux/store';
import { customizeFonts } from '@/store/customizeFontStore';
import Konva from 'konva';
import React, { useEffect, useRef, useState } from 'react';
import { Transformer, Rect, Text as KonvaText } from 'react-konva';
import { useDispatch } from 'react-redux';
import WebFont from 'webfontloader';

export interface TextProps {
    textProps: {
        x: number;
        y: number;
        text: string;
        fontSize: number;
        fontFamily?: string;
        width?: number;
        height?: number;
        padding: number;
        fill: string;
        fontID: number;
        id: string;
    };
    isSelected: boolean;
    onSelect: () => void;
    onChange: (newAttrs: Partial<TextProps['textProps']>) => void;
}


const TextComponent: React.FC<TextProps> = ({ textProps, isSelected, onSelect, onChange }) => {

    const textRef = useRef<Konva.Text>(null);
    const trRef = useRef<Konva.Transformer>(null);

    const [bgSize, setBgSize] = useState({ width: 0, height: 0 });


    const dispatch = useDispatch();

    useEffect(() => {
        if (isSelected && textRef.current && trRef.current) {
            trRef.current.nodes([textRef.current]);
            trRef.current.moveToTop();
            trRef.current.getLayer()?.batchDraw();

            console.log(textRef.current);
        }
    }, [isSelected]);

    const [fontLoaded, setFontLoaded] = useState(false);

    useEffect(() => {
        WebFont.load({
            google: {
                families: [`${textProps.fontFamily}`]
            },
            active: () => {
                setFontLoaded(true);
            }
        });
    }, [textProps.fontFamily]);


    useEffect(() => {
        if (fontLoaded && textRef.current) {
            textRef.current.fontFamily(`${textProps.fontFamily}`);
            textRef.current.getLayer()?.batchDraw();
        }
    }, [textProps.fontFamily, fontLoaded]);


    const handleSelection = () => {
        onSelect();

        if (textRef.current) {
            textRef.current.moveToTop();
            textRef.current.getLayer()?.batchDraw();
        }
    }

    const convertTextToImage = () => {
        const textNode = textRef.current;
        if (textNode) {
            // Consider padding if any, and scale factors
            const padding = textProps.padding || 0;
            const scaleX = textNode.scaleX();
            const scaleY = textNode.scaleY();

            // Adjust width and height considering padding and scaling
            const width = (textNode.width() * scaleX) + (padding * 2);
            const height = (textNode.height() * scaleY) + (padding * 2);
            const pixelRatio = window.devicePixelRatio || 2;

            textNode.toImage({
                width,
                height,
                pixelRatio: pixelRatio,
                callback(img) {
                    const dataURL = img.src;
                    console.log(dataURL);
                    dispatch(addImage({
                        id: generateUniqueId(),
                        src: dataURL,
                        category: 'text'
                    }));
                },
            });
        }
    };

    useEffect(() => {
        if (textRef.current) {
            const textNode = textRef.current;
            const padding = textProps.padding || 2; // Use padding from your textProps if available
            const { width, height } = textNode.getClientRect();
            setBgSize({ width: width + padding * 2, height: height + padding * 2 });
        }
    }, [textProps.text, textProps.fontSize, textProps.fontFamily, textProps.padding, fontLoaded]); // Include all dependencies that could affect the text size


    return (
        <>
            {fontLoaded && (
                <>
                    <Rect
                        x={498}
                        y={242}
                        width={bgSize.width}
                        height={bgSize.height}
                        fill="white" // Background color
                    // Adjust the position if you're using padding
                    // offsetX={bgSize.width / 2}
                    // offsetY={bgSize.height / 2}
                    />
                    <KonvaText
                        name='text'
                        id={textProps.id}
                        text={textProps.text}
                        fontSize={textProps.fontSize}
                        fontFamily={textProps.fontFamily}
                        fill={textProps.fill}
                        x={500}
                        y={250}
                        ref={textRef}
                        draggable
                        lineHeight={1.5}
                        onDragEnd={(e) => {
                            onChange({
                                ...textProps,
                                x: e.target.x(),
                                y: e.target.y(),
                            });
                        }}
                        onTransformEnd={(e) => {
                            const node = textRef.current;
                            if (node) {
                                const scaleX = node.scaleX();
                                const scaleY = node.scaleY();
                                // const newWidth = Math.max(5, node.width() * scaleX);
                                // const newHeight = Math.max(5, node.height() * scaleY);
                                const newFontSize = Math.max(5, node.fontSize() * scaleX);
                                // node.scaleX(1);
                                // node.scaleY(1);
                                onChange({
                                    ...textProps,
                                    x: node.x(),
                                    y: node.y(),
                                    // width: newWidth,
                                    // height: newHeight,
                                    fontSize: newFontSize
                                });
                            }
                        }}

                        onClick={handleSelection}
                        onDblClick={convertTextToImage}
                        onTap={handleSelection}

                    />
                    {isSelected && (
                        <CustomTransformer shapeRef={textRef} isSelected={isSelected} enabledAnchors={[
                            'top-left',
                            'top-right',
                            'bottom-left',
                            'bottom-right',
                        ]} />
                    )}
                </>
            )}
        </>
    );
};

export default TextComponent;
