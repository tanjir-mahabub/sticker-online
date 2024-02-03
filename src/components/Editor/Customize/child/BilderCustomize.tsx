import ImageUpload from "@/components/Utils/ImageUploader";
import { useLocalStorageImages } from "@/hooks/useLocalStorageImages";
import { addedImage, serializeFile } from "@/redux/features/imageSlice";
import { AppDispatch, useAppSelector } from "@/redux/store";
import Image from "next/image";
import { useDispatch } from "react-redux";

interface SerializedFile {
    identifier: string;
    lastModified: number;
    webkitRelativePath: string;
    size: number;
    type: string;
}

const BilderCustomize = () => {
    const { setImages } = useLocalStorageImages();
    const imageDispatch = useDispatch<AppDispatch>();

    const handleImageUpload = (files: File[]) => {
        const serializedFiles: (SerializedFile | null)[] = files.map((file) =>
            serializeFile(file)
        );
        const filteredSerializedFiles: SerializedFile[] = serializedFiles.filter(
            Boolean
        ) as SerializedFile[];
        imageDispatch(addedImage(filteredSerializedFiles));
        setImages(filteredSerializedFiles);
    };

    return (
        <div className="w-full h-[100%]">
            <div className="p-4 space-y-5 h-[90%] overflow-y-auto">
                <h2 className="text-sm sm:text-lg font-bold">Ladda upp bild</h2>
                <ImageUpload onImageUpload={handleImageUpload} />
            </div>

            <div className="flex justify-start items-center gap-1 border-t-2 h-[10%] p-3">
                <Image
                    src="/editor/sidebar/trash.svg"
                    alt="trash-icon"
                    width={14}
                    height={100}
                    className="max-h-24 max-w-full"
                />
                <p className="text-sm font-semibold">Ta bort  alla  bilder</p>
            </div>
        </div>
    );
};

export default BilderCustomize;
