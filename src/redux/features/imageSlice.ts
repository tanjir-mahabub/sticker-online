import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SerializedFile {
  identifier: string;
  lastModified: number;
  webkitRelativePath: string;
  size: number;
  type: string;
}

const initialState: SerializedFile[] = [];

export const ImageReducer = createSlice({
  name: 'imageUploader',
  initialState,
  reducers: {
    addedImage: (state, action: PayloadAction<SerializedFile | SerializedFile[]>) => {
      const filesToAdd = Array.isArray(action.payload) ? action.payload : [action.payload];
      const serializedFiles = filesToAdd as SerializedFile[]; // Assume all items are SerializedFile
      return state.concat(serializedFiles);
    }
  }
});

export const { addedImage } = ImageReducer.actions;
export default ImageReducer.reducer;

// Serialize a File object
export function serializeFile(file: File): SerializedFile | null {
  try {
    return {
      identifier: file.name,
      lastModified: file.lastModified,
      webkitRelativePath: file.webkitRelativePath,
      size: file.size,
      type: file.type,
    };
  } catch (error) {
    console.error("Error serializing File:", error);
    return null;
  }
}
