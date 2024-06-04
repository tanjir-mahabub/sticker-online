import { FC, useEffect } from 'react';
import { Tooltip } from '@/components/Utils/ToolTips';
import Image from 'next/image';
import { useAppSelector } from '@/redux/store';

interface ButtonControlProps {
    onClick: () => void;
    iconSrc: string;
    tooltip: string;
    borderClasses?: string;
    borderRadiusClasses?: string;
    disabled?: boolean;
    disabledIconFilter?: string;
}

const ButtonControl: FC<ButtonControlProps> = ({
    onClick,
    iconSrc,
    tooltip,
    borderClasses = '',
    borderRadiusClasses = '',
    disabled,
    disabledIconFilter = 'brightness(0) invert(0.75)',
}) => {

    const canvasProperties = useAppSelector(state => state.canvas)

    const { clientWidth } = canvasProperties;  

    return (
        <Tooltip message={tooltip} direction='up'>
            <button
                type='button'
                onClick={onClick}
                disabled={disabled}
                className={`border ${borderClasses} ${borderRadiusClasses} flex justify-center items-center h-full px-1.5 py-2 hover:bg-so-deep-gray cursor-pointer`}
            >
                <Image
                    src={iconSrc}
                    width={clientWidth >= 1024 ? 20 : 14}
                    height={clientWidth >= 1024 ? 20 : 14}
                    alt="icon"
                    style={{ filter: disabled ? disabledIconFilter : 'none' }}
                />
            </button>
        </Tooltip>
    )
};

export default ButtonControl;
