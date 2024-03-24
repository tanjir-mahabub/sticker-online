import { useCallback } from 'react';
import Raphael from 'raphael';

export const useRaphaelElements = (paper: any) => {
  const addImage = useCallback((image:any) => {
    if (!paper) return null;

    const { id, src, x, y, width, height, attrs } = image;
    let element = paper.getById(id);
    if (!element) {
      element = paper.image(src, x, y, width, height).attr(attrs);
      element.id = id;
    } else {
      element.attr({ src, x, y, width, height, ...attrs });
    }
    return element;
  }, [paper]);

  const addText = useCallback((textItem: any) => {
    if (!paper) return null;

    const { id, text, x, y, attrs } = textItem;
    let element = paper.getById(id);
    if (!element) {
      element = paper.text(x, y, text).attr(attrs);
      element.id = id;
    } else {
      element.attr({ text, x, y, ...attrs });
    }
    return element;
  }, [paper]);

  return { addImage, addText };
};
