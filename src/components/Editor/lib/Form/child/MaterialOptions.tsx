import React, { useState } from 'react';
import Image from 'next/image';

interface MaterialOption {
    label: string;
    icon: string;
}

interface MaterialOptionsProps {
    materials: MaterialOption[];
}

const MaterialOptions: React.FC<MaterialOptionsProps> = ({ materials }) => {
    const [isShowInformation, setIsShowInformation] = useState(false);

    return (
        <>
            {materials.map((option, index) => (
                <li key={index} className="py-1 font-semibold hover:bg-gray-100 cursor-pointer flex justify-start items-center">
                    <div className='w-4/12 px-1'>
                        <Image className='w-full object-contain' src={option.icon} width={100} height={100} alt={option.label} />
                    </div>
                    <div className='w-5/12'>
                        {option.label}
                    </div>
                    <div onClick={() => setIsShowInformation(true)} className='w-3/12 text-xs font-semibold underline'>
                        Mer info
                    </div>
                </li>
            ))}

            {isShowInformation && (
                <div className='absolute left-0 right-0 w-full h-full flex justify-center items-center bg-black/30 backdrop-blur-sm'>
                    <div className='w-[400px] h-auto bg-white'>
                        Card
                    </div>
                </div>
            )}
        </>
    );
};

export default MaterialOptions;
