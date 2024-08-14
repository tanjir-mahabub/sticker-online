import React from 'react';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { showPopup } from '@/redux/features/popupSlice';
import AnimateIn from '@/lib/AnimateIn';
import { MaterialOptionProps } from '@/types/types';

interface MaterialOptionsProps {
    materials: MaterialOptionProps[];
    onSelectOption: (option: MaterialOptionProps) => void;
}

const MaterialOptions: React.FC<MaterialOptionsProps> = ({ materials, onSelectOption }) => {
    const dispatch = useDispatch();

    const handleOptionClick = (option: MaterialOptionProps) => {
        onSelectOption(option);
    };

    return (
        <>
            {materials.map((option, index) => (
                <AnimateIn
                    key={index}
                    from="opacity-50 translate-y-80"
                    to="opacity-100 translate-y-0 translate-x-0"
                    delay={50 * index}
                    duration={700}>
                    <li key={index} className="lg:py-1 font-bold hover:bg-gray-100 cursor-pointer flex justify-start items-center" onClick={() => handleOptionClick(option)}>
                        <div className='w-4/12 px-1'>
                            <Image className='w-fit object-contain h-20 lg:h-full' src={option.icon} width={100} height={100} alt={option.label} />
                        </div>
                        <div className='w-5/12'>
                            {option.label}
                        </div>
                        <div onClick={() => dispatch(showPopup({
                            title: option.popup.title,
                            imgSrc: option.popup.imgSrc,
                            content: option.popup.content
                        }))} className='w-3/12 text-xs font-semibold underline'>
                            Mer info
                        </div>
                    </li>
                </AnimateIn>
            ))}
        </>
    );
};

export default MaterialOptions;
