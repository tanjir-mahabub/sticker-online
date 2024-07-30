export const itemSelection = (
    canvas: fabric.Canvas | null,
    grow: number,
    frameWidth: number,
    frameHeight: number
  ): { object: fabric.Object, percentageInside: number }[] | null => {
    if (!canvas) return null;

    // Define the frame area
    const frameLeft = (canvas.getWidth() - frameWidth) / 2;
    const frameTop = (canvas.getHeight() - frameHeight) / 2;
    const frameRight = frameLeft + frameWidth;
    const frameBottom = frameTop + frameHeight;

    // Ensure the objects are unique by their IDs
    const uniqueObjects = new Map<string, fabric.Object>();
    const objects: fabric.Object[] = canvas.getObjects().filter(obj => {
      const category = obj.data?.category;
      return (category === 'image' || category === 'text') && obj.id !== "dieCutImage";
    });

    objects.forEach(obj => {
      if (obj.id && !uniqueObjects.has(obj.id)) {
        uniqueObjects.set(obj.id, obj);
      }
    });

    // Helper function to calculate the bounding box with grow factor applied
    const calculateBoundingBox = (obj: fabric.Object, grow: number) => {
      const originalWidth = (obj.width ?? 0) * (obj.scaleX ?? 1);
      const originalHeight = (obj.height ?? 0) * (obj.scaleY ?? 1);
      return {
        left: (obj.left ?? 0) - grow / 2,
        top: (obj.top ?? 0) - grow / 2,
        right: (obj.left ?? 0) + originalWidth + grow / 2,
        bottom: (obj.top ?? 0) + originalHeight + grow / 2,
        width: originalWidth + grow,
        height: originalHeight + grow,
      };
    };

    // Helper function to calculate the overlapping area of two rectangles
    const calculateOverlapArea = (box1: { left: number; top: number; right: number; bottom: number }, 
                                  box2: { left: number; top: number; right: number; bottom: number }): number => {
      const overlapWidth = Math.max(0, Math.min(box1.right, box2.right) - Math.max(box1.left, box2.left));
      const overlapHeight = Math.max(0, Math.min(box1.bottom, box2.bottom) - Math.max(box1.top, box2.top));
      return overlapWidth * overlapHeight;
    };

    // Helper function to check if two bounding boxes overlap
    const isOverlap = (box1: { left: number; top: number; right: number; bottom: number }, 
                       box2: { left: number; top: number; right: number; bottom: number }): boolean => {
      return !(
        box1.right <= box2.left || // Box1 is completely left of Box2
        box1.left >= box2.right || // Box1 is completely right of Box2
        box1.bottom <= box2.top || // Box1 is completely above Box2
        box1.top >= box2.bottom    // Box1 is completely below Box2
      );
    };

    let selectedObjects: { object: fabric.Object, percentageInside: number }[] = [];
    let touchedObjects: { object: fabric.Object, percentageInside: number }[] = [];

    uniqueObjects.forEach(obj => {
      const boundingBox = calculateBoundingBox(obj, grow);
      const frameBox = { left: frameLeft, top: frameTop, right: frameRight, bottom: frameBottom, width: frameWidth, height: frameHeight };

      // Calculate the area of the object and the area within the frame
      const objectArea = boundingBox.width * boundingBox.height;
      const overlapArea = calculateOverlapArea(boundingBox, frameBox);

      // Calculate the percentage of the object that is inside the frame
      const percentageInside = (overlapArea / objectArea) * 100;
      const correctedPercentageInside = Math.min(Math.max(percentageInside, 0), 100);

      // Add the object and its percentage inside the frame to the selection
      touchedObjects.push({ object: obj, percentageInside: correctedPercentageInside });
    });

    // Determine if objects touch after applying grow
    touchedObjects.forEach(obj1 => {
      let hasTouched = false;
      touchedObjects.forEach(obj2 => {
        if (obj1.object !== obj2.object) {
          if (isOverlap(calculateBoundingBox(obj1.object, grow), calculateBoundingBox(obj2.object, grow))) {
            hasTouched = true;
            if (!selectedObjects.includes(obj1)) {
              selectedObjects.push(obj1);
            }
            if (!selectedObjects.includes(obj2)) {
              selectedObjects.push(obj2);
            }
          }
        }
      });
      if (!hasTouched && !selectedObjects.includes(obj1)) {
        selectedObjects.push(obj1);
      }
    });

    // If objects do not touch, only keep the one with the highest percentage inside
    if (!selectedObjects.some(obj => touchedObjects.some(tObj => tObj.object !== obj.object && isOverlap(calculateBoundingBox(tObj.object, grow), calculateBoundingBox(obj.object, grow))))) {
      selectedObjects = [selectedObjects.reduce((maxObj, obj) => (obj.percentageInside > maxObj.percentageInside ? obj : maxObj))];
    }

    return selectedObjects;
  };