import { StickerSelectorStore } from "@/store/stickerSelectorStore";
import { StickerState } from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";

const initialSticker = StickerSelectorStore[0];

const initialState: StickerState = {
  id: initialSticker.id,
  isNewFileUploaded: false
};
export const StickerReducer = createSlice({
    name: 'sticker',
    initialState,
    reducers: {
        selectedSticker: (state, action) => {          
            // Update state with new sticker ID
            state.id = action.payload;
            // Reset isNewFileUploaded to false when a new sticker is selected
            state.isNewFileUploaded = false;
        },
        fileUploaded: (state, action) => {
            // Set isNewFileUploaded to true when a new file is uploaded
            state.isNewFileUploaded = action.payload;
        }
    }
})

export const { selectedSticker, fileUploaded } = StickerReducer.actions;
export default StickerReducer.reducer;