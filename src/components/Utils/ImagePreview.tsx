import Image from "next/image";
import { useEffect, useState } from "react";
import { useImageStorage } from "@/hooks/useImageStorage"; // Update the import path
import { useDispatch } from "react-redux";
import { setCanvasProperties } from "@/redux/features/canvasSlice";

interface ImagePreviewProps {
    files: string[];
    isImageDeleted: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ files, isImageDeleted }) => {
    const { data: previewImages } = useImageStorage('imageStore');
    const [images, setImages] = useState<string[]>([]);

    const dispatch = useDispatch();


    useEffect(() => {
        setImages(previewImages)
        files && setImages(prevImg => [...prevImg, ...files])
        isImageDeleted && setImages([])
    }, [previewImages, files, isImageDeleted, dispatch]);

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
