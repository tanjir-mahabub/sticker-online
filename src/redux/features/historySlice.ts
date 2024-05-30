import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Position {
  x?: number;
  y?: number;
  center?:{
    x: number,
    y: number
  };
  scale?:{
    x: number,
    y: number
  };
  translate?:{
    x: number,
    y: number
  };
  size?:{
    x: number,
    y: number
  };
  ratio: number;
  rotate?: number;
  width?: number;
  height?: number;
  scaleX?: number;
  scaleY?: number;
  matrix?: any;
  color?: string;
  backgoundColor?: string;
}

interface ObjectHistory {
  id: string; 
  category: string; 
  history: Position[];
  historyStep: number;
}

interface HistoryState {
  objectHistories: ObjectHistory[]; // Array of histories for different objects
}

const initialState: HistoryState = {
  objectHistories: [],
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addedToHistory: (state, action: PayloadAction<{ id: string; category: string, position: Position }>) => {
      const { id, category, position } = action.payload;
      const objectHistoryIndex = state.objectHistories.findIndex((obj) => obj.id === id);
      if (objectHistoryIndex !== -1) {
        const objectHistory = state.objectHistories[objectHistoryIndex];
        state.objectHistories[objectHistoryIndex] = {
          ...objectHistory,
          history: objectHistory.history.slice(0, objectHistory.historyStep + 1).concat([position]),
          historyStep: objectHistory.historyStep + 1,
        };
      } else {
        state.objectHistories.push({
          id,
          category,
          history: [position],
          historyStep: 0,
        });
      }
    },
    undo: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const objectHistoryIndex = state.objectHistories.findIndex((obj) => obj.id === id);
      if (objectHistoryIndex !== -1 && state.objectHistories[objectHistoryIndex].historyStep > 0) {
        state.objectHistories[objectHistoryIndex].historyStep -= 1;
      }
    },
    redo: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const objectHistoryIndex = state.objectHistories.findIndex((obj) => obj.id === id);
      const objectHistory = state.objectHistories[objectHistoryIndex];
      if (objectHistoryIndex !== -1 && objectHistory.historyStep < objectHistory.history.length - 1) {
        state.objectHistories[objectHistoryIndex].historyStep += 1;
      }
    },
    deleteHistoryById: (state, action: PayloadAction<string>) => {
      const idToDelete = action.payload;
      state.objectHistories = state.objectHistories.filter(obj => obj.id !== idToDelete);
    },

    deleteAllHistoriesByCategory: (state, action: PayloadAction<string>) => {
      const categoryToDelete = action.payload;
      state.objectHistories = state.objectHistories.filter(obj => obj.category !== categoryToDelete);
    },    

    clearAllHistories: (state) => {
      state.objectHistories = [];
    },
  },
});

export const { addedToHistory, undo, redo, deleteHistoryById, deleteAllHistoriesByCategory, clearAllHistories } = historySlice.actions;
export default historySlice.reducer;
