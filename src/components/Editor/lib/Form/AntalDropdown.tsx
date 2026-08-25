import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import AntalOptions from './child/AntalOptions';
import { useDispatch } from 'react-redux';
import { setCalculation } from '@/redux/features/calculationSlice';
import { setAntalLastSelected } from '@/redux/features/formSlice';
import { useAppSelector } from '@/redux/store';
import { useCanvas } from '@/context/CanvasContext';
import { AntalOptionProps } from '@/types/types';
import { useEditorI18n } from '@/context/EditorI18nContext';

const defaultAntalOptions = [
    { id: 1, object_id: 1, st: '500 st', cost: 4990, rate: '10', value: '500-st' },
    { id: 2, object_id: 2, st: '200 st', cost: 2590, rate: '13,5', value: '200-st' },
    { id: 3, object_id: 3, st: '100 st', cost: 1490, rate: '14,9', value: '100-st' },
    { id: 4, object_id: 4, st: '50 st', cost: 890, rate: '17,8', value: '50-st' },
    { id: 5, object_id: 5, st: '25 st', cost: 490, rate: '19,9', value: '25-st' },
    { id: 6, object_id: 6, st: '10 st', cost: 240, rate: '24,5', value: '10-st' },
];

const AntalDropdown: React.FC = () => {
    const dispatch = useDispatch();
    const { formatCurrency, t } = useEditorI18n();
    const { stickerData } = useCanvas();

    const antalOptions = stickerData?.antals?.length ? stickerData.antals : defaultAntalOptions;

    const sortedAntalOptions = [...antalOptions].sort((a, b) => {
        const numA = parseInt(a.st); 
        const numB = parseInt(b.st);
        return numB - numA; 
    });    

    const antalDefault = useAppSelector(state => state.formValues.antalLastSelected);
    const selected = sortedAntalOptions.find(option => option.id === antalDefault);
    
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<AntalOptionProps | null>(selected || sortedAntalOptions[0] || null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleOptionChange = (option: AntalOptionProps) => {
        setIsOpen(false);
        setSelectedOption(option);
        dispatch(setAntalLastSelected(option.id));
    };

    useEffect(() => {
        if (selectedOption) {
            dispatch(setCalculation({ antalCost: selectedOption.cost }));
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
                className="mt-1 px-3 py-2 lg:py-3 bg-so-gray border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-blue-300 relative flex justify-between items-center"
            >
                <div className="font-semibold w-fit min-w-[160px] cursor-pointer flex gap-1 justify-start items-center pr-5">
                    <div className='w-fit flex justify-start px-1'>
                        {selectedOption?.st}
                    </div>
                    <div className='w-fit text-xs font-semibold bg-black text-white rounded px-1.5 py-1.5'>
                        {formatCurrency(parseFloat((selectedOption?.rate || '1').replace(',', '.')))} {t('perPiece')}
                    </div>
                </div>
                <span className={`transition transform ${isOpen ? 'rotate-180' : ''}`}><Image src={'/downArrow.svg'} alt='down-arrow' width={11} height={11} /></span>
            </button>
            {isOpen && (
                <div className="antal-option">
                    <ul className="w-full">
                        <AntalOptions antal={sortedAntalOptions} onSelectOption={handleOptionChange} />
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AntalDropdown;
