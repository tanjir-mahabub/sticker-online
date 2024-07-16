import { fabric } from 'fabric';

interface AdjustViewportProps {
  canvas: fabric.Canvas; 
  obj: fabric.Object;
  frameWidth?: number;
  frameHeight?: number;
  frame?: boolean;
  setPercent?: number;
  setOffsetY?: number;
}

export const adjustViewportToElement = ({ 
  canvas, 
  obj, 
  frameWidth, 
  frameHeight, 
  frame = false, 
  setPercent = 0.5, 
  setOffsetY = 50 
}: AdjustViewportProps): void => {
  if (canvas && obj) {
    const canvasWidth = frame && frameWidth ? frameWidth : canvas.getWidth();
    const canvasHeight = frame && frameHeight ? frameHeight : canvas.getHeight();
    const rectWidth = obj.getScaledWidth();
    const rectHeight = obj.getScaledHeight();
console.log('image die---', canvasWidth, canvasHeight, rectWidth, rectHeight, '50%', canvasWidth * 0.5, canvasHeight * 0.5);
    const scaleX = (canvasWidth * setPercent) / rectWidth;
    const scaleY = (canvasHeight * setPercent) / rectHeight;
    const scale = Math.min(scaleX, scaleY);

    const zoom = scale < 1 ? scale : 1;

    canvas.setZoom(zoom);

    const viewportTransform = canvas.viewportTransform!;

    // Calculate the new viewport translation to center the object
    const centerX = canvasWidth / 2 - (obj.left! + rectWidth / 2) * zoom;
    const centerY = canvasHeight / 2 - (obj.top! + rectHeight / 2) * zoom;

    viewportTransform[4] = centerX;
    viewportTransform[5] = centerY - setOffsetY;

    canvas.setViewportTransform(viewportTransform);
    canvas.requestRenderAll();

    console.log('Adjusted canvas viewport to fit element within 50% of canvas size.');
  }
};
