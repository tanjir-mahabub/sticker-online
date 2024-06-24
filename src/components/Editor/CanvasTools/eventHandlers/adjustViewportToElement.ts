import { fabric } from 'fabric';

export const adjustViewportToElement = (canvas: fabric.Canvas, obj: fabric.Object) => {
  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();
  const rectWidth = obj.getScaledWidth();
  const rectHeight = obj.getScaledHeight();

  const scaleX = (canvasWidth * 0.75) / rectWidth;
  const scaleY = (canvasHeight * 0.75) / rectHeight;
  const scale = Math.min(scaleX, scaleY);

  const zoom = scale < 1 ? scale : 1;

  canvas.setZoom(zoom);

  const viewportTransform = canvas.viewportTransform!;
  viewportTransform[4] = (canvasWidth - rectWidth * zoom) / 2 - obj.left! * zoom;
  viewportTransform[5] = (canvasHeight - rectHeight * zoom) / 2 - obj.top! * zoom;

  canvas.requestRenderAll();

  console.log('Adjusted canvas viewport to fit element within 75% of canvas size.');
};
