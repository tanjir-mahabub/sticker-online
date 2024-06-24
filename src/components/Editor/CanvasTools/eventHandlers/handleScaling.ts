import { fabric } from 'fabric';
import { adjustViewportToElement } from './adjustViewportToElement';

export const handleScaling = (fabricCanvas: fabric.Canvas) => (e: any) => {
  const target = e.target as fabric.Object;
  if (target) {
    adjustViewportToElement(fabricCanvas, target);
  }
};
