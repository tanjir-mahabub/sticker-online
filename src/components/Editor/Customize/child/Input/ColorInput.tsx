import { Sketch } from '@uiw/react-color';
import React, { useState } from 'react';

const ColorInput: React.FC = () => {
    const [hex, setHex] = useState("#fff");

    return (
        <>
            <Sketch
                className=''
                style={{ width: '100%' }}
                color={hex}
                onChange={(color) => {
                    setHex(color.hex);
                }}
            />
            <p className="font-bold py-3">{hex}</p>
        </>
    )
};

export default ColorInput;