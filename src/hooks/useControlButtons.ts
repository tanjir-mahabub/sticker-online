import { useAppSelector } from "@/redux/store";
import { useCallback, useMemo } from "react";
import { fabric } from "fabric";

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
      canvasRef.current?.remove(activeObject);
      canvasRef.current?.renderAll();
      updateButtonStates();
    }
  }, [canvasRef, updateButtonStates]);

  const handleCenterEL = useCallback(() => {
    const activeObject = canvasRef.current?.getActiveObject();
    if (activeObject) {
      activeObject.center();
      canvasRef.current?.renderAll();
      updateButtonStates();
    }
  }, [canvasRef, updateButtonStates]);

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
