import { fabric } from "fabric";
import { curveCatmullRomClosed, line } from "d3-shape";
import geom from "@/lib/geom";

export const DIE_CUT_BACKGROUND_ID = "dieCutImage";
export const DIE_CUT_LINE_ID = "dieCutCutline";

export interface ContourOptions {
  padding: number;
  resolution?: number;
  alphaThreshold?: number;
  minimumIslandArea?: number;
  maximumHoleArea?: number;
  simplifyTolerance?: number;
}

export interface ContourBounds {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface ContourResult {
  pathData: string;
  bounds: ContourBounds;
  componentCount: number;
}

const isArtwork = (object: fabric.Object) => {
  const category = object.data?.category;
  return object.visible !== false && object.opacity !== 0 &&
    (category === "image" || category === "motiv" || category === "text") &&
    object.id !== DIE_CUT_BACKGROUND_ID && object.id !== DIE_CUT_LINE_ID;
};

const cloneObject = (object: fabric.Object) => new Promise<fabric.Object>((resolve, reject) => {
  object.clone((clone: fabric.Object) => clone ? resolve(clone) : reject(new Error("Unable to clone canvas object")), ["id", "data"]);
});

const unionBounds = (objects: fabric.Object[], padding: number): ContourBounds => {
  const boxes = objects.map((object) => object.getBoundingRect(true, true));
  const left = Math.min(...boxes.map((box) => box.left)) - padding;
  const top = Math.min(...boxes.map((box) => box.top)) - padding;
  const right = Math.max(...boxes.map((box) => box.left + box.width)) + padding;
  const bottom = Math.max(...boxes.map((box) => box.top + box.height)) + padding;
  return { left, top, width: Math.max(1, right - left), height: Math.max(1, bottom - top) };
};

const dilate = (source: Uint8Array, width: number, height: number, radius: number) => {
  const size = width * height;
  const distance = new Float32Array(size);
  const infinity = width + height;
  for (let index = 0; index < size; index += 1) distance[index] = source[index] ? 0 : infinity;

  const diagonal = Math.SQRT2;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      let value = distance[index];
      if (x > 0) value = Math.min(value, distance[index - 1] + 1);
      if (y > 0) value = Math.min(value, distance[index - width] + 1);
      if (x > 0 && y > 0) value = Math.min(value, distance[index - width - 1] + diagonal);
      if (x + 1 < width && y > 0) value = Math.min(value, distance[index - width + 1] + diagonal);
      distance[index] = value;
    }
  }
  for (let y = height - 1; y >= 0; y -= 1) {
    for (let x = width - 1; x >= 0; x -= 1) {
      const index = y * width + x;
      let value = distance[index];
      if (x + 1 < width) value = Math.min(value, distance[index + 1] + 1);
      if (y + 1 < height) value = Math.min(value, distance[index + width] + 1);
      if (x + 1 < width && y + 1 < height) value = Math.min(value, distance[index + width + 1] + diagonal);
      if (x > 0 && y + 1 < height) value = Math.min(value, distance[index + width - 1] + diagonal);
      distance[index] = value;
    }
  }

  const result = new Uint8Array(size);
  for (let index = 0; index < size; index += 1) result[index] = distance[index] <= radius ? 1 : 0;
  return result;
};

const fillSmallHoles = (mask: Uint8Array, width: number, height: number, maximumArea: number) => {
  if (maximumArea <= 0) return mask;
  const visited = new Uint8Array(mask.length);
  const queue = new Int32Array(mask.length);
  const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]] as const;

  for (let start = 0; start < mask.length; start += 1) {
    if (mask[start] || visited[start]) continue;
    let head = 0;
    let tail = 0;
    let touchesEdge = false;
    const component: number[] = [];
    queue[tail++] = start;
    visited[start] = 1;

    while (head < tail) {
      const index = queue[head++];
      component.push(index);
      const x = index % width;
      const y = Math.floor(index / width);
      if (x === 0 || y === 0 || x === width - 1 || y === height - 1) touchesEdge = true;
      for (const [dx, dy] of neighbours) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        const next = ny * width + nx;
        if (!mask[next] && !visited[next]) {
          visited[next] = 1;
          queue[tail++] = next;
        }
      }
    }
    if (!touchesEdge && component.length <= maximumArea) component.forEach((index) => { mask[index] = 1; });
  }
  return mask;
};

interface Component { pixels: number[]; start: [number, number]; }

