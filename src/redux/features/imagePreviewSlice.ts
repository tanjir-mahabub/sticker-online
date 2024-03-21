import { ImageInfo } from '@/types/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ImagePreviewState {
  images: ImageInfo[];
}

const initialState: ImagePreviewState = {
  images: [],
};

export const imagePreviewSlice = createSlice({
  name: 'imagePreview',
  initialState,
  reducers: {
    // Action to add a single image with a unique ID
    addImage: (state, action: PayloadAction<ImageInfo>) => {
      const exists = state.images.some(image => image.id === action.payload.id);
      if (!exists) {
        state.images.push(action.payload);
      }
    },
    // Action to add multiple images with unique IDs
    addImages: (state, action: PayloadAction<ImageInfo[]>) => {
      const uniqueImages = action.payload.filter(newImage => 
        !state.images.some(existingImage => existingImage.id === newImage.id));
      state.images.push(...uniqueImages);
    },
    updateImages: (state, action: PayloadAction<{id: string; attrs: Partial<ImageInfo>}>) => {
      const { id, attrs } = action.payload;
      const imageIndex = state.images.findIndex(image => image.id === id);
      if (imageIndex !== -1) {
        state.images[imageIndex] = { ...state.images[imageIndex], ...attrs };
      }
    },
    removeImagesByCategory: (state, action: PayloadAction<string>) => {
      const categoryToRemove = action.payload;
      state.images = state.images.filter(image => image.category !== categoryToRemove);
    },
    // Action to remove an image by id
    removeImage: (state, action: PayloadAction<string>) => {
      state.images = state.images.filter(image => image.id !== action.payload);
    },
    // Action to clear all images
    clearImages: (state, action: PayloadAction<string>) => {
      const category = action.payload;
      // Filter out images that match the given category
      state.images = state.images.filter(image => image.category !== category);      
    },
  },
});

export const { addImage, addImages, updateImages, removeImage, clearImages } = imagePreviewSlice.actions;

export default imagePreviewSlice.reducer;
