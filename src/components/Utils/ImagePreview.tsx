import Image from "next/image";
import { ImageInfo } from "@/types/types";

interface ImageProps {
    images: ImageInfo[]
}

const ImagePreview: React.FC<ImageProps> = ({ images }) => {

    // console.log(images.filter(image => image.category === 'image'));


    return (
        <div className="flex flex-wrap flex-grow justify-start items-center gap-2">
            {images?.filter(image => image.category === 'image').map((image: ImageInfo, index: number) => (
                <div key={image.id + Math.random()} className="flex-1 min-w-[100px] flex w-full justify-center items-center">
                    <Image src={image.src} alt={`Selected ${index + 1}`} width={100} height={100} className="max-w-[80px] lg:max-h-full lg:max-w-full" />
                </div>
            ))}
        </div>
    );
};

export default ImagePreview;
