import { ContourFinder } from "@/lib/ContourFinder";
import geom from "../../lib/geom";
import * as d3 from "d3";
import opentype from 'opentype.js';
import { fontMapping } from "@/store/customizeFontStore";

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


// export const generateSVGImageData = async (svgData: string, width: number, height: number, grow: number, backgroundColor: string): Promise<string> => {

//     const newWidth: number = width;
//     const newHeight: number = height;

//     const serializer = new XMLSerializer();

//     const modifiedSVG = await svgModification(svgData, newWidth, newHeight, grow, backgroundColor, backgroundColor);

//     // const svgString = serializer.serializeToString(modifiedSVG);

//     //const reModifiedSVG = await svgModification(svgString, newWidth, newHeight, 1, backgroundColor, 'rgba(0,0,0,0.3)');

//     const TsvgString = serializer.serializeToString(modifiedSVG);

//     // Create a Blob from the serialized SVG string
//     const blob = new Blob([TsvgString], { type: 'image/svg+xml' });

//     // Create a URL for the Blob
//     const url = window.URL.createObjectURL(blob);

//     return url;
// };


// const svgModification = async (svg: string, newWidth: number, newHeight: number, grow: number, backgroundColor: string, strokeColor: string): Promise<any> => {
//     return new Promise((resolve, reject) => {
//         const canvas = document.createElement('canvas');
//         canvas.width = newWidth;
//         canvas.height = newHeight;
//         const ctx = canvas.getContext('2d', {
//             willReadFrequently: true
//         });

//         const img = new Image();
//         img.src = `data:image/svg+xml;base64,${btoa(svg)}`;

//         img.onload = async () => {
//             try {
//                 if (!ctx) throw new Error('Canvas context is null');

//                 ctx.imageSmoothingEnabled = true;
//                 ctx.imageSmoothingQuality = 'high';
//                 ctx.drawImage(img, 0, 0, newWidth, newHeight);
//                 const imageData = ctx.getImageData(0, 0, newWidth, newHeight);
//                 const pixels = imageData.data;

//                 // Array to store non-transparent pixels
//                 const nonTransparentPixels = [];

//                 // Iterate over the pixel data
//                 for (let i = 0; i < pixels.length; i += 1) {
//                     // Check the alpha value of the pixel
//                     const alpha = pixels[i + 3];

//                     // If alpha > 0, consider the pixel as non-transparent
//                     if (alpha > 0) {
//                         // Get the RGBA values of the non-transparent pixel
//                         const r = pixels[i] = 255;
//                         const g = pixels[i + 1] = 0;
//                         const b = pixels[i + 2] = 0;
//                         const a = alpha;

//                         // Store the pixel information
//                         nonTransparentPixels.push({ x: (i / 4) % canvas.width, y: Math.floor((i / 4) / canvas.width), r, g, b, a });
//                     }
//                 }

//                 const nonTransparentCoordinates = nonTransparentPixels.map(pixel => [pixel.x, pixel.y]);

//                 const modifiedPoints = generateModifiedPoints(nonTransparentCoordinates, 0)
//                 // console.log('nonTransparentCoordinates', nonTransparentCoordinates);

//                 // console.log(imageData);
//                 //  const grid = (x: number, y: number) => {
//                 //     const index = (y * imageData.width + x) * 4;
//                 //     const alpha = imageData.data[index + 3];
//                 //     return alpha > 0;
//                 // };
//                 // console.log(grid);

//                 // const contours = geom.contour(grid);
//                 // console.log(contours);


//                 // Now 'contours' contains the generated contour paths
//                 // console.log('modifiedPoints', contours);


//                 const modifiedContours = await drawSVG(nonTransparentPixels, newWidth, newHeight, grow, backgroundColor, strokeColor);
//                 console.log(modifiedContours);

//                 resolve(modifiedContours);
//             } catch (error) {
//                 reject(error);
//             }
//         };

//         img.onerror = (error) => {
//             reject(new Error('Failed to load SVG image: ' + error));
//         };
//     });
// };

