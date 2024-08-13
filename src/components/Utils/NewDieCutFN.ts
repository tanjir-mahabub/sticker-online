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
    //console.log('Raw SVG Data:', svgData);

    const parser = new DOMParser();
    const svgDocument = parser.parseFromString(svgData, 'image/svg+xml');
    const svgElement = svgDocument.documentElement;

    if (svgElement.tagName.toLowerCase() !== 'svg') {
        throw new Error('Parsed element is not an SVG.');
    }

    let width = svgElement.getAttribute('width');
    let height = svgElement.getAttribute('height');
    const viewBox = svgElement.getAttribute('viewBox');

    //console.log('Parsed attributes:', { width, height, viewBox });

    if (!width || !height || !viewBox) {
        //console.warn('SVG is missing width, height, or viewBox attributes.');

        if (!viewBox) {
            //console.error('SVG must have a viewBox attribute if width and height are not provided.');
            throw new Error('SVG must have a viewBox attribute if width and height are not provided.');
        }

        const [x, y, viewBoxWidth, viewBoxHeight] = viewBox.split(' ').map(Number);
        if (!width) {
            //console.warn(`Width is missing; using viewBox width: ${viewBoxWidth}`);
            width = viewBoxWidth.toString();
        }
        if (!height) {
            //console.warn(`Height is missing; using viewBox height: ${viewBoxHeight}`);
            height = viewBoxHeight.toString();
        }
    }

    return { width: width!, height: height!, viewBox: viewBox! };
};
  
  const scaleSVG = (svgData: string, scale: number): string => {
    const parser = new DOMParser();
    const svgDocument = parser.parseFromString(svgData, 'image/svg+xml');
    const svgElement = svgDocument.documentElement;
  
    // Extract original viewBox
    const { viewBox } = getSvgAttributes(svgData);
  
    // Set new viewBox based on scale
    const [x, y, width, height] = viewBox.split(' ').map(parseFloat);
    const newWidth = width / scale;
    const newHeight = height / scale;
    const newViewBox = `${x} ${y} ${newWidth} ${newHeight}`;
    svgElement.setAttribute('viewBox', newViewBox);
  
    // Return the scaled SVG as a string
    const serializer = new XMLSerializer();
    return serializer.serializeToString(svgElement);
  };
  
  const restoreSVG = (
    scaledSvgData: string,
    originalSvgData: string
  ): string => {
    // Parse the scaled SVG data and get the document element
    const parser = new DOMParser();
    const svgDocument = parser.parseFromString(scaledSvgData, 'image/svg+xml');
    const svgElement = svgDocument.documentElement;
  
    // Extract original width, height, and viewBox
    const { width, height, viewBox } = getSvgAttributes(originalSvgData);
  
    // Restore original width, height, and viewBox
    svgElement.setAttribute('width', width);
    svgElement.setAttribute('height', height);
    svgElement.setAttribute('viewBox', viewBox);
  
    // Return the restored SVG as a string
    const serializer = new XMLSerializer();
    return serializer.serializeToString(svgElement);
  };
  
  
  const adjustViewBox = (svgElement: SVGSVGElement): void => {
    const viewBox = svgElement.getAttribute('viewBox');
    if (!viewBox) {
        throw new Error('SVG must have a viewBox attribute.');
    }

    const [x, y, width, height] = viewBox.split(' ').map(Number);

    // Calculate the necessary translation
    const translateX = -x;
    const translateY = -y;

    // Set the viewBox to start at 0 0
    svgElement.setAttribute('viewBox', `0 30 ${width} ${height}`);

    // Apply the translation to all child elements
    const children = Array.from(svgElement.children);
    children.forEach(child => {
        const transform = child.getAttribute('transform');
        const translateTransform = `translate(${translateX},${translateY})`;
        const newTransform = transform ? `${translateTransform} ${transform}` : translateTransform;
        child.setAttribute('transform', newTransform);
    });
};


// Example usage within your generateSVGImageData function or wherever you handle SVGs
export const generateSVGImageData = async (
    svgData: string,
    grow: number,
    backgroundColor: string
): Promise<string> => {
    const scale = 0.3; // Example scale factor

    console.log('Original SVG:', svgData);
    const svgElement = parseSvgString(svgData);

    // Adjust the SVG viewBox and apply necessary transformations
    adjustViewBox(svgElement);

    // Serialize the adjusted SVG back to string
    const serializer = new XMLSerializer();
    const adjustedSvgData = serializer.serializeToString(svgElement);

    //console.log('Adjusted SVG:', adjustedSvgData);

    // Continue with your existing scaling and modification logic...
    const scaledSvgData = scaleSVG(adjustedSvgData, scale);
    const { width: scaledWidth, height: scaledHeight, viewBox } = getSvgAttributes(adjustedSvgData);

    if (!scaledWidth || !scaledHeight) throw new Error('Invalid SVG dimensions');
    //console.log('Scaled SVG:', scaledSvgData);

    const modifiedSVG = await svgModification(
        scaledSvgData,
        parseInt(scaledWidth),
        parseInt(scaledHeight),
        viewBox,
        grow,
        backgroundColor,
        backgroundColor
    );

    const modifiedSVGImg = serializer.serializeToString(modifiedSVG);
    //console.log('Modified SVG:', modifiedSVG);

    const restoredSvgData = restoreSVG(scaledSvgData, modifiedSVGImg);

    const { width: restoredWidth, height: restoredHeight } = getSvgAttributes(svgData);

    if (!restoredWidth || !restoredHeight) throw new Error('Invalid SVG dimensions');
    //console.log('Restored SVG:', restoredSvgData);

    return createDataURL(parseSvgString(restoredSvgData), parseInt(restoredWidth), parseInt(restoredHeight), grow, backgroundColor);
};


