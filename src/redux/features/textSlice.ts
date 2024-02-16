import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TextState {
  selectedText: { id: number; name: string } | null;
}

const initialState: TextState = {
  selectedText: null,
};

const textSlice = createSlice({
  name: 'text',
  initialState,
  reducers: {
    setText(state, action: PayloadAction<{ id: number; name: string }>) {
      state.selectedText = action.payload;
    },
  },
});

export const { setText } = textSlice.actions;
export default textSlice.reducer;
