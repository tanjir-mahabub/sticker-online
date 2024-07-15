import React, { useEffect } from 'react';
import { fabric } from 'fabric';
import { ImageInfo } from '@/types/types';
import { findObjectById } from './eventHandlers/canvasFunctions';
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { setCategoryToRemove } from '@/redux/features/categoryToRemove';
import { adjustViewportToElement } from './eventHandlers/adjustViewportToElement';

interface ImageComponentProps {
  fabricCanvas: React.MutableRefObject<fabric.Canvas | null>;
  images: ImageInfo[];
  saveState: () => void;
}

const ImageComponent: React.FC<ImageComponentProps> = ({ fabricCanvas, images, saveState }) => {
  const CategoryToRemove = useAppSelector(state => state.categoryToRemove);
  const dispatch = useDispatch();

  useEffect(() => {
    if (fabricCanvas.current && images) {
      const canvas = fabricCanvas.current;
      const canvasCenter = {
        left: canvas.getWidth() / 2,
        top: canvas.getHeight() / 2,
      };

      images.forEach((image) => {
        fabric.Image.fromURL(image.src, (oImg) => {
          const imgWidth = image.width ?? oImg.width ?? 0;
          const imgHeight = image.height ?? oImg.height ?? 0;

          // Center the image on the canvas
          oImg.set({
            id: image.id,
            left: canvasCenter.left - imgWidth / 2,
            top: canvasCenter.top - imgHeight / 2,
            width: imgWidth,
            height: imgHeight,
            angle: 0,
            opacity: 1,
            scaleX: 1,
            scaleY: 1,
            crossOrigin: 'anonymous',
            data: {
              id: image.id,
              category: image.category,
              status: image.status,
            },
          });

          const objectExists = findObjectById(canvas, image.id);
          if (!objectExists) {
            canvas.add(oImg);
            if (image.category === "image" ) adjustViewportToElement({canvas, obj: oImg});
            saveState();
          }
        });
      });

      if (CategoryToRemove) {
        const imagesToRemove = canvas.getObjects('image') as fabric.Image[];
        imagesToRemove.forEach((obj) => {
          if (obj.data?.category === CategoryToRemove) {
            canvas.remove(obj);
          }
        });
      }
    }

    return () => {
      dispatch(setCategoryToRemove(''));
    };
  }, [fabricCanvas, CategoryToRemove, images, saveState, dispatch]);

  return null;
};

export default ImageComponent;
