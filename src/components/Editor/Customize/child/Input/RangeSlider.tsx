import { setCanvasProperties } from '@/redux/features/canvasSlice';
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface RangeSliderProps {
    minValue: number;
    maxValue: number;
    step: number;
    label?: string;
    defaultValue?: number;
    handleDieCut?: (value: number, selected: boolean) => void;
}

const RangeSlider: React.FC<RangeSliderProps> = ({ minValue, maxValue, step, label, defaultValue, handleDieCut }) => {
    const dispatch = useDispatch();
    const grow = useSelector((state: RootState) => state.canvas.grow);

    const [value, setValue] = useState<number>(defaultValue || minValue);
    const [isSliding, setIsSliding] = useState<boolean>(false);
    const initialRender = useRef(true); // Ref to track the initial render

    const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(+e.target.value);
        if (!isSliding) setIsSliding(true);
    };

    const handleRangeChangeEnd = () => {
        if (isSliding && value) {
            setIsSliding(false);
            // Dispatch the action when the user has finished sliding
            dispatch(setCanvasProperties({ grow: value }));
            // console.log(value);
            handleDieCut && handleDieCut(value, false);
        }
    };

    // Run handleDieCut if defaultValue changes and is defined
    // useEffect(() => {
    //     if (defaultValue !== undefined && handleDieCut) {
    //         handleDieCut();
    //     }
    // }, [defaultValue, handleDieCut]);

    // // Run handleDieCut when grow value changes
    // useEffect(() => {
    //     if (initialRender.current) {
    //         initialRender.current = false; // Skip the first render
    //     } else {
    //         if (handleDieCut) {
    //             console.log('running', grow);
    //             handleDieCut();
    //         }
    //     }
    // }, [grow, handleDieCut]);

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
                    height: 24px;
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
