import { useRef, useEffect, useState, useCallback } from "react";
import { fabric } from "fabric";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import { setCanvasProperties } from "@/redux/features/canvasSlice";
import { pixelToCm } from "@/components/Utils/function";
import { adjustViewportToElement } from "@/components/Editor/CanvasTools/eventHandlers/adjustViewportToElement";
import { useCanvas } from "@/context/CanvasContext";
import { useAppSelector } from "@/redux/store";
import { extractDAttributeValue, generateSVGImageData } from "@/components/Utils/NewDieCutFN";
import { itemSelection } from "@/components/Utils/ItemSelection";
import { generateSVGWithMargin } from "@/components/Utils/GenerateSVG";
import materialStore from "@/store/materialStore";

type OnDieCutReady = (result: React.MutableRefObject<fabric.Canvas | null>) => void;

export const useDieCutEffect = (onDieCutReady?: OnDieCutReady) => {
  const { fabricCanvasRef } = useCanvas();
  const [dieCutResult, setDieCutResult] = useState<string | null>(null);
  const materialDefault = useAppSelector(state => state.formValues.materialLastSelected);
  const canvasProperties = useAppSelector(state => state.canvas);
  const { grow, backgroundColor } = canvasProperties;
  const StickerNavID = useAppSelector(state => state.sticker.id);

  const [selectedItem, setSelectedItem] = useState<fabric.Object | null>(null);
  const dispatch = useDispatch();  

  const deletePrevDieCut = (canvas: fabric.Canvas) => {
    const existingObject = canvas.getObjects().find(obj => obj.get('id') === "dieCutImage");
    if (existingObject) {
      canvas.remove(existingObject);
      canvas.renderAll();
    }
  };

  const debouncedGenerateSVGImageData = debounce(async (svgString, grow, backgroundColor, callback) => {
    try {
        const modifiedSVG = await generateSVGImageData(svgString, grow, backgroundColor);
        const dAttributeValue = await extractDAttributeValue(modifiedSVG);
        callback(dAttributeValue);
    } catch (error) {
        console.error('Error generating SVG image data:', error);
    }
}, 300); 

  const handleDieCut = useCallback(async (grow?: number) => {
    if (grow) {
      dispatch(setCanvasProperties({
        isLoading: true
      }));
      
      const canvas = fabricCanvasRef.current;
      console.log('Canvas:', canvas);
      console.log('Grow:', grow);
      
      if (!canvas || grow === undefined) return;
      
      const zoom = canvas.getZoom() || 1;
      deletePrevDieCut(canvas);

      canvas.discardActiveObject();

      const selected = itemSelection(canvas, grow, canvasProperties.frameWidth, canvasProperties.frameHeight);
      console.log('Selected items:', selected);
      selected?.forEach(item => {
        console.log(`Object ID: ${item.object.id}, Percentage Inside: ${item.percentageInside.toFixed(2)}%`);
      });

      if (selected && selected.length > 0) {
        // Extract the objects from the selected array and store their original states
        const selectedObjects = selected.map(item => item.object);
        const originalStates = selectedObjects.map(obj => ({
          left: obj.left,
          top: obj.top,
          scaleX: obj.scaleX,
          scaleY: obj.scaleY,
          angle: obj.angle,
          originX: obj.originX,
          originY: obj.originY,
          flipX: obj.flipX,
          flipY: obj.flipY,
        }));

        // Create a group from the selected items
        const group = new fabric.Group(selectedObjects, {
          id: 'dieCutGroup', // Custom property to identify the group
          selectable: true,  // Set whether the group should be selectable
          evented: true      // Set whether the group should trigger events
        });

        // Add the group to the canvas
        canvas.add(group);
        canvas.renderAll(); // Render the canvas to show the new group

        // Center the group on the canvas
        adjustViewportToElement({ canvas, obj: group });

        // Calculate the new frame size with the grow value
        const newWidthWithGrow = group.width! + grow;
        const newHeightWithGrow = group.height! + grow;
        const newBredd = pixelToCm(newWidthWithGrow);
        const newHojd = pixelToCm(newHeightWithGrow);
        dispatch(setCanvasProperties({
          bredd: newBredd,
          hojd: newHojd,
          frameWidth: newWidthWithGrow,
          frameHeight: newHeightWithGrow,
          canvasInitialZoom: zoom
        }));

        // Ungroup the objects and restore original positions
        group.ungroupOnCanvas();
        selectedObjects.forEach((obj, index) => {
          obj.set(originalStates[index]);
          obj.setCoords(); // Update the object's coordinates
        });
        canvas.remove(group);
        canvas.renderAll(); // Render the canvas again to reflect the changes
      }
      
      const svgString = await generateSVGWithMargin({
        canvas: canvas,
        frameWidth: canvasProperties.frameWidth,
        frameHeight: canvasProperties.frameHeight,
        backgroundColor: canvasProperties.backgroundColor,
        StickerNavID: StickerNavID,        
        hasBackground: true,     
        printLine: false,
        isDieCutImage: false
      });
      

      if (svgString && grow) {
        try {
                    
          const modifiedSVG = await generateSVGImageData(svgString, grow, canvasProperties.backgroundColor);
          const dAttributeValue = await extractDAttributeValue(modifiedSVG);

          if (dAttributeValue) {
            setDieCutResult(dAttributeValue);
            // console.log(dAttributeValue);
            onDieCutReady && onDieCutReady(fabricCanvasRef);
            dispatch(setCanvasProperties({
              isLoading: false
            }));
          } else {
            console.error('Failed to extract D attribute value from the modified SVG');
          }
        } catch (error) {
          console.error('Error generating SVG image data:', error);
        }

        dispatch(setCanvasProperties({
          isLoading: false,
          canvasInitialZoom: zoom
        }));
      } else {
        console.error('Failed to generate SVG data from the fabric canvas');
      }
    }
  }, [fabricCanvasRef, canvasProperties.frameWidth, canvasProperties.frameHeight, canvasProperties.backgroundColor, StickerNavID, onDieCutReady, dispatch]);
  

  const handleDownloadSVG = async (): Promise<void> => {
    const canvas = fabricCanvasRef.current;

    if (canvas) {
      try {        
        const svgString = await generateSVGWithMargin({
          canvas: canvas,
          frameWidth: canvasProperties.frameWidth,
          frameHeight: canvasProperties.frameHeight,
          backgroundColor: canvasProperties.backgroundColor,
          StickerNavID: StickerNavID,
          hasBackground: true
        });
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

        // Calculate the new position and size considering the current viewport transformation
        const zoom = canvas.getZoom();
        const viewportTransform = canvas.viewportTransform!;
        
        // Calculate the canvas center point
        const canvasCenter = {
            x: canvas.getWidth() / 2,
            y: canvas.getHeight() / 2
        };

        // Calculate the new position for the dieCutImage to center it on the canvas
        const dieCutImageCenter = {
            x: canvasCenter.x - (dieCutImage.width! * zoom) / 2,
            y: canvasCenter.y - (dieCutImage.height! * zoom) / 2 - 30
        };

        // Set the position of the dieCutImage in the center of the canvas
        dieCutImage.set({
            left: dieCutImageCenter.x - viewportTransform[4] / zoom - grow / 2,
            top: dieCutImageCenter.y - viewportTransform[5] / zoom - grow / 2,
            scaleX: (dieCutImage.width! * zoom + grow) / dieCutImage.width!,
            scaleY: (dieCutImage.height! * zoom + grow) / dieCutImage.height!,
        });

        // Add dieCutImage to the canvas and send it to back
        canvas.add(dieCutImage);
        dieCutImage.sendToBack();

        if (selectedMaterial && selectedMaterial.src) {
            fabric.Image.fromURL(selectedMaterial.src, function (img) {
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

        adjustViewportToElement({ canvas, obj: dieCutImage})

        // Adjust the viewport to center the selected item
        canvas.requestRenderAll();    
        
        // Update canvas properties with dieCutImage dimensions
      const newBredd = pixelToCm(dieCutImage.width! * dieCutImage.scaleX!);
      const newHojd = pixelToCm(dieCutImage.height! * dieCutImage.scaleY!);
      dispatch(setCanvasProperties({
        bredd: newBredd,
        hojd: newHojd,
        frameWidth: dieCutImage.width! * dieCutImage.scaleX!,
        frameHeight: dieCutImage.height! * dieCutImage.scaleY!
      }));

    }

    return () => {
        if (canvas) {
            deletePrevDieCut(canvas);
        }
    };
}, [dieCutResult, fabricCanvasRef, materialDefault, grow, backgroundColor, dispatch]);


  return { dieCutResult, handleDownloadSVG, handleDieCut };
};



