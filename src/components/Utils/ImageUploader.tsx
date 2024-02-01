import Image from 'next/image';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploadProps {
    onImageUpload: (files: File[]) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const acceptedFiles = {
        'image/png': ['.png'],
        'image/jpeg': ['.jpg', '.jpeg'],
        'image/svg+xml': ['.svg', '.xml'],
        'application/pdf': ['.pdf']
    };

    const maxFileSize = 10 * 1024 * 1024; // 10 MB in bytes

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const validFiles = acceptedFiles.filter(file => file.size <= maxFileSize);

        if (validFiles.length !== acceptedFiles.length) {
            // Handle unrecognized files
            console.warn('Some files were not recognized or had invalid types.');
        }

        const newImages = validFiles.map(file => URL.createObjectURL(file));
        setSelectedImages(prevImages => [...prevImages, ...newImages]);
        onImageUpload(validFiles);
    }, [onImageUpload, maxFileSize]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: acceptedFiles,
        maxSize: maxFileSize,
    });

    return (
        <div className="space-y-5">
            <div {...getRootProps()} className="flex flex-col justify-center items-center border-2 border-dashed border-black/30 w-full h-40 space-y-3 hover:bg-so-deep-gray cursor-pointer transition">
                <div className="flex">
                    <Image src="/editor/sidebar/upload.svg" alt="logo" width={50} height={100} className="drop-shadow-lg w-fit h-fit rounded-full" />
                </div>
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p className="text-sm font-bold">Släpp bilderna här...</p>
                ) : (
                    <p className="text-sm font-bold">Lägg till eller dra filer</p>
                )}
            </div>

            <div className="text-sm">
                <p><b>Accept file types:</b> png, jpg, svg, pdf</p>
                <p><b>Max file size:</b> 10 MB</p>
            </div>

            <div className="flex flex-wrap flex-grow justify-center items-center gap-2">
                {selectedImages.map((image, index) => (
                    <div key={index} className="flex-1 min-w-[100px] flex w-full justify-center items-center">
                        <Image src={image} alt={`Selected ${index + 1}`} width={180} height={100} className="max-h-full max-w-full" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageUpload;
