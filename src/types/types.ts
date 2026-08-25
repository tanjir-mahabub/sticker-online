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

export interface StickerData {
  options: {
    dimensions_rate: string;
    api_username: string;
    api_password: string;
  };
  materials: MaterialOptionProps[];
  antals: AntalOptionProps[];
  laminates: LaminateOptionProps[];
}

export interface MaterialOptionProps {
  id: number;
  object_id: number;
  label: string;
  value: string;
  cost: number;
  icon: string;
  label_icon: string;
  src: string;
  popup: Popup;
}

export interface Popup {
  title: string;
  imgSrc: string;
  content: string;
}

export interface AntalOptionProps {
  id: number;
  object_id: number;
  st: string;
  cost: number;
  rate: string;
  value: string;
}

export interface LaminateOptionProps {
  id: number;
  object_id: number;
  st: string;
  value: string;
  cost: number;
}

export interface EditorPageProps {
  stickerData: StickerData;
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
  centerX: number | null;
  centerY: number | null;
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
