import { setCanvasProperties } from '@/redux/features/canvasSlice';
import { useAppSelector } from '@/redux/store';
import { Sketch, Compact } from '@uiw/react-color';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

type ColorType = 'Background' | 'Text' | 'Both';
interface ColorStyle {
    sketch?: boolean;
    compact?: boolean;
    type?: ColorType;
    showValue?: ColorType;
    styles?: React.CSSProperties;
    onColorChange?: (color: string) => void;
}

const ColorInput: React.FC<ColorStyle> = ({ sketch, compact, type, showValue, styles, onColorChange }) => {
    const defaultBackgroundColor = useAppSelector(state => state.canvas.backgroundColor);
    const defaultTextColor = useAppSelector(state => state.canvas.textColor);
    const [hexBackground, setHexBackground] = useState(defaultBackgroundColor);
    const [hexText, setHexText] = useState(defaultTextColor);

    const dispatch = useDispatch();

    const handleBackgroundChange = (color: { hex: string }) => {
        setHexBackground(color.hex);
        onColorChange && onColorChange(color.hex);
        dispatch(setCanvasProperties({ backgroundColor: color.hex }));
    };

    const handleTextChange = (color: { hex: string }) => {
        setHexText(color.hex);
        onColorChange && onColorChange(color.hex);
        dispatch(setCanvasProperties({ textColor: color.hex }));
    };

    const handleChange = (color: { hex: string }) => {
        switch (type) {
            case "Background":
                handleBackgroundChange(color)
                break;

            case "Text":
                handleTextChange(color)
                break;

            case "Both":
                handleBackgroundChange(color)
                handleTextChange(color)
                break;

            default:
                break;
        }
    }

    return (
        <>
            <div className="flex flex-col gap-10">
                <div>
                    {sketch && <Sketch
                        className=''
                        style={{ width: '100%', ...styles }}
                        color={hexBackground}
                        onChange={handleChange}
                    />}

                    {compact && <Compact
                        className=''
                        style={{ width: '100%', ...styles }}
                        color={hexBackground}
                        onChange={handleChange}
                    />}
                </div>

                {showValue && (
                    <div className='flex flex-col gap-3'>
                        {showValue === 'Background' && (
                            <>
                                <p className='text-xs lg:text-sm font-bold text-so-black'>Färgkod (Bakgrund)</p>
                                <p className="bg-so-deep-gray font-bold px-3 py-2 border rounded">{hexBackground}</p>
                            </>
                        )}

                        {showValue === 'Text' && (
                            <>
                                <p className='text-xs lg:text-sm font-bold text-so-black'>Färgkod (Text)</p>
                                <p className="bg-so-deep-gray font-bold px-3 py-2 border rounded">{hexText}</p>
                            </>
                        )}

                        {showValue === 'Both' && (
                            <>
                                <p className='text-xs lg:text-sm font-bold text-so-black'>Färgkod (Bakgrund)</p>
                                <p className="bg-so-deep-gray font-bold px-3 py-2 border rounded">{hexBackground}</p>

                                <p className='text-xs lg:text-sm font-bold text-so-black'>Färgkod (Text)</p>
                                <p className="bg-so-deep-gray font-bold px-3 py-2 border rounded">{hexText}</p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </>
    )
};

export default ColorInput;
