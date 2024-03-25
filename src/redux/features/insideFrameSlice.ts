// insideFrameSlice.js or insideFrameSlice.ts if using TypeScript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store'; // Import your store's root state

interface ImageState {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  insideFrame: boolean;
}

interface FrameState {
  images: ImageState[];
  totalWidth?: number;
  totalHeight?: number;
  minX?: number;
  minY?: number;
}

const initialState: FrameState = {
  images: [],
};

export const insideFrameSlice = createSlice({
  name: 'insideFrame',
  initialState,
  reducers: {
    addOrUpdateImage: (state, action: PayloadAction<ImageState>) => {
      const index = state.images.findIndex(image => image.id === action.payload.id);
      if (index !== -1) {
        state.images[index] = action.payload;
      } else {
        state.images.push(action.payload);
      }
    },
    removeImage: (state, action: PayloadAction<string>) => {
      state.images = state.images.filter(image => image.id !== action.payload);
    },
    calculateTotalDimensions: (state) => {
      const insideImages = state.images.filter(image => image.insideFrame);
      
      // Initialize variables to track the extents of the images
      let minX = Infinity, minY = Infinity, maxX = 0, maxY = 0;
    
      insideImages.forEach(image => {
        minX = Math.min(minX, image.x);
        minY = Math.min(minY, image.y);
        maxX = Math.max(maxX, image.x + image.width);
        maxY = Math.max(maxY, image.y + image.height);
      });
    
      // Calculate total dimensions based on the extents
      state.totalWidth = maxX - minX;
      state.totalHeight = maxY - minY;
    
      // Optionally store minX and minY if you need them for positioning
      state.minX = minX;
      state.minY = minY;
    },
    
  },
});

export const { addOrUpdateImage, removeImage, calculateTotalDimensions } = insideFrameSlice.actions;

export const selectInsideFrameState = (state: RootState) => state.insideFrame;

export default insideFrameSlice.reducer;
