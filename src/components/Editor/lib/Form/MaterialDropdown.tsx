import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import materialStore from '@/store/materialStore';
import MaterialOptions from './child/MaterialOptions';

interface MaterialDropdownProps {
    selectedOption: string;
    onChange: (option: string) => void;
}

// Assuming materialStore is correctly imported and structured
const MaterialDropdown: React.FC<MaterialDropdownProps> = ({ selectedOption, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Splitting the materialStore into two arrays for explicit column control
    const halfIndex = Math.ceil(materialStore.length / 2);
    const firstHalfOptions = materialStore.slice(0, halfIndex);
    const secondHalfOptions = materialStore.slice(halfIndex);

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
                className="mt-1 px-3.5 py-3 bg-so-gray border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-blue-300 relative flex justify-between items-center"
            >
                {selectedOption}
                <span className={`transition transform ${isOpen ? 'rotate-180' : ''}`}><Image src={'/downArrow.svg'} alt='down-arrow' width={11} height={11} /></span>
            </button>
            {isOpen && (
                <div className={`absolute left-0 bottom-[92px] mb-2 w-[600px] bg-white border border-gray-300 divide-x rounded-md z-50 overflow-auto grid grid-cols-2 `}>
                    <ul className="w-full">
                        <MaterialOptions materials={firstHalfOptions} />
                    </ul>
                    <ul className="w-full">
                        <MaterialOptions materials={secondHalfOptions} />
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MaterialDropdown;
