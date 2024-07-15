import { fabric } from 'fabric';

export const handleMouseWheel = (fabricCanvas: fabric.Canvas) => (opt: any) => {
  const delta = opt.e.deltaY;
  const activeObject = fabricCanvas.getActiveObject();
  if (activeObject) {
    zoomOnObject(fabricCanvas, activeObject, delta);
  } else {
    const zoom = fabricCanvas.getZoom();
    const newZoom = zoom * (0.999 ** delta);
    const clampedZoom = Math.max(0.01, Math.min(20, newZoom));
    fabricCanvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, clampedZoom);
    fabricCanvas.requestRenderAll();
  }
  opt.e.preventDefault();
  opt.e.stopPropagation();
};

const zoomOnObject = (canvas: fabric.Canvas, obj: fabric.Object, delta: number) => {
  const zoom = canvas.getZoom();
  const newZoom = zoom * (0.999 ** delta);

  const clampedZoom = Math.max(0.01, Math.min(20, newZoom));

  const center = obj.getCenterPoint();
  canvas.zoomToPoint({ x: center.x, y: center.y }, clampedZoom);
  canvas.requestRenderAll();
};
