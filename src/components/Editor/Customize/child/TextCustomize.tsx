import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { upsertText, removeText, clearTexts } from "@/redux/features/textSlice"; // Adjust the import path as necessary
import ColorInput from './Input/ColorInput';
import { customizeFonts } from "@/store/customizeFontStore"; // Adjust the import path as necessary
import TextInput from './Input/TextInput';
import { generateUniqueId } from '@/components/Utils/functions';
import { useAppSelector } from "@/redux/store"; // Adjust the import path as necessary
import Image from 'next/image';
import { deleteAllHistoriesByCategory } from '@/redux/features/historySlice';

const TextCustomize: React.FC = () => {
    const dispatch = useDispatch();
    // Use useAppSelector to get texts from the state
    const texts = useAppSelector((state) => state.text.texts);

    const [isColorPickerVisible, setIsColorPickerVisible] = useState<boolean>(false);
    const [selectedColor, setSelectedColor] = useState<string>("#000000");
    const [selectedFont, setSelectedFont] = useState<number>(1);
    const [text, setText] = useState<string>('Sample Text');
    const [fontSize, setFontSize] = useState<number>(24);

    const handleTextChange = (newValue: string) => setText(newValue);

    const handleFontSizeChange = (newSize: number) => setFontSize(newSize);

    const toggleColorPicker = () => setIsColorPickerVisible(!isColorPickerVisible);

    const AddText = () => {
        const newID = generateUniqueId();
        let startX = 200;
        let startY = 100;
        const gap = 20;

        // Calculating the starting position based on the last text element
        // if (texts.length > 0) {
        //     const lastText = texts[texts.length - 1];
        //     startX = lastText.x;
        //     startY = lastText.y + lastText.fontSize + gap;
        // }

        const newTextEntry = {
            id: newID,
            x: startX,
            y: startY,
            fontID: selectedFont,
            fontFamily: customizeFonts.find(font => font.id === selectedFont)?.fontName || '',
            text: text,
            type: 'text',
            category: 'text',
            fontSize: fontSize,
            fill: selectedColor,
            rotation: 0, // Add default rotation if necessary
            scaleX: 1, // Add default scale if necessary
            scaleY: 1, // Add default scale if necessary
        };

        // Dispatch the upsertText action to add or update the text in the store
        newTextEntry && dispatch(upsertText(newTextEntry));
    };

    // Implement a function to remove a text element if needed
    const handleClearTexts = () => {
        dispatch(clearTexts());
        dispatch(deleteAllHistoriesByCategory("text"))
    };

    return (
        <div className="w-full h-full">
            <div className='w-full h-[92%] overflow-auto pb-10'>
                <div className="p-4 space-y-5 overflow-y-auto">
                    <h2 className="text-sm sm:text-base lg:text-lg font-bold">Lägg till text</h2>
                </div>

                <div className="grid grid-cols-2 xl:grid-cols-3 justify-start items-center gap-3 px-3">
                    {customizeFonts.map(customFonts => (
                        <div key={customFonts.id} className={`${selectedFont === customFonts.id ? 'border-2 border-orange-300' : 'border-gray-300/70'} bg-so-deep-gray flex justify-center items-center w-full h-20 rounded cursor-pointer hover:shadow-md border`}
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
                    <div className='relative flex gap-2 py-5 z-10'>
                        {isColorPickerVisible && (
                            <div className='absolute left-0 bottom-[75px] z-20'>
                                <ColorInput
                                    sketch
                                    type="Text"
                                    onColorChange={setSelectedColor}
                                    styles={{
                                        width: '100%',
                                        margin: 'auto',
                                        // padding: '10px 5px 5px 5px',
                                        borderRadius: '3px'
                                    }}
                                />
                            </div>
                        )}
                        <p className='text-xs font-bold leading-7'>Color</p>
                        <button onClick={toggleColorPicker} className="w-7 h-7 border border-black/30 rounded shadow" style={{ background: `${selectedColor}` }}></button>
                    </div>

                    <div>
                        <button onClick={AddText} className='bg-black text-white rounded shadow px-3 py-1'>Add Text</button>
                    </div>
                </div>
            </div>


            <div className="flex justify-start items-center gap-1 border-t-2 h-[8%] px-3">
                <div className="hover:bg-so-deep-gray h-fit cursor-pointer p-2 rounded hover:shadow-lg border" onClick={handleClearTexts}>
                    <Image
                        src="/editor/sidebar/trash.svg"
                        alt="trash-icon"
                        width={18}
                        height={18}
                        className="max-h-24 max-w-full w-full h-auto"
                    />
                </div>
                <p className="text-xs md:text-sm font-semibold">Ta bort alla bilder</p>
            </div>

        </div>
    );
};

export default TextCustomize;
