
import { generateUniqueId } from '@/components/Utils/vectorFunction';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface MotivState {
  id: string;
  file: string;
}

const motivSlice = createSlice({
  name: 'motivs',
  initialState: [] as MotivState[],
  reducers: {
    addMotiv: (state, action: PayloadAction<string[]>) => {
      state.push(...action.payload.map(file => ({ id: generateUniqueId(), file })));
    },
    deleteMotiv: (state, action: PayloadAction<string>) => {
      return state.filter(file => file.id !== action.payload);
    },
    deleteAllMotiv: () => {
      return [];
    },
  },
});

export const { addMotiv, deleteMotiv, deleteAllMotiv } = motivSlice.actions;

export default motivSlice.reducer;