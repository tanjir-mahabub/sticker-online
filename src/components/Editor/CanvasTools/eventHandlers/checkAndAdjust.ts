import { fabric } from 'fabric';
import { checkSizeAndAdjustViewport } from './checkSizeAndAdjustViewport';
import { findObjectById } from './canvasFunctions';

export const checkAndAdjust = (fabricCanvas: fabric.Canvas) => () => {
  const selectedObject = fabricCanvas.getActiveObject();
  // const selectedObject = findObjectById(fabricCanvas, "dieCutImage");
  if (selectedObject) {
    checkSizeAndAdjustViewport(fabricCanvas, selectedObject);
  }
};
