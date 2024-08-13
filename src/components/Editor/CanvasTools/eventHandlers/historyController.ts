import { itemSelection } from '@/components/Utils/ItemSelection';
import { fabric } from 'fabric';

class HistoryController {
  canvas: fabric.Canvas;
  history: any[];
  redoStack: any[];
  grow: number;

  constructor(canvas: fabric.Canvas, initialGrow: number) {
    this.canvas = canvas;
    this.history = [];
    this.redoStack = [];
    this.grow = initialGrow;
    this.saveState();
  }

  saveState() {
    const state = {
      canvas: this.canvas.toJSON(['id', 'data']),
      grow: this.grow,
    };
    this.history.push(state);
    this.redoStack = [];
  }

  undo(frameWidth: number, frameHeight: number) {
    if (this.history.length > 1) {
      const currentState = this.history.pop();
      this.redoStack.push(currentState);
      const previousState = this.history[this.history.length - 1];
      this.canvas.loadFromJSON(previousState.canvas, () => {
        this.grow = previousState.grow;
        this.canvas.renderAll();
        setTimeout(() => {
          itemSelection(this.canvas, this.grow, frameWidth, frameHeight);
        }, 0);
      });
    }
  }

  redo(frameWidth: number, frameHeight: number) {
    if (this.redoStack.length > 0) {
      const nextState = this.redoStack.pop();
      this.history.push(nextState);
      this.canvas.loadFromJSON(nextState.canvas, () => {
        this.grow = nextState.grow;
        this.canvas.renderAll();
        setTimeout(() => {
          itemSelection(this.canvas, this.grow, frameWidth, frameHeight);
        }, 0);
      });
    }
  }

  setGrowValue(newGrow: number) {
    this.grow = newGrow;
    this.saveState();
  }
}

export default HistoryController;
