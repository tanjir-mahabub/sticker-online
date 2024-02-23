import { generateUniqueId } from '@/components/Utils/functions';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface FileState {
    id: string;
    file: string;
  }
// Get initial state from localStorage
const initialState: FileState[] = [];

const fileSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {  
    addFiles: (state, action: PayloadAction<string[]>) => {
      state.push(...action.payload.map(file => ({ id: generateUniqueId(), file })));
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

