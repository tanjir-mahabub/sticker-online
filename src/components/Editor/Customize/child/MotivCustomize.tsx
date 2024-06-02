import { useEffect, useState } from "react";
import MotiveCategoryDropdown from "./Input/MotiveCategoryDropdown";
import { motiveStore } from "@/store/motiveStore";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { addImage, clearImages } from "@/redux/features/imagePreviewSlice";
import { RootState, useAppSelector } from "@/redux/store";
import { deleteAllHistoriesByCategory } from "@/redux/features/historySlice";
import { generateUniqueId } from "@/components/Utils/vectorFunction";

const MotivCustomize = () => {
    const [selectedMotiveCategory, setSelectedMotiveCategory] = useState('Populära');
    const dispatch = useDispatch();
    const imagePreviews = useAppSelector((state: RootState) => state.imagePreview.images);

    const handleMotivClick = async (icon: string) => {
        // Create a new image element
        const img = new window.Image();

        // Set the source of the image to the icon URL
        img.src = icon;

        // Once the image has loaded, draw it onto a canvas
        img.onload = function () {
            // Create a canvas element
            const canvas = document.createElement('canvas');

            // Set the canvas dimensions
            canvas.width = img.width;
            canvas.height = img.height;

            // Get the canvas context
            const ctx = canvas.getContext('2d');

            // Check if the canvas context is available
            if (ctx) {
                // Draw the image onto the canvas
                ctx.drawImage(img, 0, 0);

                // Convert the canvas content to a data URL
                const dataURL = canvas.toDataURL();

                // Create a new image object with the data URL
                const newImage = {
                    id: generateUniqueId(),
                    src: dataURL,
                    category: 'motiv',
                };

                // Dispatch the new image to the store
                dispatch(addImage(newImage));
            } else {
                console.error('Unable to get canvas context');
            }
        };
    };


    const handleDeleteBTN = () => {

        dispatch(clearImages("motiv"));
        dispatch(deleteAllHistoriesByCategory("motiv"))
    };

    return (
        <div className="w-full h-[90%] lg:h-full">
            <div className="w-full h-[92%] overflow-auto">
                <div className="px-3 py-3 lg:p-4 space-y-3 lg:space-y-5 overflow-y-auto">
                    <h2 className="text-sm md:text-base xl:text-lg font-bold">Lägg till motiv</h2>
                    <div>
                        <label htmlFor="Kategori" className="block text-xs lg:text-sm font-bold text-gray-700">
                            Kategori
                        </label>
                        <MotiveCategoryDropdown selectedOption={selectedMotiveCategory} onChange={setSelectedMotiveCategory} />
                    </div>
                </div>

                <div className="flex flex-wrap flex-grow justify-start items-center gap-3 px-3 pb-3">
                    {motiveStore.map(motiv => (
                        motiv.category === selectedMotiveCategory && motiv.icons.map((icon, idx) => (
                            <div key={idx} className="bg-so-deep-gray flex justify-center items-center w-[70px] h-16 rounded cursor-pointer hover:shadow-md border border-gray-300/70" onClick={() => handleMotivClick(icon)}>
                                <Image src={icon} width={36} height={36} alt={`icon-${idx}`} />
                            </div>
                        ))
                    ))}
                </div>
            </div>

            <div className="flex justify-start items-center gap-1 border-t-2 h-auto lg:h-[8%] p-3">
                <div className="hover:bg-so-deep-gray cursor-pointer hover:shadow-lg"  onClick={handleDeleteBTN}>
                    <Image src="/editor/sidebar/trash.svg" alt="trash-icon" width={18} height={100} className="w-full h-full border rounded-sm p-2" />
                </div>
                <p className="text-xs lg:text-sm font-semibold">Ta bort alla motiv</p>
            </div>
        </div>
    );
};

export default MotivCustomize;
