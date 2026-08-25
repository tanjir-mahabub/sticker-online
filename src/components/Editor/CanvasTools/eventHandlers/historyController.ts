import { fabric } from 'fabric';

interface HistorySnapshot {
  canvas: ReturnType<fabric.Canvas['toJSON']>;
  grow: number;
  signature: string;
}

class HistoryController {
  canvas: fabric.Canvas;
  history: HistorySnapshot[];
  redoStack: HistorySnapshot[];
  grow: number;

  constructor(canvas: fabric.Canvas, initialGrow: number) {
    this.canvas = canvas;
    this.history = [];
    this.redoStack = [];
    this.grow = initialGrow;
    this.saveState();
  }

  saveState() {
    const canvasState = this.canvas.toJSON(['id', 'data']);
    canvasState.objects = canvasState.objects.filter((object: any) => object.data?.category !== 'generated');
    const signature = JSON.stringify({ canvas: canvasState, grow: this.grow });
    if (this.history.at(-1)?.signature === signature) return;
    const state = {
      canvas: canvasState,
      grow: this.grow,
      signature,
    };
    this.history.push(state);
    if (this.history.length > 50) this.history.shift();
    this.redoStack = [];
  }

  undo(frameWidth: number, frameHeight: number) {
    if (this.history.length > 1) {
      const currentState = this.history.pop();
      if (!currentState) return;
      this.redoStack.push(currentState);
      const previousState = this.history[this.history.length - 1];
      if (!previousState) return;
      this.canvas.loadFromJSON(previousState.canvas, () => {
        this.grow = previousState.grow;
        this.canvas.renderAll();
        this.canvas.fire('object:modified');
      });
    }
  }

  redo(frameWidth: number, frameHeight: number) {
    if (this.redoStack.length > 0) {
      const nextState = this.redoStack.pop();
      if (!nextState) return;
      this.history.push(nextState);
      this.canvas.loadFromJSON(nextState.canvas, () => {
        this.grow = nextState.grow;
        this.canvas.renderAll();
        this.canvas.fire('object:modified');
      });
    }
  }

  setGrowValue(newGrow: number) {
    this.grow = newGrow;
    this.saveState();
  }
}

export default HistoryController;
