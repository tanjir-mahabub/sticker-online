import { fabric } from "fabric";

interface FramePlacementOptions {
  frameWidth: number;
  frameHeight: number;
  coverage?: number;
  verticalOffset?: number;
}

/** Places a new object in frame space, independent of viewport pan and zoom. */
export const placeObjectInFrame = (
  canvas: fabric.Canvas,
  object: fabric.Object,
  { frameWidth, frameHeight, coverage = 0.68, verticalOffset = -30 }: FramePlacementOptions,
) => {
  const viewport = canvas.viewportTransform ?? fabric.iMatrix.concat();
  const screenCenter = new fabric.Point(canvas.getWidth() / 2, canvas.getHeight() / 2 + verticalOffset);
  const frameCenter = fabric.util.transformPoint(screenCenter, fabric.util.invertTransform(viewport));

  const safeWidth = Math.max(40, frameWidth * coverage);
  const safeHeight = Math.max(40, frameHeight * coverage);
  const objectWidth = Math.max(1, object.getScaledWidth());
  const objectHeight = Math.max(1, object.getScaledHeight());
  const fitScale = Math.min(1, safeWidth / objectWidth, safeHeight / objectHeight);

  object.set({
    originX: "center",
    originY: "center",
    left: frameCenter.x,
    top: frameCenter.y,
    scaleX: (object.scaleX ?? 1) * fitScale,
    scaleY: (object.scaleY ?? 1) * fitScale,
  });
  object.setCoords();
  return object;
};
