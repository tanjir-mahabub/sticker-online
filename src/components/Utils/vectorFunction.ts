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
    return Math.round(cm);
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

export const svgStringToNode = (svgString: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    return doc.documentElement;
}

export const handleFrameAdjustment = (elements: any) => {
    if (elements) {
        const checkValues: any = [];
        elements?.forEach((el: any) => {
            el?.freeTransform?.hideHandles({ undrag: false })
            const bbox = el?.getBBox();
            checkValues.push({ id: el.id, bbox: bbox })

        })
        console.log(checkValues.filter((item: any) => Math.min(item.bbox.x)));
    }
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




export const defaultOptions = {
    keepRatio: true,
    rotate: true,
    scale: true,
    drag: true,
    distance: 1.35,
    size: 7,
    round: 100,
    draw: ['bbox'],
    attrs: {
        fill: '#fff',
        stroke: '#000'
    },
};

export const createRotatePattern = (svgElement: SVGElement) => {
    const svgNS = "http://www.w3.org/2000/svg";

    if (svgElement) {
        const pattern = document.createElementNS(svgNS, "pattern");
        // Pattern attributes
        pattern.setAttribute("id", "rotateImageFill");
        pattern.setAttribute("patternUnits", "objectBoundingBox");
        pattern.setAttribute("width", "100%");
        pattern.setAttribute("height", "100%");

        const image = document.createElementNS(svgNS, "image");
        // Image attributes
        image.setAttributeNS("http://www.w3.org/1999/xlink", "href", "/rotateIcon.svg");
        image.setAttribute("width", "22");
        image.setAttribute("height", "22");

        pattern.appendChild(image);

        // Append pattern to defs
        let defs = svgElement.querySelector("defs");
        if (!defs) {
            defs = document.createElementNS(svgNS, "defs");
            svgElement.appendChild(defs);
        }
        defs.appendChild(pattern);
    }
}

// export const showFreeTransform = (ft: any) => {
//     if (ft) {
//         ft.showHandles()
//         if (ft.handles) {
//             if (ft.handles.x.line) ft.handles.x.line.hide();

//             if (ft.handles.x.disc) ft.handles.x.disc.hide();

//             if (ft.handles.center.disc) ft.handles.center.disc.node.setAttribute("pointer-events", "none")

//         }
//     }

//     ft?.updateHandles();

//     ft?.apply();
// }

// export const hideFreeTransform = (ft: any, paper?: any) => {
//     ft && ft?.hideHandles({ undrag: false })
//     if (paper) {
//         paper?.forEach((el: any) => {
//             if (el.type === "image" && el.id !== ft.subject.id) {
//                 el.freeTransform && el.freeTransform.hideHandles({ undrag: false })
//             }
//         })
//     }
// }


// export const handleFreeTransform = (ft: any, events: any) => {
//     // console.log(ft, events);          
//     if (events.includes('drag start')) {
//         ft.subject.paper.forEach((el: any) => {
//             if (el.node.classList.contains('freeTransform')) {
//                 el.node.style.visibility = "hidden"
//             }
//         })
//     }
//     if (events.includes('drag end')) {
//         ft.handles.center.disc.node.style.visibility = "visible"
//         ft.handles.x.disc.node.style.visibility = "visible"
//         ft.handles.x.line.node.style.visibility = "visible"
//         ft.handles.y.disc.node.style.visibility = "visible"
//         ft.handles.y.line.node.style.visibility = "visible"
//         ft.bbox.node.style.visibility = "visible"
//         ft.handles.bbox.forEach((item: any) => {
//             item.element.node.style.visibility = "visible";
//             item.element.node.style.opacity = "0.5"
//         })

//         // console.log('drag end from vector', ft);
//         const paper: any = ft.subject?.paper;
//         const paperCenter: { x: number, y: number } = { x: paper.width / 2, y: paper.height / 2 };
//         const bbox: any = ft.subject?.getBBox();
//         const elCenter = { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 };
//         const translation = { x: paperCenter.x - elCenter.x, y: paperCenter.y - elCenter.y };

//         const matrix = ft.subject?.transform();
//         console.log('ft.attrs', translation.x, translation.y);
//         let x = translation.x;
//         let y = translation.y;

//         return {
//             subject: ft.subject,
//             attrs: {
//                 x: x,
//                 y: y,
//             }
//         };
//     }

//     if (events.includes('scale end') || events.includes('rotate end')) {

//     }

    // if (events.includes('scale end') || events.includes('rotate end')) {

    //     // const paper: any = ft.subject?.paper;
    //     // const paperCenter: { x: number, y: number } = { x: paper.width / 2, y: paper.height / 2 };
    //     // const bbox: any = ft.subject?.getBBox();
    //     // const elCenter = { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 };
    //     // const translation = { x: paperCenter.x - elCenter.x, y: paperCenter.y - elCenter.y };

    //     //     const matrix = ft.subject?.matrix;

    //     //     console.log(matrix);

    //     //     let x = translation.x;
    //     //     let y = translation.y;
    //     //     console.log('scale---', ft);
    //     //     let scaleX = ft.attrs.scale.x;
    //     //     let scaleY = ft.attrs.scale.y;          
    //     //     let rotate = ft.attrs.scale.rotate;

    //     //     // matrix.forEach(([operation, ...params]: any) => {
    //     //     //     switch (operation) {
    //     //     //         case "T":
    //     //     //             // x = params[0];
    //     //     //             // y = params[1];
    //     //     //             break;
    //     //     //         case "S":
    //     //     //             scaleX = params[0];
    //     //     //             scaleY = params[1];
    //     //     //             break;
    //     //     //         case "R":                        
    //     //     //             rotate = params[0];
    //     //     //             break;
    //     //     //     }
    //     //     // });

    //     //     // Log transformation values
    //     //     // console.log(ft.subject?.id);


    //         // console.log("Drag end ScaleX:", scaleX);
    //         // console.log("Drag end ScaleY:", scaleY);            
    //         // console.log("Drag end Rotate:", rotate);

    //     return {
    //         subject: ft.subject,
    //         attrs: {      
    //         //    matrix: matrix
    //         }
    //     };
    // }
// }


export const FTitemVisibility = (selectedItem: any, status: string) => {
    const ft = selectedItem?.freeTransform
    if (ft && status) {
        ft.handles.center.disc.node.style.visibility = status
        ft.handles.x.disc.node.style.visibility = status
        ft.handles.x.line.node.style.visibility = status
        ft.handles.y.disc.node.style.visibility = status
        ft.handles.y.line.node.style.visibility = status
        ft.bbox.node.style.visibility = status
        ft.handles.bbox.forEach((item: any) => Object.assign(item?.element?.node?.style, { visibility: status, opacity: "0.5" }));
        console.log('newft', ft);
    }
}

export const calculateBoundingBox = (paper: any, set: any) => {
    let minX = paper.width;
    let minY = paper.height;
    let maxX = 0;
    let maxY = 0;

    set.forEach((el: any) => {
        const bbox = el.getBBox();
        
        if (bbox.x < minX) {
            minX = bbox.x;
        }
        if (bbox.y < minY) {
            minY = bbox.y;
        }
        if (bbox.x + bbox.width > maxX) {
            maxX = bbox.x + bbox.width;
        }
        if (bbox.y + bbox.height > maxY) {
            maxY = bbox.y + bbox.height;
        }
    });

    const totalWidth = maxX - minX;
    const totalHeight = maxY - minY;

    return {
        x: minX,
        y: minY,
        width: totalWidth,
        height: totalHeight
    };
};