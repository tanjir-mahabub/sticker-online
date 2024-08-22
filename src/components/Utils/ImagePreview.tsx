import Image from "next/image";
import { ImageInfo } from "@/types/types";

interface ImageProps {
    images: ImageInfo[];
}

const ImagePreview: React.FC<ImageProps> = ({ images }) => {

    const filteredImages = images.filter(image => image.category === 'image');

    return (
        <div className="grid xs:grid-cols-2 sm:grid-cols-3 gap-2 w-full">
            {filteredImages.map((image: ImageInfo) => (
                <div 
                    key={image.id} 
                    className="relative aspect-square w-full"
                >
                    {image.src && (
                        <Image
                            src={image.src}
                            alt={`Selected image ${image.id}`}
                            layout="fill" 
                            objectFit="contain" 
                            className="rounded-sm"
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default ImagePreview;
