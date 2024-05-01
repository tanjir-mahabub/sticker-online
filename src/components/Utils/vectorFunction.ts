import { ContourFinder } from "@/lib/ContourFinder";
import geom from "../../lib/geom";
import * as d3 from "d3";
import opentype from 'opentype.js';
import { fontMapping } from "@/store/customizeFontStore";

const svgCreate = async (svgElement: SVGElement, width: number, height: number, grow: number, backgroundColor: string) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    const xAttr = svgElement.getAttribute("x");
    const yAttr = svgElement.getAttribute("y");
    const widthAttr = svgElement.getAttribute("width");
    const heightAttr = svgElement.getAttribute("height");

    // Perform null checks before parsing attribute values
    const x = xAttr ? parseFloat(xAttr) : 0;
    const y = yAttr ? parseFloat(yAttr) : 0;
    // const width = widthAttr ? parseFloat(widthAttr) : 100;
    // const height = heightAttr ? parseFloat(heightAttr) : 100;

    svg.setAttribute("x", "0")
    svg.setAttribute("y", "0")
    // svg.setAttribute("x", "0")
    // svg.setAttribute("x", "0")

    // Set attributes for the SVG container
    svg.setAttribute("viewport", `0 0 ${width} ${height}`);


    const matrix = `matrix(1,0,0,1, -${x / 2}, -${y / 2})`;
    console.log(matrix);
    svgElement.setAttribute("transform", matrix);

    // svgElement.removeAttribute("width");
    // svgElement.removeAttribute("height");
    console.log(svgElement);
    svg.appendChild(svgElement);
    const svgString = new XMLSerializer().serializeToString(svg);
    // const modified = await svgModification(svgString, 280, 385, 20, "red", "red");
    // console.log('modified', modified);
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    const svgNode = doc.children[0];
    console.log(svgNode);
    return svgNode;
}

// Define a cache to store the path data for each text element
export const generateContours = async (svgString: string, width: number, height: number, grow: number, backgroundColor: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    const elements = Array.from(doc.children[0].childNodes);


    const modifiedSvgStrings: string[] = [];
    for (const element of elements) {
        const svgElement = element as SVGElement;
        if (svgElement.nodeName === "image") {
            const svgString = await svgCreate(svgElement, width, height, grow, backgroundColor)
            // console.log(svgString);
            return svgString;
        }
        // const modifiedSvgString = await generateContoursFromElement(svgElement);
        // modifiedSvgStrings.push(modifiedSvgString);
    }

    // return modifiedSvgStrings;
};



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


export const generateSVGJoin = async (svgData: string, width: number, height: number, grow: number, backgroundColor: string): Promise<string> => {

    const newWidth: number = width;
    const newHeight: number = height;

    const serializer = new XMLSerializer();

    const modifiedSVG = await svgJoining(svgData, newWidth, newHeight, grow, backgroundColor, backgroundColor);
    // console.log(modifiedSVG);
    // Check if modifiedSVG is a valid Node object
    if (modifiedSVG && modifiedSVG instanceof Node) {
        const svgString = serializer.serializeToString(modifiedSVG);
        return svgString;
    } else {
        throw new Error('Invalid SVG node');
    }
}

export const generateSVGImageTest = async (imageNode: SVGImageElement | SVGPathElement, width: number, height: number, grow: number, backgroundColor: string): Promise<string> => {

    const newWidth: number = width;
    const newHeight: number = height;

    const serializer = new XMLSerializer();

    // Create a new SVG document
    const svgNS = 'http://www.w3.org/2000/svg';
    const svgNode = document.createElementNS(svgNS, 'svg');

    // Set SVG attributes like width, height, and background color
    svgNode.setAttribute('width', String(newWidth));
    svgNode.setAttribute('height', String(newHeight));

    // Create a new image element if imageNode is SVGImageElement
    if (imageNode instanceof SVGImageElement) {
        const newImage = document.createElementNS(svgNS, 'image');
        newImage.setAttribute('xlink:href', imageNode.href.baseVal);
        newImage.setAttribute('width', String(imageNode.width.baseVal));
        newImage.setAttribute('height', String(imageNode.height.baseVal));
        svgNode.appendChild(newImage);
    }
    // Clone the path element if imageNode is SVGPathElement
    else if (imageNode instanceof SVGPathElement) {
        svgNode.appendChild(imageNode.cloneNode(true));
    }

    // Serialize the SVG document into a string
    const svgString = serializer.serializeToString(svgNode);

    // Create a Blob from the serialized SVG string
    const blob = new Blob([svgString], { type: 'image/svg+xml' });

    // Create a URL for the Blob
    const url = window.URL.createObjectURL(blob);

    return url;
};


