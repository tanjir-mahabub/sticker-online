import { useState } from "react";
import MotiveCategoryDropdown from "./Input/MotiveCategoryDropdown";
import { motiveStore } from "@/store/motiveStore";
import Image from "next/image";

const MotivCustomize = () => {
    const [selectedMotiveCategory, setSelectedMotiveCategory] = useState('Populära');

    console.log(selectedMotiveCategory);

    return (

        <div className="w-full">
            <div className="p-4 space-y-5 overflow-y-auto">
                <h2 className="text-sm sm:text-lg font-bold">Lägg till motiv</h2>
                <div>
                    <label htmlFor="Kategori" className="block text-sm font-bold text-gray-700">
                        Kategori
                    </label>
                    <MotiveCategoryDropdown selectedOption={selectedMotiveCategory} onChange={setSelectedMotiveCategory} />
                </div>
            </div>

            <div className="flex flex-wrap flex-grow justify-start items-center gap-3 p-3">
                {motiveStore.map(motiv => {
                    if (motiv.category == selectedMotiveCategory) {
                        return motiv.icons.map((icon, idx) => (
                            <div key={idx} className="bg-so-deep-gray flex justify-center items-center w-20 h-20 rounded cursor-pointer hover:shadow-md border border-gray-300/70">
                                <div>
                                    <Image src={icon} width={42} height={42} alt={`icon-${idx}`} />
                                </div>
                            </div>

                        ))
                    }
                })}
            </div>
        </div>
    )
}

export default MotivCustomize