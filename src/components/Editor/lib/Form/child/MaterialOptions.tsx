import React from 'react';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { showPopup } from '@/redux/features/popupSlice';
import AnimateIn from '@/lib/AnimateIn';
import { MaterialOptionProps } from '@/types/types';
import { useAppSelector } from '@/redux/store';
import { useEditorI18n } from '@/context/EditorI18nContext';

interface MaterialOptionsProps {
    materials: MaterialOptionProps[];
    onSelectOption: (option: MaterialOptionProps) => void;
}

const MaterialOptions: React.FC<MaterialOptionsProps> = ({ materials, onSelectOption }) => {
    const canvasProperties = useAppSelector(state => state.canvas);
    const { t } = useEditorI18n();

    const dispatch = useDispatch();

    const handleOptionClick = (option: MaterialOptionProps) => {
        onSelectOption(option);
    };

    const swatchFor = (option: MaterialOptionProps): React.CSSProperties => {
        if (option.value === 'color') return { background: canvasProperties.backgroundColor };
        const backgrounds: Record<string, string> = {
            'matte-white': '#f8fafc', 'kraft-paper': 'linear-gradient(135deg,#d4b483,#b98b55)', neon: '#dfff00',
            clear: 'linear-gradient(45deg,#fff 25%,#e5e7eb 25%,#e5e7eb 50%,#fff 50%,#fff 75%,#e5e7eb 75%)',
            mirror: 'linear-gradient(135deg,#f8fafc,#94a3b8,#fff)', 'pixie-dust': 'linear-gradient(135deg,#f5d0fe,#c4b5fd,#fce7f3)',
            prismatic: 'linear-gradient(135deg,#a7f3d0,#bfdbfe,#f5d0fe)', 'brushed-alloy': 'linear-gradient(90deg,#94a3b8,#f8fafc,#94a3b8)'
        };
        return { background: backgrounds[option.value] || '#f4f4f5', backgroundSize: option.value === 'clear' ? '12px 12px' : undefined };
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
                    <li key={index} className="material-option-card" onClick={() => handleOptionClick(option)}>
                        <div className='material-option-preview'>
                            {option.icon ? (
                                <Image className='w-full h-full object-cover' src={option.icon} width={72} height={72} alt={option.label} />
                            ) : (
                                <div className='material-option-swatch' style={swatchFor(option)} />
                            )}
                        </div>
                        <div className='material-option-copy'>
                            <strong>{option.value === "color" ? t('color') : option.label}</strong>
                            <small>{option.value === 'color' ? canvasProperties.backgroundColor.toUpperCase() : option.value.replaceAll('-', ' ')}</small>
                        </div>
                        <button type="button" onClick={(event) => { event.stopPropagation(); dispatch(showPopup({
                            title: option.popup.title,
                            imgSrc: option.popup.imgSrc,
                            content: option.popup.content
                        })); }} className='material-option-info'>
                            {t('moreInfo')}
                        </button>
                    </li>
                </AnimateIn>
            ))}
        </>
    );
};

export default MaterialOptions;
