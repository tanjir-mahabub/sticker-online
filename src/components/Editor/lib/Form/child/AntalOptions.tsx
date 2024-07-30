import React, { useState } from 'react';
import AnimateIn from '@/lib/AnimateIn';
import { formattedTotalCost } from '@/components/Utils/function';

export interface AntalOption {
    id: number;
    st: string;
    cost: number;
    rate: string;
}

interface AntalOptionsProps {
    antal: AntalOption[];
    onSelectOption: (option: AntalOption) => void;
}

const AntalOptions: React.FC<AntalOptionsProps> = ({ antal, onSelectOption }) => {

    const handleOptionClick = (option: AntalOption) => {
        onSelectOption(option);
    };

    return (
        <>
            {antal.map((option, index) => (
                <AnimateIn
                    key={index}
                    from="opacity-50 translate-y-80"
                    to="opacity-100 translate-y-0 translate-x-0"
                    delay={50 * index}
                    duration={700}>
                    <li key={index} className="w-full gap-1 px-3 py-2 font-semibold hover:bg-gray-100 cursor-pointer flex justify-between items-center" onClick={() => handleOptionClick(option)}>
                        <div className='w-16 px-1'>
                            {option.st}
                        </div>
                        <div className='w-20 text-left'>
                            {formattedTotalCost(option.cost)}
                        </div>
                        <div className='w-20 text-center text-xs font-semibold bg-black text-white rounded px-1.5 py-2'>
                            {option.rate}
                        </div>
                    </li>
                </AnimateIn>
            ))}
        </>
    );
};

export default AntalOptions;
