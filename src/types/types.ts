import { ImageProps } from "@/components/Editor/CanvasTools/Image";
import { RectangleProps } from "@/components/Editor/CanvasTools/Rectangle";
import { TextProps } from "@/components/Editor/CanvasTools/Text";

export interface StickerState {    
  id: number
}

export interface SideNavState {    
  id: number
}

export interface ImageData {
  id: string;
  file: string;
}


export interface ImageInfo {
  id: string;
  src: string;
}


export interface CanvasState {  
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  frameWidth: number;
  frameHeight: number;    
  bredd: number;
  hojd: number;
  scale: number;
  grow: number;
}


type HistoryAction = Partial<RectangleProps['shapeProps'][]> | Partial<ImageProps['imageProps'][]> | Partial<TextProps['textProps'][]>;

export type AddToHistory= (action: HistoryAction) => void;


export interface Frame {
  centerX: number;
  centerY: number;
  frameWidth: number;
  frameHeight: number;
}

export interface ObjectPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}