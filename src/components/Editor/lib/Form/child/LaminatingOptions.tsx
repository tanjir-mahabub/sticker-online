import React from 'react';
import AnimateIn from '@/lib/AnimateIn';
import { LaminateOptionProps } from '@/types/types';

interface LaminatingOptions {
    laminatings: LaminateOptionProps[];
    onSelectOption: (option: LaminateOptionProps) => void;
}

const LaminatingOptions: React.FC<LaminatingOptions> = ({ laminatings, onSelectOption }) => {

    const handleOptionClick = (option: LaminateOptionProps) => {
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
                        {option.st}
                    </li>
                </AnimateIn>
            ))}
        </>
    );
};

export default LaminatingOptions;
