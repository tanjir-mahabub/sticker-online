import React from 'react';
import { fabric } from 'fabric';
import { ImageInfo } from '@/types/types';

interface LoadImageProps {
  canvasRef: React.MutableRefObject<fabric.Canvas | null>;
  images: ImageInfo[];
  saveState: () => void;
}

const LoadImage: React.FC<LoadImageProps> = ({ canvasRef, images, saveState }) => {
  const loadImages = () => {
    if (canvasRef.current) {
      images.forEach(image => {
        fabric.Image.fromURL(image.src, (oImg) => {
          oImg.set({
            left: Math.random() * 400,
            top: Math.random() * 400,
            width: image.width,
            height: image.height,
            angle: 0,
            opacity: 1,
            scaleX: 1,
            scaleY: 1,
            crossOrigin: 'anonymous',
          });
          canvasRef.current?.add(oImg);
          //saveState(); // Save state after adding each image
        });
      });
    }
  };

  return <button onClick={loadImages}>Load Images</button>;
};

export default LoadImage;
