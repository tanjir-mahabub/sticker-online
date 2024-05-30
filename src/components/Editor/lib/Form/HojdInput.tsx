import React, { ChangeEvent, KeyboardEvent } from 'react';

interface HojdInputProps {
    value: number;
    onChange: (value: number) => void;
    onStepUp: () => void;
    onStepDown: () => void;
}

const HojdInput: React.FC<HojdInputProps> = ({ value, onChange, onStepUp, onStepDown }) => {

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowUp') {
            onStepUp();
        } else if (e.key === 'ArrowDown') {
            onStepDown();
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value.replace(',', '.'));
        if (!isNaN(newValue)) {
            onChange(newValue);
        }
    };

    return (
        <div className="relative w-full">
            <input
                type="text"
                id="hojd"
                name="hojd"
                placeholder="5 cm"
                className="mt-1 px-3.5 py-3 bg-so-gray border border-gray-300 rounded-md w-28 3xl:w-36 focus:outline-none focus:ring focus:border-blue-300"
                value={`${value.toFixed(1).replace('.', ',')} cm`}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
            <div className="absolute top-1 right-3 inset-y-0 flex flex-col justify-center items-center pl-2">
                <button
                    type="button"
                    className="text-so-black text-[10px] bg-gray-200 px-[5px] py-0 leading-0"
                    onClick={onStepUp}
                >
                    ▲
                </button>
                <button
                    type="button"
                    className="text-so-black text-[10px] bg-gray-200 px-[5px] py-0 leading-0"
                    onClick={onStepDown}
                >
                    ▼
                </button>
            </div>
        </div>
    );
};

export default HojdInput;
