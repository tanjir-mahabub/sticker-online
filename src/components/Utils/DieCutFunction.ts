import { CanvasState } from "@/types/types";
import geom from "../../lib/geom";
import * as d3 from "d3";
import { line } from 'd3-shape';

export const createDieCut = (paper: any, pathValue: string, canvasProps: CanvasState): void => {
    console.log(paper, pathValue, canvasProps);
};

const getSvgDimensions = (svgData: string): { width: number | null; height: number | null } => {
    const svgElement = new DOMParser().parseFromString(svgData, 'image/svg+xml').documentElement;
    const width = parseFloat(svgElement.getAttribute('width') || '0');
    const height = parseFloat(svgElement.getAttribute('height') || '0');
    return { width, height };
};

export const generateSVGImageData = async (
    svgData: string,
    grow: number,
    backgroundColor: string
): Promise<string> => {
    const { width, height } = getSvgDimensions(svgData);
    if (width === null || height === null) throw new Error('Invalid SVG dimensions');

    const modifiedSVG = await svgModification(svgData, width, height, grow, backgroundColor, backgroundColor);
    return createDataURL(modifiedSVG, width, height, grow, backgroundColor);
};

const svgModification = async (
    svg: string,
    width: number,
    height: number,
    grow: number,
    backgroundColor: string,
    strokeColor: string
): Promise<SVGSVGElement> => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Canvas context is null');

    const img = new Image();
    img.src = `data:image/svg+xml;base64,${btoa(svg)}`;

    console.log('svg modifying...');

    return new Promise<SVGSVGElement>((resolve, reject) => {
        img.onload = () => {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);

            const imageData = ctx.getImageData(0, 0, width, height);
            const pixels = imageData.data;
            const nonTransparentPixels = extractNonTransparentPixels(pixels, width);

            drawSVG(nonTransparentPixels, width, height, grow, backgroundColor, strokeColor)
                .then(resolve)
                .catch(reject);
        };

        img.onerror = () => reject(new Error('Failed to load SVG image'));
    });
};

const extractNonTransparentPixels = (
    pixels: Uint8ClampedArray,
    width: number
): { x: number; y: number; r: number; g: number; b: number; a: number }[] => {
    const nonTransparentPixels: { x: number; y: number; r: number; g: number; b: number; a: number }[] = [];

    console.log('Pixel extracting...');

    for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i + 3] > 0) {
            nonTransparentPixels.push({
                x: (i / 4) % width,
                y: Math.floor((i / 4) / width),
                r: 0,
                g: 0,
                b: 255,
                a: pixels[i + 3]
            });
        }
    }
    return nonTransparentPixels;
};

const drawSVG = async (
    pixels: { x: number; y: number; r: number; g: number; b: number; a: number }[],
    width: number,
    height: number,
    grow: number,
    backgroundColor: string,
    strokeColor: string
): Promise<SVGSVGElement> => {
    const svgNS = "http://www.w3.org/2000/svg";
    const svgRoot = document.createElementNS(svgNS, "svg");
    svgRoot.setAttribute("xmlns", svgNS);
    svgRoot.setAttribute("width", width.toString());
    svgRoot.setAttribute("height", height.toString());

    const fragment = document.createDocumentFragment();
    pixels.forEach(({ x, y }) => {
        const rect = createSVGRect(svgNS, x, y, backgroundColor, strokeColor, grow);
        fragment.appendChild(rect);
    });

    console.log('svg drawing...');

    svgRoot.appendChild(fragment);
    return svgRoot;
};

const createSVGRect = (
    svgNS: string,
    x: number,
    y: number,
    backgroundColor: string,
    strokeColor: string,
    grow: number
): SVGRectElement => {
    const rect = document.createElementNS(svgNS, "rect") as SVGRectElement;
    rect.setAttribute("x", x.toString());
    rect.setAttribute("y", y.toString());
    rect.setAttribute("width", "1");
    rect.setAttribute("height", "1");
    rect.setAttribute("fill", backgroundColor);
    rect.setAttribute("stroke", strokeColor);
    rect.setAttribute("stroke-width", grow.toString());
    rect.setAttribute("stroke-linejoin", "round");
    rect.setAttribute("stroke-linecap", "round");
    rect.setAttribute("vector-effect", "non-scaling-stroke");
    console.log('svg rect creating...');
    return rect;
};

