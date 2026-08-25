import { useCallback, useEffect, useMemo } from "react";
import { fabric } from "fabric";
import { useDispatch } from "react-redux";
import { deleteImage } from "@/redux/features/imagePreviewSlice";
import { removeText } from "@/redux/features/textSlice";
import { setCanvasProperties } from "@/redux/features/canvasSlice";
import { useCanvas } from "@/context/CanvasContext";
import { getFrameBounds } from "@/components/Editor/CanvasTools/eventHandlers/constrainObjectToFrame";
import { useAppSelector } from "@/redux/store";

interface ControlButtonsProps {
  canvasRef: React.MutableRefObject<fabric.Canvas | null>;
  updateButtonStates: () => void;
}

const artworkStack = (canvas: fabric.Canvas) => canvas.getObjects().filter((object) => object.data?.category !== "generated");

export const useControlButtons = ({ canvasRef, updateButtonStates }: ControlButtonsProps) => {
  
  const dispatch = useDispatch();
  const { saveState } = useCanvas();
  const { frameWidth, frameHeight } = useAppSelector((state) => state.canvas);

  const commit = useCallback(() => {
    canvasRef.current?.requestRenderAll();
    saveState();
    updateButtonStates();
  }, [canvasRef, saveState, updateButtonStates]);

  const handleFlipX = useCallback(() => {
    const activeObject = canvasRef.current?.getActiveObject();
    if (activeObject) {
      activeObject.set('flipX', !activeObject.flipX);
      commit();
    }
  }, [canvasRef, commit]);

  const handleFlipY = useCallback(() => {
    const activeObject = canvasRef.current?.getActiveObject();
    if (activeObject) {
      activeObject.set('flipY', !activeObject.flipY);
      commit();
    }
  }, [canvasRef, commit]);

  const handleSendFront = useCallback(() => {
    const canvas = canvasRef.current;
    const activeObject = canvas?.getActiveObject();
    const layers = canvas ? artworkStack(canvas) : [];
    const target = layers.at(-1);
    if (canvas && activeObject && target && activeObject !== target) {
      canvas.moveTo(activeObject, canvas.getObjects().indexOf(target));
      commit();
    }
  }, [canvasRef, commit]);

  const handleSendBack = useCallback(() => {
    const canvas = canvasRef.current;
    const activeObject = canvas?.getActiveObject();
    const layers = canvas ? artworkStack(canvas) : [];
    const target = layers[0];
    if (canvas && activeObject && target && activeObject !== target) {
      canvas.moveTo(activeObject, canvas.getObjects().indexOf(target));
      commit();
    }
  }, [canvasRef, commit]);

  const handleSendForward = useCallback(() => {
    const canvas = canvasRef.current;
    const activeObject = canvas?.getActiveObject();
    const layers = canvas ? artworkStack(canvas) : [];
    const index = activeObject ? layers.indexOf(activeObject) : -1;
    const target = layers[index + 1];
    if (canvas && activeObject && target) {
      canvas.moveTo(activeObject, canvas.getObjects().indexOf(target));
      commit();
    }
  }, [canvasRef, commit]);

  const handleSendBackward = useCallback(() => {
    const canvas = canvasRef.current;
    const activeObject = canvas?.getActiveObject();
    const layers = canvas ? artworkStack(canvas) : [];
    const index = activeObject ? layers.indexOf(activeObject) : -1;
    const target = layers[index - 1];
    if (canvas && activeObject && target) {
      canvas.moveTo(activeObject, canvas.getObjects().indexOf(target));
      commit();
    }
  }, [canvasRef, commit]);

  const handleDelete = useCallback(() => {
    const activeObject = canvasRef.current?.getActiveObject();
    if (activeObject) {
      activeObject.id && activeObject.type === "image" && dispatch(deleteImage(activeObject.id))        
      activeObject.id && activeObject.data?.category === "motiv" && dispatch(deleteImage(activeObject.id))        
      activeObject.id && activeObject.data?.category === "text" && dispatch(removeText(activeObject.id))           
      canvasRef.current?.remove(activeObject);
      commit();
    }
  }, [canvasRef, commit, dispatch]);
  

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
      const bounds = getFrameBounds(canvas, frameWidth, frameHeight);
      activeObject.set({
        originX: "center",
        originY: "center",
        left: (bounds.left + bounds.right) / 2,
        top: (bounds.top + bounds.bottom) / 2,
      });
  
      activeObject.setCoords();
      commit();
    }
  }, [canvasRef, commit, frameHeight, frameWidth]);

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
