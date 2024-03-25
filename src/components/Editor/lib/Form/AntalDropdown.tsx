import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import materialStore from '@/store/materialStore';
import MaterialOptions from './child/MaterialOptions';
import AntalOptions, { AntalOption } from './child/AntalOptions';

interface AntalDropdownProps {
    selectedOption: AntalOption;
    onChange: (option: AntalOption) => void;
}

// Assuming materialStore is correctly imported and structured
const AntalDropdown: React.FC<AntalDropdownProps> = ({ selectedOption, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const antalOptions = [
        { st: '500 st', amount: '4990 kr', rate: '10 kr / st' },
        { st: '200 st', amount: '2590 kr', rate: '13,5 kr / st' },
        { st: '100 st', amount: '1490 kr', rate: '14,9 kr / st' },
        { st: '50 st', amount: '890 kr', rate: '17,8 kr / st' },
        { st: '25 st', amount: '490 kr', rate: '19,9 kr / st' },
        { st: '10 st', amount: '240 kr', rate: '24,5 kr / st' },
    ];


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(!isOpen);
                }}
                className="mt-1 px-3 py-3 bg-so-gray border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-blue-300 relative flex justify-between items-center"
            >
                <div className="font-semibold w-fit min-w-[160px] cursor-pointer flex gap-1 justify-start items-center pr-5">
                    <div className='w-1/3 flex justify-start px-1'>
                        {selectedOption.st}
                    </div>
                    <div className='w-2/2 text-xs font-semibold bg-black text-white rounded px-1.5 py-1.5'>
                        {selectedOption.rate}
                    </div>
                </div>
                <span className={`transition transform ${isOpen ? 'rotate-180' : ''}`}><Image src={'/downArrow.svg'} alt='down-arrow' width={11} height={11} /></span>
            </button>
            {isOpen && (
                <div className={`absolute left-0 bottom-[92px] mb-2 grid gap-4 w-[250px] bg-white border border-gray-300 divide-x rounded-md z-50 overflow-hidden`}>
                    <ul className="w-full">
                        <AntalOptions antal={antalOptions} />
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AntalDropdown;
