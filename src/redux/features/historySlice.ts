import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Position {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  scaleX?: number;
  scaleY?: number;
  rotation?: number;
}

interface ObjectHistory {
  objectId: string; // Unique identifier for the object
  history: Position[]; // History of positions for the object
  historyStep: number; // Current history step for the object
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
    addedToHistory: (state, action: PayloadAction<{ objectId: string; position: Position }>) => {
      const { objectId, position } = action.payload;
      const objectHistoryIndex = state.objectHistories.findIndex((obj) => obj.objectId === objectId);
      if (objectHistoryIndex !== -1) {
        const objectHistory = state.objectHistories[objectHistoryIndex];
        state.objectHistories[objectHistoryIndex] = {
          ...objectHistory,
          history: objectHistory.history.slice(0, objectHistory.historyStep + 1).concat([position]),
          historyStep: objectHistory.historyStep + 1,
        };
      } else {
        state.objectHistories.push({
          objectId,
          history: [position],
          historyStep: 0,
        });
      }
    },
    undo: (state, action: PayloadAction<string>) => {
      const objectId = action.payload;
      const objectHistoryIndex = state.objectHistories.findIndex((obj) => obj.objectId === objectId);
      if (objectHistoryIndex !== -1 && state.objectHistories[objectHistoryIndex].historyStep > 0) {
        state.objectHistories[objectHistoryIndex].historyStep -= 1;
      }
    },
    redo: (state, action: PayloadAction<string>) => {
      const objectId = action.payload;
      const objectHistoryIndex = state.objectHistories.findIndex((obj) => obj.objectId === objectId);
      const objectHistory = state.objectHistories[objectHistoryIndex];
      if (objectHistoryIndex !== -1 && objectHistory.historyStep < objectHistory.history.length - 1) {
        state.objectHistories[objectHistoryIndex].historyStep += 1;
      }
    },
    deleteHistoryById: (state, action: PayloadAction<string>) => {
      const objectIdToDelete = action.payload;
      state.objectHistories = state.objectHistories.filter(obj => obj.objectId !== objectIdToDelete);
    },

    clearAllHistories: (state) => {
      state.objectHistories = [];
    },
  },
});

export const { addedToHistory, undo, redo, deleteHistoryById, clearAllHistories } = historySlice.actions;
export default historySlice.reducer;
