export const centerObjectInViewport = (canvas: fabric.Canvas, obj: fabric.Object) => {
    const zoom = canvas.getZoom();
    const viewportTransform = canvas.viewportTransform || [1, 0, 0, 1, 0, 0];
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();

    const centerX = (canvasWidth / 2 - viewportTransform[4]) / zoom;
    const centerY = (canvasHeight / 2 - viewportTransform[5]) / zoom;

    obj.set({
      left: centerX - obj.getScaledWidth() / 2,
      top: centerY - obj.getScaledHeight() / 2,
    });

    obj.setCoords();
    canvas.renderAll();
  };