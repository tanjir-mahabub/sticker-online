import { useCallback } from 'react';
import Raphael from 'raphael';

export const useRaphaelElements = (paper: any) => {
  const addImageElement = useCallback((image: any) => {
    if (!paper) return null;

    const { id, src, x, y, width, height, attrs, scaleX, scaleY, rotation, type } = image;
    let element = paper.getById(id);
    if (!element) {
      element = paper.image(src, x, y, width, height).attr(attrs);
      element.id = id;
      element.data({ 'data': type });
      element.data({ 'isCenterable': true });
    } else {
      element.attr({ src, x, y, width, height, ...attrs });
    }

    // Apply scaling transformation
    if (scaleX !== undefined || scaleY !== undefined) {
      const scaleString = `S${scaleX || 1},${scaleY || 1}`;
      element.transform(scaleString);
    }

    // Apply rotation transformation
    if (rotation !== undefined) {
      element.transform(`R${rotation}`);
    }

    return element;
  }, [paper]);

  const addTextElement = useCallback((textItem: any) => {
    if (!paper) return null;

    const { id, text, x, y, attrs, type } = textItem;
    let element = paper.getById(id);
    if (!element) {
      element = paper.text(x, y, text).attr(attrs);
      element.id = id;
      element.data({ 'data': type });
      element.data({ 'isCenterable': true });
    } else {
      element.attr({ text, x, y, ...attrs });
    }
    return element;
  }, [paper]);

  const addPathElement = useCallback((pathItem: any) => {
    if (!paper) return null;

    const { id, pathData, attrs, type } = pathItem;
    let element = paper.getById(id);
    if (!element) {
      element = paper.path(pathData).attr(attrs);
      element.id = id;
      element.data({ 'data': type });
      element.data({ 'isCenterable': true });
    } else {
      element.attr({ path: pathData, ...attrs });
    }
    return element;
  }, [paper]);

  return { addImageElement, addTextElement, addPathElement };
};
