import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const categoryToRemoveSlice = createSlice({
    name: 'categoryToRemove',
    initialState: '',
    reducers: {
        setCategoryToRemove: (state, action: PayloadAction<string>) => {
            state = action.payload;
            return state
        },
    },
});

export const { setCategoryToRemove } = categoryToRemoveSlice.actions;
export default categoryToRemoveSlice.reducer;