const findComponents = (mask: Uint8Array, width: number, height: number, minimumArea: number) => {
  const visited = new Uint8Array(mask.length);
  const queue = new Int32Array(mask.length);
  const components: Component[] = [];
  const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]] as const;

  for (let start = 0; start < mask.length; start += 1) {
    if (!mask[start] || visited[start]) continue;
    let head = 0;
    let tail = 0;
    const pixels: number[] = [];
    queue[tail++] = start;
    visited[start] = 1;
    while (head < tail) {
      const index = queue[head++];
      pixels.push(index);
      const x = index % width;
      const y = Math.floor(index / width);
      for (const [dx, dy] of neighbours) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        const next = ny * width + nx;
        if (mask[next] && !visited[next]) {
          visited[next] = 1;
          queue[tail++] = next;
        }
      }
    }
    if (pixels.length >= minimumArea) components.push({ pixels, start: [start % width, Math.floor(start / width)] });
  }
  return components.sort((a, b) => b.pixels.length - a.pixels.length);
};

const perpendicularDistance = (point: number[], start: number[], end: number[]) => {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  if (dx === 0 && dy === 0) return Math.hypot(point[0] - start[0], point[1] - start[1]);
  return Math.abs(dy * point[0] - dx * point[1] + end[0] * start[1] - end[1] * start[0]) / Math.hypot(dx, dy);
};

const simplify = (points: number[][], tolerance: number): number[][] => {
  if (points.length <= 4) return points;
  let furthest = 0;
  let index = 0;
  for (let cursor = 1; cursor < points.length - 1; cursor += 1) {
    const distance = perpendicularDistance(points[cursor], points[0], points[points.length - 1]);
    if (distance > furthest) { furthest = distance; index = cursor; }
  }
  if (furthest <= tolerance) return [points[0], points[points.length - 1]];
  const first = simplify(points.slice(0, index + 1), tolerance);
  const second = simplify(points.slice(index), tolerance);
  return [...first.slice(0, -1), ...second];
};

export class StickerContourEngine {
  async generate(canvas: fabric.Canvas, options: ContourOptions): Promise<ContourResult | null> {
    const objects = canvas.getObjects().filter(isArtwork);
    if (!objects.length) return null;

    const resolution = Math.min(4, Math.max(1, options.resolution ?? 2));
    const padding = Math.max(1, options.padding);
    const bounds = unionBounds(objects, padding + 4);
    const rasterWidth = Math.max(1, Math.ceil(bounds.width * resolution));
    const rasterHeight = Math.max(1, Math.ceil(bounds.height * resolution));
    if (rasterWidth * rasterHeight > 18_000_000) throw new Error("Artwork is too large to trace safely. Reduce its dimensions and try again.");

    const element = document.createElement("canvas");
    const surface = new fabric.StaticCanvas(element, {
      width: rasterWidth,
      height: rasterHeight,
      enableRetinaScaling: false,
      renderOnAddRemove: false,
      backgroundColor: "transparent",
    });
    surface.setViewportTransform([resolution, 0, 0, resolution, -bounds.left * resolution, -bounds.top * resolution]);

    const clones = await Promise.all(objects.map(cloneObject));
    clones.forEach((clone) => {
      clone.set({ selectable: false, evented: false, shadow: undefined });
      surface.add(clone);
    });
    surface.renderAll();

    const context = element.getContext("2d", { willReadFrequently: true });
    if (!context) { surface.dispose(); return null; }
    const pixels = context.getImageData(0, 0, rasterWidth, rasterHeight).data;
    const threshold = Math.min(255, Math.max(1, options.alphaThreshold ?? 28));
    const mask = new Uint8Array(rasterWidth * rasterHeight);
    for (let index = 0; index < mask.length; index += 1) mask[index] = pixels[index * 4 + 3] >= threshold ? 1 : 0;
    surface.dispose();

    const expanded = dilate(mask, rasterWidth, rasterHeight, padding * resolution);
    fillSmallHoles(expanded, rasterWidth, rasterHeight, options.maximumHoleArea ?? 500 * resolution * resolution);
    const components = findComponents(expanded, rasterWidth, rasterHeight, options.minimumIslandArea ?? 16 * resolution * resolution);
    if (!components.length) return null;

    const pathBuilder = line<[number, number]>()
      .x((point) => point[0])
      .y((point) => point[1])
      .curve(curveCatmullRomClosed.alpha(0.5));
    const paths: string[] = [];
    for (const component of components) {
      const componentMask = new Set(component.pixels);
      const points = geom.contour((x: number, y: number) => {
        if (x < 0 || y < 0 || x >= rasterWidth || y >= rasterHeight) return false;
        return componentMask.has(y * rasterWidth + x);
      }, component.start) as number[][];
      const scenePoints = points.map(([x, y]) => [bounds.left + x / resolution, bounds.top + y / resolution]);
      const simplified = simplify([...scenePoints, scenePoints[0]], options.simplifyTolerance ?? 0.7).slice(0, -1) as [number, number][];
      const path = simplified.length >= 3 ? pathBuilder(simplified) : null;
      if (path) paths.push(path);
    }
    if (!paths.length) return null;

    return { pathData: paths.join(" "), bounds, componentCount: paths.length };
  }
}

export const getArtworkObjects = (canvas: fabric.Canvas) => canvas.getObjects().filter(isArtwork);
