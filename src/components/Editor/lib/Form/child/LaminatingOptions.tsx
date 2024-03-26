import React, { useState } from 'react';
import AnimateIn from '@/lib/AnimateIn';

export interface LaminatingsOption {
    id: number;
    label: string;
    cost: number;
}

interface LaminatingOptionsProps {
    laminatings: LaminatingsOption[];
    onSelectOption: (option: LaminatingsOption) => void;
}

const LaminatingOptions: React.FC<LaminatingOptionsProps> = ({ laminatings, onSelectOption }) => {

    const handleOptionClick = (option: LaminatingsOption) => {
        onSelectOption(option);
    };

    return (
        <>
            {laminatings.map((option, index) => (
                <AnimateIn
                    key={index}
                    from="opacity-50 translate-y-80"
                    to="opacity-100 translate-y-0 translate-x-0"
                    delay={50 * index}
                    duration={700}>
                    <li key={index} className="px-3 py-2 font-semibold hover:bg-gray-100 cursor-pointer flex justify-start items-center" onClick={() => handleOptionClick(option)}>
                        {option.label}
                    </li>
                </AnimateIn>
            ))}
        </>
    );
};

export default LaminatingOptions;
