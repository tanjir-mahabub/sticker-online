import { useEffect, useState } from "react";
import MotiveCategoryDropdown from "./Input/MotiveCategoryDropdown";
import { motiveStore } from "@/store/motiveStore";
import Image from "next/image";
import { useImageStorage } from "@/hooks/useImageStorage";
import { useDispatch } from "react-redux";
import { addMotiv, deleteAllMotiv } from "@/redux/features/motivSlice";
import { addFiles, deleteAllFiles } from "@/redux/features/fileUploadSlice";
import { useAppSelector } from "@/redux/store";
import { addImage, clearImages } from "@/redux/features/imagePreviewSlice";
import { generateUniqueId } from "@/components/Utils/functions";

const MotivCustomize = () => {
    const [MotivDeleted, setMotivDeleted] = useState(false);

    const [selectedMotiv, setSelectedMotive] = useState('');

    const { data: previewImages, updateData: updatePreviewImages } = useImageStorage('imageStore');

    const [selectedMotiveCategory, setSelectedMotiveCategory] = useState('Populära');

    const dispatch = useDispatch();

    const imagePreviews = useAppSelector(state => state.imagePreview);
    const FileState = useAppSelector(state => state.file)

    const imageUrlToDataURL = async (imageUrl: string): Promise<string> => {
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                // Use a type assertion here to inform TypeScript that reader.result is expected to be a string.
                const result = reader.result;
                if (typeof result === 'string') {
                    resolve(result);
                } else {
                    reject('Failed to convert blob to data URL');
                }
            };
            reader.onerror = error => reject(error);
            reader.readAsDataURL(blob);
        });
    };

    const handleMotivClick = async (icon: string) => {
        try {
            const dataUrl = await imageUrlToDataURL(icon);
            dispatch(deleteAllFiles())
            dispatch(addFiles([dataUrl]));

        } catch (error) {
            console.error('Error converting image to data URL:', error);
        }
    }


    const handleDeleteBTN = () => {
        dispatch(deleteAllFiles())
        updatePreviewImages(previewImages.filter((img) => img.category !== 'motiv'));
        dispatch(clearImages("motiv"));

    }

    useEffect(() => {
        FileState?.map(image => {
            dispatch(deleteAllFiles())

            dispatch(addImage({
                id: image.id,
                src: image.src,
                category: 'motiv'
            }))
        });
    })



    return (
        <div className="h-full">
            <div className="w-full h-[90%]">
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
                    {motiveStore.map(motiv => {
                        if (motiv.category == selectedMotiveCategory) {
                            return motiv.icons.map((icon, idx) => (
                                <div key={idx} className="bg-so-deep-gray flex justify-center items-center w-20 h-20 rounded cursor-pointer hover:shadow-md border border-gray-300/70" onClick={() => handleMotivClick(icon)}>
                                    <div>
                                        <Image src={icon} width={42} height={42} alt={`icon-${idx}`} />
                                    </div>
                                </div>

                            ))
                        }
                    })}
                </div>
            </div>

            <div className="flex justify-start items-center gap-1 border-t-2 h-[10%] p-3">
                <div className="hover:bg-so-deep-gray cursor-pointer p-2 rounded hover:shadow-lg border" onClick={handleDeleteBTN}>
                    <Image
                        src="/editor/sidebar/trash.svg"
                        alt="trash-icon"
                        width={18}
                        height={100}
                        className="max-h-24 max-w-full w-full h-auto"
                    />
                </div>
                <p className="text-xs lg:text-sm font-semibold">Ta bort  alla  motiv</p>
            </div>
        </div>
    )
}

export default MotivCustomize