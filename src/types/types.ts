import { ImageProps } from "@/components/Editor/CanvasTools/Image";
import { RectangleProps } from "@/components/Editor/CanvasTools/Rectangle";
import { TextProps } from "@/components/Editor/CanvasTools/Text";

export interface StickerState {    
  id: number
}

export interface SideNavState {    
  id: number
}


export interface CanvasState {  
  centerX: number;
  centerY: number;
  frameWidth: number;
  frameHeight: number;  
  canvasUpdated: boolean;
}


type HistoryAction = Partial<RectangleProps['shapeProps'][]> | Partial<ImageProps['imageProps'][]> | Partial<TextProps['textProps'][]>;

export type AddToHistory= (action: HistoryAction) => void;