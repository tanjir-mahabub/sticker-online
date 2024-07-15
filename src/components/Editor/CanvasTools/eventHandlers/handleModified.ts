import { fabric } from 'fabric';
import { checkSizeAndAdjustViewport } from './checkSizeAndAdjustViewport';

export const handleModified = (fabricCanvas: fabric.Canvas) => () => {
  const selectedObject = fabricCanvas.getActiveObject();
  if (selectedObject) {
    checkSizeAndAdjustViewport(fabricCanvas, selectedObject);
  }
};
