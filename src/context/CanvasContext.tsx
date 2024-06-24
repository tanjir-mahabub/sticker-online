import React, { createContext, useContext, useRef, ReactNode } from 'react';
import { fabric } from 'fabric';
import HistoryController from '@/components/Editor/CanvasTools/eventHandlers/historyController';

interface CanvasContextProps {
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>;
  htmlCanvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  historyControllerRef: React.MutableRefObject<HistoryController | null>;
  iconImageRef: React.MutableRefObject<HTMLImageElement | null>;
  saveState: () => void;
  undo: () => void;
  redo: () => void;
}

interface CanvasProviderProps {
  children: ReactNode;
}

const CanvasContext = createContext<CanvasContextProps | undefined>(undefined);

export const CanvasProvider: React.FC<CanvasProviderProps> = ({ children }) => {
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const htmlCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const historyControllerRef = useRef<HistoryController | null>(null);
  const iconImageRef = useRef<HTMLImageElement | null>(null);

  const saveState = () => {
    historyControllerRef.current?.saveState();
  };

  const undo = () => {
    historyControllerRef.current?.undo();
  };

  const redo = () => {
    historyControllerRef.current?.redo();
  };

  return (
    <CanvasContext.Provider value={{ fabricCanvasRef, htmlCanvasRef, historyControllerRef, iconImageRef, saveState, undo, redo }}>
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = (): CanvasContextProps => {
    const context = useContext(CanvasContext);
    if (!context) {
      throw new Error('useCanvas must be used within a CanvasProvider');
    }
    return context;
  };