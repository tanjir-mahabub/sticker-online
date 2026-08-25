import { pixelToCm } from "@/components/Utils/function";
import { fabric } from "fabric";
import { getFrameBounds } from "./constrainObjectToFrame";

const ARTWORK_CATEGORIES = new Set(["image", "motiv", "text"]);

interface ArtboardOptions {
  frameWidth: number;
  frameHeight: number;
  cutlinePadding: number;
  verticalOffset?: number;
  fitViewport?: boolean;
}

export interface ArtboardExpansion {
  frameWidth: number;
  frameHeight: number;
  bredd: number;
  hojd: number;
  zoom: number;
  expanded: boolean;
  zoomChanged: boolean;
}

/**
 * Expands the production artboard around all editable artwork.
 *
 * The artboard deliberately never shrinks during editing. This prevents the
 * canvas, measurements and transform controls from jumping when an object is
 * moved back towards the centre or temporarily removed.
 */
export const expandArtboardToArtwork = (
  canvas: fabric.Canvas,
  {
    frameWidth,
    frameHeight,
    cutlinePadding,
    verticalOffset = -30,
    fitViewport = false,
  }: ArtboardOptions,
): ArtboardExpansion | null => {
  const artwork = canvas.getObjects().filter((object) => ARTWORK_CATEGORIES.has(object.data?.category));
  if (!artwork.length) return null;

  artwork.forEach((object) => object.setCoords());
  const boxes = artwork.map((object) => object.getBoundingRect(true, true));
  const left = Math.min(...boxes.map((box) => box.left));
  const top = Math.min(...boxes.map((box) => box.top));
  const right = Math.max(...boxes.map((box) => box.left + box.width));
  const bottom = Math.max(...boxes.map((box) => box.top + box.height));

  const currentBounds = getFrameBounds(canvas, frameWidth, frameHeight, verticalOffset);
  const centreX = (currentBounds.left + currentBounds.right) / 2;
  const centreY = (currentBounds.top + currentBounds.bottom) / 2;
  const safetyGap = Math.max(6, Math.min(36, cutlinePadding)) + 8;

  const requiredWidth = Math.ceil(2 * (Math.max(Math.abs(left - centreX), Math.abs(right - centreX)) + safetyGap));
  const requiredHeight = Math.ceil(2 * (Math.max(Math.abs(top - centreY), Math.abs(bottom - centreY)) + safetyGap));
  const nextWidth = Math.max(frameWidth, requiredWidth);
  const nextHeight = Math.max(frameHeight, requiredHeight);
  const expanded = nextWidth > frameWidth + 0.5 || nextHeight > frameHeight + 0.5;

  const currentZoom = canvas.getZoom() || 1;
  let nextZoom = currentZoom;
  if (fitViewport && expanded) {
    const availableWidth = Math.max(160, canvas.getWidth() - Math.min(240, canvas.getWidth() * 0.18));
    const availableHeight = Math.max(160, canvas.getHeight() - Math.min(240, canvas.getHeight() * 0.22));
    nextZoom = Math.max(0.05, Math.min(currentZoom, availableWidth / nextWidth, availableHeight / nextHeight));
    if (nextZoom < currentZoom - 0.001) {
      canvas.zoomToPoint(
        new fabric.Point(canvas.getWidth() / 2, canvas.getHeight() / 2 + verticalOffset),
        nextZoom,
      );
      canvas.calcOffset();
    }
  }

  return {
    frameWidth: nextWidth,
    frameHeight: nextHeight,
    bredd: pixelToCm(nextWidth),
    hojd: pixelToCm(nextHeight),
    zoom: nextZoom,
    expanded,
    zoomChanged: nextZoom < currentZoom - 0.001,
  };
};
