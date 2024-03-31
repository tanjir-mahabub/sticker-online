import { FC } from 'react';
import { Tooltip } from '@/components/Utils/ToolTips';
import Image from 'next/image';

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
    disabled = false,
    disabledIconFilter = 'brightness(0) invert(0.5)',
}) => (
    <Tooltip message={tooltip}>
        <button
            type='button'
            onClick={onClick}
            disabled={disabled}
            className={`border ${borderClasses} ${borderRadiusClasses} flex justify-center items-center h-full px-1.5 py-2 hover:bg-so-deep-gray cursor-pointer`}
        >
            <Image
                src={iconSrc}
                width="20"
                height="20"
                alt="icon"
                style={{ filter: disabled ? disabledIconFilter : 'none' }}
            />
        </button>
    </Tooltip>
);

export default ButtonControl;
