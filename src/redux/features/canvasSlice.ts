import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CanvasState } from '@/types/types'; // Assuming you have a separate file for defining types

const initialState: CanvasState = {
  centerX: 0,
  centerY: 0,
  frameWidth: 0,
  frameHeight: 0,
  canvasUpdated: false,
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
