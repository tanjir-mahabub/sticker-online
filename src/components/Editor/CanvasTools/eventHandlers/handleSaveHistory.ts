import { fabric } from 'fabric';

const saveCanvasHistory = (canvasRef: React.MutableRefObject<fabric.Canvas | null>) => {
  if (canvasRef.current) {
    const json = JSON.parse(localStorage.getItem('canvasHistory') || '[]');
    const history = json.history || [];
    const index = json.index || 0;

    const newHistory = history.slice(0, index + 1);
    newHistory.push(canvasRef.current.toJSON(['left', 'top', 'scaleX', 'scaleY', 'angle', 'width', 'height']));

    localStorage.setItem('canvasHistory', JSON.stringify({ history: newHistory, index: newHistory.length - 1 }));
  }
};

const saveElementHistory = (element: fabric.Object) => {
  const elementId = element.toObject().id;
  if (elementId) {
    const json = JSON.parse(localStorage.getItem('elementHistory') || '{}');
    const history = json[elementId] || [];
    const newHistory = [...history, element.toObject()];

    localStorage.setItem('elementHistory', JSON.stringify({ ...json, [elementId]: newHistory }));
  }
};

export { saveCanvasHistory, saveElementHistory };
