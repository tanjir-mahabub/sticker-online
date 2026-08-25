import { fabric } from "fabric";

interface ConstraintOptions {
  frameWidth: number;
  frameHeight: number;
  cutlinePadding: number;
  verticalOffset?: number;
}

export const getFrameBounds = (
  canvas: fabric.Canvas,
  frameWidth: number,
  frameHeight: number,
  verticalOffset = -30,
) => {
  const viewport = canvas.viewportTransform ?? fabric.iMatrix.concat();
  const screenCenter = new fabric.Point(canvas.getWidth() / 2, canvas.getHeight() / 2 + verticalOffset);
  const center = fabric.util.transformPoint(screenCenter, fabric.util.invertTransform(viewport));
  return {
    left: center.x - frameWidth / 2,
    top: center.y - frameHeight / 2,
    right: center.x + frameWidth / 2,
    bottom: center.y + frameHeight / 2,
  };
};

/** Keeps editable artwork inside the printable frame, including cutline allowance. */
export const constrainObjectToFrame = (
  canvas: fabric.Canvas,
  object: fabric.Object,
  { frameWidth, frameHeight, cutlinePadding, verticalOffset = -30 }: ConstraintOptions,
) => {
  if (object.data?.category === "generated") return false;
  const allowance = Math.max(2, Math.min(cutlinePadding, Math.min(frameWidth, frameHeight) * 0.18));
  const bounds = getFrameBounds(canvas, frameWidth, frameHeight, verticalOffset);
  const availableWidth = Math.max(20, frameWidth - allowance * 2);
  const availableHeight = Math.max(20, frameHeight - allowance * 2);

  object.setCoords();
  let box = object.getBoundingRect(true, true);
  const fit = Math.min(1, availableWidth / Math.max(1, box.width), availableHeight / Math.max(1, box.height));
  if (fit < 1) {
    object.scaleX = (object.scaleX ?? 1) * fit;
    object.scaleY = (object.scaleY ?? 1) * fit;
    object.setCoords();
    box = object.getBoundingRect(true, true);
  }

  const safeLeft = bounds.left + allowance;
  const safeTop = bounds.top + allowance;
  const safeRight = bounds.right - allowance;
  const safeBottom = bounds.bottom - allowance;
  let dx = 0;
  let dy = 0;
  if (box.left < safeLeft) dx = safeLeft - box.left;
  else if (box.left + box.width > safeRight) dx = safeRight - (box.left + box.width);
  if (box.top < safeTop) dy = safeTop - box.top;
  else if (box.top + box.height > safeBottom) dy = safeBottom - (box.top + box.height);

  if (dx || dy) {
    object.set({ left: (object.left ?? 0) + dx, top: (object.top ?? 0) + dy });
    object.setCoords();
  }
  return fit < 1 || Boolean(dx || dy);
};
