import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the structure for text element's data
interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fill: string;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
}

// Initial state of the text elements slice
interface TextState {
  texts: TextElement[];
}

const initialState: TextState = {
  texts: [],
};

const textSlice = createSlice({
  name: 'text',
  initialState,
  reducers: {
    // Add or update a text element based on its ID
    upsertText: (state, action: PayloadAction<TextElement>) => {
      const newText = action.payload;
      if (!state.texts) {
        state.texts = []; // Ensure texts is an array if it's not already
      }
      const textIndex = state.texts.findIndex(text => text.id === newText.id);
      if (textIndex !== -1) {
        // Update existing text
        state.texts[textIndex] = newText;
      } else {
        // Add new text
        state.texts.push(newText);
      }
    },

    // Remove a text element by its ID
    removeText: (state, action: PayloadAction<string>) => {
      state.texts = state.texts.filter(text => text.id !== action.payload);
    },

    // Clear all text elements
    clearTexts: (state) => {
      state.texts = [];
    },

    updateTextElementAttributes: (state, action: PayloadAction<{ id: string; attributes: Partial<TextElement> }>) => {
      const { id, attributes } = action.payload;
      const index = state.texts.findIndex(text => text.id === id);
      if (index !== -1) {
        state.texts[index] = { ...state.texts[index], ...attributes };
      }
    },
  },
});

// Export the actions
export const { upsertText, removeText, clearTexts, updateTextElementAttributes } = textSlice.actions;

// Export the reducer
export default textSlice.reducer;
