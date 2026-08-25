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
  setOffsetY = 30 
}: AdjustViewportProps): void => {
  if (canvas && obj) {
    const canvasWidth = frame && frameWidth ? frameWidth : canvas.getWidth();
    const canvasHeight = frame && frameHeight ? frameHeight : canvas.getHeight();
    const rectWidth = obj.getScaledWidth();
    const rectHeight = obj.getScaledHeight();
    if (![canvasWidth, canvasHeight, rectWidth, rectHeight].every(Number.isFinite) || canvasWidth <= 0 || canvasHeight <= 0 || rectWidth <= 0 || rectHeight <= 0) return;
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
  }
};
