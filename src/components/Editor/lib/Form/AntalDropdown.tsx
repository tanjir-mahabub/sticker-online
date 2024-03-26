import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import AntalOptions, { AntalOption } from './child/AntalOptions';
import { useDispatch } from 'react-redux';
import { setCalculation } from '@/redux/features/calculationSlice';
import { setAntalLastSelected, setMaterialLastSelected } from '@/redux/features/formSlice';
import { useAppSelector } from '@/redux/store';


const AntalDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<AntalOption | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const dispatch = useDispatch();

    const antalDefault = useAppSelector(state => state.formValues);

    const antalOptions = [
        { id: 1, st: '500 st', cost: 4990, rate: '10 kr / st' },
        { id: 2, st: '200 st', cost: 2590, rate: '13,5 kr / st' },
        { id: 3, st: '100 st', cost: 1490, rate: '14,9 kr / st' },
        { id: 4, st: '50 st', cost: 890, rate: '17,8 kr / st' },
        { id: 5, st: '25 st', cost: 490, rate: '19,9 kr / st' },
        { id: 6, st: '10 st', cost: 240, rate: '24,5 kr / st' },
    ];


    useEffect(() => {
        console.log("Antal default value:", antalDefault.antalLastSelected); // Debug statement

        if (antalDefault.antalLastSelected !== null) {
            const selected = antalOptions.find(option => option.id === antalDefault.antalLastSelected);
            console.log("Selected option:", selected); // Debug statement
            setSelectedOption(selected || null);
        }
    }, [antalDefault]);

    const handleOptionChange = (option: AntalOption) => {
        setIsOpen(false);
        setSelectedOption(option);

        dispatch(setAntalLastSelected(option.id));
        dispatch(setCalculation({ antalCost: option.cost }));
    };


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
                    <div className='w-fit flex justify-start px-1'>
                        {selectedOption?.st}
                    </div>
                    <div className='w-fit text-xs font-semibold bg-black text-white rounded px-1.5 py-1.5'>
                        {selectedOption?.rate}
                    </div>
                </div>
                <span className={`transition transform ${isOpen ? 'rotate-180' : ''}`}><Image src={'/downArrow.svg'} alt='down-arrow' width={11} height={11} /></span>
            </button>
            {isOpen && (
                <div className={`absolute left-0 bottom-[92px] mb-2 grid gap-4 w-[280px] bg-white border border-gray-300 divide-x rounded-md z-50 overflow-hidden`}>
                    <ul className="w-full">
                        <AntalOptions antal={antalOptions} onSelectOption={handleOptionChange} />
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AntalDropdown;
