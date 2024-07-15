import React, { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { useAppSelector } from '@/redux/store';
import { useCanvas } from '@/context/CanvasContext';
import { debounce } from 'lodash';
import { generateSVGImageData, extractDAttributeValue } from '@/components/Utils/DieCutFunction';
import materialStore from '@/store/materialStore';
import { adjustViewportToElement } from '@/components/Editor/CanvasTools/eventHandlers/adjustViewportToElement';
import { useDispatch } from 'react-redux';
import { setCanvasProperties } from '@/redux/features/canvasSlice';

type OnDieCutReady = (result: React.MutableRefObject<fabric.Canvas | null>) => void;

export const useDieCutEffect = (onDieCutReady?: OnDieCutReady) => {
  const { fabricCanvasRef } = useCanvas();
  const [dieCutResult, setDieCutResult] = useState<string | null>(null);
  const materialDefault = useAppSelector(state => state.formValues.materialLastSelected);      
  const canvasProperties = useAppSelector(state => state.canvas);    
  const { grow, backgroundColor, isLoading } = canvasProperties;  

  const dispatch = useDispatch();

  const deletePrevDieCut = (canvas: fabric.Canvas) => {
    const existingObject = canvas.getObjects().find(obj => obj.get('id') === "dieCutImage");
        if(existingObject) {
          canvas.remove(existingObject);
          canvas.renderAll();
        }
  }

  const debouncedHandleDieCut = debounce(async (grow?: number) => {
    const canvas = fabricCanvasRef.current;

    if (canvas && grow) {

      deletePrevDieCut(canvas);
      
      canvas.requestRenderAll();
      const svgData = canvas.toSVG();
      // console.log('handle die cut', svgData, 'zoom', canvas.getZoom());
      // const svgData = await generateSVGWithMargin(canvas, 20);

      if (svgData && grow) {
        try {
          const modifiedSVG = await generateSVGImageData(svgData, grow, "white");
          const dAttributeValue = await extractDAttributeValue(modifiedSVG);

          console.log('running diecut');

          if (dAttributeValue) {
            setDieCutResult(dAttributeValue);            
            onDieCutReady && onDieCutReady(fabricCanvasRef);
          } else {
            console.error('Failed to extract D attribute value from the modified SVG');            
          }
        } catch (error) {
          console.error('Error generating SVG image data:', error);         
        }
      } else {
        console.error('Failed to generate SVG data from the fabric canvas');        
      }
    }
  }, 300);

  const handleDieCut = async (value?: number) => {
    if(value) {
      // dispatch(setCanvasProperties({
      //   isLoading: true
      // }));
      console.log(isLoading);
      debouncedHandleDieCut(value);       
    }
  };  
  
  const generateSVGWithMargin = (canvas: fabric.Canvas, margin = 20): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        // Deselect all objects on the canvas
        canvas.discardActiveObject();
  
        // Get all objects on the canvas
        const objects = canvas.getObjects();
  
        // Process objects in chunks to avoid blocking the main thread
        const processChunks = (startIndex: number, chunkSize: number) => {
          return new Promise<void>((chunkResolve) => {
            const endIndex = Math.min(startIndex + chunkSize, objects.length);
            for (let i = startIndex; i < endIndex; i++) {
              objects[i].set('active' as keyof fabric.Object, true as unknown as boolean);
            }
            canvas.discardActiveObject();
  
            if (endIndex < objects.length) {
              setTimeout(() => {
                processChunks(endIndex, chunkSize).then(chunkResolve);
              }, 0); // Throttle by adding a delay of 0ms
            } else {
              chunkResolve();
            }
          });
        };
  
        processChunks(0, 100).then(() => {
          // Create a group from all objects
          const group = new fabric.ActiveSelection(objects, {
            canvas: canvas,
          });
  
          // Set the group as the active object
          canvas.setActiveObject(group);
  
          // Render the canvas to update the selection
          canvas.requestRenderAll();
  
          // Get the bounding box of the group
          const boundingRect = group.getBoundingRect();
          const { left, top, width, height } = boundingRect;
  
          // Calculate actual position and size considering zoom and viewport transformation
          const zoom = canvas.getZoom();
          const viewportTransform = canvas.viewportTransform ?? [1, 0, 0, 1, 0, 0];
          const actualLeft = (left - viewportTransform[4]) / zoom;
          const actualTop = (top - viewportTransform[5]) / zoom;
          const actualWidth = width / zoom;
          const actualHeight = height / zoom;
  
          // Adjust the group's position for exporting
          group.set({
            left: actualLeft,
            top: actualTop,
          });
  
          // Update the coordinates
          group.setCoords();
          canvas.renderAll();
  
          // Get the SVG of the group
          const groupSVG = group.toSVG();
  
          // Remove the temporary group from the canvas
          canvas.discardActiveObject();
          canvas.remove(group);
          canvas.renderAll();
  
          // Create the SVG document with proper namespaces and viewBox
          const wrappedSVG = `
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="${actualLeft - margin} ${actualTop - margin} ${actualWidth + 2 * margin} ${actualHeight + 2 * margin}" width="${actualWidth + 2 * margin}" height="${actualHeight + 2 * margin}">
              ${groupSVG}
            </svg>
          `;
  
          resolve(wrappedSVG);
        });
      } catch (error) {
        reject(error);
      }
    });
  };
  

  const handleDownloadSVG = async (): Promise<void> => {
    const canvas = fabricCanvasRef.current;
  
    if (canvas) {
      try {
        const margin = 20;
        const svgString = await generateSVGWithMargin(canvas, margin);
  
        // Create a Blob and download the SVG
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'canvas.svg';
        a.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error exporting SVG:', error);
      }
    }
  };

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
  
    if (dieCutResult && canvas && grow) {
      const strokeColor = "rgba(0,0,0,0.3)";
      const dieCutImageId = 'dieCutImage';
      const selectedMaterial = materialStore.find(material => material.id === materialDefault);
  
      deletePrevDieCut(canvas);
  
      const dieCutImage = new fabric.Path(dieCutResult, {
        strokeWidth: 1,
        stroke: strokeColor,
        fill: 'transparent',
        id: dieCutImageId,
      });
  
      canvas.discardActiveObject();
  
      // Filter out the dieCutImage object
      const objects = canvas.getObjects().filter(obj => obj.get('id') !== dieCutImageId).map(obj => obj.set('active' as keyof fabric.Object, true as unknown as boolean));
  
      // Deselect any active object
      canvas.discardActiveObject();
  
      // Create a group from all objects except the dieCutImage
      const group = new fabric.ActiveSelection(objects, {
        canvas: canvas,
      });
  
      // Set the group as the active object
      canvas.setActiveObject(group);
  
      // Render the canvas to update the selection
      canvas.requestRenderAll();
  
      // Get the bounding box of the group
      const boundingRect = group.getBoundingRect();
      const { left, top, width, height } = boundingRect;
  
      // Remove the temporary group from the canvas
      canvas.remove(group);
      canvas.renderAll();
  
      // Calculate the new position and size considering the current viewport transformation
      const zoom = canvas.getZoom();
      const viewportTransform = canvas.viewportTransform!;
      const adjustedLeft = (left - viewportTransform[4]) / zoom;
      const adjustedTop = (top - viewportTransform[5]) / zoom;
      const adjustedWidth = width / zoom;
      const adjustedHeight = height / zoom;
  console.log(zoom);
      // Set the position of the dieCutImage behind the group, accounting for the zoom level
      dieCutImage.set({
        left: adjustedLeft - grow,
        top: adjustedTop - grow,
        scaleX: (adjustedWidth + 2 * grow) / dieCutImage.width!,
        scaleY: (adjustedHeight + 2 * grow) / dieCutImage.height!,
      });      
  
      // Add dieCutImage to the canvas and send it to back
      canvas.add(dieCutImage);
      dieCutImage.sendToBack();

      if (selectedMaterial && selectedMaterial.src) {
        fabric.Image.fromURL(selectedMaterial.src, function(img) {
          const element = img.getElement();
          if (element instanceof HTMLImageElement) {
            const pattern = new fabric.Pattern({
              source: element,
              repeat: 'repeat' // or 'no-repeat', 'repeat-x', 'repeat-y'
            });
            dieCutImage.set({ fill: pattern });
            canvas.renderAll();
          } else {
            console.error("The element is not an HTMLImageElement");
          }
        });
      } else {
        if (selectedMaterial?.value === "clear") {
          dieCutImage.set({ fill: "transparent" });
        } else {
          dieCutImage.set({ fill: backgroundColor });
        }
      }
  
      dieCutImage.set({
        selectable: false,
        evented: false,        
      });
  
      const afterDieObjects = canvas.getObjects().map(obj => obj.set('active' as keyof fabric.Object, true as unknown as boolean));
  
      // Deselect any active object
      canvas.discardActiveObject();
  
      // Create a group from all objects including the dieCutImage
      const newGroup = new fabric.ActiveSelection(afterDieObjects, {
        canvas: canvas,
      });
  
      // Set the group as the active object
      canvas.setActiveObject(newGroup);
      // centerObjectInViewport(canvas, newGroup);
      adjustViewportToElement({canvas, obj: newGroup});
  
      canvas.discardActiveObject();
      canvas.remove(newGroup);
      canvas.renderAll();    

      // dispatch(setCanvasProperties({
      //   frameWidth: (adjustedWidth + 2 * grow) / dieCutImage.width!,
      //   frameHeight: (adjustedHeight + 2 * grow) / dieCutImage.height!
      // }))
    }
  
    return () => {
      if (canvas) {
        deletePrevDieCut(canvas);
      }
    };
  }, [dieCutResult, fabricCanvasRef, materialDefault, grow, backgroundColor, dispatch]);  
  

  return { dieCutResult, handleDownloadSVG, handleDieCut };
};
