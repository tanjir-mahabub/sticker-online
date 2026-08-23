import { setCanvasProperties } from '@/redux/features/canvasSlice';
import { useAppSelector } from '@/redux/store';
import { Sketch, Compact } from '@uiw/react-color';
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { debounce } from 'lodash';

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

    useEffect(() => {
        setHexBackground(defaultBackgroundColor);
        setHexText(defaultTextColor);
    }, [defaultBackgroundColor, defaultTextColor]);

    const handleChange = useMemo(
        () => debounce((color: { hexa: string }) => {
            const newColor = color.hexa;

            switch (type) {
                case "Background":
                    if (hexBackground !== newColor) {
                        setHexBackground(newColor);
                        dispatch(setCanvasProperties({ backgroundColor: newColor }));
                    }
                    break;
                case "Text":
                    if (hexText !== newColor) {
                        setHexText(newColor);
                        dispatch(setCanvasProperties({ textColor: newColor }));
                    }
                    break;
                case "Both":
                    if (hexBackground !== newColor || hexText !== newColor) {
                        setHexBackground(newColor);
                        setHexText(newColor);
                        dispatch(setCanvasProperties({ backgroundColor: newColor, textColor: newColor }));
                    }
                    break;
                default:
                    break;
            }

            onColorChange && onColorChange(newColor);
        }, 200),
        [hexBackground, hexText, type, dispatch, onColorChange]
    );

    useEffect(() => () => handleChange.cancel(), [handleChange]);

    return (
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
    );
};

export default ColorInput;
