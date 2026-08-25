import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { upsertText, clearTexts } from "@/redux/features/textSlice"; // Adjust the import path as necessary
import ColorInput from './Input/ColorInput';
import { customizeFonts } from "@/store/customizeFontStore"; // Adjust the import path as necessary
import TextInput from './Input/TextInput';
import { persistor, useAppSelector } from "@/redux/store"; // Adjust the import path as necessary
import Image from 'next/image';
import { deleteAllHistoriesByCategory } from '@/redux/features/historySlice';
import { generateUniqueId } from '@/components/Utils/function';
import { setCategoryToRemove } from '@/redux/features/categoryToRemove';
import { useEditorI18n } from '@/context/EditorI18nContext';

const TextCustomize: React.FC = () => {
    const dispatch = useDispatch();
    const { t } = useEditorI18n();
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
        if (newTextEntry) {
            dispatch(upsertText(newTextEntry))
        }
    };

    // Implement a function to remove a text element if needed
    const handleClearTexts = () => {
        dispatch(setCategoryToRemove("text"))
        dispatch(clearTexts());
        dispatch(deleteAllHistoriesByCategory("textPath"))
        void persistor.flush();
    };

    return (
        <div className="flex flex-col w-full h-full">
            <div className='flex-auto space-y-3 h-full overflow-y-auto bg-white p-4'>
                <div className="space-y-3 lg:space-y-5">
                    <h2 className="text-sm sm:text-base lg:text-lg font-bold">{t('addText')}</h2>
                </div>

                <div className="grid grid-cols-2 xl:grid-cols-3 justify-start items-center gap-3">
                    {customizeFonts.map(customFonts => (
                        <div key={customFonts.id} className={`${selectedFont === customFonts.id ? 'border-2 border-orange-300' : 'border-gray-300/70'} bg-so-deep-gray flex justify-center items-center w-full h-20 rounded cursor-pointer hover:shadow-md border`}
                            onClick={() => setSelectedFont(customFonts.id)}
                        >
                            <p className={`${customFonts.font.className} text-lg`}>
                                {t('text')}
                            </p>
                        </div>
                    ))}
                </div>

                <div className=''>
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
                        <p className='text-xs font-bold leading-7'>{t('textColor')}</p>
                        <button onClick={toggleColorPicker} className="w-7 h-7 border border-black/30 rounded shadow" style={{ background: `${selectedColor}` }}></button>
                    </div>

                    <div>
                        <button onClick={AddText} className='bg-black text-white rounded shadow px-3 py-1'>{t('addText')}</button>
                    </div>
                </div>
            </div>



            <div className="flex-auto flex justify-start items-center gap-1 h-[60px] bg-white border-t px-3">
                <div className="hover:bg-so-deep-gray cursor-pointer hover:shadow-lg" onClick={handleClearTexts}>
                    <Image
                        src="/editor/sidebar/trash.svg"
                        alt="trash-icon"
                        width={18}
                        height={18}
                        className="w-fit h-fit border rounded-sm p-1"
                    />
                </div>
                <p className="text-xs md:text-sm font-semibold">{t('removeTexts')}</p>
            </div>
        </div>
    );
};

export default TextCustomize;
