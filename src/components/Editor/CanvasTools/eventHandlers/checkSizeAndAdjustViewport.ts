import { fabric } from 'fabric';
import { adjustViewportToElement } from './adjustViewportToElement';

export const checkSizeAndAdjustViewport = (canvas: fabric.Canvas, obj: fabric.Object) => {
  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();
  const rectWidth = obj.getScaledWidth();
  const rectHeight = obj.getScaledHeight();

  if (rectWidth > canvasWidth * 0.50 || rectHeight > canvasHeight * 0.50) {
    console.log('Rectangle size exceeds 50% of the canvas size');
    adjustViewportToElement({canvas, obj});
  } 
};
