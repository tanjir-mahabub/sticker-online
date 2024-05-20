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
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  scaleX?: number;
  scaleY?: number;
  rotate?: number;
  stackNum?: number;
}

export interface ExtendedRaphaelPaper {
  width: number;
  height: number;
  forEach(callback: (el: any) => void): void;
  rect: (x: number, y: number, width: number, height: number, round?: number) => void;
  circle: (x: number, y: number, radius: number) => void;
  path: (d: string) => void;
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
  selectionCancel?: boolean;
  backgroundColor: string;
  textColor: string;
}


// type HistoryAction = Partial<RectangleProps['shapeProps'][]> | Partial<ImageProps['imageProps'][]> | Partial<TextProps['textProps'][]>;

// export type AddToHistory= (action: HistoryAction) => void;


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

export type BoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};