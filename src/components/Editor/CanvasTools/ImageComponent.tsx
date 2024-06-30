import React, { useEffect } from 'react';
import { fabric } from 'fabric';
import { ImageInfo } from '@/types/types';
import { findObjectById } from './eventHandlers/canvasFunctions';
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { setCategoryToRemove } from '@/redux/features/categoryToRemove';

interface ImageComponentProps {
  fabricCanvas: React.MutableRefObject<fabric.Canvas | null>;
  images: ImageInfo[];
  saveState: () => void;
}

const ImageComponent: React.FC<ImageComponentProps> = ({ fabricCanvas, images, saveState }) => {
    const CategoryToRemove = useAppSelector(state => state.categoryToRemove);

    const dispatch = useDispatch();

    useEffect(() => {      
        console.log(images);
        if (fabricCanvas.current && images) {    
            images.forEach((image) => {        
                fabric.Image.fromURL(image.src, (oImg) => {
                oImg.set({
                    id: image.id,
                    left: Math.random() * 400,
                    top: Math.random() * 400,
                    width: image.width,
                    height: image.height,
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

                    const objectExits = findObjectById(fabricCanvas.current!, image.id);
                    !objectExits && fabricCanvas.current?.add(oImg) && saveState(); // Save state after adding each image
                });
            });

            if(CategoryToRemove) {                
                const images = fabricCanvas.current.getObjects('image') as fabric.Image[];                
                images?.forEach(obj => {
                    if(obj.data.category === CategoryToRemove) {
                        fabricCanvas?.current?.remove(obj)
                    }
                })          
            }
        }

        return () => {
            dispatch(setCategoryToRemove(""))
        };
    }, [fabricCanvas, CategoryToRemove, images, saveState, dispatch]);

  return null;
};

export default ImageComponent;
