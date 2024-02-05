import React, { ChangeEvent } from 'react';

interface BreddInputProps {
    value: number;
    onChange: (value: number) => void;
    onStepUp: () => void;
    onStepDown: () => void;
}

const BreddInput: React.FC<BreddInputProps> = ({ value, onChange, onStepUp, onStepDown }) => {
    return (
        <div className="relative w-full">
            <input
                type="text"
                id="bredd"
                name="bredd"
                placeholder="6,5 cm"
                className="mt-1 px-3.5 py-3 bg-so-gray border border-gray-300 rounded-md w-28 3xl:w-36 focus:outline-none focus:ring focus:border-blue-300"
                value={`${value.toFixed(1).replace('.', ',')} cm`}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    onChange(parseFloat(e.target.value.replace(',', '.')))
                }
            />
            <div className="absolute top-1 right-3 inset-y-0 flex flex-col justify-center items-center pl-2">
                <button
                    type="button"
                    className="text-so-black text-[10px] bg-gray-200 px-1.5 py-0.5"
                    onClick={onStepUp}
                >
                    ▲
                </button>
                <button
                    type="button"
                    className="text-so-black text-[10px] bg-gray-200 px-1.5 py-0.5"
                    onClick={onStepDown}
                >
                    ▼
                </button>
            </div>
        </div>
    );
};

export default BreddInput;
