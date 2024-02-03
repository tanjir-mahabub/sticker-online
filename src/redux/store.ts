import StickerReducer from '@/redux/features/stickerSlice';
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import SideNavReducer from './features/sideNavSlice';

const store = configureStore({
  reducer: {
    sticker: StickerReducer,
    sideNav: SideNavReducer
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;