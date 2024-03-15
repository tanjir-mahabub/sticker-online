import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setTextValue } from "@/redux/features/textSlice"; // Adjust the path as necessary
import ColorInput from './Input/ColorInput';
import { customizeFonts } from "@/store/customizeFontStore"; // Adjust the path as necessary
import TextInput from './Input/TextInput';
import { useTextStorage } from '@/hooks/useTextStorage';
import { generateUniqueId } from '@/components/Utils/functions';


const TextCustomize: React.FC = () => {
    const { data: previewText, updateData: updatedTextPreview } = useTextStorage('textStore');

    const [isColorPickerVisible, setIsColorPickerVisible] = useState<boolean>(false);
    const [selectedColor, setSelectedColor] = useState<string>("#000000");

    const [selectedFont, setSelectedFont] = useState(1);
    const [text, setText] = useState('Sample Text');
    const [fontSize, setFontSize] = useState(24);


    const handleTextChange = (newValue: string) => {
        setText(newValue);
    };

    const handleFontSizeChange = (newSize: number) => {
        setFontSize(newSize);
    };

    const dispatch = useDispatch();

    const toggleColorPicker = () => setIsColorPickerVisible(!isColorPickerVisible);

    const AddText = () => {
        const newID = generateUniqueId();
        let startX = 100;
        let startY = 100;
        const gap = 20;


        if (previewText && previewText.length > 0) {

            const lastText = previewText[previewText.length - 1];
            startX = lastText.x;
            startY = lastText.y + lastText.fontSize + gap;
        }

        const newTextEntry = {
            id: newID,
            x: startX,
            y: startY,
            fontID: selectedFont,
            fontFamily: customizeFonts.find(font => font.id === selectedFont)?.fontName || '',
            text: text,
            fontSize: fontSize,
            fill: selectedColor
        };
        dispatch(setTextValue(newTextEntry));
        updatedTextPreview(newTextEntry);
    };


    return (
        <div onClick={() => isColorPickerVisible && setIsColorPickerVisible(false)} className="w-full h-full overflow-auto pb-10">
            <div className="p-4 space-y-5 overflow-y-auto">
                <h2 className="text-sm sm:text-lg font-bold">Lägg till text</h2>
            </div>

            <div className="flex flex-wrap flex-grow justify-start items-center gap-3 p-3">
                {customizeFonts.map(customFonts => (
                    <div key={customFonts.id} className={`${selectedFont === customFonts.id ? 'border-2 border-orange-300' : 'border-gray-300/70'} bg-so-deep-gray flex justify-center items-center w-20 h-20 rounded cursor-pointer hover:shadow-md border`}
                        onClick={() => setSelectedFont(customFonts.id)}
                    >
                        <p className={`${customFonts.font.className} text-lg`}>
                            Text
                        </p>
                    </div>
                ))}
            </div>

            <div className='px-3 pt-3'>
                <div>
                    <TextInput
                        value={text}
                        fontSize={fontSize}
                        onChange={handleTextChange}
                        onFontSizeChange={handleFontSizeChange}
                    />
                </div>
                <div className='relative flex gap-2 py-5'>
                    {isColorPickerVisible && (
                        <div className='absolute left-0 bottom-[75px]'>
                            <ColorInput
                                sketch
                                defaultColor={selectedColor}
                                onColorChange={setSelectedColor}
                                styles={{
                                    width: '90%',
                                    margin: 'auto',
                                    // padding: '10px 5px 5px 5px',
                                    borderRadius: '3px'
                                }}
                            />
                        </div>
                    )}
                    <p className='leading-7'>Text Color</p>
                    <button onClick={toggleColorPicker} className="w-7 h-7 border border-black/30 rounded shadow" style={{ background: `${selectedColor}` }}></button>
                </div>

                <div>
                    <button onClick={AddText} className='bg-black text-white rounded shadow px-3 py-1'>Add Text</button>
                </div>
            </div>


        </div>
    );
};

export default TextCustomize;
