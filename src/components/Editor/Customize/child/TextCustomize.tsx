import { useLocalStorage } from "@/hooks/useLocalStorage";
import { customizeFonts } from "@/store/customizeFontStore";
import { useState } from "react";

const TextCustomize = () => {

    const { data: textSelected, updateData: updatedTextSelected } = useLocalStorage('textStore');

    const handleSelectText = (id: string, name: string) => {

        const updatedLocalStorageData = {
            ...textSelected,
            selectedTextId: id,
            selectedTextName: name
        };

        updatedTextSelected(updatedLocalStorageData);
    };


    return (
        <div className="w-full">
            <div className="p-4 space-y-5 overflow-y-auto">
                <h2 className="text-sm sm:text-lg font-bold">Lägg till text</h2>
            </div>

            <div className="flex flex-wrap flex-grow justify-start items-center gap-3 p-3">
                {customizeFonts.map(customFonts => (
                    <div key={customFonts.id} className="bg-so-deep-gray flex justify-center items-center w-20 h-20 rounded cursor-pointer hover:shadow-md border border-gray-300/70"
                        onClick={() => handleSelectText(customFonts.id.toString(), customFonts.fontName)}
                    >
                        <p className={`${customFonts.font.className} text-lg`}>
                            Text
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TextCustomize