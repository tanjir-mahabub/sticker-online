import { useCallback, useEffect, useMemo } from "react";
import { fabric } from "fabric";
import { useDispatch } from "react-redux";
import { deleteImage } from "@/redux/features/imagePreviewSlice";
import { removeText } from "@/redux/features/textSlice";
import { setCanvasProperties } from "@/redux/features/canvasSlice";

interface ControlButtonsProps {
  canvasRef: React.MutableRefObject<fabric.Canvas | null>;
  updateButtonStates: () => void;
}

const isLastItem = (canvas: fabric.Canvas, object: fabric.Object): boolean => {
  const objects = canvas.getObjects();
  return objects.indexOf(object) === objects.length - 1;
};

const isFirstItem = (canvas: fabric.Canvas, object: fabric.Object): boolean => {
  const objects = canvas.getObjects();
  return objects.indexOf(object) === 0;
};

export const useControlButtons = ({ canvasRef, updateButtonStates }: ControlButtonsProps) => {
  
  const dispatch = useDispatch();

  const handleFlipX = useCallback(() => {
    const activeObject = canvasRef.current?.getActiveObject();
    if (activeObject) {
      activeObject.set('flipX', !activeObject.flipX);
      canvasRef.current?.renderAll();
      updateButtonStates();
    }
  }, [canvasRef, updateButtonStates]);

  const handleFlipY = useCallback(() => {
    const activeObject = canvasRef.current?.getActiveObject();
    if (activeObject) {
      activeObject.set('flipY', !activeObject.flipY);
      canvasRef.current?.renderAll();
      updateButtonStates();
    }
  }, [canvasRef, updateButtonStates]);

  const handleSendFront = useCallback(() => {
    const activeObject = canvasRef.current?.getActiveObject();
    if (activeObject && !isLastItem(canvasRef.current!, activeObject)) {
      canvasRef.current?.bringToFront(activeObject);
      canvasRef.current?.renderAll();
      updateButtonStates();
    }
  }, [canvasRef, updateButtonStates]);

  const handleSendBack = useCallback(() => {
    const activeObject = canvasRef.current?.getActiveObject();
    if (activeObject && !isFirstItem(canvasRef.current!, activeObject)) {
      canvasRef.current?.sendToBack(activeObject);
      canvasRef.current?.renderAll();
      updateButtonStates();
    }
  }, [canvasRef, updateButtonStates]);

  const handleSendForward = useCallback(() => {
    const activeObject = canvasRef.current?.getActiveObject();
    if (activeObject && !isLastItem(canvasRef.current!, activeObject)) {
      canvasRef.current?.bringForward(activeObject);
      canvasRef.current?.renderAll();
      updateButtonStates();
    }
  }, [canvasRef, updateButtonStates]);

  const handleSendBackward = useCallback(() => {
    const activeObject = canvasRef.current?.getActiveObject();
    if (activeObject && !isFirstItem(canvasRef.current!, activeObject)) {
      canvasRef.current?.sendBackwards(activeObject);
      canvasRef.current?.renderAll();
      updateButtonStates();
    }
  }, [canvasRef, updateButtonStates]);

  const handleDelete = useCallback(() => {
    const activeObject = canvasRef.current?.getActiveObject();
    if (activeObject) {
      activeObject.id && activeObject.data.category === "image" && dispatch(deleteImage(activeObject.id))  
      activeObject.id && activeObject.data.category === "text" && dispatch(removeText(activeObject.id))           
      canvasRef.current?.remove(activeObject);
      canvasRef.current?.renderAll();
      updateButtonStates();
    }
  }, [canvasRef, updateButtonStates, dispatch]);

  // const handleCenterEL = useCallback(() => {
  //   const activeObject = canvasRef.current?.getActiveObject();
  //   if (activeObject) {
  //     activeObject.center();
  //     canvasRef.current?.renderAll();
  //     updateButtonStates();
  //   }
  // }, [canvasRef, updateButtonStates]);

  const handleCenterEL = useCallback(() => {
    const canvas = canvasRef.current;
    const activeObject = canvas?.getActiveObject();
  
    if (canvas && activeObject) {
      const zoom = canvas.getZoom();
      const viewportTransform = canvas.viewportTransform!;
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();
  
      // Calculate the new position considering the current viewport transformation
      const centerX = (canvasWidth / 2 - viewportTransform[4]) / zoom;
      const centerY = (canvasHeight / 2 - viewportTransform[5]) / zoom;
  
      activeObject.set({
        left: centerX - activeObject.getScaledWidth() / 2,
        top: (centerY - activeObject.getScaledHeight() / 2) - 50,
      });
  
      activeObject.setCoords();
      canvas.renderAll();
      updateButtonStates();
    }
  }, [canvasRef, updateButtonStates]);

  useEffect(() => {
    const activeObject = canvasRef.current?.getActiveObject();
    if(activeObject) {
      dispatch(setCanvasProperties({ hasSelected: true }))
    } else {
      dispatch(setCanvasProperties({ hasSelected: false }))
    }
  }, [canvasRef, dispatch])

  return useMemo(() => ({
    handleFlipX,
    handleFlipY,
    handleSendFront,
    handleSendBack,
    handleSendForward,
    handleSendBackward,
    handleDelete,
    handleCenterEL
  }), [
    handleFlipX,
    handleFlipY,
    handleSendFront,
    handleSendBack,
    handleSendForward,
    handleSendBackward,
    handleDelete,
    handleCenterEL
  ]);
};
