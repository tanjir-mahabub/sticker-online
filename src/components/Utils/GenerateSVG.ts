import { fabric } from "fabric";
interface GenerateSVGWithMarginOptions {
  canvas: fabric.Canvas;
  frameWidth: number;
  frameHeight: number;
  backgroundColor: string;
  StickerNavID: number;
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
  frameWidth,
  frameHeight,
  backgroundColor,
  StickerNavID,
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

      // Calculate the frame's position considering the viewport transform
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();

      !isDieCutImage && deletePrevDieCut(canvas);

      // Adjust for zoom in the original viewport transformation
      const offsetX = originalViewportTransform[4] / zoom;
      const offsetY = originalViewportTransform[5] / zoom;

      // Calculate the frame's position centered on the canvas with an additional offsetY
      const frameLeft = (canvasWidth / zoom - frameWidth) / 2 - offsetX;
      const frameTop = (canvasHeight / zoom - frameHeight) / 2 - offsetY - 30 / zoom;

      // Export the entire canvas as SVG
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
        backgroundShape.setAttribute("x", (frameLeft - printLineWidth / 2).toString());
        backgroundShape.setAttribute("y", (frameTop - printLineWidth / 2).toString());
        backgroundShape.setAttribute("width", (frameWidth + printLineWidth).toString());
        backgroundShape.setAttribute("height", (frameHeight + printLineWidth).toString());
        backgroundShape.setAttribute("fill", backgroundColor);

        if(printLine) {
          backgroundShape.setAttribute("stroke", "magenta");
          backgroundShape.setAttribute("stroke-width", printLineWidth.toString());
          backgroundShape.setAttribute("stroke-linecap", "round");
          backgroundShape.setAttribute("stroke-linejoin", "round");
        }

        if (StickerNavID === 1) {
          backgroundShape.setAttribute("fill", "transparent");
        } else if (StickerNavID === 3) {
          backgroundShape.setAttribute("rx", (frameWidth / 2).toString());
          backgroundShape.setAttribute("ry", (frameHeight / 2).toString());
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
      const newViewBox = `${frameLeft - margin} ${frameTop - margin} ${frameWidth + 2 * margin} ${frameHeight + 2 * margin}`;
      svgRoot.setAttribute("viewBox", newViewBox);
      svgRoot.setAttribute("width", (frameWidth + 2 * margin).toString());
      svgRoot.setAttribute("height", (frameHeight + 2 * margin).toString());

      // Serialize the modified SVG back to string
      const serializer = new XMLSerializer();
      const newSVGString = serializer.serializeToString(svgRoot);

      resolve(newSVGString);
    } catch (error) {
      reject(error);
    }
  });
};
