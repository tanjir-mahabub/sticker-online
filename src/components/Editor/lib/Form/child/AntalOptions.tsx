import React, { useState } from 'react';
import AnimateIn from '@/lib/AnimateIn';

export interface AntalOption {
    st: string;
    amount: string;
    rate: string;
}

interface AntalOptionsProps {
    antal: AntalOption[];
}

const AntalOptions: React.FC<AntalOptionsProps> = ({ antal }) => {


    return (
        <>
            {antal.map((option, index) => (
                <AnimateIn
                    key={index}
                    from="opacity-50 translate-y-80"
                    to="opacity-100 translate-y-0 translate-x-0"
                    delay={50 * index}
                    duration={700}>
                    <li key={index} className="px-3 py-2 font-semibold hover:bg-gray-100 cursor-pointer flex justify-start items-center">
                        <div className='w-4/12 px-1'>
                            {option.st}
                        </div>
                        <div className='w-4/12'>
                            {option.amount}
                        </div>
                        <div className='w-4/12 text-center text-xs font-semibold bg-black text-white rounded px-1.5 py-2'>
                            {option.rate}
                        </div>
                    </li>
                </AnimateIn>
            ))}
        </>
    );
};

export default AntalOptions;
