export const formattedTotalCost = (value: number) => {
    const formatedCost = new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' }).format(value);
    return formatedCost;
}

export const pixelsToCm = (pixels: number, dpi: number): number => {
    // Convert pixels to centimeters using the formula
    const cm = pixels / dpi * 2.54;
    return cm;
}


// export const generateSVGImageData = (imageUrl: string, width: number, height: number, grow: number): string => {
//     // Calculate the new width and height based on the reduction factor
//     const newWidth: number = width * grow;
//     const newHeight: number = height * grow;

//     // Construct SVG filter to add outline and make the image full white
//     const filterId: string = 'filter-outline-white'; // Unique ID for the filter
//     const filterSVG: string = `
//         <filter id="${filterId}" color-interpolation-filters="sRGB">
//             <!-- Apply dilate morphology operation to create an outline -->
//             <feMorphology in="SourceAlpha" result="outline" operator="dilate" radius="5" />
//             <!-- Apply flood operation to color the outline -->
//             <feFlood flood-color="black" flood-opacity="1" result="outline-color" />
//             <!-- Combine original image with the colored outline -->
//             <feComposite in="outline-color" in2="outline" operator="in" result="outline" />
//             <!-- Apply blend mode to overlay outline on the original image -->
//             <feBlend in="outline" in2="SourceGraphic" mode="normal" />
//             <!-- Set the feColorMatrix values to make the image full white -->
//             <feColorMatrix type="matrix" values="1 0 0 0 1
//                                                    0 1 0 0 1
//                                                    0 0 1 0 1
//                                                    0 0 0 1 0"/>
//         </filter>
//     `;

//      // Create a temporary canvas element and its 2D rendering context
//      const tempCanvas = document.createElement('canvas');
//      const tempCtx = tempCanvas.getContext('2d');
 
//      // Set the dimensions of the temporary canvas
//      tempCanvas.width = width;
//      tempCanvas.height = height;
 
//      // Create an SVG image element
//      const svgImage = new Image();
//      svgImage.src = `data:image/svg+xml;base64,${btoa(filterSVG)}`;     
 
//      svgImage.onload = () => {
//         // Draw the SVG image onto the temporary canvas
//        if(tempCtx) {
//         tempCtx.drawImage(svgImage, 0, 0);
    
//         // Get the modified image data from the temporary canvas
//         const imgData = tempCtx.getImageData(0, 0, newWidth, newHeight);
    
//         // Log imgData inside this callback
//         console.log('imagedata', imgData);
//        }
//     };
    

//     // Construct SVG XML string with the new dimensions and apply the filter to the image
//     const svgXML: string = `
//         <svg xmlns="http://www.w3.org/2000/svg" width="${newWidth}" height="${newHeight}">
//             <!-- Define the filter -->
//             ${filterSVG}
//             <!-- Apply the filter to the image -->
//             <image href="${svgImage.src}" width="${newWidth}" height="${newHeight}" filter="url(#${filterId})" />
//         </svg>
//     `;   

//     // Return the SVG XML string
//     return svgXML;
// };





import geom from "../../lib/geom";
import * as d3 from "d3";


export const generateSVGImageData = async (svgData: string, width: number, height: number, grow: number, backgroundColor: string): Promise<string> => {

    const newWidth: number = width;
    const newHeight: number = height;

    const filterIdWhite: string = 'filter-white';
    const filterIdOutline: string = 'filter-outline';

    // Filter SVG to convert the image to full white
    const filterSVGWhite: string = `
        <filter id="${filterIdWhite}" color-interpolation-filters="sRGB">
            <!-- Set the feColorMatrix values to make the image full white -->
            <feColorMatrix type="matrix" values="1 0 0 0 1
                                                  0 1 0 0 1
                                                  0 0 1 0 1
                                                  0 0 0 1 0"/>
        </filter>
    `;

    // Filter SVG to create a black outline
    const filterSVGOutline: string = `
        <filter id="${filterIdOutline}" color-interpolation-filters="sRGB">
            <!-- Apply dilate morphology operation to create an outline -->
            <feMorphology in="SourceAlpha" result="outline" operator="dilate" radius="7" />
            <!-- Apply flood operation to color the outline black -->
            <feFlood flood-color="white" result="outline-color" />
            <!-- Combine original image with the black outline -->
            <feComposite in="outline-color" in2="outline" operator="in" result="outline" />
            <!-- Merge the outline with the original image -->
            <feMerge>
                <feMergeNode in="outline" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
    `;

    const updatedSVGData = svgData.replace('</svg>', `${filterSVGWhite}${filterSVGOutline}</svg>`);

    
    const parser = new DOMParser();
    const doc = parser.parseFromString(updatedSVGData, 'image/svg+xml');

    const imageElement = doc.querySelector('image');

    if (imageElement) {
        imageElement.setAttribute('filter', `url(#${filterIdWhite})`);
    }

    const serializer = new XMLSerializer();
    const updatedSvgString = serializer.serializeToString(doc);

    const modifiedSVG = await svgModification(updatedSvgString, newWidth, newHeight, grow, backgroundColor, backgroundColor);

    console.log('modifiedSVG', modifiedSVG);

    
        const svgString = serializer.serializeToString(modifiedSVG);

        // Create a Blob from the serialized SVG string
        const blob = new Blob([svgString], { type: 'image/svg+xml' });

        // Create a URL for the Blob
        const url = window.URL.createObjectURL(blob);

        return url;
};


const svgModification = async (svg: string, newWidth: number, newHeight: number, grow: number, backgroundColor: string, fillColor: string): Promise<any> => {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx = canvas.getContext('2d');

        const img = new Image();
        img.src = `data:image/svg+xml;base64,${btoa(svg)}`;

        img.onload = () => {
            if(!ctx) return;
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
            const imageData = ctx.getImageData(0, 0, newWidth, newHeight);
            const grid = (x: number, y: number) => {
                const index = (y * imageData.width + x) * 4;
                return imageData.data[index] > 0;  // Assuming black pixel is the outline
            };

            const contours = geom.contour(grid);
            const modifiedContours = redraw(contours, newWidth, newHeight, grow, backgroundColor, fillColor);

            resolve(modifiedContours);
        };
    });
};

const generateModifiedPoints = (points:any, offset: number) => {       
    return points.map((point: any) => [point[0], point[1] + offset]);
}

import { Selection } from 'd3-selection';
import { line } from 'd3-shape';

const redraw = (points: any[], width: number, height: number, grow: number, backgroundColor: string, fillColor: string): SVGSVGElement | null => {
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
