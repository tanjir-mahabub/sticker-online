import React, { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/redux/store';
import { useCanvas } from '@/context/CanvasContext';
import { debounce } from 'lodash';
import { generateSVGImageData, extractDAttributeValue } from '@/components/Utils/DieCutFunction';
import { convertJpgToBase64 } from '@/components/Utils/vectorFunction';
import { checkSizeAndAdjustViewport } from '@/components/Editor/CanvasTools/eventHandlers/checkSizeAndAdjustViewport';

type OnDieCutReady = (result: React.MutableRefObject<fabric.Canvas | null>) => void;


export const useDieCutEffect = (onDieCutReady: OnDieCutReady) => {
  const { fabricCanvasRef, setIsLoading } = useCanvas();
  const [dieCutResult, setDieCutResult] = useState<string | null>(null);
  const materialDefault = useAppSelector(state => state.formValues.materialLastSelected);
  const CanvasProperties = useAppSelector(state => state.canvas);
  const { grow } = CanvasProperties;

  const dispatch = useDispatch();

  const debouncedHandleDieCut = debounce(async () => {       

    try {
      const svgData = fabricCanvasRef?.current?.toSVG();
    
      if (svgData && grow) {
        try {
          console.log('Die Cut Produced', 'grow', grow);
          const modifiedSVG = await generateSVGImageData(svgData, grow, "white");
          const dAttributeValue = await extractDAttributeValue(modifiedSVG);

          console.log('running diecut');

          if (dAttributeValue) {
            setDieCutResult(dAttributeValue);
            setIsLoading(false);           
          } else {
            console.error('Failed to extract D attribute value from the modified SVG');
          }
        } catch (error) {
          console.error('Error generating SVG image data:', error);
        }
      } else {
        console.error('Failed to generate SVG data from the fabric canvas');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }, 300);

  const selectAllElements = () => {
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      const objects = canvas.getObjects();
      canvas.discardActiveObject();
      const selection = new fabric.ActiveSelection(objects, {
        canvas: canvas,
      });
      canvas.setActiveObject(selection);
      checkSizeAndAdjustViewport(canvas, selection);
      canvas.requestRenderAll();
    }
  };

  const handleDieCut = async () => {
    // debouncedHandleDieCut();
    // selectAllElements();

    grow && debouncedHandleDieCut()
  };

  const handleDownloadSVG = async (): Promise<void> => {
    if (fabricCanvasRef.current) {
      const svgData = fabricCanvasRef.current.toSVG();
      console.log(svgData);

      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'canvas.svg';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (dieCutResult && canvas) {
      const strokeColor = "rgba(0,0,0,0.3)";
      const bgColor = "white";
      const dieCutImageId = 'dieCutImage';

      const dieCutImage = new fabric.Path(dieCutResult, {
        stroke: strokeColor,
        fill: 'transparent',
        id: dieCutImageId,
      });

      // Find and remove existing dieCutImage if it exists
      const existingObject = canvas.getObjects().find(obj => obj.get('id') === dieCutImageId);
    //   if (existingObject) {
    //     canvas.remove(existingObject);
    //   }

      // Check if the object already exists before adding
      if (!existingObject) {
        canvas.add(dieCutImage);
      }

      dieCutImage.set('data', 'dieCutImage');

      // Set custom data attribute
      dieCutImage.set('id', dieCutImageId);
      dieCutImage.set({
        selectable: false,
        evented: false,
      });

      dieCutImage.sendToBack();   
      
      fabricCanvasRef?.current && onDieCutReady(fabricCanvasRef);

      // Uncomment and update the following section if you need to handle material selection and fill
      /*
      const selectedMaterial = materialStore.find(material => material.id === materialDefault);
      if (selectedMaterial && selectedMaterial.src) {
        convertJpgToBase64(selectedMaterial.src)
          .then((base64Data: string) => {
            const img = new Image();
            img.src = base64Data;
            img.onload = function () {
              const patternSourceCanvas = document.createElement('canvas');
              const ctx = patternSourceCanvas.getContext('2d');
              patternSourceCanvas.width = img.width;
              patternSourceCanvas.height = img.height;
              ctx?.drawImage(img, 0, 0);

              const patternImage = new Image();
              patternImage.src = patternSourceCanvas.toDataURL();
              patternImage.onload = function () {
                const pattern = new fabric.Pattern({
                  source: patternImage,
                  repeat: 'repeat'
                });
                dieCutImage.set('fill', pattern);
                canvas.renderAll();
              };
            };
          })
          .catch((error) => {
            console.error('Error converting JPG to base64:', error);
          });
      } else if (selectedMaterial?.value === "clear") {
        dieCutImage.set('fill', 'transparent');
        canvas.renderAll();
      } else {
        dieCutImage.set('fill', bgColor);
        canvas.renderAll();
      }
      */
    }
  }, [dieCutResult, fabricCanvasRef, materialDefault, grow, onDieCutReady]);

  return { dieCutResult, handleDownloadSVG, handleDieCut };
};
