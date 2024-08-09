import { fabric } from 'fabric';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Controls from './Controls';
import TextPath from './TextPath';
import { useAppSelector } from '@/redux/store';
import ImageComponent from './ImageComponent';
import { useCanvas } from '@/context/CanvasContext';
import { useCanvasSetup } from '@/hooks/useCanvasSetup';
import ControlElements from './ControlElements';
import Spinner from '@/components/Utils/Spinner';
import { useDispatch } from 'react-redux';
import { setCanvasProperties } from '@/redux/features/canvasSlice';
import CanvasFrame from './CanvasFrame';
import { useDieCutEffect } from '@/hooks/useDieCutEffect';
import { adjustViewportToElement } from './eventHandlers/adjustViewportToElement';
import { pixelToCm } from '@/components/Utils/function';

const FabricCanvas: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  const hasRun = useRef(false);

  const { fabricCanvasRef, htmlCanvasRef, historyControllerRef, iconImageRef, saveState } = useCanvas();
  const canvasProperties = useAppSelector((state) => state.canvas);
  const imagePreviews = useAppSelector((state) => state.imagePreview.images);

  const dispatch = useDispatch();

  useCanvasSetup(htmlCanvasRef, fabricCanvasRef, historyControllerRef, iconImageRef, saveState);

  const { handleDieCut } = useDieCutEffect();

  const handleMouseDown = useCallback((e: any) => {
    if (e.target !== null) {
      dispatch(setCanvasProperties({ hasSelected: true }));
    } else {
      dispatch(setCanvasProperties({ hasSelected: false }));
    }
  }, [dispatch]);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      canvas.preserveObjectStacking = true;
      canvas.renderAll();
      setIsReady(true);

      canvas.on('mouse:down', handleMouseDown);

      dispatch(setCanvasProperties({
        isLoading: false
      }));

      return () => {
        canvas.off('mouse:down', handleMouseDown);
      };
    }
  }, [fabricCanvasRef, handleMouseDown, dispatch]);  

  
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
  
    if (!canvas) {
      console.error('Canvas is not initialized');
      return;
    }
  
    const runAfterReload = () => {
      const zoom = canvas.getZoom();
      const selectedObjects = canvas.getObjects();
  
      if (!selectedObjects || selectedObjects.length === 0) {
        console.warn('No objects found on the canvas');
        return;
      }
  
      // Ensure all selected objects are instances of fabric.Object
      selectedObjects.forEach(obj => {
        if (!(obj instanceof fabric.Object)) {
          console.error('Object is not a fabric.Object:', obj);
        } else {
          console.log('Valid fabric.Object:', obj);
        }
      });
  
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
        id: 'dieCutGroupNew', // Custom property to identify the group
        selectable: true,  // Set whether the group should be selectable
        evented: true      // Set whether the group should trigger events
      });
  
      // Add the group to the canvas
      canvas.add(group);
      canvas.renderAll(); // Render the canvas to show the new group
  
      if (group) {
        // Center the group on the canvas
        adjustViewportToElement({ canvas, obj: group });
  
        // Calculate the new frame size with the grow value
        const groupWidth = group.width ?? 0; // Use default value of 0 if undefined
        const groupHeight = group.height ?? 0; // Use default value of 0 if undefined
        const newWidthWithGrow = groupWidth + canvasProperties.grow * 2;
        const newHeightWithGrow = groupHeight + canvasProperties.grow * 2;
        const newBredd = pixelToCm(newWidthWithGrow);
        const newHojd = pixelToCm(newHeightWithGrow);
        dispatch(setCanvasProperties({
          bredd: newBredd,
          hojd: newHojd,
          frameWidth: newWidthWithGrow,
          frameHeight: newHeightWithGrow,
          canvasInitialZoom: zoom
        }));
  
        // Adjust the group size based on the grow value
        group.set({
          scaleX: newWidthWithGrow / groupWidth,
          scaleY: newHeightWithGrow / groupHeight
        });
        group.setCoords(); // Update the group's coordinates
  
        canvas.renderAll();
  
        // Ungroup the objects and restore original positions
        if (typeof group.ungroupOnCanvas === 'function') {
          group.ungroupOnCanvas();
        } else {
          console.error('Group does not have ungroupOnCanvas method', group);
        }
  
        selectedObjects.forEach((obj, index) => {
          obj.set(originalStates[index]);
          obj.setCoords(); // Update the object's coordinates
        });
  
        canvas.remove(group);
        canvas.renderAll();
      }
  
      console.log("This function runs after all objects are added and rendered.");
  
      // Your function logic here
      if (canvasProperties.grow) {
        // handleDieCut(canvasProperties.grow);
      }
    };
  
    const handleAfterRender = () => {
      // Check if all objects are rendered and we haven't run the function yet
      if (!hasRun.current && canvas.getObjects().length > 0) {
        hasRun.current = true;
        runAfterReload();
      }
    };
  
    // Attach the after:render event listener
    canvas.on('after:render', handleAfterRender);
  
    // Clean up event listener on component unmount
    return () => {
      canvas.off('after:render', handleAfterRender);
    };
  }, [fabricCanvasRef, canvasProperties.grow, dispatch, handleDieCut]);
  
  
  
  

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Perform any necessary cleanup or state saving here
      console.log('Page is about to be unloaded.');

      // If you want to show a confirmation dialog to the user, set event.returnValue
      event.returnValue = ''; // Setting this property shows the confirmation dialog in some browsers.
      return ''; // This line is necessary for some browsers to show the confirmation dialog.
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div>
      {canvasProperties.isLoading && <Spinner />}
      <CanvasFrame fabricCanvas={fabricCanvasRef.current} />
      <div className='absolute z-[100]'>
        <Controls canvasRef={fabricCanvasRef} />
      </div>
      {fabricCanvasRef.current && isReady && <TextPath fabricCanvas={fabricCanvasRef} saveState={saveState} />}
      {fabricCanvasRef.current && isReady && <ImageComponent fabricCanvas={fabricCanvasRef} images={imagePreviews} saveState={saveState} />}
      <ControlElements canvasRef={fabricCanvasRef} selected={canvasProperties.hasSelected} />
      <canvas ref={htmlCanvasRef} width={canvasProperties.canvasWidth} height={canvasProperties.canvasHeight} className="bg-transparent" />
    </div>
  );
};

export default React.memo(FabricCanvas);
