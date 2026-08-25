import { fabric } from "fabric";
import { getFrameBounds } from "./constrainObjectToFrame";

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
  const bounds = getFrameBounds(canvas, frameWidth, frameHeight, verticalOffset);
  const frameCenter = new fabric.Point((bounds.left + bounds.right) / 2, (bounds.top + bounds.bottom) / 2);

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
