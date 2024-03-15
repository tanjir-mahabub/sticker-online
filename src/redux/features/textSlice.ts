import { TextData } from '@/hooks/useTextStorage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TextState {
  selectedTexts: TextData[];
}

const initialState: TextState = {
  selectedTexts: [],
};

const textSlice = createSlice({
  name: 'text',
  initialState,
  reducers: {
    setTextValue: (state, action: PayloadAction<TextData>) => {
      const index = state.selectedTexts.findIndex(text => text.id === action.payload.id);
      if (index !== -1) {
        state.selectedTexts[index] = action.payload;
      } else {
        state.selectedTexts.push(action.payload);
      }
    },
    removeTextValue: (state, action: PayloadAction<string>) => {
      state.selectedTexts = state.selectedTexts.filter(text => text.id !== action.payload);
    }
  },
});

export const { setTextValue, removeTextValue } = textSlice.actions;
export default textSlice.reducer;
