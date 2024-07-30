import { fabric } from "fabric";
import { itemSelection } from "./ItemSelection";

export const generateSVGWithMargin = (
  canvas: fabric.Canvas,
  frameWidth: number,
  frameHeight: number,
  backgroundColor: string,
  StickerNavID: number,
  margin = 10,
  grow = 0
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Store the original zoom and viewportTransform
      const originalViewportTransform = canvas.viewportTransform?.slice() || [1, 0, 0, 1, 0, 0];
      let zoom = originalViewportTransform[0];

      if(zoom < 1) {
        originalViewportTransform[0] = 1;
        originalViewportTransform[1] = 0;
        originalViewportTransform[2] = 0;
        originalViewportTransform[3] = 1;
        originalViewportTransform[4] = (originalViewportTransform[4] + margin / 2) * zoom - 30;
        originalViewportTransform[5] = (originalViewportTransform[5] + margin / 2) * zoom - 30;
        zoom = 1
      }

      // Export the entire canvas as SVG
      const canvasSVG = canvas.toSVG();

      // Create a new DOMParser instance
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(canvasSVG, "image/svg+xml");

      // Get the SVG root element
      const svgRoot = svgDoc.documentElement;

      // Calculate the frame's position considering the viewport transform
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();
      const frameLeft = (canvasWidth - frameWidth) / 2 - originalViewportTransform[4];
      const frameTop = (canvasHeight - frameHeight) / 2 - originalViewportTransform[5] - 30;

      // Create a background shape element
      let backgroundShape;
      if (StickerNavID === 3) {
        // Circle using rect with 50% border radius
        backgroundShape = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        backgroundShape.setAttribute("x", frameLeft.toString());
        backgroundShape.setAttribute("y", frameTop.toString());
        backgroundShape.setAttribute("width", (frameWidth * zoom).toString());
        backgroundShape.setAttribute("height", (frameHeight * zoom).toString());
        backgroundShape.setAttribute("rx", (frameWidth * zoom / 2).toString());
        backgroundShape.setAttribute("ry", (frameHeight * zoom / 2).toString());
        backgroundShape.setAttribute("fill", backgroundColor);
      } else {
        // Rectangle or Rounded Rectangle
        backgroundShape = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        backgroundShape.setAttribute("x", frameLeft.toString());
        backgroundShape.setAttribute("y", frameTop.toString());
        backgroundShape.setAttribute("width", (frameWidth * zoom).toString());
        backgroundShape.setAttribute("height", (frameHeight * zoom).toString());
        backgroundShape.setAttribute("fill", backgroundColor);
        if (StickerNavID === 4) {
          backgroundShape.setAttribute("rx", "10"); // Rounded corners
          backgroundShape.setAttribute("ry", "10");
        }
      }

      // Append the background shape to the SVG
      svgRoot.insertBefore(backgroundShape, svgRoot.firstChild);

      // Create a new viewBox based on the transformed frame dimensions and margin
      const newViewBox = `${frameLeft / zoom - margin} ${frameTop / zoom - margin} ${(frameWidth + 2 * margin) * zoom} ${(frameHeight + 2 * margin) * zoom}`;
      svgRoot.setAttribute("viewBox", newViewBox);
      svgRoot.setAttribute("width", ((frameWidth + 2 * margin) * zoom).toString());
      svgRoot.setAttribute("height", ((frameHeight + 2 * margin) * zoom).toString());

      // Serialize the modified SVG back to string
      const serializer = new XMLSerializer();
      const newSVGString = serializer.serializeToString(svgRoot);

      resolve(newSVGString);
    } catch (error) {
      reject(error);
    }
  });
};
