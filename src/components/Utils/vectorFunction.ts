export const formattedTotalCost = (value: number) => {
    const formatedCost = new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' }).format(value);
    return formatedCost;
}

export const pixelsToCm = (pixels: number, dpi: number): number => {
    // Convert pixels to centimeters using the formula
    const cm = pixels / dpi * 2.54;
    return cm;
}


export const generateSVGImageData = (imageUrl: string, width: number, height: number, grow: number): string => {
    // Calculate the new width and height based on the reduction factor
    const newWidth: number = width * grow;
    const newHeight: number = height * grow;

    // Construct SVG XML string with the new dimensions
    const svgXML: string = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${newWidth}" height="${newHeight}">
            <image href="${imageUrl}" width="${newWidth}" height="${newHeight}" />
        </svg>
    `;

    return svgXML;
};


