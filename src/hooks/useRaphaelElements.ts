import { useCallback } from 'react';

interface RaphaelAttributes {
    [key: string]: string | number;
}

export interface RaphaelPaper {
    image: (src: string, x: number, y: number, width: number, height: number) => any;
    text: (x: number, y: number, text: string) => any;
}



interface ImageItem {
    src: string;
    x: number;
    y: number;
    width: number;
    height: number;
    attrs?: RaphaelAttributes;
  }
  
  interface TextItem {
    x: number;
    y: number;
    text: string;
    attrs?: RaphaelAttributes;
  }


  export const useRaphaelElements = (paper: RaphaelPaper | null) => {
    // Add multiple images
    const addImages = useCallback((images: ImageItem[]) => {
      if (!paper) return [];
      return images.map(({ src, x, y, width, height, attrs }) => {
        const image = paper.image(src, x, y, width, height).attr(attrs || {})
        image.data('isCenterable', true); 
        return image;
      }
      );
    }, [paper]);
  
    // Add multiple texts
    const addTexts = useCallback((texts: TextItem[]) => {
      if (!paper) return [];
      return texts.map(({ x, y, text, attrs }) => {
        const textEL =  paper.text(x, y, text).attr(attrs);
        textEL.data('isCenterable', true);
        return textEL;
      }       
      );
    }, [paper]);
  
    return { addImages, addTexts };
  };