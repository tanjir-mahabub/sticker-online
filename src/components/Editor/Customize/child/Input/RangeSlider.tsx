import React, { useState } from 'react';

interface RangeSliderProps {
    minValue: number;
    maxValue: number;
    step: number;
}

const RangeSlider: React.FC<RangeSliderProps> = ({ minValue, maxValue, step }) => {
    const [value, setValue] = useState<number>(minValue);

    const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(+e.target.value);
    };

    return (
        <div className="flex flex-col gap-5 w-full">
            <input
                type="range"
                min={minValue}
                max={maxValue}
                step={step}
                value={value}
                className="w-full h-1.5 bg-orange-500 rounded border-none outline-none appearance-none"
                onChange={handleRangeChange}
            />

            <p className="text-2xl font-semibold font-open-sans text-black pl-8">Selected Value: {value}</p>

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
