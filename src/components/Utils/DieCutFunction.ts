import { CanvasState } from "@/types/types";
import geom from "../../lib/geom";
import * as d3 from "d3";
import { Selection } from 'd3-selection';
import { line } from 'd3-shape';

export const createDieCut = (paper: any, pathValue: string, canvasProps: CanvasState) => {
    console.log(paper, pathValue, canvasProps);
}

const getSvgDimensions = (svgData: string) => {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgData, 'image/svg+xml');
    const svgElement = svgDoc.documentElement;
  
    const widthAttr = svgElement.getAttribute('width');
    const heightAttr = svgElement.getAttribute('height');
  
    const width = widthAttr ? parseFloat(widthAttr) : null;
    const height = heightAttr ? parseFloat(heightAttr) : null;
  
    return { width, height };
  };
  
  export const generateSVGImageData = async (
    svgData: string,
    grow: number,
    backgroundColor: string
  ): Promise<string> => {
    const { width, height } = getSvgDimensions(svgData);
  
    if (width === null || height === null) {
      throw new Error('Invalid SVG dimensions');
    }
  
    const modifiedSVG = await svgModification(svgData, width, height, grow, backgroundColor, backgroundColor);
    return createDataURL(modifiedSVG, width, height, grow, backgroundColor);
  };

// Function to modify SVG
const svgModification = async (svg: string, newWidth: number, newHeight: number, grow: number, backgroundColor: string, strokeColor: string): Promise<SVGSVGElement> => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx = canvas.getContext('2d', {
            willReadFrequently: true
        });

        const img = new Image();
        img.src = `data:image/svg+xml;base64,${btoa(svg)}`;

        img.onload = () => {
            if (!ctx) {
                reject(new Error('Canvas context is null'));
                return;
            }

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            console.log('diecut test', newWidth, newHeight, 'grow', grow);
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
            const imageData = ctx.getImageData(0, 0, newWidth, newHeight);
            const pixels = imageData.data;

            const nonTransparentPixels = [];

            for (let i = 0; i < pixels.length; i += 4) {
                const alpha = pixels[i + 3];
                if (alpha > 0) {
                    const r = pixels[i] = 0;
                    const g = pixels[i + 1] = 0;
                    const b = pixels[i + 2] = 255;
                    const a = alpha;
                    nonTransparentPixels.push({ x: (i / 4) % canvas.width, y: Math.floor((i / 4) / canvas.width), r, g, b, a });
                }
            }

            drawSVG(nonTransparentPixels, newWidth, newHeight, grow, backgroundColor, strokeColor)
                .then(resolve)
                .catch(reject);
        };

        img.onerror = (error) => {
            reject(new Error('Failed to load SVG image: ' + error));
        };
    });
};

const drawSVG = async (pixels: { x: number; y: number; r: number; g: number; b: number; }[], newWidth: number, newHeight: number, grow: number, backgroundColor: string, strokeColor: string): Promise<SVGSVGElement> => {
    const svgRoot = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgRoot.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgRoot.setAttribute("width", newWidth.toString());
    svgRoot.setAttribute("height", newHeight.toString());

    const fragment = document.createDocumentFragment(); // Create a document fragment

    pixels.forEach((pixel) => {
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", pixel.x.toString());
        rect.setAttribute("y", pixel.y.toString());
        rect.setAttribute("width", "1");
        rect.setAttribute("height", "1");
        rect.setAttribute("fill", backgroundColor);
        rect.setAttribute("stroke", strokeColor);
        rect.setAttribute("stroke-width", grow.toString());
        rect.setAttribute("stroke-linejoin", "round");
        rect.setAttribute("stroke-linecap", "round");
        rect.setAttribute("vector-effect", "non-scaling-stroke");
        fragment.appendChild(rect); // Append to fragment
    });

    svgRoot.appendChild(fragment); // Append fragment to SVG root

    return svgRoot;
};


// Function to create data URL from SVG element
const createDataURL = async (svgElement: SVGSVGElement, width: number, height: number, grow: number, backgroundColor: string): Promise<string> => {
    if (!svgElement) {
        throw new Error('Invalid SVG element');
    }

    const svgString = new XMLSerializer().serializeToString(svgElement);
    // console.log(svgString);

    const modifiedSVG = await reDrawSVGImg(svgString, width, height, backgroundColor, "rgba(0,0,0,0.3)");

    const modifiedSVGString = new XMLSerializer().serializeToString(modifiedSVG);

    const blob = new Blob([modifiedSVGString], { type: 'image/svg+xml' });

    return window.URL.createObjectURL(blob);
};



const generateModifiedPoints = (points: any, offset: number) => {
    return points.map((point: any) => [point[0], point[1] + offset]);
}

const reDrawSVGImg = async (svg: string, width: number, height: number, backgroundColor: string, fillColor: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
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
                ctx.drawImage(img, 0, 0, width, height);
                const imageData = ctx.getImageData(0, 0, width, height);

                const grid = (x: number, y: number) => {
                    const index = (y * imageData.width + x) * 4;
                    const alpha = imageData.data[index + 3];
                    return alpha > 0;
                };

                const contours = geom.contour(grid);

                const modifiedContours = await drawSVGLine(contours, width, height, 1, backgroundColor, fillColor);
                // console.log(modifiedContours);

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

const drawSVGLine = (points: any[], width: number, height: number, grow: number, backgroundColor: string, fillColor: string): SVGSVGElement | null => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svgNode = document.createElementNS(svgNS, 'svg');
    svgNode.setAttribute('width', `${width}`);
    svgNode.setAttribute('height', `${height}`);

    if (points.length > 0) {
        const mPoints = generateModifiedPoints(points, 0); // Offset by +10

        const lineGenerator = line<any>()
            .x(d => d[0])
            .y(d => d[1])
            .curve(d3.curveBasisClosed);

        // Manually close the path by connecting the last point to the first point
        const closedPoints = [...mPoints, mPoints[0]];

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

        // Draw the modified path for fill
        // const fillPath: Selection<SVGPathElement, any, any, any> = d3.select(svgNode)
        //     .append("g")
        //     .attr("clip-path", `url(#${clipPathId})`)
        //     .append("path")
        //     .attr("fill", fillColor)
        //     .attr("stroke", "none")  // No stroke
        //     .attr("stroke-width", "0")  // No stroke width
        //     .attr("stroke-linejoin", "round")
        //     .attr("stroke-linecap", "round");

        // fillPath.datum(closedPoints)
        //     .attr("d", lineGenerator);

        // Draw the modified path for stroke
        const strokePath: Selection<SVGPathElement, any, any, any> = d3.select(svgNode)
            .append("g")
            .attr("clip-path", `url(#${clipPathId})`)
            .append("path")
            .attr("fill", backgroundColor)  // No fill
            .attr("stroke", fillColor)  // Use stroke
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


export const extractDAttributeValue = async (svgUrl: string): Promise<string | null> => {
    try {
        // Fetch SVG content from the Blob URL
        const response = await fetch(svgUrl);
        const svgString = await response.text();

        // Ensure the SVG string starts with "<svg>" tag
        const formattedSvgString = svgString.startsWith("<svg>") ? svgString : `<svg xmlns="http://www.w3.org/2000/svg"> ${svgString}</>`;

        const parser = new DOMParser();
        const doc = parser.parseFromString(formattedSvgString, "image/svg+xml");

        const pathElement = doc.querySelector('path');
        return pathElement ? pathElement.getAttribute('d') : null;
    } catch (error) {
        console.error('Error parsing SVG:', error);
        return null;
    }
};