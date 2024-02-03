import { StickerSelectorStore } from "@/store/stickerSelectorStore";
import { StickerState } from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";

const initialSticker = StickerSelectorStore[0];

const initialState: StickerState = {
  id: initialSticker.id
};

export const StickerReducer = createSlice({
    name: 'sticker',
    initialState,
    reducers: {
        selectedSticker: (state, action) => {          
            return state = action.payload
        }
    }
})

export const { selectedSticker } = StickerReducer.actions;
export default StickerReducer.reducer;