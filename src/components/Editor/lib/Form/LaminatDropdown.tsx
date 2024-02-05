import React, { useState } from 'react';

interface LaminatDropdownProps {
    selectedOption: string;
    onChange: (option: string) => void;
}

const LaminatDropdown: React.FC<LaminatDropdownProps> = ({ selectedOption, onChange }) => {
    const laminatOptions = ['Glansig', 'Option 2', 'Option 3'];

    return (
        <div className="relative w-full">
            <select
                id="laminat"
                name="laminat"
                className="mt-1 px-3.5 py-3 bg-so-gray border border-gray-300 rounded-md min-w-52 3xl:min-w-60 w-full focus:outline-none focus:ring focus:border-blue-300"
                value={selectedOption}
                onChange={(e) => onChange(e.target.value)}
            >
                {laminatOptions.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            <div className="absolute top-1 right-3 inset-y-0 flex flex-col justify-center items-center pl-2">
                {/* Add any additional elements or styling for the dropdown button */}
            </div>
        </div>
    );
};

export default LaminatDropdown;
