import { fabric } from 'fabric';

class HistoryController {
  canvas: fabric.Canvas;
  history: any[];
  redoStack: any[];

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
    this.history = [];
    this.redoStack = [];
    this.saveState();
  }

  saveState() {
    const state = this.canvas.toJSON(['id']);
    // console.log(this.history);
    this.history.push(state);
    this.redoStack = [];
  }

  undo() {
    if (this.history.length > 1) {
      const currentState = this.history.pop();
      this.redoStack.push(currentState);
      const previousState = this.history[this.history.length - 1];
      this.canvas.loadFromJSON(previousState, () => {
        this.canvas.renderAll();
      });
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      const nextState = this.redoStack.pop();
      this.history.push(nextState);
      this.canvas.loadFromJSON(nextState, () => {
        this.canvas.renderAll();
      });
    }
  }
}

export default HistoryController;
