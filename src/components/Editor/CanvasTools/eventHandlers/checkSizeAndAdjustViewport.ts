import { fabric } from 'fabric';
import { adjustViewportToElement } from './adjustViewportToElement';

export const checkSizeAndAdjustViewport = (canvas: fabric.Canvas, obj: fabric.Object) => {
  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();
  const rectWidth = obj.getScaledWidth();
  const rectHeight = obj.getScaledHeight();

  if (rectWidth > canvasWidth * 0.20 || rectHeight > canvasHeight * 0.20) {
    console.log('Rectangle size exceeds 30% of the canvas size');
  } 
  adjustViewportToElement(canvas, obj);
};
