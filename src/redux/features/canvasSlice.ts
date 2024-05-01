import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CanvasState } from '@/types/types'; // Assuming you have a separate file for defining types

const initialState: CanvasState = {
  width: 0,
  height: 0,
  centerX: 0,
  centerY: 0,
  frameWidth: 0,
  frameHeight: 0,
  bredd: 0,
  hojd: 0,
  scale: 1,
  grow: 1,
  selectionCancel: false,
  backgroundColor: "#ffffff",
  textColor: "#000000"
};

const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    setCanvasProperties(state, action: PayloadAction<Partial<CanvasState>>) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { setCanvasProperties } = canvasSlice.actions;

export default canvasSlice.reducer;
