import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PopupContent {
  title: string;
  imgSrc: string;
  content: string;  
}

interface PopupState {
  isVisible: boolean;
  content: PopupContent | null;
}

const initialState: PopupState = {
  isVisible: false,
  content: null,
};

export const popupSlice = createSlice({
  name: 'popup',
  initialState,
  reducers: {
    showPopup: (state, action: PayloadAction<PopupContent>) => {
      state.isVisible = true;
      state.content = action.payload;
    },
    hidePopup: (state) => {
      state.isVisible = false;
      state.content = null;
    },
  },
});

export const { showPopup, hidePopup } = popupSlice.actions;

export default popupSlice.reducer;
