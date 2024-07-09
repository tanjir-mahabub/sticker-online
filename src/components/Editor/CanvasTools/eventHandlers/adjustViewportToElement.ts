// import { fabric } from 'fabric';

// export const adjustViewportToElement = (canvas: fabric.Canvas, obj: fabric.Object) => {
//   const canvasWidth = canvas.getWidth();
//   const canvasHeight = canvas.getHeight();
//   const rectWidth = obj.getScaledWidth();
//   const rectHeight = obj.getScaledHeight();

//   const scaleX = (canvasWidth * 0.50) / rectWidth;
//   const scaleY = (canvasHeight * 0.50) / rectHeight;
//   const scale = Math.min(scaleX, scaleY);

//   const zoom = scale < 1 ? scale : 1;

//   canvas.setZoom(zoom);

//   const viewportTransform = canvas.viewportTransform!;
//   viewportTransform[4] = (canvasWidth - rectWidth * zoom) / 2 - obj.left! * zoom;
//   viewportTransform[5] = (canvasHeight - rectHeight * zoom) / 2 - obj.top! * zoom;

//   canvas.requestRenderAll();

//   console.log('Adjusted canvas viewport to fit element within 50% of canvas size.');
// };



import { fabric } from 'fabric';

export const adjustViewportToElement = (canvas: fabric.Canvas, obj: fabric.Object) => {
  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();
  const rectWidth = obj.getScaledWidth();
  const rectHeight = obj.getScaledHeight();

  const scaleX = (canvasWidth * 0.50) / rectWidth;
  const scaleY = (canvasHeight * 0.50) / rectHeight;
  const scale = Math.min(scaleX, scaleY);

  const zoom = scale < 1 ? scale : 1;

  canvas.setZoom(zoom);

  const viewportTransform = canvas.viewportTransform!;

  // Calculate the new viewport translation to center the object
  const centerX = canvasWidth / 2 - (obj.left! + rectWidth / 2) * zoom;
  const centerY = canvasHeight / 2 - (obj.top! + rectHeight / 2) * zoom;

  viewportTransform[4] = centerX;
  viewportTransform[5] = centerY - 60;

  canvas.setViewportTransform(viewportTransform);
  canvas.requestRenderAll();

  console.log('Adjusted canvas viewport to fit element within 50% of canvas size.');
};