const svgModification = async (
    svg: string,
    width: number,
    height: number,
    viewbox: string,
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

    //console.log('svg modifying...');

    return new Promise<SVGSVGElement>((resolve, reject) => {
        img.onload = () => {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);

            const imageData = ctx.getImageData(0, 0, width, height);
            const pixels = imageData.data;
            const nonTransparentPixels = extractNonTransparentPixels(pixels, width);
            // //console.log(imageData.data, nonTransparentPixels);

            drawSVG(nonTransparentPixels, width, height, viewbox, grow, backgroundColor, strokeColor)
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

    //console.log('Pixel extracting...');

    for (let i = 0; i < pixels.length; i += 4) {
        const alpha = pixels[i + 3];
        if (alpha > 0) {
            const x = (i / 4) % width;
            const y = Math.floor((i / 4) / width);
            // //console.log(`Non-transparent pixel found at (${x}, ${y}) with alpha: ${alpha}`);
            nonTransparentPixels.push({
                x,
                y,
                r: pixels[i],
                g: pixels[i + 1],
                b: pixels[i + 2],
                a: alpha
            });
        }
    }
    
    return nonTransparentPixels;
};


const drawSVG = async (
  pixels: { x: number; y: number; r: number; g: number; b: number; a: number }[],
  width: number,
  height: number,
  viewbox: string,
  grow: number,
  backgroundColor: string,
  strokeColor: string
): Promise<SVGSVGElement> => {
  const svgNS = "http://www.w3.org/2000/svg";
  const [viewBoxX, viewBoxY, viewBoxWidth, viewBoxHeight] = viewbox.split(' ').map(Number);

  // Increase the viewBox size to accommodate the grow value
  const expandedWidth = viewBoxWidth + grow * 2;
  const expandedHeight = viewBoxHeight + grow * 2;

  // Recalculate the viewBox to keep the content centered
  const newViewBoxX = viewBoxX - grow;
  const newViewBoxY = viewBoxY - grow;

  const svgRoot = document.createElementNS(svgNS, "svg");
  svgRoot.setAttribute("xmlns", svgNS);
  svgRoot.setAttribute("width", expandedWidth.toString());
  svgRoot.setAttribute("height", expandedHeight.toString());
  svgRoot.setAttribute("viewBox", `${newViewBoxX} ${newViewBoxY} ${expandedWidth} ${expandedHeight}`);

  const fragment = document.createDocumentFragment();
  pixels.forEach(point => {
      const { x, y } = point;
      const circle = document.createElementNS(svgNS, "circle");
      circle.setAttribute("cx", x.toString());
      circle.setAttribute("cy", y.toString());
      circle.setAttribute("fill", backgroundColor);
      circle.setAttribute("stroke", strokeColor);
      circle.setAttribute("stroke-width", grow.toString());
      circle.setAttribute("stroke-linejoin", "round");
      circle.setAttribute("stroke-linecap", "round");
      circle.setAttribute("vector-effect", "non-scaling-stroke");
      circle.setAttribute("r", "5");
        
      svgRoot.appendChild(circle);
  });

  svgRoot.appendChild(fragment);
  return svgRoot;
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
    const modifiedSVG = await reDrawSVGImg(svgString, width, height, grow, backgroundColor, "rgba(0,0,0,0.3)");
    if (!modifiedSVG) throw new Error('Failed to redraw SVG image');

    const modifiedSVGString = new XMLSerializer().serializeToString(modifiedSVG);

    const modifiedSVG2 = await reDrawSVGImg(modifiedSVGString, width, height, 1, backgroundColor, "rgba(0,0,0,0.3)");
    if (!modifiedSVG2) throw new Error('Failed to redraw SVG image');

    const modifiedSVGString2 = new XMLSerializer().serializeToString(modifiedSVG2);
    
    //console.log('Url creating...');

    return window.URL.createObjectURL(new Blob([modifiedSVGString2], { type: 'image/svg+xml' }));
};

const generateModifiedPoints = (points: any[], offset: number): any[] => points.map(([x, y]) => [x, y + offset]);

const reDrawSVGImg = async (
    svg: string,
    width: number,
    height: number,
    grow: number,
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

    //console.log('SVG Image redrawing...');

    return new Promise<SVGSVGElement | null>((resolve, reject) => {
        img.onload = async () => {
            try {
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);

                const imageData = ctx.getImageData(0, 0, width, height);
                const grid = (x: number, y: number) => imageData.data[(y * imageData.width + x) * 4 + 3] > 0;

                const contours = geom.contour(grid);
                const modifiedContours = await drawSVGLine(contours, width, height, grow, backgroundColor, fillColor);

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
    
    //console.log('SVG line creating...');

    return svgNode;
};

export const extractDAttributeValue = async (svgUrl: string): Promise<string | null> => {
    try {
        const svgString = await (await fetch(svgUrl)).text();
        const formattedSvgString = svgString.startsWith("<svg>") ? svgString : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800"> ${svgString}</svg>`;
        const pathElement = new DOMParser().parseFromString(formattedSvgString, "image/svg+xml").querySelector('path');
        return pathElement ? pathElement.getAttribute('d') : null;
    } catch (error) {
        //console.error('Error parsing SVG:', error);
        return null;
    }
};