const createDataURL = async (
    svgElement: SVGSVGElement,
    width: number,
    height: number,
    grow: number,
    backgroundColor: string
): Promise<string> => {
    if (!svgElement) throw new Error('Invalid SVG element');

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const modifiedSVG = await reDrawSVGImg(svgString, width, height, backgroundColor, "rgba(0,0,0,0.3)");
    if (!modifiedSVG) throw new Error('Failed to redraw SVG image');

    const modifiedSVGString = new XMLSerializer().serializeToString(modifiedSVG);
    
    console.log('Url creating...');

    return window.URL.createObjectURL(new Blob([modifiedSVGString], { type: 'image/svg+xml' }));
};

const generateModifiedPoints = (points: any[], offset: number): any[] => points.map(([x, y]) => [x, y + offset]);

const reDrawSVGImg = async (
    svg: string,
    width: number,
    height: number,
    backgroundColor: string,
    fillColor: string
): Promise<SVGSVGElement | null> => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Canvas context is null');

    const img = new Image();
    img.src = `data:image/svg+xml;base64,${btoa(svg)}`;

    console.log('SVG Image redrawing...');

    return new Promise<SVGSVGElement | null>((resolve, reject) => {
        img.onload = async () => {
            try {
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);

                const imageData = ctx.getImageData(0, 0, width, height);
                const grid = (x: number, y: number) => imageData.data[(y * imageData.width + x) * 4 + 3] > 0;

                const contours = geom.contour(grid);
                const modifiedContours = await drawSVGLine(contours, width, height, 1, backgroundColor, fillColor);

                resolve(modifiedContours);
            } catch (error) {
                reject(error);
            }
        };

        img.onerror = () => reject(new Error('Failed to load SVG image'));
    });
};

const drawSVGLine = (
    points: any[],
    width: number,
    height: number,
    grow: number,
    backgroundColor: string,
    fillColor: string
): SVGSVGElement | null => {
    if (!points.length) return null;

    const svgNS = "http://www.w3.org/2000/svg";
    const svgNode = document.createElementNS(svgNS, "svg");
    svgNode.setAttribute("width", width.toString());
    svgNode.setAttribute("height", height.toString());

    const mPoints = generateModifiedPoints(points, 0);
    const lineGenerator = line<any>().x(d => d[0]).y(d => d[1]).curve(d3.curveBasisClosed);
    const closedPoints = [...mPoints, mPoints[0]];

    const clipPathId = `clipPath${Date.now()}`;
    const clipPath = d3.select(svgNode).append("defs").append("clipPath").attr("id", clipPathId);
    clipPath.append("rect").attr("width", width).attr("height", height).attr("fill", backgroundColor);

    const strokePath = d3.select(svgNode).append("g").attr("clip-path", `url(#${clipPathId})`).append("path")
        .attr("fill", backgroundColor)
        .attr("stroke", fillColor)
        .attr("stroke-width", grow.toString())
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("vector-effect", "non-scaling-stroke");

    strokePath.datum(closedPoints).attr("d", lineGenerator);
    
    console.log('SVG line creating...');

    return svgNode;
};

export const extractDAttributeValue = async (svgUrl: string): Promise<string | null> => {
    try {
        const svgString = await (await fetch(svgUrl)).text();
        const formattedSvgString = svgString.startsWith("<svg>") ? svgString : `<svg xmlns="http://www.w3.org/2000/svg"> ${svgString}</svg>`;
        const pathElement = new DOMParser().parseFromString(formattedSvgString, "image/svg+xml").querySelector('path');
        return pathElement ? pathElement.getAttribute('d') : null;
    } catch (error) {
        console.error('Error parsing SVG:', error);
        return null;
    }
};
