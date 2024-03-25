import { useEffect, useState } from "react";
import MotiveCategoryDropdown from "./Input/MotiveCategoryDropdown";
import { motiveStore } from "@/store/motiveStore";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { addImage, clearImages } from "@/redux/features/imagePreviewSlice";
import { RootState, useAppSelector } from "@/redux/store";
import { generateUniqueId } from "@/components/Utils/functions";

const MotivCustomize = () => {
    const [selectedMotiveCategory, setSelectedMotiveCategory] = useState('Populära');
    const dispatch = useDispatch();
    const imagePreviews = useAppSelector((state: RootState) => state.imagePreview.images);

    const handleMotivClick = async (icon: string) => {

        const newImage = {
            id: generateUniqueId(),
            src: icon,
            category: 'motiv',
        };
        dispatch(addImage(newImage));
    };

    const handleDeleteBTN = () => {

        dispatch(clearImages("motiv"));
    };

    return (
        <div className="h-full">
            <div className="w-full h-[92%]">
                <div className="p-4 space-y-3 lg:space-y-5 overflow-y-auto">
                    <h2 className="text-sm md:text-base xl:text-lg font-bold">Lägg till motiv</h2>
                    <div>
                        <label htmlFor="Kategori" className="block text-xs lg:text-sm font-bold text-gray-700">
                            Kategori
                        </label>
                        <MotiveCategoryDropdown selectedOption={selectedMotiveCategory} onChange={setSelectedMotiveCategory} />
                    </div>
                </div>

                <div className="flex flex-wrap flex-grow justify-start items-center gap-3 px-3">
                    {motiveStore.map(motiv => (
                        motiv.category === selectedMotiveCategory && motiv.icons.map((icon, idx) => (
                            <div key={idx} className="bg-so-deep-gray flex justify-center items-center w-20 h-20 rounded cursor-pointer hover:shadow-md border border-gray-300/70" onClick={() => handleMotivClick(icon)}>
                                <Image src={icon} width={42} height={42} alt={`icon-${idx}`} />
                            </div>
                        ))
                    ))}
                </div>
            </div>

            <div className="flex justify-start items-center gap-1 border-t-2 h-[8%] p-3">
                <div className="hover:bg-so-deep-gray cursor-pointer p-2 rounded hover:shadow-lg border" onClick={handleDeleteBTN}>
                    <Image src="/editor/sidebar/trash.svg" alt="trash-icon" width={18} height={100} className="max-h-24 max-w-full w-full h-auto" />
                </div>
                <p className="text-xs lg:text-sm font-semibold">Ta bort alla motiv</p>
            </div>
        </div>
    );
};

export default MotivCustomize;
