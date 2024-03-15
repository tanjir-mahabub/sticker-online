import React, { ChangeEvent, useEffect, useState } from 'react';

interface TextInputProps {
    value: string;
    fontSize: number;
    onChange: (value: string) => void;
    onFontSizeChange: (size: number) => void;
}

const TextInput: React.FC<TextInputProps> = ({ value, fontSize, onChange, onFontSizeChange }) => {

    const maxChars = 100;

    const [remainingChars, setRemainingChars] = useState(maxChars - value.length);

    useEffect(() => {
        setRemainingChars(maxChars - value.length);
    }, [value]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const sanitizedInput = inputValue.replace(/<[^>]*>?/gm, '');
        if (sanitizedInput.length <= maxChars) {
            onChange(sanitizedInput);
            setRemainingChars(maxChars - sanitizedInput.length);
        }
    };

    const handleFontSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newFontSize = parseInt(e.target.value, 10);
        if (!isNaN(newFontSize) && newFontSize > 0) {
            onFontSizeChange(newFontSize);
        }
    };

    return (
        <div className="relative w-full flex flex-col gap-2">
            <div className=''>
                <label htmlFor="text">Text Input</label>
                <input
                    type="text"
                    id="text"
                    name="text"
                    placeholder="Enter text"
                    className="w-full block px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-300 sm:text-sm"
                    value={value}
                    onChange={handleChange}
                    maxLength={maxChars}
                />
                <span className="text-xs">{`Remaining characters: ${remainingChars}`}</span>
            </div>

            <div>
                <label htmlFor="fontSize">Font Size</label>
                <div className="flex items-center">
                    <input
                        type="number"
                        id="fontSize"
                        name="fontSize"
                        placeholder="Font Size"
                        className="w-full block px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-300 sm:text-sm"
                        value={fontSize}
                        onChange={handleFontSizeChange}
                        min="1"
                    />
                </div>
            </div>
        </div>
    );
};

export default TextInput;
