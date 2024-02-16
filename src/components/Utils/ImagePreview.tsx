import Image from "next/image";
import { useAppSelector } from "@/redux/store";

const ImagePreview: React.FC = () => {

    const FileState = useAppSelector(state => state.file);

    return (
        <div className="flex flex-wrap flex-grow justify-center items-center gap-2">
            {FileState?.map((image, index) => (
                <div key={image.id + Math.random()} className="flex-1 min-w-[100px] flex w-full justify-center items-center">
                    <Image src={image.file} alt={`Selected ${index + 1}`} width={180} height={100} className="max-h-full max-w-full" />
                </div>
            ))}
        </div>
    );
};

export default ImagePreview;
