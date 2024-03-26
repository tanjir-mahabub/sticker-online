// redux/features/inputValuesSlice.js

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InputValuesState {
  breddDefaultValue: number;
  hojdDefaultValue: number;
  laminatingLastSelected: number | null;
  materialLastSelected: number | null;
  antalLastSelected: number | null;
}

const initialState: InputValuesState = {
  breddDefaultValue: 6.5,
  hojdDefaultValue: 5,
  laminatingLastSelected: 1,
  materialLastSelected: 1,
  antalLastSelected: 1,
};

const inputValuesSlice = createSlice({
  name: 'formValues',
  initialState,
  reducers: {
    setBreddDefaultValue(state, action: PayloadAction<number>) {
      state.breddDefaultValue = action.payload;
    },
    setHojdDefaultValue(state, action: PayloadAction<number>) {
      state.hojdDefaultValue = action.payload;
    },
    setLaminatingLastSelected(state, action: PayloadAction<number | null>) {
      state.laminatingLastSelected = action.payload;
    },
    setMaterialLastSelected(state, action: PayloadAction<number | null>) {
      state.materialLastSelected = action.payload;
    },
    setAntalLastSelected(state, action: PayloadAction<number | null>) {
      state.antalLastSelected = action.payload;
    },
  },
});

export const {
  setBreddDefaultValue,
  setHojdDefaultValue,
  setLaminatingLastSelected,
  setMaterialLastSelected,
  setAntalLastSelected,
} = inputValuesSlice.actions;

export default inputValuesSlice.reducer;
