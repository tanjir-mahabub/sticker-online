import React, { useEffect } from 'react';
import { fabric } from 'fabric';
import { useAppSelector } from '@/redux/store';
import { convertTextToPath } from '@/components/Utils/function';
import { findObjectById } from './eventHandlers/canvasFunctions';
import { useDispatch } from 'react-redux';
import { setCategoryToRemove } from '@/redux/features/categoryToRemove';

interface TextPathProps {
  fabricCanvas: React.MutableRefObject<fabric.Canvas | null>;
  saveState: () => void;
}

const TextPath: React.FC<TextPathProps> = ({ fabricCanvas, saveState }) => {
  const CategoryToRemove = useAppSelector(state => state.categoryToRemove);
  const CanvasProperties = useAppSelector(state => state.canvas);
  const textPreviews = useAppSelector((state) => state.text.texts);

  const dispatch = useDispatch();

  useEffect(() => {
    if (fabricCanvas.current) {
      // console.log(textPreviews);
      textPreviews?.forEach((text: any) => {        
        convertTextToPath(text)
          .then((pathData) => {                                            
            if (pathData) {
              const textPath = new fabric.Path(pathData);
              textPath.set({
                id: text.id,               
                fill: text.fill,
                stroke: 'transparent',
                strokeWidth: 1,
                objectCaching: false,
                data: {
                  id: text.id,
                  category: text.category,                  
                },
              });

               // Calculate the center position
              //  const canvasCenterX = CanvasProperties.canvasWidth / 2;
              //  const canvasCenterY = CanvasProperties.canvasHeight / 2;
              //  const textPathWidth = textPath.width ?? 0;
              //  const textPathHeight = textPath.height ?? 0;
              //  const textPathCenterX = textPathWidth / 2;
              //  const textPathCenterY = textPathHeight / 2;
 
              //  textPath.left = canvasCenterX - textPathCenterX;
              //  textPath.top = canvasCenterY - textPathCenterY - 30;

              const objectExists = findObjectById(fabricCanvas.current!, text.id);       
              
              !objectExists && fabricCanvas.current?.add(textPath) && saveState();
            } else {
              console.error('Invalid path data:', pathData);
            }
          })
          .catch((error: any) => {
            console.error('Error converting text to path:', error);
          });
      });

      if(CategoryToRemove) {                
        const texts = fabricCanvas.current.getObjects('path') as fabric.Path[];                       
        texts?.forEach(obj => {
            if(obj?.data?.category === CategoryToRemove) {
                fabricCanvas?.current?.remove(obj)
            }
        })          
    }
    }

    return () => {
      dispatch(setCategoryToRemove(""))
  };
  }, [fabricCanvas, textPreviews, CategoryToRemove, CanvasProperties, saveState, dispatch]);

  return null;
};

export default TextPath;
