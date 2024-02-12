import { setCanvasProperties } from '@/redux/features/canvasSlice';
import { customizeFonts } from '@/store/customizeFontStore';
import Konva from 'konva';
import React, { useEffect, useRef } from 'react';
import { Transformer, Text as KonvaText } from 'react-konva';
import { useDispatch } from 'react-redux';

export interface TextProps {
    textProps: {
        x: number;
        y: number;
        text: string;
        fontSize: number;
        fontFamily: string;
        width: number;
        height: number;
        padding: number;
        fill: string;
        id: string;
    };
    isSelected: boolean;
    onSelect: () => void;
    onChange: (newAttrs: Partial<TextProps['textProps']>) => void;
}


const Text: React.FC<TextProps> = ({ textProps, isSelected, onSelect, onChange }) => {
    const textRef = useRef<Konva.Text>(null);
    const trRef = useRef<Konva.Transformer>(null);

    const dispatch = useDispatch();

    const onDoubleClickHandle = (e: Konva.KonvaEventObject<MouseEvent> | Konva.KonvaEventObject<TouchEvent>) => {
        const stage = e.target.getStage();
        const textNode = textRef.current;

        if (textNode && stage && trRef) {
            // Hide the text node and transformer
            textNode.hide();
            // trRef.current?.hide();
            // Create a textarea over canvas with absolute position
            const textarea = document.createElement('textarea');
            document.body.appendChild(textarea);
            // Set textarea styles to match text node styles
            // Position it over the text node
            const textPosition = textNode.getAbsolutePosition();
            const stageBox = stage.container().getBoundingClientRect();
            textarea.style.position = 'absolute';
            textarea.style.left = stageBox.left + textPosition.x + 'px';
            textarea.style.top = stageBox.top + textPosition.y + 'px';
            textarea.style.width = trRef.current?.width + 'px';
            textarea.style.height = trRef.current?.height + 'px'; // Ensure textarea covers entire text height
            textarea.style.fontSize = textNode.fontSize() + 'px';
            textarea.style.fontFamily = textNode.fontFamily();
            textarea.style.color = textNode.fill();
            textarea.style.background = 'transparent';
            textarea.style.border = 'none';
            textarea.style.padding = textNode.padding() + 'px';
            textarea.style.margin = '0';
            textarea.style.overflow = 'hidden';
            textarea.style.resize = 'none';
            textarea.style.outline = 'none';
            textarea.style.lineHeight = 'tight';
            textarea.style.textAlign = textNode.align();
            textarea.style.transformOrigin = 'left top';
            textarea.style.overflowY = "auto";
            // textarea.style.border = "1px solid";
            // Set initial text content to match text node text
            textarea.value = textNode.text();
            // Add event listeners for editing and removing the textarea
            textarea.addEventListener('input', () => {
                // When the textarea content changes, update the text node text
                textNode.text(textarea.value);
                // Force redraw of the layer
                textNode.getLayer()?.batchDraw();
            });
            textarea.addEventListener('blur', () => {
                // When the textarea loses focus (editing is finished)
                // Remove the textarea and show the text node and transformer
                textarea.parentNode?.removeChild(textarea);
                textNode.show();
                trRef.current?.show();
                // Force redraw of the layer
                textNode.getLayer()?.batchDraw();
            });
            // Focus on the textarea to start editing
            textarea.focus();

        }
        window.addEventListener('click', handleOutsideClick);
    }


    const handleOutsideClick = (e: MouseEvent) => {
        const textarea = document.querySelector('textarea');
        const textNode = textRef.current;
        if (textNode && textarea && e.target !== textarea) {
            textNode.text(textarea.value);

            textNode.width(textarea.scrollWidth)
            textNode.height(textarea.scrollHeight)
        }
        console.log('test');
    }



    useEffect(() => {
        if (isSelected && textRef.current && trRef.current) {
            trRef.current.nodes([textRef.current]);
            trRef.current.getLayer()?.batchDraw();
        }
    }, [isSelected]);

    useEffect(() => {

        dispatch(setCanvasProperties({ canvasUpdated: true }))
        console.log('text', textProps);

        return () => {
            dispatch(setCanvasProperties({ canvasUpdated: false }))
            // console.log('uploaded return');
        };
    }, [textProps, dispatch])


    return (
        <>
            <KonvaText
                {...textProps}
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
                        const newWidth = Math.max(5, node.width() * scaleX);
                        const newHeight = Math.max(5, node.height() * scaleY);
                        const newFontSize = Math.max(5, node.fontSize() * scaleX);
                        node.scaleX(1);
                        node.scaleY(1);
                        onChange({
                            ...textProps,
                            x: node.x(),
                            y: node.y(),
                            width: newWidth,
                            height: newHeight,
                            fontSize: newFontSize
                        });
                    }
                }}

                onClick={onSelect}
                onTap={onSelect}
                onDblClick={onDoubleClickHandle}

            />
            {isSelected && (
                <Transformer
                    ref={trRef}
                    rotateEnabled={true}
                    boundBoxFunc={(oldBox, newBox) => {
                        if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                    keepRatio={true}
                />
            )}
        </>
    );
};

export default Text;
