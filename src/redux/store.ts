import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';
import StickerReducer from '@/redux/features/stickerSlice';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import SideNavReducer from './features/sideNavSlice';
import canvasReducer from './features/canvasSlice';
import textReducer from './features/textSlice';
import motivReducer from './features/motivSlice';
import historyReducer from './features/historySlice';
import insideFrameReducer from './features/insideFrameSlice';
import imagePreviewReducer from './features/imagePreviewSlice';
import popupReducer from './features/popupSlice';
import calculationReducer from './features/calculationSlice';
import formReducer from './features/formSlice';
import stackOrderReducer from './features/stackOrderSlice'
import categoryToRemoveReducer from './features/categoryToRemove';

const rootReducer = combineReducers({
  sticker: StickerReducer,
  sideNav: SideNavReducer,
  canvas: canvasReducer,
  text: textReducer,
  motiv: motivReducer,
  history: historyReducer,
  insideFrame: insideFrameReducer,
  imagePreview: imagePreviewReducer,
  popup: popupReducer,
  calculation: calculationReducer,
  formValues: formReducer,
  stackOrder: stackOrderReducer,
  categoryToRemove: categoryToRemoveReducer
})

const persistConfig = {
  key: 'root',
  storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);


export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;