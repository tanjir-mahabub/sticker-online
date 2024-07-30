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

export interface CanvasProps {
  width?: number;
  height?: number;
  frameWidth?: number;
  frameHeight?: number;
  centerX?: number,
  centerY?: number,
  scale?: number
}

export interface ImageInfo {
  id: string;
  src: string;
  category?: string;
  status?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  scaleX?: number;
  scaleY?: number;
  rotate?: number;
  stackNum?: number;
}

export interface CanvasState {
  clientWidth: number,
  clientHeight: number,
  canvasInitialZoom: number,
  canvasX: number,
  canvasY: number,
  canvasWidth: number,
  canvasHeight: number,
  centerX: number;
  centerY: number;
  frameWidth: number;
  frameHeight: number;
  bredd: number;
  hojd: number;
  scale: number;
  grow: number;
  backgroundColor: string;
  textColor: string;
  isLoading: boolean;
  hasSelected: boolean;
}