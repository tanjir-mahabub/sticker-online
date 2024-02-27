import { generateUniqueId } from '@/components/Utils/functions';
import { ImageInfo } from '@/types/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState: ImageInfo[] = [];

const fileSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {  
    addFiles: (state, action: PayloadAction<string[]>) => {
      state.push(...action.payload.map(file => ({ id: generateUniqueId(), src: file })));
    },
    deleteFile: (state, action: PayloadAction<string>) => {
      return state.filter(file => file.id !== action.payload);
    },
    deleteAllFiles: () => {
      return [];
    },
  },
});

export const { addFiles, deleteFile, deleteAllFiles } = fileSlice.actions;

export default fileSlice.reducer;

