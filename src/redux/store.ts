import StickerReducer from '@/redux/features/stickerSlice';
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import SideNavReducer from './features/sideNavSlice';
import canvasReducer from './features/canvasSlice';
import textReducer from './features/textSlice';
import fileReducer from './features/fileUploadSlice';
import motivReducer from './features/motivSlice';
import historyReducer from './features/historySlice';
import insideFrameReducer from './features/insideFrameSlice';
import imagePreviewReducer from './features/imagePreviewSlice';
import popupReducer from './features/popupSlice';

const store = configureStore({
  reducer: {
    sticker: StickerReducer,
    sideNav: SideNavReducer,
    canvas: canvasReducer,
    text: textReducer,
    file: fileReducer,
    motiv: motivReducer,
    history: historyReducer,
    insideFrame: insideFrameReducer,
    imagePreview: imagePreviewReducer,
    popup: popupReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;