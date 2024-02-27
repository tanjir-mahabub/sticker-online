import { useState } from "react";
import MotiveCategoryDropdown from "./Input/MotiveCategoryDropdown";
import { motiveStore } from "@/store/motiveStore";
import Image from "next/image";
import { useImageStorage } from "@/hooks/useImageStorage";
import { useDispatch } from "react-redux";
import { addMotiv, deleteAllMotiv } from "@/redux/features/motivSlice";

const MotivCustomize = () => {
    const [MotivDeleted, setMotivDeleted] = useState(false);

    const { data: previewMotives, updateData: updatePreviewMotives } = useImageStorage('motivStore');

    const [selectedMotiveCategory, setSelectedMotiveCategory] = useState('Populära');

    const dispatch = useDispatch();

    // Function to convert image URL to data URL
    const imageUrlToDataURL = async (imageUrl: string) => {
        // Fetch the image as a blob
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        // Convert blob to data URL
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const imageData = reader.result as string;
                resolve(imageData);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };


    const handleMotivClick = (icon: string) => {

        // Example usage
        imageUrlToDataURL(icon)
            .then((dataUrl) => {
                console.log('Data URL:', dataUrl);
                const newImageStore: any = [...previewMotives, dataUrl];
                dispatch(addMotiv(newImageStore));
            })
            .catch((error) => {
                console.error('Error converting image to data URL:', error);
            });
    }

    const handleDeleteBTN = () => {
        dispatch(deleteAllMotiv());
        setMotivDeleted(true);
    }

    return (
        <div className="h-full">
            <div className="w-full h-[90%]">
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
                <p className="text-sm font-semibold">Ta bort  alla  motiv</p>
            </div>
        </div>
    )
}

export default MotivCustomize