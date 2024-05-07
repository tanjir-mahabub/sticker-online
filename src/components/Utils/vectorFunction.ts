import opentype from 'opentype.js';
import { fontMapping } from "@/store/customizeFontStore";
import { Frame, ObjectPosition } from '@/types/types';

const pathDataCache = new Map();

export function convertTextToPath(element: any): Promise<void> {
    // Check if path data for this text element is already cached
    if (pathDataCache.has(element.id)) {
        // Return the cached path data
        return Promise.resolve(pathDataCache.get(element.id));
    }

    return new Promise<void>((resolve) => {
        if (element.type === "text") {
            const fontFamily = element.fontFamily;

            opentype?.load(fontMapping[fontFamily], (err: any, font: any) => {
                if (err) {
                    resolve();
                    return;
                }

                const textPath = font.getPath(
                    element.text,
                    element.x,
                    element.y,
                    element.fontSize,
                    {
                        fill: element.fill,
                        stroke: element.stroke,
                        strokeWidth: element.strokeWidth,
                        width: element.width,
                        height: element.height,
                    }
                );

                const pathData = textPath.toPathData();
                // Cache the path data for this text element
                pathDataCache.set(element.id, pathData);
                // Resolve with the path data
                resolve(pathData);
            });
        } else {
            resolve();
        }
    });
}


export const getTextWidthCanvas = (text: string, font: string, fontSize: number): number => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    ctx.font = `${fontSize}px ${font}`;

    const textMetrics = ctx.measureText(text);

    return textMetrics.width;
};

export const formattedTotalCost = (value: number) => {
    const formatedCost = new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' }).format(value);
    return formatedCost;
}

export const pixelsToCm = (pixels: number, dpi: number): number => {
    // Convert pixels to centimeters using the formula
    const cm = pixels / dpi * 2.54;
    return cm;
}

export const generateUniqueId = (): string => {
    return Math.random().toString(36).substring(2, 12);
};


export const cmToPixel = (cm: number, dpi = 96) => {
    const inches = cm / 2.54;
    const pixels = inches * dpi;
    return Math.round(pixels);
}


export const pixelToCm = (pixels: number, dpi = 96) => {
    const inches = pixels / dpi;
    const cm = inches * 2.54;
    return cm.toFixed(1).replace('.', ',');
}

export const calculateFrameEdges = (frame: Frame) => {
    return {
        startX: frame.centerX - (frame.frameWidth / 2),
        startY: frame.centerY - (frame.frameHeight / 2),
        endX: frame.centerX + (frame.frameWidth / 2),
        endY: frame.centerY + (frame.frameHeight / 2),
    };
};


export const isObjectInsideFrame = (objectPosition: ObjectPosition, frameEdges: ReturnType<typeof calculateFrameEdges>) => {
    // Calculate object edges
    const objectLeft = objectPosition?.x;
    const objectRight = objectPosition?.x + objectPosition?.width;
    const objectTop = objectPosition?.y;
    const objectBottom = objectPosition?.y + objectPosition?.height;

    // Check if the object intersects with the frame
    const intersects = !(
        objectRight < frameEdges.startX ||
        objectLeft > frameEdges.endX ||
        objectBottom < frameEdges.startY ||
        objectTop > frameEdges.endY
    );

    return intersects;
};



export const convertJpgToBase64 = (imageURL: string) => {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.crossOrigin = 'Anonymous';

        img.onload = function () {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = img.width;
            canvas.height = img.height;

            if (!ctx) return;

            ctx.drawImage(img, 0, 0);

            const base64Data = canvas.toDataURL('image/png');

            resolve(base64Data);
        };

        img.onerror = function () {
            reject(new Error('Failed to load the image'));
        };

        img.src = imageURL;
    });
}