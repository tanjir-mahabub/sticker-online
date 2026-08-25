import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import materialStore from '@/store/materialStore';
import MaterialOptions from './child/MaterialOptions';
import { useDispatch } from 'react-redux';
import { setCalculation } from '@/redux/features/calculationSlice';
import { setMaterialLastSelected } from '@/redux/features/formSlice';
import { useAppSelector } from '@/redux/store';
import { useCanvas } from '@/context/CanvasContext';
import { MaterialOptionProps } from '@/types/types';
import { useEditorI18n } from '@/context/EditorI18nContext';
import { selectedSideNav } from '@/redux/features/sideNavSlice';

const MaterialDropdown: React.FC = () => {
    const materialDefault = useAppSelector(state => state.formValues.materialLastSelected);
    const { stickerData } = useCanvas();

    const remoteMaterials = stickerData?.materials?.length ? stickerData.materials : materialStore;
    const materials = [...materialStore.filter(option => !remoteMaterials.some(remote => remote.id === option.id)), ...remoteMaterials];
    const { t } = useEditorI18n();

    const selected = materials.find(option => option.id === materialDefault);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<MaterialOptionProps | null>(selected || materials[0] || null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const dispatch = useDispatch();


    const handleOptionChange = (option: MaterialOptionProps) => {
        setIsOpen(false);
        setSelectedOption(option);

        dispatch(setMaterialLastSelected(option.id));
        if (option.value === 'color') dispatch(selectedSideNav({ id: 4 }));
    };

    useEffect(() => {
        selectedOption && dispatch(setCalculation({ materialCost: selectedOption.cost }));
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
                className="mt-1 px-3.5 py-3 font-semibold bg-so-gray border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-blue-300 relative flex justify-between items-center"
            >
                {selectedOption?.value === "color" ? t('color') : selectedOption?.label || t('selectMaterial')}
                <span className={`transition transform ${isOpen ? 'rotate-180' : ''}`}><Image src={'/downArrow.svg'} alt='down-arrow' width={11} height={11} /></span>
            </button>
            {isOpen && (
                <div className="material-option">
                    <ul className="material-option-grid">
                        <MaterialOptions materials={materials} onSelectOption={handleOptionChange} />
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MaterialDropdown;
