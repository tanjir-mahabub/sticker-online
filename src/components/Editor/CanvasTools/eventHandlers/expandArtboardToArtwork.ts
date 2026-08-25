import { pixelToCm } from "@/components/Utils/function";
import { fabric } from "fabric";

const ARTWORK_CATEGORIES = new Set(["image", "motiv", "text"]);

interface ArtboardOptions {
  frameWidth: number;
  frameHeight: number;
  cutlinePadding: number;
  verticalOffset?: number;
  fitViewport?: boolean;
  frameCenterX?: number | null;
  frameCenterY?: number | null;
}

export interface ArtboardExpansion {
  frameWidth: number;
  frameHeight: number;
  bredd: number;
  hojd: number;
  zoom: number;
  centerX: number;
  centerY: number;
  expanded: boolean;
  resized: boolean;
  moved: boolean;
  zoomChanged: boolean;
}

/**
 * Fits the production artboard tightly around all editable artwork.
 */
export const expandArtboardToArtwork = (
  canvas: fabric.Canvas,
  {
    frameWidth,
    frameHeight,
    cutlinePadding,
    verticalOffset = -30,
    fitViewport = false,
    frameCenterX = null,
    frameCenterY = null,
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

  const safetyGap = Math.max(6, Math.min(36, cutlinePadding)) + 8;

  const centreX = (left + right) / 2;
  const centreY = (top + bottom) / 2;
  const nextWidth = Math.max(1, Math.ceil(right - left + safetyGap * 2));
  const nextHeight = Math.max(1, Math.ceil(bottom - top + safetyGap * 2));
  const expanded = nextWidth > frameWidth + 0.5 || nextHeight > frameHeight + 0.5;
  const resized = Math.abs(nextWidth - frameWidth) > 0.5 || Math.abs(nextHeight - frameHeight) > 0.5;
  const moved = !Number.isFinite(frameCenterX) || !Number.isFinite(frameCenterY) ||
    Math.abs(centreX - frameCenterX!) > 0.5 || Math.abs(centreY - frameCenterY!) > 0.5;

  const currentZoom = canvas.getZoom() || 1;
  let nextZoom = currentZoom;
  if (fitViewport && (resized || moved)) {
    const availableWidth = Math.max(160, canvas.getWidth() - Math.min(240, canvas.getWidth() * 0.18));
    const availableHeight = Math.max(160, canvas.getHeight() - Math.min(240, canvas.getHeight() * 0.22));
    nextZoom = Math.max(0.05, Math.min(1, availableWidth / nextWidth, availableHeight / nextHeight));
    const screenX = canvas.getWidth() / 2;
    const screenY = canvas.getHeight() / 2 + verticalOffset;
    canvas.setViewportTransform([nextZoom, 0, 0, nextZoom, screenX - centreX * nextZoom, screenY - centreY * nextZoom]);
    canvas.calcOffset();
  }

  return {
    frameWidth: nextWidth,
    frameHeight: nextHeight,
    bredd: pixelToCm(nextWidth),
    hojd: pixelToCm(nextHeight),
    zoom: nextZoom,
    centerX: centreX,
    centerY: centreY,
    expanded,
    resized,
    moved,
    zoomChanged: Math.abs(nextZoom - currentZoom) > 0.001,
  };
};
