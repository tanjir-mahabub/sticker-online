export const findObjectById = (canvas: fabric.Canvas, id: string): fabric.Object | null => {
    const objects = canvas.getObjects();
    // console.log(objects);
    for (const obj of objects) {
      if ((obj as any).id === id) {
        return obj;
      }
    }
    return null;
  }

  