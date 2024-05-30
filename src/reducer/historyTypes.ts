interface Position {
    x?: number;
    y?: number;
    center?: {
      x: number;
      y: number;
    };
    scale?: {
      x: number;
      y: number;
    };
    translate?: {
      x: number;
      y: number;
    };
    size?: {
      x: number;
      y: number;
    };
    ratio: number;
    rotate?: number;
    width?: number;
    height?: number;
    scaleX?: number;
    scaleY?: number;
    matrix?: any;
    color?: string;
    backgroundColor?: string;
  }
  
  interface ObjectHistory {
    id: string;
    category: string;
    history: Position[];
    historyStep: number;
  }
  
  export interface HistoryState {
    objectHistories: ObjectHistory[];
  }
  
  export type HistoryAction =
    | { type: 'addedToHistory'; payload: { id: string; category: string; position: Position } }
    | { type: 'undo'; payload: string }
    | { type: 'redo'; payload: string }
    | { type: 'deleteHistoryById'; payload: string }
    | { type: 'deleteAllHistoriesByCategory'; payload: string }
    | { type: 'clearAllHistories' };
  