import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import materialStore from '@/store/materialStore';
import MaterialOptions from './child/MaterialOptions';
import { useDispatch } from 'react-redux';
import { setCalculation } from '@/redux/features/calculationSlice';
import { setMaterialLastSelected } from '@/redux/features/formSlice';
import { useAppSelector } from '@/redux/store';

export interface MaterialOption {
    id: number,
    label: string,
    value: string,
    cost: number,
    icon: string,
    popup: {
        title: string,
        imgSrc: string,
        content: string
    }
}

// Assuming materialStore is correctly imported and structured
const MaterialDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<MaterialOption | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const dispatch = useDispatch();

    const materialDefault = useAppSelector(state => state.formValues);

    // Splitting the materialStore into two arrays for explicit column control
    const halfIndex = Math.ceil(materialStore.length / 2);
    const firstHalfOptions = materialStore.slice(0, halfIndex);
    const secondHalfOptions = materialStore.slice(halfIndex);

    const handleOptionChange = (option: MaterialOption) => {
        setIsOpen(false);
        setSelectedOption(option);

        const selectedMaterial = materialStore.find(material => material.id === option.id);

        dispatch(setMaterialLastSelected(option.id));
        if (selectedMaterial) {
            dispatch(setCalculation({ materialCost: selectedMaterial.cost }));
        }
    };



    useEffect(() => {
        // Set default selected option to have id 1
        if (materialDefault.materialLastSelected !== null) {
            setSelectedOption(materialStore.find(option => option.id === materialDefault.materialLastSelected) || null);
        }
    }, [materialDefault]);

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
                className="mt-1 px-3.5 py-3 font-semibold bg-so-gray border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-blue-300 relative flex justify-between items-center"
            >
                {selectedOption?.label}
                <span className={`transition transform ${isOpen ? 'rotate-180' : ''}`}><Image src={'/downArrow.svg'} alt='down-arrow' width={11} height={11} /></span>
            </button>
            {isOpen && (
                <div className={`absolute left-0 bottom-[92px] mb-2 w-[600px] bg-white border border-gray-300 divide-x rounded-md z-50 grid grid-cols-2 overflow-hidden`}>
                    <ul className="w-full">
                        <MaterialOptions materials={firstHalfOptions} onSelectOption={handleOptionChange} />
                    </ul>
                    <ul className="w-full">
                        <MaterialOptions materials={secondHalfOptions} onSelectOption={handleOptionChange} />
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MaterialDropdown;
