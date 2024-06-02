import ImageUpload from "@/components/Utils/ImageUploader";
import ImagePreview from "@/components/Utils/ImagePreview";
import { useDispatch } from "react-redux";
import { addImage, clearImages } from "@/redux/features/imagePreviewSlice";
import { RootState, useAppSelector } from "@/redux/store";
import Image from "next/image";
import { deleteAllHistoriesByCategory } from "@/redux/features/historySlice";
import { generateUniqueId } from "@/components/Utils/vectorFunction";
import { setCategoryToRemove } from "@/redux/features/categoryToRemove";

const BilderCustomize = () => {
    const dispatch = useDispatch();

    const CanvasProperties = useAppSelector(state => state.canvas);    

    const imagePreviews = useAppSelector((state: RootState) => state.imagePreview.images);

    const handleImageUpload = (files: File[]) => {
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
                const imageDataUrl = event.target?.result;
                if (typeof imageDataUrl === "string") {
                    const image = new window.Image();
                    image.onload = () => {
                        const width = image.naturalWidth;
                        const height = image.naturalHeight;                        
                        
                        let status = "";
                        if (width >= 1920 && height >= 1080) {
                            status = "HD";
                        } else if (width >= 1280 && height >= 720) {
                            status = "SD";
                        } else {
                            status = "Low";
                        }

                        dispatch(addImage({
                            id: generateUniqueId(),
                            src: imageDataUrl,
                            width: width,
                            height: height,                            
                            category: 'image',
                            status: status
                        }));
                    };
                    image.src = imageDataUrl;
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleDeleteBTN = () => {
        dispatch(setCategoryToRemove("image"))
        dispatch(clearImages("image"));
        dispatch(deleteAllHistoriesByCategory("image"))
    };

    return (
        <div className="w-full h-[85%] lg:h-full">
            <div className="px-3 py-3 lg:pb-5 lg:p-4 space-y-5 h-full overflow-y-auto">
                <h2 className="text-sm md:text-base xl:text-lg font-bold">Ladda upp bild</h2>
                <ImageUpload onImageUpload={handleImageUpload} />
                {imagePreviews && <ImagePreview images={imagePreviews} />}
            </div>

            <div className="flex justify-start items-center gap-1 border-t-2 h-auto lg:h-[8%] p-3">
                <div className="hover:bg-so-deep-gray cursor-pointer hover:shadow-lg" onClick={handleDeleteBTN}>
                    <Image
                        src="/editor/sidebar/trash.svg"
                        alt="trash-icon"
                        width={18}
                        height={100}
                        className="w-full h-full border rounded-sm p-2"
                        priority
                    />
                </div>
                <p className="text-xs md:text-sm font-semibold">Ta bort alla bilder</p>
            </div>
        </div>
    );
};

export default BilderCustomize;
