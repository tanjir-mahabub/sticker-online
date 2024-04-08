export const formattedTotalCost = (value: number) => {
    const formatedCost = new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' }).format(value);
    return formatedCost;
}

export const pixelsToCm = (pixels: number, dpi: number): number => {
    // Convert pixels to centimeters using the formula
    const cm = pixels / dpi * 2.54;
    return cm;
}



import geom from "../../lib/geom";


export const generateSVGImageData = (imageUrl: string, width: number, height: number, grow: number): string => {
    // Calculate the new width and height based on the reduction factor
    const newWidth: number = width * grow;
    const newHeight: number = height * grow;

    // Construct SVG filter to add outline and make the image full white
    const filterId: string = 'filter-outline-white'; // Unique ID for the filter
    const filterSVG: string = `
        <filter id="${filterId}" color-interpolation-filters="sRGB">
            <!-- Apply dilate morphology operation to create an outline -->
            <feMorphology in="SourceAlpha" result="outline" operator="dilate" radius="5" />
            <!-- Apply flood operation to color the outline -->
            <feFlood flood-color="black" flood-opacity="1" result="outline-color" />
            <!-- Combine original image with the colored outline -->
            <feComposite in="outline-color" in2="outline" operator="in" result="outline" />
            <!-- Apply blend mode to overlay outline on the original image -->
            <feBlend in="outline" in2="SourceGraphic" mode="normal" />
            <!-- Set the feColorMatrix values to make the image full white -->
            <feColorMatrix type="matrix" values="1 0 0 0 1
                                                   0 1 0 0 1
                                                   0 0 1 0 1
                                                   0 0 0 1 0"/>
        </filter>
    `;

     // Create a temporary canvas element and its 2D rendering context
     const tempCanvas = document.createElement('canvas');
     const tempCtx = tempCanvas.getContext('2d');
 
     // Set the dimensions of the temporary canvas
     tempCanvas.width = width;
     tempCanvas.height = height;
 
     // Create an SVG image element
     const svgImage = new Image();
     svgImage.src = `data:image/svg+xml;base64,${btoa(filterSVG)}`;     
 
     svgImage.onload = () => {
        // Draw the SVG image onto the temporary canvas
        tempCtx.drawImage(svgImage, 0, 0);
    
        // Get the modified image data from the temporary canvas
        const imgData = tempCtx.getImageData(0, 0, newWidth, newHeight);
    
        // Log imgData inside this callback
        console.log(imgData);
    };
    

    // Construct SVG XML string with the new dimensions and apply the filter to the image
    const svgXML: string = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${newWidth}" height="${newHeight}">
            <!-- Define the filter -->
            ${filterSVG}
            <!-- Apply the filter to the image -->
            <image href="${imageUrl}" width="${newWidth}" height="${newHeight}" filter="url(#${filterId})" />
        </svg>
    `;   

    // Return the SVG XML string
    return svgXML;
};




