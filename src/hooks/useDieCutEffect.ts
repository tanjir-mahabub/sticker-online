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

  const [selectedItem, setSelectedItem] = useState<ObjectsWithPercentageArray>([]);
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

    const selected = itemSelection(canvas, grow, frameWidth, frameHeight);
    console.log('Selected items:', selected);
    selected && setSelectedItem(selected);
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
      const newWidthWithGrow = group.width! + grow * 2; // grow value should be added on both sides
      const newHeightWithGrow = group.height! + grow * 2; // grow value should be added on both sides
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
      selectedItem: selectedItem,
      frameWidth: frameWidth,
      frameHeight: frameHeight,
      grow: grow,
      backgroundColor: backgroundColor,
      StickerNavID: StickerNavID,
      hasBackground: false,
      printLine: false,
      isDieCutImage: false
    });

    console.log('svgString', svgString);

    if (svgString && grow) {
      try {
        const modifiedSVG = await generateSVGImageData(svgString, grow, backgroundColor);
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
}, [fabricCanvasRef, frameWidth, frameHeight, backgroundColor, selectedItem, StickerNavID, onDieCutReady, dispatch]);

  

  const handleDownloadSVG = async (): Promise<void> => {
    const canvas = fabricCanvasRef.current;

    if (canvas) {
      try {        
        // const svgString = await generateSVGWithMargin({
        //   canvas: canvas,
        //   frameWidth: frameWidth,
        //   frameHeight: frameHeight,
        //   backgroundColor: backgroundColor,
        //   StickerNavID: StickerNavID,
        //   hasBackground: true
        // });
        // // Create a Blob and download the SVG
        // const blob = new Blob([svgString], { type: 'image/svg+xml' });
        // const url = URL.createObjectURL(blob);
        // const a = document.createElement('a');
        // a.href = url;
        // a.download = 'canvas.svg';
        // a.click();
        // URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error exporting SVG:', error);
      }
    }
  };  


  
//   useEffect(() => {
//     const canvas = fabricCanvasRef.current;

//     if (dieCutResult && canvas && grow) {
//         const strokeColor = "rgba(0,0,0,0.3)";
//         const dieCutImageId = 'dieCutImage';
//         const selectedMaterial = materialStore.find(material => material.id === materialDefault);

//         deletePrevDieCut(canvas);

//         const dieCutImage = new fabric.Path(dieCutResult, {
//             strokeWidth: 1,
//             stroke: strokeColor,
//             fill: 'transparent',
//             id: dieCutImageId,
//         });

//         canvas.discardActiveObject();

//         // Calculate the new position and size considering the current viewport transformation
//         const zoom = canvas.getZoom();
//         const viewportTransform = canvas.viewportTransform!;
        
//         // Calculate the canvas center point
//         const canvasCenter = {
//             x: canvas.getWidth() / 2,
//             y: canvas.getHeight() / 2
//         };

//         // Calculate the new position for the dieCutImage to center it on the canvas
//         const dieCutImageCenter = {
//             x: canvasCenter.x - (dieCutImage.width! * zoom) / 2,
//             y: canvasCenter.y - (dieCutImage.height! * zoom) / 2 - 30
//         };

//         // Set the position of the dieCutImage in the center of the canvas
//         dieCutImage.set({
//             left: dieCutImageCenter.x - viewportTransform[4] / zoom - grow / 2,
//             top: dieCutImageCenter.y - viewportTransform[5] / zoom - grow / 2,
//             scaleX: (dieCutImage.width! * zoom + grow) / dieCutImage.width!,
//             scaleY: (dieCutImage.height! * zoom + grow) / dieCutImage.height!,
//         });

//         // Add dieCutImage to the canvas and send it to back
//         canvas.add(dieCutImage);
//         dieCutImage.sendToBack();

//         if (selectedMaterial && selectedMaterial.src) {
//             fabric.Image.fromURL(selectedMaterial.src, function (img) {
//                 const element = img.getElement();
//                 if (element instanceof HTMLImageElement) {
//                     const pattern = new fabric.Pattern({
//                         source: element,
//                         repeat: 'repeat' // or 'no-repeat', 'repeat-x', 'repeat-y'
//                     });
//                     dieCutImage.set({ fill: pattern });
//                     canvas.renderAll();
//                 } else {
//                     console.error("The element is not an HTMLImageElement");
//                 }
//             });
//         } else {
//             if (selectedMaterial?.value === "clear") {
//                 dieCutImage.set({ fill: "transparent" });
//             } else {
//                 dieCutImage.set({ fill: backgroundColor });
//             }
//         }

//         dieCutImage.set({
//             selectable: false,
//             evented: false,
//         });

//         adjustViewportToElement({ canvas, obj: dieCutImage})

//         // Adjust the viewport to center the selected item
//         canvas.requestRenderAll();    
        
//         // Update canvas properties with dieCutImage dimensions
//       const newBredd = pixelToCm(dieCutImage.width! * dieCutImage.scaleX!);
//       const newHojd = pixelToCm(dieCutImage.height! * dieCutImage.scaleY!);
//       dispatch(setCanvasProperties({
//         bredd: newBredd,
//         hojd: newHojd,
//         frameWidth: dieCutImage.width! * dieCutImage.scaleX!,
//         frameHeight: dieCutImage.height! * dieCutImage.scaleY!
//       }));

