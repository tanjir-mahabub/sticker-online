import Konva from "konva";

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
