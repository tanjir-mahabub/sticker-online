import { useCanvas } from '@/context/CanvasContext';
import { setCalculation } from '@/redux/features/calculationSlice';
import { setMaterialLastSelected } from '@/redux/features/formSlice';
import { useAppSelector } from '@/redux/store';
import materialStore from '@/store/materialStore';
import { MaterialOptionProps } from '@/types/types';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import MaterialOptions from './child/MaterialOptions';

const MaterialDropdown: React.FC = () => {
    const materialDefault = useAppSelector(state => state.formValues.materialLastSelected);
    const { stickerData } = useCanvas();

    const materials = stickerData?.materials?.length ? stickerData.materials : materialStore;

    const selected = materials.find(option => option.id === materialDefault);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<MaterialOptionProps | null>(selected || null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const dispatch = useDispatch();

    // Determine the number of columns and split the materials accordingly
    let columns = 1;
    if (materials.length > 8) {
        columns = 3;
    } else if (materials.length > 4) {
        columns = 2;
    }

    const materialsPerColumn = Math.ceil(materials.length / columns);
    const splitMaterials = Array.from({ length: columns }, (_, i) =>
        materials.slice(i * materialsPerColumn, (i + 1) * materialsPerColumn)
    );

    const handleOptionChange = (option: MaterialOptionProps) => {
        setIsOpen(false);
        setSelectedOption(option);

        dispatch(setMaterialLastSelected(option.id));
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

    // Determine the width of the material-option based on the number of columns
    const materialOptionWidth = columns * 300;

    return (
        <div className="lg:relative w-full" ref={dropdownRef}>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(!isOpen);
                }}
                className="mt-1 px-3.5 py-3 font-semibold bg-so-gray border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-blue-300 relative flex justify-between items-center"
            >
                {selectedOption?.label || "Select Material"}
                <span className={`transition transform ${isOpen ? 'rotate-180' : ''}`}><Image src={'/downArrow.svg'} alt='down-arrow' width={11} height={11} /></span>
            </button>
            {isOpen && (
                <div
                    className={`material-option`}
                    style={{ width: `${materialOptionWidth}px` }} // Dynamic width based on columns
                >
                    <div className={`grid grid-cols-${columns} gap-4 divide-x`}>
                        {splitMaterials.map((materialColumn, columnIndex) => (
                            <ul key={columnIndex} className="w-full">
                                <MaterialOptions materials={materialColumn} onSelectOption={handleOptionChange} />
                            </ul>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MaterialDropdown;
