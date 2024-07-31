import { fabric } from "fabric";

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
      // Store the original viewportTransform
      const originalViewportTransform = canvas.viewportTransform?.slice() || [1, 0, 0, 1, 0, 0];
      const zoom = originalViewportTransform[0];

      // Calculate the frame's position considering the viewport transform
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();

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

      // Create a background shape element
      let backgroundShape;
      if (StickerNavID === 3) {
        // Circle using rect with 50% border radius
        backgroundShape = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        backgroundShape.setAttribute("x", frameLeft.toString());
        backgroundShape.setAttribute("y", frameTop.toString());
        backgroundShape.setAttribute("width", frameWidth.toString());
        backgroundShape.setAttribute("height", frameHeight.toString());
        backgroundShape.setAttribute("rx", (frameWidth / 2).toString());
        backgroundShape.setAttribute("ry", (frameHeight / 2).toString());
        backgroundShape.setAttribute("fill", backgroundColor);
      } else {
        // Rectangle or Rounded Rectangle
        backgroundShape = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        backgroundShape.setAttribute("x", frameLeft.toString());
        backgroundShape.setAttribute("y", frameTop.toString());
        backgroundShape.setAttribute("width", frameWidth.toString());
        backgroundShape.setAttribute("height", frameHeight.toString());
        backgroundShape.setAttribute("fill", backgroundColor);
        if (StickerNavID === 4) {
          backgroundShape.setAttribute("rx", "10"); // Rounded corners
          backgroundShape.setAttribute("ry", "10");
        }
      }

      // Append the background shape to the SVG
      svgRoot.insertBefore(backgroundShape, svgRoot.firstChild);

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
