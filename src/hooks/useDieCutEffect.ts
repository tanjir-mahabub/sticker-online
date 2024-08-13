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

interface ObjectWithPercentage {
  object: fabric.Object;
  percentageInside: number;
}

export type ObjectsWithPercentageArray = ObjectWithPercentage[];


export const useDieCutEffect = (onDieCutReady?: OnDieCutReady) => {
  const { fabricCanvasRef } = useCanvas();
  const [dieCutResult, setDieCutResult] = useState<string | null>(null);
  const materialDefault = useAppSelector(state => state.formValues.materialLastSelected);
  const canvasProperties = useAppSelector(state => state.canvas);
  const { frameWidth, frameHeight, backgroundColor } = canvasProperties;
  const StickerNavID = useAppSelector(state => state.sticker.id);
  const [dieCutReady, setDieCutReady] = useState(false);

  const [selectedItem, setSelectedItem] = useState<ObjectsWithPercentageArray>([]);
  const dispatch = useDispatch();

  const deletePrevDieCut = (canvas: fabric.Canvas) => {
    const existingObject = canvas.getObjects().find(obj => obj.get('id') === "dieCutImage");
    if (existingObject) {
      canvas.remove(existingObject);
      canvas.renderAll();
    }
  };


  const handleDownloadSVG = async (): Promise<void> => {
    const canvas = fabricCanvasRef.current;

    if (canvas) {
      try {
        const svgString = await generateSVGWithMargin({
          canvas: canvas,
          selectedItem: selectedItem,
          frameWidth: frameWidth,
          frameHeight: frameHeight,
          grow: canvasProperties.grow,
          backgroundColor: backgroundColor,
          StickerNavID: StickerNavID,
          hasBackground: true,
          printLine: true,
          printLineWidth: 2,
          isDieCutImage: true,
          hasPath: false
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


  const debouncedGenerateSVGImageData = debounce(async (svgString, grow, backgroundColor, callback) => {
    try {
      const modifiedSVG = await generateSVGImageData(svgString, grow, backgroundColor);
      const dAttributeValue = await extractDAttributeValue(modifiedSVG);
      callback(dAttributeValue);
    } catch (error) {
      console.error('Error generating SVG image data:', error);
    }
  }, 300);


  const dieCutGenerating = useCallback((dAttributeValue: string | null) => {
    const canvas = fabricCanvasRef.current;
    const selectedMaterial = materialStore.find(material => material.id === materialDefault);

    if (!canvas) {
      console.error('Canvas is not initialized');
      return;
    }

    try {
      if (dAttributeValue && selectedItem && canvas && canvasProperties.grow) {
        const strokeColor = "rgba(0,0,0,0.3)";
        const dieCutImageId = 'dieCutImage';

        deletePrevDieCut(canvas);

        const dieCutImage = new fabric.Path(dAttributeValue, {
          strokeWidth: 1,
          stroke: strokeColor,
          fill: 'transparent',
          id: dieCutImageId,
        });

        dieCutImage.set({
          selectable: false,
          evented: false,
        });

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

        canvas.add(dieCutImage);
        dieCutImage.sendToBack();
        canvas.renderAll();

        //console.log("This function runs after all objects are added and rendered.");

        setDieCutReady(true);
      }
    } catch (error) {
      console.error('Error while processing the canvas:', error);
    }

  }, [fabricCanvasRef, canvasProperties.grow, selectedItem, backgroundColor, materialDefault])


  const handleSVGOperations = useCallback(async (
    canvas: fabric.Canvas,
    selectedItem: ObjectsWithPercentageArray,
    frameWidth: number,
    frameHeight: number,
    grow: number,
    backgroundColor: string,
    StickerNavID: number,
    zoom: number,
    dispatch: any, // Assuming you are using a dispatch method from Redux or similar
    fabricCanvasRef: any,
    onDieCutReady: any
  ) => {
    try {
      const svgString = await generateSVGWithMargin({
        canvas: canvas,
        selectedItem: selectedItem,
        frameWidth: frameWidth,
        frameHeight: frameHeight,
        grow: grow,
        backgroundColor: backgroundColor,
        StickerNavID: StickerNavID,
        hasBackground: false,
        printLine: false,
        isDieCutImage: false,
      });

      //console.log('die cut calling 3');

      //console.log('Generated SVG String:', svgString, "frame", frameWidth, frameHeight);

      if (svgString && grow) {
        const modifiedSVG = await generateSVGImageData(svgString, grow, backgroundColor);
        const dAttributeValue = await extractDAttributeValue(modifiedSVG);

        if (modifiedSVG && dAttributeValue) {
          // setDieCutResult(dAttributeValue);

          dieCutGenerating(dAttributeValue)
          onDieCutReady && onDieCutReady(fabricCanvasRef);
          dispatch(setCanvasProperties({
            isLoading: false
          }));
        } else {
          console.error('Failed to extract D attribute value from the modified SVG');
          dispatch(setCanvasProperties({
            isLoading: false
          }));
        }
      } else {
        console.error('Failed to generate SVG data from the fabric canvas');
        dispatch(setCanvasProperties({
          isLoading: false
        }));
      }
    } catch (error) {
      console.error('Error during SVG operations:', error);
      dispatch(setCanvasProperties({
        isLoading: false
      }));
    }
  }, [dieCutGenerating]);


  const handleDieCut = useCallback(async (grow?: number) => {
    //console.log('die cut calling 1');
    if (grow) {
      dispatch(setCanvasProperties({
        isLoading: true
      }));

      const canvas = fabricCanvasRef.current;
      if (!canvas || grow === undefined) return;

      canvas.renderAll();

      const zoom = canvas.getZoom() || 1;
      deletePrevDieCut(canvas);

      canvas.discardActiveObject();

      const selected = itemSelection(canvas, grow, frameWidth, frameHeight);
      //console.log('die cut calling 2', canvas, canvas.getObjects(), selected, grow, frameWidth, frameHeight);
      if (!selected) {
        dispatch(setCanvasProperties({
          isLoading: false
        }));
        return;
      };

      selected && setSelectedItem(selected);
      selected?.forEach(item => {
        //console.log(`Object ID: ${item.object.id}, Percentage Inside: ${item.percentageInside.toFixed(2)}%`);
      });

      if (selected && selected.length > 0) {
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

        const group = new fabric.Group(selectedObjects, {
          id: 'dieCutGroup',
          selectable: true,
          evented: true
        });

        canvas.add(group);
        canvas.renderAll();

        const newWidthWithGrow = group.width!;
        const newHeightWithGrow = group.height!;
        const newBredd = pixelToCm(newWidthWithGrow);
        const newHojd = pixelToCm(newHeightWithGrow);

        // Update frameWidth and frameHeight based on the grow value
        dispatch(setCanvasProperties({
          bredd: newBredd,
          hojd: newHojd,
          frameWidth: newWidthWithGrow,
          frameHeight: newHeightWithGrow,
          canvasInitialZoom: zoom,
          grow: grow 
        }));

        adjustViewportToElement({ canvas, obj: group });

        group.ungroupOnCanvas();
        selectedObjects.forEach((obj, index) => {
          obj.set(originalStates[index]);
          obj.setCoords();
        });
        canvas.remove(group);
        canvas.renderAll();


        if (newWidthWithGrow && newHeightWithGrow) {
          await handleSVGOperations(
            canvas,
            selectedItem,
            newWidthWithGrow,
            newHeightWithGrow,
            grow,
            backgroundColor,
            StickerNavID,
            zoom,
            dispatch,
            fabricCanvasRef,
            onDieCutReady
          );
        }
      }
    }
  }, [fabricCanvasRef, frameWidth, frameHeight, backgroundColor, selectedItem, StickerNavID, handleSVGOperations, onDieCutReady, dispatch]);


  useEffect(() => {
    const canvas = fabricCanvasRef.current;

    if (!canvas) {
      console.error('Canvas is not initialized');
      return;
    }

    const dieCutImage = canvas.getObjects().find(obj => obj.id === "dieCutImage");
    const selectedMaterial = materialStore.find(material => material.id === materialDefault);

    if (dieCutImage) {
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

      canvas.renderAll();
    }
  }, [fabricCanvasRef, materialDefault, backgroundColor]); 


  useEffect(() => {
    if (!dieCutReady) return;
  
    const canvas = fabricCanvasRef.current;
  
    if (!canvas) {
      console.error('Canvas is not initialized');
      return;
    }
  
    const dieCutImage = canvas.getObjects().find(obj => obj.id === "dieCutImage");
  
    if (!dieCutImage) {
      console.error('dieCutImage is not initialized');
      return;
    }
  
    if (dieCutImage && canvasProperties.grow) {
      canvas.discardActiveObject();
  
      const originalViewportTransform = canvas.viewportTransform?.slice() || [1, 0, 0, 1, 0, 0];
      const zoom = originalViewportTransform[0];
  
      const selectedObjects = selectedItem.map(item => item.object);
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
  
      const group = new fabric.Group(selectedObjects, {
        id: 'dieCutGroup2',
        selectable: true,
        evented: true
      });
  
      // Calculate the center of the group
      const groupCenterX = group.left! + group.width! / 2;
      const groupCenterY = group.top! + group.height! / 2;
  
      // Calculate the new size for the dieCutImage based on the grow value
      const newWidth = dieCutImage.width! + canvasProperties.grow * 2;
      const newHeight = dieCutImage.height! + canvasProperties.grow * 2;
  
      // Calculate the scale factors
      const scaleX = newWidth / dieCutImage.width!;
      const scaleY = newHeight / dieCutImage.height!;
  
      // Apply the scaling to the dieCutImage
      dieCutImage.scaleX = scaleX;
      dieCutImage.scaleY = scaleY;
      dieCutImage.setCoords(); // Recalculate coordinates after scaling
  
      // Recalculate the position to keep the dieCutImage centered
      const dieCutImageLeft = groupCenterX - newWidth / 2;
      const dieCutImageTop = groupCenterY - newHeight / 2;
  
      dieCutImage.set({
        left: dieCutImageLeft,
        top: dieCutImageTop
      });
  
      // Convert the new dimensions to cm and dispatch them
      const originalWidthCm = pixelToCm(newWidth);
      const originalHeightCm = pixelToCm(newHeight);
  
      dispatch(setCanvasProperties({
        bredd: originalWidthCm,
        hojd: originalHeightCm,
        frameWidth: newWidth,
        frameHeight: newHeight,
        canvasInitialZoom: zoom,
        grow: canvasProperties.grow
      }));
  
      //console.log('dieCut changing');
  
      group.ungroupOnCanvas();
      selectedObjects.forEach((obj, index) => {
        obj.set(originalStates[index]);
        obj.setCoords();
      });
  
      canvas.remove(group);
      canvas.renderAll();
  
      // Create a new group with the selected items and the dieCutImage
      const newGroup = new fabric.Group([...selectedObjects, dieCutImage], {
        selectable: true,
        evented: true,
      });
  
      // Add the new group to the canvas
      canvas.add(newGroup);
      canvas.renderAll();
  
      // Adjust the viewport to fit the new group
      adjustViewportToElement({ canvas, obj: newGroup });
  
      // Optionally ungroup the new group and restore the objects
      newGroup.ungroupOnCanvas();
      [...selectedObjects, dieCutImage].forEach((obj) => obj.setCoords());
      canvas.remove(newGroup);
      canvas.renderAll();
  
      // Reset the dieCutReady state after the operation is complete
      setDieCutReady(false);
    }
  }, [dieCutReady, fabricCanvasRef, canvasProperties.grow, selectedItem, dispatch]);
  



  return { dieCutResult, handleDownloadSVG, handleDieCut };
};



