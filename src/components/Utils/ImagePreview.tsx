import Image from "next/image";
import { useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage"; // Update the import path

interface ImagePreviewProps {
    files: string[];
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ files }) => {
    const { data: previewImages } = useLocalStorage('imageStore');
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        setImages(previewImages)
        files && setImages(prevImg => [...prevImg, ...files])
    }, [previewImages, files]);

    return (
        <div className="flex flex-wrap flex-grow justify-center items-center gap-2">
            {images.map((image, index) => (
                <div key={index} className="flex-1 min-w-[100px] flex w-full justify-center items-center">
                    <Image src={image} alt={`Selected ${index + 1}`} width={180} height={100} className="max-h-full max-w-full" />
                </div>
            ))}
        </div>
    );
};

export default ImagePreview;
