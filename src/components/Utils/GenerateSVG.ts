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
}

const deletePrevDieCut = (canvas: fabric.Canvas) => {
  const existingObject = canvas.getObjects().find(obj => obj.get('id') === "dieCutImage");
  if (existingObject) {
    canvas.remove(existingObject);
    canvas.renderAll();
  }
};



export const generateSVGWithMargin = ({
  canvas,
  selectedItem,
  frameWidth,
  frameHeight,
  backgroundColor,
  StickerNavID,
  grow,
  margin = 10,
  hasBackground = true,
  printLine = true,
  printLineWidth = 3,
  isDieCutImage = true
}: GenerateSVGWithMarginOptions): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Store the original viewportTransform
      const originalViewportTransform = canvas.viewportTransform?.slice() || [1, 0, 0, 1, 0, 0];
      const zoom = originalViewportTransform[0];

      // Calculate the actual frame dimensions considering the zoom level
      const actualFrameWidth = frameWidth / zoom;
      const actualFrameHeight = frameHeight / zoom;
      const scaledMargin = margin / zoom;

      // Calculate the frame's position considering the zoom level
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();

      if (!isDieCutImage) {
        deletePrevDieCut(canvas);
      }

      const offsetX = originalViewportTransform[4] / zoom;
      const offsetY = originalViewportTransform[5] / zoom;

      const frameLeft = (canvasWidth / zoom - actualFrameWidth) / 2 - offsetX;
      const frameTop = (canvasHeight / zoom - actualFrameHeight) / 2 - offsetY - 50;

      console.log(`Frame: Left=${frameLeft}, Top=${frameTop}, Width=${actualFrameWidth}, Height=${actualFrameHeight}, Zoom=${zoom}`);

      // Export canvas as SVG
      const canvasSVG = canvas.toSVG();

      // Create a new DOMParser instance
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(canvasSVG, "image/svg+xml");

      // Get the SVG root element
      const svgRoot = svgDoc.documentElement;

      // Create a background shape element if hasBackground is true
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
      }

      // Create a clipping path
      const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
      const clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
      const clipPathId = "clipPath";
      clipPath.setAttribute("id", clipPathId);

      if (backgroundShape) {
        clipPath.appendChild(backgroundShape.cloneNode(true));
        defs.appendChild(clipPath);
        svgRoot.insertBefore(defs, svgRoot.firstChild);

        // Apply the clipping path to the group
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("clip-path", `url(#${clipPathId})`);

        // Move all existing elements under the group
        while (svgRoot.childNodes.length > defs.childNodes.length + 1) {
          g.appendChild(svgRoot.childNodes[defs.childNodes.length + 1]);
        }
        svgRoot.appendChild(g);

        // Append the background shape to the SVG (as a child of the group)
        g.insertBefore(backgroundShape, g.firstChild);
      }

      // Create a new viewBox based on the transformed frame dimensions and margin
      const newViewBox = `${frameLeft - scaledMargin} ${frameTop - scaledMargin} ${actualFrameWidth + 2 * scaledMargin} ${actualFrameHeight + 2 * scaledMargin}`;
      svgRoot.setAttribute("viewBox", newViewBox);
      svgRoot.setAttribute("width", (actualFrameWidth + 2 * scaledMargin).toString());
      svgRoot.setAttribute("height", (actualFrameHeight + 2 * scaledMargin).toString());

      // Serialize the modified SVG back to string
      const serializer = new XMLSerializer();
      const newSVGString = serializer.serializeToString(svgRoot);

      resolve(newSVGString);
    } catch (error) {
      reject(error);
    }
  });
};
