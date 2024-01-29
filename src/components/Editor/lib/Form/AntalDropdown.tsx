import React from 'react';

interface AntalDropdownProps {
    selectedOption: string;
    onChange: (option: string) => void;
}

const AntalDropdown: React.FC<AntalDropdownProps> = ({ selectedOption, onChange }) => {
    const antalOptions = [
        { st: '100 st', percentage: '-45%' },
        { st: '200 st', percentage: '-40%' },
        { st: '300 st', percentage: '-35%' },
        // Add more options as needed
    ];

    const renderPercentageDisplay = (stValue: string) => {
        const percentage = antalOptions.find((opt) => opt.st === stValue)?.percentage;
        return (
            <div key={percentage} className="absolute top-1 left-16 inset-y-0 flex flex-col justify-center items-center pl-2">
                <div className="bg-black text-white px-1.5 py-1 ml-2 rounded">{percentage}</div>
            </div>
        );
    };

    return (
        <div className="relative w-full">
            <select
                id="antal"
                name="antal"
                className="mt-1 px-3.5 py-3 bg-so-gray border border-gray-300 rounded-md min-w-60 w-full focus:outline-none focus:ring focus:border-blue-300"
                value={selectedOption}
                onChange={(e) => onChange(e.target.value)}
            >
                {antalOptions.map((option) => (
                    <option key={option.st} value={option.st}>
                        {option.st}
                    </option>
                ))}
            </select>
            {antalOptions.map((option) => selectedOption.startsWith(option.st) && renderPercentageDisplay(option.st))}
        </div>
    );
};

export default AntalDropdown;
