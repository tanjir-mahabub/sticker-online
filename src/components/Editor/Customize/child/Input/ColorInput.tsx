import { Sketch } from '@uiw/react-color';
import React, { useState } from 'react';

const ColorInput: React.FC = () => {
    const [hex, setHex] = useState("#ffffff");

    return (
        <>
            <div className="flex flex-col gap-10">
                <div>
                    <Sketch
                        className=''
                        style={{ width: '100%' }}
                        color={hex}
                        onChange={(color) => {
                            setHex(color.hex);
                        }}
                    />
                </div>
                <div className='flex flex-col gap-3'>
                    <p className='text-sm 3xl:text-sm font-bold text-so-black'>Färgkod (Hex)</p>
                    <p className="bg-so-deep-gray font-bold px-3 py-2 border rounded">{hex}</p>
                </div>
            </div>
        </>
    )
};

export default ColorInput;