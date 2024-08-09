import { CanvasState } from "@/types/types";
import geom from "../../lib/geom";
import * as d3 from "d3";
import { line } from 'd3-shape';

const parseSvgString = (svgString: string): SVGSVGElement => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    const svgElement = doc.documentElement as unknown as SVGSVGElement;
  
    if (svgElement.tagName.toLowerCase() !== 'svg') {
      throw new Error('Provided string is not a valid SVG.');
    }
  
    return svgElement;
  };
  
  const getSvgAttributes = (svgData: string): { width: string, height: string, viewBox: string } => {
    //console.log('Raw SVG Data:', svgData); // Log the raw SVG data

    const parser = new DOMParser();
    const svgDocument = parser.parseFromString(svgData, 'image/svg+xml');
    const svgElement = svgDocument.documentElement;

    // Ensure the parsed element is an SVG element
    if (svgElement.tagName.toLowerCase() !== 'svg') {
        throw new Error('Parsed element is not an SVG.');
    }

    // Extract width, height, and viewBox
    let width = svgElement.getAttribute('width');
    let height = svgElement.getAttribute('height');
    const viewBox = svgElement.getAttribute('viewBox');

    console.log('Parsed attributes:', { width, height, viewBox }); // Log parsed attributes

    // Check for missing attributes and handle accordingly
    if (!width || !height || !viewBox) {
        console.warn('SVG is missing width, height, or viewBox attributes.');

        if (!viewBox) {
            console.error('SVG must have a viewBox attribute if width and height are not provided.');
            throw new Error('SVG must have a viewBox attribute if width and height are not provided.');
        }

        // Extract dimensions from the viewBox if width and height are missing
        const [x, y, viewBoxWidth, viewBoxHeight] = viewBox.split(' ').map(Number);
        if (!width) {
            console.warn(`Width is missing; using viewBox width: ${viewBoxWidth}`);
            width = viewBoxWidth.toString();
        }
        if (!height) {
            console.warn(`Height is missing; using viewBox height: ${viewBoxHeight}`);
            height = viewBoxHeight.toString();
        }
    }

    return { width: width!, height: height!, viewBox: viewBox! };
};
  

  export const generateSVGImageData = async (
    svgData: string,
    grow: number,
    backgroundColor: string
  ): Promise<string> => {

    const { width: scaledWidth, height: scaledHeight, viewBox } = await getSvgAttributes(svgData);
  
    if (scaledWidth === null || scaledHeight === null) throw new Error('Invalid SVG dimensions');
  
    const modifiedSVG = await svgModification(svgData, parseInt(scaledWidth), parseInt(scaledHeight), viewBox, grow, backgroundColor, backgroundColor);
  
    const serializer = new XMLSerializer();
    const modifiedSVGImg = serializer.serializeToString(modifiedSVG);
    
    const { width: modifiedWidth, height: modifiedHeight } = getSvgAttributes(modifiedSVGImg);
    modifiedSVG.setAttribute("viewBox", `0 0 ${modifiedWidth} ${modifiedHeight}`);
    
    console.log('Modified SVG:', modifiedSVG, 'scaled width', scaledWidth, scaledHeight);
    
    const modifiedSVGImgStirng = serializer.serializeToString(modifiedSVG);
  
    const svgElement = parseSvgString(modifiedSVGImgStirng);
  
    return createDataURL(svgElement, parseInt(modifiedWidth), parseInt(modifiedHeight), grow, backgroundColor);
  };

const svgModification = async (
    svg: string,
    width: number,
    height: number,
    viewBox: string,
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

            drawSVG(nonTransparentPixels, width, height, viewBox, grow, backgroundColor, strokeColor)
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
    viewBox: string,
    grow: number,
    backgroundColor: string,
    strokeColor: string
): Promise<SVGSVGElement> => {
    const svgNS = "http://www.w3.org/2000/svg";
    const svgRoot = document.createElementNS(svgNS, "svg");
    svgRoot.setAttribute("xmlns", svgNS);
    svgRoot.setAttribute("width", width.toString());
    svgRoot.setAttribute("height", height.toString()); 
    console.log('viewBox test', viewBox);
    svgRoot.setAttribute("viewBox", viewBox); 

    const fragment = document.createDocumentFragment();
    pixels.forEach(({ x, y }) => {
        const rect = createSVGRect(svgNS, x, y, backgroundColor, strokeColor, grow);
        fragment.appendChild(rect);
    });

    // console.log('svg drawing...');

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
