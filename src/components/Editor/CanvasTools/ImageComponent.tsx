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
  const CanvasProperties = useAppSelector(state => state.canvas);
  const { frameWidth, frameHeight } = CanvasProperties;

  const dispatch = useDispatch();

  useEffect(() => {
    if (fabricCanvas.current && images) {
      const canvas = fabricCanvas.current;
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();
      const canvasCenter = {
        left: canvasWidth / 2,
        top: canvasHeight / 2 - 30,
      };

      images.forEach((image) => {
        fabric.Image.fromURL(image.src, (oImg) => {
          // Calculate the aspect ratio of the image
          const imgAspectRatio = (oImg.width || 1) / (oImg.height || 1);

          // Determine the dimensions such that the image is scaled to fit within 50% of the canvas dimensions while maintaining its aspect ratio
          let imgWidth = canvasWidth * 0.5;
          let imgHeight = imgWidth / imgAspectRatio;

          if (imgHeight > canvasHeight * 0.5) {
            imgHeight = canvasHeight * 0.5;
            imgWidth = imgHeight * imgAspectRatio;
          }

          // Center the image on the canvas
          oImg.set({
            id: image.id,
            // left: canvasCenter.left - imgWidth / 2,
            // top: canvasCenter.top - imgHeight / 2,
            // scaleX: imgWidth / oImg.width!,
            // scaleY: imgHeight / oImg.height!,
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
            //if (image.category === "image") adjustViewportToElement({ canvas, obj: oImg, setOffsetY: 50 });
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
  }, [fabricCanvas, frameWidth, frameHeight, CategoryToRemove, images, saveState, dispatch]);

  return null;
};

export default ImageComponent;
