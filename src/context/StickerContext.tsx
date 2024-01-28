"use client"

import { stickerSelectorStore } from '@/store/StickerSelectorStore';
import React, { createContext, FC, useContext, useState, ReactNode } from 'react';

interface Sticker {
  title: string;
  price: number;
}

interface StickerContextProps {
  selectedSticker: Sticker;
  setSticker: (title: string, price: number) => void;
}

const StickerContext = createContext<StickerContextProps | undefined>(undefined);

interface StickerProviderProps {
  children: ReactNode;
}

export const StickerProvider: FC<StickerProviderProps> = ({ children }) => {
  const initialSticker = stickerSelectorStore[0];

  const [selectedSticker, setSelectedSticker] = useState<Sticker>({
    title: initialSticker.title,
    price: initialSticker.price,
  });

  const setSticker = (title: string, price: number) => {
    setSelectedSticker({ title, price });
  };

  return (
    <StickerContext.Provider value={{ selectedSticker, setSticker }}>
      {children}
    </StickerContext.Provider>
  );
};

export const useStickerContext = () => {
  const context = useContext(StickerContext);
  if (!context) {
    throw new Error('useStickerContext must be used within a StickerProvider');
  }
  return context;
};
