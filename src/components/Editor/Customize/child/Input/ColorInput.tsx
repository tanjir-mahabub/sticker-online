import { setCanvasProperties } from '@/redux/features/canvasSlice';
import { useAppSelector } from '@/redux/store';
import { Sketch, Compact } from '@uiw/react-color';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

interface ColorStyle {
    sketch?: boolean;
    compact?: boolean;
    showValue?: boolean;
    styles?: React.CSSProperties;
    onColorChange?: (color: string) => void;
}

const ColorInput: React.FC<ColorStyle> = ({ sketch, compact, showValue, styles, onColorChange }) => {
    const defaultBackgroundColor = useAppSelector(state => state.canvas.backgroundColor)
    const [hex, setHex] = useState(defaultBackgroundColor);

    const dispatch = useDispatch();

    const handleChange = (color: { hex: string }) => {
        setHex(color.hex);
        onColorChange && onColorChange(color.hex);
        dispatch(setCanvasProperties({ backgroundColor: color.hex }))
    };

    return (
        <>
            <div className="flex flex-col gap-10">
                <div>
                    {sketch && <Sketch
                        className=''
                        style={{ width: '100%', ...styles }}
                        color={hex}
                        onChange={handleChange}
                    />}

                    {compact && <Compact
                        className=''
                        style={{ width: '100%', ...styles }}
                        color={hex}
                        onChange={handleChange}
                    />}
                </div>

                {showValue && (
                    <div className='flex flex-col gap-3'>
                        <p className='text-xs lg:text-sm font-bold text-so-black'>Färgkod (Hex)</p>
                        <p className="bg-so-deep-gray font-bold px-3 py-2 border rounded">{hex}</p>
                    </div>
                )}
            </div>
        </>
    )
};

export default ColorInput;