// const drawSVG = (pixels: { x: number; y: number; r: number; g: number; b: number; }[], newWidth: number, newHeight: number, grow: number, backgroundColor: string, strokeColor: string): SVGSVGElement => {
//     // Create a new SVG element
//     const svgRoot = document.createElementNS("http://www.w3.org/2000/svg", "svg");
//     svgRoot.setAttribute("xmlns", "http://www.w3.org/2000/svg");
//     svgRoot.setAttribute("width", newWidth.toString());
//     svgRoot.setAttribute("height", newHeight.toString());
//     // svgRoot.setAttribute("style", `background-color:${backgroundColor};`);

//     // Draw each non-transparent pixel as a rectangle
//     pixels.forEach(pixel => {
//         // Create a rectangle element for each pixel
//         const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
//         rect.setAttribute("x", pixel.x.toString());
//         rect.setAttribute("y", pixel.y.toString());
//         rect.setAttribute("width", "1");
//         rect.setAttribute("height", "1");
//         rect.setAttribute("fill", `${backgroundColor}`);
//         rect.setAttribute("stroke", strokeColor);
//         rect.setAttribute("stroke-width", `${grow}`);
//         rect.setAttribute("stroke-linejoin", "round")
//         rect.setAttribute("stroke-linecap", "round");
//         rect.setAttribute("vector-effect", "non-scaling-stroke");

//         // Append the rectangle to the SVG root element
//         svgRoot.appendChild(rect);
//     });

//     return svgRoot;
// };




// const generateModifiedPoints = (points: any, offset: number) => {
//     return points.map((point: any) => [point[0], point[1] + offset]);
// }

import { Selection } from 'd3-selection';
import { line } from 'd3-shape';


const connectPoints = (points: any[]) => {
    const connectedPoints = [];
    for (let i = 0; i < points.length - 1; i++) {
        connectedPoints.push(points[i]);
        if (distance(points[i], points[i + 1]) > 2) {  // Adjust the threshold as needed
            connectedPoints.push(midPoint(points[i], points[i + 1]));
        }
    }
    connectedPoints.push(points[points.length - 1]);
    return connectedPoints;
}

const distance = (point1: any, point2: any) => {
    const dx = point2[0] - point1[0];
    const dy = point2[1] - point1[1];
    return Math.sqrt(dx * dx + dy * dy);
}

const midPoint = (point1: any, point2: any) => {
    return [(point1[0] + point2[0]) / 2, (point1[1] + point2[1]) / 2];
}



const redraw = (points: any[], width: number, height: number, grow: number, backgroundColor: string, strokeColor: string): SVGSVGElement | null => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svgNode = document.createElementNS(svgNS, 'svg');
    svgNode.setAttribute('width', `${width}`);
    svgNode.setAttribute('height', `${height}`);

    if (points.length > 0) {
        const connectedPoints = connectPoints(points); // Offset by +10

        const lineGenerator = line<any>()
            .x(d => d[0])
            .y(d => d[1])
            .curve(d3.curveBasis);

        // Manually close the path by connecting the last point to the first point
        const closedPoints = [...connectedPoints, connectedPoints[0]];

        // const clipPathId = `clipPath${Date.now()}`;
        // const clipPath = d3.select(svgNode)
        //     .append("defs")
        //     .append("clipPath")
        //     .attr("id", clipPathId);

        // Append clipPath with a background rectangle
        // clipPath.append("rect")
        //     .attr("width", width)
        //     .attr("height", height)
        //     .attr("fill", backgroundColor);

        // Draw the modified path for stroke
        const strokePath: Selection<SVGPathElement, any, any, any> = d3.select(svgNode)
            .append("g")
            // .attr("clip-path", `url(#${clipPathId})`)
            .append("path")
            .attr("fill", backgroundColor)  // No fill
            .attr("stroke", strokeColor)  // Use stroke
            .attr("stroke-width", `${grow}`)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round");

        strokePath.datum(closedPoints)
            .attr("d", lineGenerator)
            .attr("vector-effect", "non-scaling-stroke");


        return svgNode;
    }

    return null;  // Return null if points array is empty
}
