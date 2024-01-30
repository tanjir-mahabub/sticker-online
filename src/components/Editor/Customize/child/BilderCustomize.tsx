import ImageUpload from "@/components/Utils/ImageUploader";
import Image from "next/image";

const BilderCustomize = () => {
    const handleImageUpload = (files: File[]) => {
        console.log('Uploaded files:', files);
    };

    return (
        <div className="w-full h-[100%]">
            <div className="p-3 space-y-5 h-[90%] overflow-y-auto">
                <h2 className="text-sm sm:text-lg font-bold">Ladda upp bild</h2>
                <ImageUpload onImageUpload={handleImageUpload} />
            </div>

            <div className="flex justify-start items-center gap-1 border-t-2 h-[10%] px-3">
                <Image src="/editor/sidebar/trash.svg" alt="trash-icon" width={14} height={100} className="max-h-24 max-w-full" />
                <p className="text-sm font-semibold">Ta bort  alla  bilder</p>
            </div>
        </div>
    );
}

export default BilderCustomize;
