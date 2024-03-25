import ImageUpload from "@/components/Utils/ImageUploader";
import ImagePreview from "@/components/Utils/ImagePreview";
import { useDispatch, useSelector } from "react-redux";
import { addImage, clearImages } from "@/redux/features/imagePreviewSlice";
import { RootState, useAppSelector } from "@/redux/store";
import Image from "next/image";
import { generateUniqueId } from "@/components/Utils/functions";

const BilderCustomize = () => {
    const dispatch = useDispatch();

    const imagePreviews = useAppSelector((state: RootState) => state.imagePreview.images);

    const handleImageUpload = (files: File[]) => {
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {

                const imageDataUrl = event.target?.result;
                if (typeof imageDataUrl === "string") {

                    dispatch(addImage({
                        id: generateUniqueId(),
                        src: imageDataUrl,
                        category: 'image',
                    }));
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleDeleteBTN = () => {

        dispatch(clearImages("image"));
    };

    return (
        <div className="w-full h-[100%]">
            <div className="p-4 space-y-5 h-[92%] overflow-y-auto">
                <h2 className="text-sm md:text-base xl:text-lg font-bold">Ladda upp bild</h2>
                <ImageUpload onImageUpload={handleImageUpload} />
                {imagePreviews && <ImagePreview images={imagePreviews} />}
            </div>

            <div className="flex justify-start items-center gap-1 border-t-2 h-[8%] px-3">
                <div className="hover:bg-so-deep-gray cursor-pointer p-2 rounded hover:shadow-lg border" onClick={handleDeleteBTN}>
                    <Image
                        src="/editor/sidebar/trash.svg"
                        alt="trash-icon"
                        width={18}
                        height={100}
                        className="max-h-24 max-w-full w-full h-auto"
                    />
                </div>
                <p className="text-xs md:text-sm font-semibold">Ta bort alla bilder</p>
            </div>
        </div>
    );
};

export default BilderCustomize;
