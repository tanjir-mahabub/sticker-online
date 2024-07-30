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
      // Deselect all objects on the canvas
      canvas.discardActiveObject();

      // Calculate the frame's position centered on the canvas
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();
      const frameLeft = (canvasWidth - frameWidth) / 2;
      const frameTop = (canvasHeight - frameHeight) / 2;

      // Determine border radius based on StickerNavID
      let cornerRadius = 0;
      if (StickerNavID === 3) {
        cornerRadius = Math.min(frameWidth * grow / 2, frameHeight * grow / 2) / 2; // Circle
      } else if (StickerNavID === 4) {
        cornerRadius = 10; // Rounded corners
      }

      // Use itemSelection to get the selected objects
      const selectedObjects = itemSelection(canvas, grow, frameWidth, frameHeight)?.map(item => item.object) ?? [];

      // Clone the selected objects
      Promise.all(selectedObjects.map(obj => new Promise<fabric.Object>((resolve) => {
        obj.clone((clonedObj: fabric.Object) => resolve(clonedObj), ["left", "top", "scaleX", "scaleY", "angle", "originX", "originY"]);
      }))).then(clonedObjects => {
        // Set the cloned objects' positions and scales
        clonedObjects.forEach(obj => {
          obj.set({
            left: obj.left!,
            top: obj.top!,
            scaleX: obj.scaleX ?? 1,
            scaleY: obj.scaleY ?? 1,
            selectable: false,
            evented: false,
          });
          obj.setCoords();
        });

        // Create a temporary canvas for the SVG generation
        const tempCanvas = new fabric.StaticCanvas(null, { width: canvasWidth, height: canvasHeight });
        const group = new fabric.Group(clonedObjects, {
          left: frameLeft + frameWidth / 2,
          top: frameTop + frameHeight / 2,
          originX: 'center',
          originY: 'center',
          selectable: false,
          evented: false,
        });

        // Add the group to the temporary canvas
        tempCanvas.add(group);

        // Create a background rectangle
        const backgroundRect = new fabric.Rect({
          left: frameLeft,
          top: frameTop,
          width: frameWidth,
          height: frameHeight,
          fill: backgroundColor,
          selectable: false,
          evented: false,
          rx: cornerRadius,
          ry: cornerRadius,
        });

        tempCanvas.add(backgroundRect);
        tempCanvas.sendToBack(backgroundRect);
        tempCanvas.renderAll();

        // Get the SVG of the group with the background rectangle
        const groupSVG = group.toSVG();
        const backgroundRectSVG = backgroundRect.toSVG();

        // Create the SVG document with the specified frame dimensions and background
        const wrappedSVG = `
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="${frameLeft - margin} ${frameTop - margin} ${frameWidth + 2 * margin} ${frameHeight + 2 * margin}" width="${frameWidth + 2 * margin}" height="${frameHeight + 2 * margin}">
            ${backgroundRectSVG}
            <g>
              ${groupSVG}
            </g>
          </svg>
        `;

        resolve(wrappedSVG);
      }).catch(reject);
    } catch (error) {
      reject(error);
    }
  });
};