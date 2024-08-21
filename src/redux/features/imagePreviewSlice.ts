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
    // Add a single image with a unique ID and URL
    addImage: (state, action: PayloadAction<ImageInfo>) => {
      const exists = state.images.some(image => image.id === action.payload.id);
      if (!exists) {
        state.images.push(action.payload);
      }
    },
    // Add multiple images with unique IDs
    addImages: (state, action: PayloadAction<ImageInfo[]>) => {
      const uniqueImages = action.payload.filter(newImage =>
        !state.images.some(existingImage => existingImage.id === newImage.id));
      state.images.push(...uniqueImages);
    },
    updateImages: (state, action: PayloadAction<{ id: string; attrs: Partial<ImageInfo> }>) => {
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
    // Remove an image by id
    deleteImage: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.images = state.images.filter(image => image.id !== id);
    },
    // Clear all images of a category
    clearImages: (state, action: PayloadAction<string>) => {
      const category = action.payload;
      state.images = state.images.filter(image => image.category !== category);
    },
    updateImagePosition: (state, action: PayloadAction<{ id: string; x: number; y: number; width?: number; height?: number }>) => {
      const { id, x, y, width, height } = action.payload;
      const index = state.images.findIndex(image => image.id === id);
      if (index !== -1) {
        state.images[index] = { ...state.images[index], x, y, width, height };
      }
    },
    updateElementAttributes: (state, action: PayloadAction<{ id: string; attributes: Partial<ImageInfo> }>) => {
      const { id, attributes } = action.payload;
      const index = state.images.findIndex(image => image.id === id);
      if (index !== -1) {
        state.images[index] = { ...state.images[index], ...attributes };
      }
    },
  },
});

export const { addImage, addImages, updateImages, deleteImage, clearImages, updateImagePosition, updateElementAttributes } = imagePreviewSlice.actions;

export default imagePreviewSlice.reducer;