//       const originalStates = selectedItem.map((obj:any) => ({
//         left: obj.left,
//         top: obj.top,
//         scaleX: obj.scaleX,
//         scaleY: obj.scaleY,
//         angle: obj.angle,
//         originX: obj.originX,
//         originY: obj.originY,
//         flipX: obj.flipX,
//         flipY: obj.flipY,
//       }));

//       // Create a group from the selected items
//       const newGroup = new fabric.Group(selectedItem, {
//         id: 'dieCutGroup', // Custom property to identify the group
//         selectable: true,  // Set whether the group should be selectable
//         evented: true      // Set whether the group should trigger events
//       });

//       // Add the group to the canvas
//       canvas.add(newGroup);
//       canvas.renderAll(); 
    

//       // Center the group on the canvas
//       adjustViewportToElement({ canvas, obj: newGroup });

//       // Calculate the new frame size with the grow value
//       const newWidthWithGrow = newGroup.width! + grow;
//       const newHeightWithGrow = newGroup.height! + grow;
      

//       // Ungroup the objects and restore original positions
//       newGroup.ungroupOnCanvas();
//       selectedItem.forEach((obj:any, index:any) => {
//         obj.set(originalStates[index]);
//         obj.setCoords(); // Update the object's coordinates
//       });
     

//       // Center the group on the canvas
//       adjustViewportToElement({ canvas, obj: newGroup });

//       canvas.remove(newGroup);
//       canvas.renderAll(); 

//     }

//     return () => {
//         if (canvas) {
//             deletePrevDieCut(canvas);
//         }
//     };
// }, [dieCutResult, fabricCanvasRef, materialDefault, grow, backgroundColor, selectedItem,  dispatch]);



useEffect(() => {
  const canvas = fabricCanvasRef.current;

  if (!canvas) {
    console.error('Canvas is not initialized');
    return;
  }

  if (dieCutResult && selectedItem && canvas && canvasProperties.grow) {
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
  

    // Calculate the scale factor to fit dieCutImage into the frame while maintaining aspect ratio
    const aspectRatio = dieCutImage.width! / dieCutImage.height!;
    
    dieCutImage.scaleToWidth(frameWidth);
    dieCutImage.scaleToHeight(frameHeight);

    const originalViewportTransform = canvas.viewportTransform?.slice() || [1, 0, 0, 1, 0, 0];
    const zoom = originalViewportTransform[0];

    // Calculate the frame's position considering the viewport transform
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();      

    // Adjust for zoom in the original viewport transformation
    const offsetX = originalViewportTransform[4] / zoom;
    const offsetY = originalViewportTransform[5] / zoom;

    // Calculate the frame's position centered on the canvas
    const frameLeft = (canvasWidth / zoom - frameWidth) / 2 - offsetX;
    const frameTop = (canvasHeight / zoom - frameHeight) / 2 - offsetY;

    // Calculate the new position for the dieCutImage to center it on the frame area
    const dieCutImageLeft = frameLeft + (frameWidth) / 2;
    const dieCutImageTop = frameTop + (frameHeight) / 2;

    // Set the position of the dieCutImage in the center of the frame area
    dieCutImage.set({
      left: frameLeft,
      top: frameTop - 50,
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

    // Ensure all selected items are instances of fabric.Object
    const validItems = selectedItem.map(item => item.object).filter((obj): obj is fabric.Object => obj instanceof fabric.Object);

    // Backup the original positions and scales of the valid items
    const originalStates = validItems.map(item => ({
      object: item,
      left: item.left,
      top: item.top,
      scaleX: item.scaleX,
      scaleY: item.scaleY
    }));

    console.log('validItems', validItems);

    // Create a group from the selected items
    const newGroup = new fabric.Group(validItems, {
      id: 'dieCutGroup', // Custom property to identify the group
      selectable: true,  // Set whether the group should be selectable
      evented: true      // Set whether the group should trigger events
    });

    // Add the group to the canvas
    canvas.add(newGroup);
    canvas.renderAll();

    // Center the group on the canvas
    const groupCenter = {
      x: (canvas.getWidth() - newGroup.width! * zoom) / 2,
      y: (canvas.getHeight() - newGroup.height! * zoom) / 2
    };

    newGroup.set({
      left: groupCenter.x - originalViewportTransform[4],
      top: groupCenter.y - originalViewportTransform[5],
      scaleX: (newGroup.width! + canvasProperties.grow) / newGroup.width!,
      scaleY: (newGroup.height! + canvasProperties.grow) / newGroup.height!,
    });

    // Ungroup the items to retain their individual positions and scales
    newGroup._restoreObjectsState();
    newGroup.destroy();

    // Restore the original positions and scales of the valid items
    originalStates.forEach(state => {
      state.object.set({
        left: state.left,
        top: state.top,
        scaleX: state.scaleX,
        scaleY: state.scaleY
      });
    });

    canvas.remove(newGroup);
    canvas.renderAll();

    console.log("This function runs after all objects are added and rendered.");
  }

  return () => {
    if (canvas) {
      deletePrevDieCut(canvas);
    }
  };
}, [dieCutResult, fabricCanvasRef, materialDefault, frameWidth, frameHeight, canvasProperties.grow, backgroundColor, selectedItem, dispatch]);


  return { dieCutResult, handleDownloadSVG, handleDieCut };
};



