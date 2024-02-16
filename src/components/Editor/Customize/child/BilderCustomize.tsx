import ImageUpload from "@/components/Utils/ImageUploader";
import { useImageStorage } from "@/hooks/useImageStorage";
import Image from "next/image";
import { useState } from "react";

const BilderCustomize = () => {
    const [ImageDeleted, setImageDeleted] = useState(false);
    const { data: previewImages, updateData: updatePreviewImages } = useImageStorage('imageStore');

    const handleImageUpload = (files: File[]) => {

        const imagesData = files.map(file => {
            return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const imageData = event.target?.result as string;
                    resolve(imageData);
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(imagesData).then((imageDataArray) => {
            const newImageStore = [...previewImages, ...imageDataArray];
            updatePreviewImages(newImageStore);
        });

    };

    const handleDeleteBTN = () => {
        updatePreviewImages([]);
        setImageDeleted(true);
    }

    // useEffect(() => {

    //     dispatch(setCanvasProperties({ canvasUpdated: true }))
    //     // console.log('uploaded');

    //     return () => {
    //         dispatch(setCanvasProperties({ canvasUpdated: false }))
    //         // console.log('uploaded return');
    //     };
    // });

    return (
        <div className="w-full h-[100%]">
            <div className="p-4 space-y-5 h-[90%] overflow-y-auto">
                <h2 className="text-sm sm:text-lg font-bold">Ladda upp bild</h2>
                <ImageUpload onImageUpload={handleImageUpload} isImageDeleted={ImageDeleted} />
            </div>

            <div className="flex justify-start items-center gap-1 border-t-2 h-[10%] p-3">
                <div className="hover:bg-so-deep-gray cursor-pointer p-2 rounded hover:shadow-lg border" onClick={handleDeleteBTN}>
                    <Image
                        src="/editor/sidebar/trash.svg"
                        alt="trash-icon"
                        width={18}
                        height={100}
                        className="max-h-24 max-w-full"
                    />
                </div>
                <p className="text-sm font-semibold">Ta bort  alla  bilder</p>
            </div>
        </div>
    );
};

export default BilderCustomize;