export const generateSVGImageData = async (svgData: string, width: number, height: number, grow: number, backgroundColor: string): Promise<string> => {

    const newWidth: number = width;
    const newHeight: number = height;

    const serializer = new XMLSerializer();

    const modifiedSVG = await svgModification(svgData, newWidth, newHeight, grow, backgroundColor, backgroundColor);

    const svgString = serializer.serializeToString(modifiedSVG);

    const reModifiedSVG = await svgModification(svgString, newWidth, newHeight, 1, backgroundColor, 'rgba(0,0,0,0.3)');

    const TsvgString = serializer.serializeToString(reModifiedSVG);

    // Create a Blob from the serialized SVG string
    const blob = new Blob([TsvgString], { type: 'image/svg+xml' });

    // Create a URL for the Blob
    const url = window.URL.createObjectURL(blob);

    return url;
};

const svgJoining = async (svg: string, newWidth: number, newHeight: number, grow: number, backgroundColor: string, strokeColor: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx = canvas.getContext('2d', {
            willReadFrequently: true
        });

        const img = new Image();
        img.src = `data:image/svg+xml;base64,${btoa(svg)}`;

        img.onload = async () => {
            try {
                if (!ctx) throw new Error('Canvas context is null');

                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, newWidth, newHeight);
                const imageData = ctx.getImageData(0, 0, newWidth, newHeight);


                const contourFinderInstance = new ContourFinder();
                contourFinderInstance.init(canvas);

                // Find contours
                contourFinderInstance.findContours();

                // Convert contours to the desired format
                const formattedContours = contourFinderInstance.allContours.flatMap(contour =>
                    contour.map(point => [point.x, point.y])
                );

                const modifiedContours = await redraw(formattedContours, newWidth, newHeight, grow, backgroundColor, strokeColor);

                resolve(modifiedContours);
            } catch (error) {
                reject(error);
            }
        };

        img.onerror = (error) => {
            reject(new Error('Failed to load SVG image: ' + error));
        };
    });
};

const svgModification = async (svg: string, newWidth: number, newHeight: number, grow: number, backgroundColor: string, strokeColor: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx = canvas.getContext('2d', {
            willReadFrequently: true
        });

        const img = new Image();
        img.src = `data:image/svg+xml;base64,${btoa(svg)}`;

        img.onload = async () => {
            try {
                if (!ctx) throw new Error('Canvas context is null');

                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, newWidth, newHeight);
                const imageData = ctx.getImageData(0, 0, newWidth, newHeight);
                // console.log(imageData);
                const grid = (x: number, y: number) => {
                    const index = (y * imageData.width + x) * 4;
                    const alpha = imageData.data[index + 3];
                    return alpha > 0;
                };


                const contours = geom.contour(grid);
                // console.log(contours);

                const modifiedContours = await redraw(contours, newWidth, newHeight, grow, backgroundColor, strokeColor);

                resolve(modifiedContours);
            } catch (error) {
                reject(error);
            }
        };

        img.onerror = (error) => {
            reject(new Error('Failed to load SVG image: ' + error));
        };
    });
};


const generateModifiedPoints = (points: any, offset: number) => {
    return points.map((point: any) => [point[0], point[1] + offset]);
}

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
            .curve(d3.curveBasisClosed);

        // Manually close the path by connecting the last point to the first point
        const closedPoints = [...connectedPoints, connectedPoints[0]];

        const clipPathId = `clipPath${Date.now()}`;
        const clipPath = d3.select(svgNode)
            .append("defs")
            .append("clipPath")
            .attr("id", clipPathId);

        // Append clipPath with a background rectangle
        clipPath.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", backgroundColor);

        // Draw the modified path for stroke
        const strokePath: Selection<SVGPathElement, any, any, any> = d3.select(svgNode)
            .append("g")
            .attr("clip-path", `url(#${clipPathId})`)
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
