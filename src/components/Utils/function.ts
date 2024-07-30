import opentype from 'opentype.js';
import { fontMapping } from "@/store/customizeFontStore";

const pathDataCache = new Map();

export function convertTextToPath(element: any): Promise<string> {
    // Check if path data for this text element is already cached
    if (pathDataCache.has(element.id)) {
        // Return the cached path data
        return Promise.resolve(pathDataCache.get(element.id));
    }

    return new Promise<string>((resolve) => {
        if (element.type === "text") {
            const fontFamily = element.fontFamily;
            console.log('checking.....');

            opentype?.load(fontMapping[fontFamily], (err: any, font: any) => {
                if (err) {
                    console.log('Something wrongs in convert text to path.', err);                    
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
        }
    });
}

export const formattedTotalCost = (value: number) => {
    const formatedCost = new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' }).format(value);
    return formatedCost;
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
    return Math.round(cm);
}


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

// TypeScript function to determine image quality for printing
export const getImageQualityForPrinting = (
    actualWidthPixels: number,
    actualHeightPixels: number,
    printWidthCm: number,
    printHeightCm: number
): string => {
    const cmToInch = 2.54; // Conversion factor from centimeters to inches
    const requiredDPI = 300; // Standard print DPI

    // Convert print size from centimeters to inches
    const printWidthInches = printWidthCm / cmToInch;
    const printHeightInches = printHeightCm / cmToInch;

    // Calculate required dimensions in pixels for 300 DPI
    const requiredWidthPixels = printWidthInches * requiredDPI;
    const requiredHeightPixels = printHeightInches * requiredDPI;

    let quality: string = "Unknown";

    if (actualWidthPixels >= requiredWidthPixels && actualHeightPixels >= requiredHeightPixels) {
        quality = "Best";
    } else if (actualWidthPixels >= requiredWidthPixels * 0.75 && actualHeightPixels >= requiredHeightPixels * 0.75) {
        quality = "Average";
    } else {
        quality = "Low";
    }

    return quality;
}