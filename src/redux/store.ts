import { persistStore, persistReducer } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import StickerReducer from '@/redux/features/stickerSlice';
import SideNavReducer from './features/sideNavSlice';
import canvasReducer from './features/canvasSlice';
import textReducer from './features/textSlice';
import motivReducer from './features/motivSlice';
import insideFrameReducer from './features/insideFrameSlice';
import imagePreviewReducer from './features/imagePreviewSlice';
import popupReducer from './features/popupSlice';
import calculationReducer from './features/calculationSlice';
import formReducer from './features/formSlice';
import categoryToRemoveReducer from './features/categoryToRemove';
import createNoopStorage from './noopStorage';

const createPersistStorage = () => {
  if (typeof window !== 'undefined') {
    return createWebStorage('local');
  } else {
    return createNoopStorage();
  }
};

const persistStorage = createPersistStorage();

const persistConfig = {
  key: 'root',
  storage: persistStorage,
};

const rootReducer = combineReducers({
  sticker: StickerReducer,
  sideNav: SideNavReducer,
  canvas: canvasReducer,
  text: textReducer,
  motiv: motivReducer,
  insideFrame: insideFrameReducer,
  imagePreview: imagePreviewReducer,
  popup: popupReducer,
  calculation: calculationReducer,
  formValues: formReducer,
  categoryToRemove: categoryToRemoveReducer,
});

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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
