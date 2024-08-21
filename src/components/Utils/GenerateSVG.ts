import { ObjectsWithPercentageArray } from "@/hooks/useDieCutEffect";
import { fabric } from "fabric";

interface GenerateSVGWithMarginOptions {
  canvas: fabric.Canvas;
  selectedItem: ObjectsWithPercentageArray;
  frameWidth: number;
  frameHeight: number;
  backgroundColor: string;
  StickerNavID: number;
  grow: number; // Added grow parameter
  margin?: number;
  hasBackground?: boolean;
  printLine?: boolean;
  printLineWidth?: number;
  isDieCutImage?: boolean;
  hasPath?: boolean;
}

const deletePrevDieCut = (canvas: fabric.Canvas) => {
  const existingObject = canvas.getObjects().find(obj => obj.get('id') === "dieCutImage");
  if (existingObject) {
    canvas.remove(existingObject);
    canvas.renderAll();
  }
};


const convertImageToBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const generateSVGWithMargin = async ({
  canvas,
  selectedItem,
  frameWidth,
  frameHeight,
  backgroundColor,
  StickerNavID,
  grow,
  margin = 50,
  hasBackground = true,
  printLine = true,
  printLineWidth = 3,
  isDieCutImage = true,
  hasPath = true,
}: GenerateSVGWithMarginOptions): Promise<string> => {
  try {
    const originalViewportTransform = canvas.viewportTransform?.slice() || [1, 0, 0, 1, 0, 0];
    const zoom = originalViewportTransform[0];

    const actualFrameWidth = frameWidth + grow / zoom;
    const actualFrameHeight = frameHeight + grow / zoom;
    const scaledMargin = margin / zoom;

    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();

    if (!isDieCutImage) {
      deletePrevDieCut(canvas);
    }

    const offsetX = originalViewportTransform[4] / zoom;
    const offsetY = originalViewportTransform[5] / zoom;

    const frameLeft = (canvasWidth / zoom - actualFrameWidth) / 2 - offsetX;
    const frameTop = (canvasHeight / zoom - actualFrameHeight) / 2 - offsetY - 50;

    const canvasSVG = canvas.toSVG();

    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(canvasSVG, "image/svg+xml");
    const svgRoot = svgDoc.documentElement;

    if (hasPath) {
      const paths = svgRoot.querySelectorAll('path');
      paths.forEach((path, index) => {
        const currentStyle = path.getAttribute('style') || '';
        const newStyle = currentStyle
          .replace(/stroke:[^;]+/, `stroke: ${backgroundColor}`)
          .replace(/stroke-opacity:[^;]+/, 'stroke-opacity: 1')
          .replace(/stroke-width:[^;]+/, 'stroke-width: 18px')
          .replace(/stroke-linecap:[^;]+/, 'stroke-linecap: round')
          .replace(/stroke-linejoin:[^;]+/, 'stroke-linejoin: round')
          .replace(/stroke-miterlimit:[^;]+/, 'stroke-miterlimit: 4')
          .replace(/fill:[^;]+/, 'fill: rgb(0, 0, 0)')
          .replace(/fill-rule:[^;]+/, 'fill-rule: nonzero')
          .replace(/opacity:[^;]+/, 'opacity: 1');
        path.setAttribute('style', newStyle);
      });
    }

    // Convert image URL to Base64 and replace in the SVG
    const imageElements: any = svgRoot.querySelectorAll('image');
    for (const image of imageElements) {
      const href = image.getAttribute('xlink:href');
      if (href) {
        const base64Data = await convertImageToBase64(href);
        image.setAttribute('xlink:href', base64Data);
      }
    }

    // Create a single group to contain all elements
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

    // Move all existing elements under the group
    while (svgRoot.childNodes.length > 0) {
      group.appendChild(svgRoot.childNodes[0]);
    }
    svgRoot.appendChild(group);

    // Modify the background and viewBox if hasBackground is true
    let backgroundShape = null;
    if (hasBackground) {
      backgroundShape = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      backgroundShape.setAttribute("x", (frameLeft - scaledMargin).toString());
      backgroundShape.setAttribute("y", (frameTop - scaledMargin).toString());
      backgroundShape.setAttribute("width", (actualFrameWidth + 2 * scaledMargin).toString());
      backgroundShape.setAttribute("height", (actualFrameHeight + 2 * scaledMargin).toString());
      backgroundShape.setAttribute("fill", backgroundColor);

      if (printLine) {
        backgroundShape.setAttribute("stroke", "magenta");
        backgroundShape.setAttribute("stroke-width", printLineWidth.toString());
        backgroundShape.setAttribute("stroke-linecap", "round");
        backgroundShape.setAttribute("stroke-linejoin", "round");
      }

      if (StickerNavID === 1) {
        backgroundShape.setAttribute("fill", "transparent");
      } else if (StickerNavID === 3) {
        backgroundShape.setAttribute("rx", (actualFrameWidth / 2).toString());
        backgroundShape.setAttribute("ry", (actualFrameHeight / 2).toString());
      } else if (StickerNavID === 4) {
        backgroundShape.setAttribute("rx", "10"); // Rounded corners
        backgroundShape.setAttribute("ry", "10");
      }

      group.insertBefore(backgroundShape, group.firstChild);
    }

    // Set the viewBox to accommodate the new dimensions
    const newViewBox = `${frameLeft - scaledMargin} ${frameTop - scaledMargin} ${actualFrameWidth + 2 * scaledMargin} ${actualFrameHeight + 2 * scaledMargin}`;
    svgRoot.setAttribute("viewBox", newViewBox);
    svgRoot.setAttribute("width", (actualFrameWidth + 2 * scaledMargin).toString());
    svgRoot.setAttribute("height", (actualFrameHeight + 2 * scaledMargin).toString());

    // Serialize the modified SVG back to string
    const serializer = new XMLSerializer();
    const newSVGString = serializer.serializeToString(svgRoot);

    // Resolve with the final SVG string
    return newSVGString;

  } catch (error: any) {
    throw new Error(`Failed to generate SVG: ${error.message}`);
  }
};