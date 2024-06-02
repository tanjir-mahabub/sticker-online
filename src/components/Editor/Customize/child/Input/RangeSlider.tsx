import { setCanvasProperties } from '@/redux/features/canvasSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

interface RangeSliderProps {
    minValue: number;
    maxValue: number;
    step: number;
    label?: string;
    defaultValue?: number;
}

const RangeSlider: React.FC<RangeSliderProps> = ({ minValue, maxValue, step, label, defaultValue }) => {
    const [value, setValue] = useState<number>(defaultValue || minValue);
    const [isSliding, setIsSliding] = useState<boolean>(false);

    const dispatch = useDispatch();

    const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(+e.target.value);
        if (!isSliding) setIsSliding(true);
    };

    const handleRangeChangeEnd = () => {
        if (isSliding) {
            setIsSliding(false);
            // Dispatch the action when the user has finished sliding
            dispatch(setCanvasProperties({ grow: value }));
            console.log(value);
        }
    };

    return (
        <div className="flex flex-col gap-2 lg:gap-3 w-full">
            {label && (
                <label htmlFor="range" className="block text-xs lg:text-sm 3xl:text-sm font-bold text-so-black">
                    {label}
                </label>
            )}
            <input
                type="range"
                min={minValue}
                max={maxValue}
                step={step}
                value={value}
                id="range"
                name="range"
                className="lg:w-[200px] h-1.5 bg-orange-500 rounded border-none outline-none appearance-none"
                onChange={handleRangeChange}
                onMouseUp={handleRangeChangeEnd}
                onTouchEnd={handleRangeChangeEnd}
            />

            <p className="hidden text-2xl font-semibold font-open-sans text-black pl-8">Selected Value: {value}</p>

            <style jsx>{`
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none !important;
                    width: 24px;
                    height:24px;
                    background: white;
                    border: 5px solid #F98332;
                    border-radius: 50%;
                    cursor: pointer;
                }

                input[type="range"]::-webkit-slider-thumb:hover {
                    background: #EBEBEB;
                }
            `}</style>
        </div>
    );
};

export default RangeSlider;
