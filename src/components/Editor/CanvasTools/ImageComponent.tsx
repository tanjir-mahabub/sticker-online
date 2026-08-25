import React, { useEffect } from 'react';
import { fabric } from 'fabric';
import { ImageInfo } from '@/types/types';
import { findObjectById } from './eventHandlers/canvasFunctions';
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { setCategoryToRemove } from '@/redux/features/categoryToRemove';
import { placeObjectInFrame } from './eventHandlers/placeObjectInFrame';

interface ImageComponentProps {
  fabricCanvas: React.MutableRefObject<fabric.Canvas | null>;
  images: ImageInfo[];
  saveState: () => void;
}

const ImageComponent: React.FC<ImageComponentProps> = ({ fabricCanvas, images, saveState }) => {
  const CategoryToRemove = useAppSelector(state => state.categoryToRemove);
  const CanvasProperties = useAppSelector(state => state.canvas);
  const { frameWidth, frameHeight, centerX, centerY } = CanvasProperties;

  const dispatch = useDispatch();

  useEffect(() => {
    let active = true;
    if (fabricCanvas.current && images) {
      const canvas = fabricCanvas.current;
      images.forEach((image) => {
        fabric.Image.fromURL(image.src, (oImg) => {
          if (!active || fabricCanvas.current !== canvas) return;
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
            placeObjectInFrame(canvas, oImg, { frameWidth, frameHeight, centerX, centerY });
            canvas.add(oImg);
            canvas.setActiveObject(oImg);
            canvas.requestRenderAll();
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
      active = false;
      dispatch(setCategoryToRemove(''));
    };
  }, [fabricCanvas, frameWidth, frameHeight, centerX, centerY, CategoryToRemove, images, saveState, dispatch]);

  return null;
};

export default ImageComponent;
