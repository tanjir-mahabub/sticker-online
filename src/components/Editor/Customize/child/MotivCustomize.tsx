import { useEffect, useState } from "react";
import MotiveCategoryDropdown from "./Input/MotiveCategoryDropdown";
import { motiveStore } from "@/store/motiveStore";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { addImage, clearImages } from "@/redux/features/imagePreviewSlice";
import { persistor, RootState, useAppSelector } from "@/redux/store";
import { deleteAllHistoriesByCategory } from "@/redux/features/historySlice";
import { generateUniqueId } from "@/components/Utils/function";
import { setCategoryToRemove } from "@/redux/features/categoryToRemove";
import { generateModifiedDataURL } from "@/app/api/generateModifiedDataURL";

const MotivCustomize = () => {
    const [selectedMotiveCategory, setSelectedMotiveCategory] = useState('Populära');
    const dispatch = useDispatch();
    const imagePreviews = useAppSelector((state: RootState) => state.imagePreview.images);

    const handleMotivClick = async (icon: string) => {

        const img = new window.Image();


        img.src = icon;


        img.onload = async function () {

            const maxWidth = 200;
            const maxHeight = 200;


            let scale = 1;
            if (img.width > maxWidth || img.height > maxHeight) {
                const widthRatio = maxWidth / img.width;
                const heightRatio = maxHeight / img.height;
                scale = Math.min(widthRatio, heightRatio);
            }


            const canvas = document.createElement('canvas');


            canvas.width = img.width * scale;
            canvas.height = img.height * scale;


            const ctx = canvas.getContext('2d');

            if (ctx) {

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);


                const dataURL = canvas.toDataURL();
                const base64Image = dataURL.split(',')[1];


                const modifiedDataURL = await generateModifiedDataURL(base64Image);


                const newImage = {
                    id: generateUniqueId(),
                    src: modifiedDataURL,
                    width: canvas.width,
                    height: canvas.height,
                    scaleX: 0,
                    scaleY: 0,
                    rotate: 0,
                    status: "SD",
                    attrs: { opacity: 1, cursor: 'move' },
                    type: "motiv",
                    category: 'motiv',
                    stackNum: 0
                };


                dispatch(addImage(newImage));
            } else {
                console.error('Unable to get canvas context');
            }
        };
    };


    const handleDeleteBTN = () => {
        dispatch(setCategoryToRemove("motiv"))
        dispatch(clearImages("motiv"));
        dispatch(deleteAllHistoriesByCategory("motiv"))
        void persistor.flush();
    };

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex-auto space-y-3 h-full overflow-y-auto bg-white p-4">
                <div className="space-y-3 lg:space-y-5">
                    <h2 className="text-sm md:text-base xl:text-lg font-bold">Lägg till motiv</h2>
                    <div>
                        <label htmlFor="Kategori" className="block text-xs lg:text-sm font-bold text-gray-700">
                            Kategori
                        </label>
                        <MotiveCategoryDropdown selectedOption={selectedMotiveCategory} onChange={setSelectedMotiveCategory} />
                    </div>
                </div>

                <div className="flex flex-wrap flex-grow justify-start items-start h-fit gap-3">
                    {motiveStore.map(motiv => (
                        motiv.category === selectedMotiveCategory && motiv.icons.map((icon, idx) => (
                            <div key={idx} className="bg-so-deep-gray flex justify-center items-center w-[70px] h-16 rounded cursor-pointer hover:shadow-md border border-gray-300/70" onClick={() => handleMotivClick(icon)}>
                                <Image src={icon} width={36} height={36} alt={`icon-${idx}`} />
                            </div>
                        ))
                    ))}
                </div>
            </div>

            <div className="flex-auto flex justify-start items-center gap-1 h-[60px] bg-white border-t px-3">
                <div className="hover:bg-so-deep-gray cursor-pointer hover:shadow-lg" onClick={handleDeleteBTN}>
                    <Image src="/editor/sidebar/trash.svg" alt="trash-icon" width={18} height={18} className="w-fit h-fit border rounded-sm p-1" />
                </div>
                <p className="text-xs lg:text-sm font-semibold">Ta bort alla motiv</p>
            </div>
        </div>
    );
};

export default MotivCustomize;
