import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { setCalculation } from '@/redux/features/calculationSlice';
import LaminatingOptions from './child/LaminatingOptions';
import { setLaminatingLastSelected } from '@/redux/features/formSlice';
import { useAppSelector } from '@/redux/store';
import { useCanvas } from '@/context/CanvasContext';
import { LaminateOptionProps } from '@/types/types';


const defaultLaminatOptions: LaminateOptionProps[] = [
    {
        id: 1,
        object_id: 1,
        st: 'Glansig',
        value: "glansig",
        cost: 5
    },
    {
        id: 2,
        object_id: 2,
        st: 'Glansig 2',
        value: "glansig-2",
        cost: 10
    },
    {
        id: 3,
        object_id: 1,
        st: 'Glansig 3',
        value: "glansig-3",
        cost: 15
    },
];

const LaminatingDropdown: React.FC = () => {
    const dispatch = useDispatch();
    const { stickerData } = useCanvas();

    const laminatOptions = stickerData?.laminates?.length ? stickerData.laminates : defaultLaminatOptions;

    const laminatingDefault = useAppSelector(state => state.formValues.laminatingLastSelected);
    const selected = laminatOptions.find(option => option.id === laminatingDefault);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<LaminateOptionProps | null>(selected || null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleOptionChange = (option: LaminateOptionProps) => {
        setIsOpen(false);
        setSelectedOption(option);

        dispatch(setLaminatingLastSelected(option.id));
    };

    useEffect(() => {
        if (selectedOption) {
            dispatch(setCalculation({ laminatingCost: selectedOption.cost }));
        }
    }, [dispatch, selectedOption]);

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
        <div className="lg:relative w-full" ref={dropdownRef}>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(!isOpen);
                }}
                className="mt-1 px-3 py-3 bg-so-gray border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-blue-300 relative flex justify-between items-center"
            >
                <div className="font-semibold w-fit cursor-pointer flex gap-1 justify-start items-center pr-5">
                    {selectedOption?.st}
                </div>
                <span className={`transition transform ${isOpen ? 'rotate-180' : ''}`}><Image src={'/downArrow.svg'} alt='down-arrow' width={11} height={11} /></span>
            </button>
            {isOpen && (
                <div className="laminate-option">
                    <ul className="w-full">
                        <LaminatingOptions laminatings={laminatOptions} onSelectOption={handleOptionChange} />
                    </ul>
                </div>
            )}
        </div>
    );
};

export default LaminatingDropdown;
