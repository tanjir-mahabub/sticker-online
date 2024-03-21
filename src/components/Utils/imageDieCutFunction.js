import ImageTracer from 'imagetracerjs';
import "../../lib/geom";

const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 600
const ctx = canvas.getContext("2d");
const img = new Image();
img.crossOrigin = "anonymous";

async function loadImage(src) {
    return new Promise((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

async function convertSVGtoPNG(dataURL) {
    await loadImage(dataURL);
    ctx.drawImage(img, 0, 0, img.width, img.height);
    const pngDataUrl = canvas.toDataURL('image/png');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return loadImage(pngDataUrl);
}

async function traceImage(src) {
    return new Promise((resolve, reject) => {
        ImageTracer.imageToSVG(src, (svgString) => {
            resolve('data:image/svg+xml;utf8,' + encodeURIComponent(svgString));
        }, { numberofcolors: 16, strokewidth: 3 });
    });
}

async function generatePathData(img) {
    ctx.drawImage(img, 0, 0, img.width, img.height);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const points = geom.contour((x, y) => {
        const i = (y * canvas.width + x) * 4;
        return imgData.data[i + 3] > 20;
    });
    return redraw(points);
}


function redraw(points) {
    const svg = d3.select("#VECTORSVGId");

    // Clear previous content
    svg.selectAll("*").remove();

    
    // svg.append("image")
    // .attr("xlink:href", img.src)
    // .attr("width", img.width)
    // .attr("height", img.height)
    // .attr("x", cw / 2 - img.width / 2)
    // .attr("y", ch / 2 - img.height / 2);
    

    function generateModifiedPoints(points, offset) {       
        return points.map(point => [point[0], point[1] + offset]);
    }

    
    if (points.length > 0) {
        
        const lineGenerator = d3.line()
            .x(d => d[0]) 
            .y(d => d[1]) 
            .curve(d3.curveBasis);
        
        const points1 = generateModifiedPoints(points, -10); // Offset by -10
        const points2 = generateModifiedPoints(points, 0); // Offset by +10        
   
        svg.append("path")
            .datum(points2)
            .attr("d", lineGenerator)
            .attr("fill", "none")
            .attr("stroke", "red") // First modified path in red
            .attr("stroke-width", 100) 
            .attr("stroke-linejoin", "bevel")
            .attr("stroke-linecap", "round")
            .attr("clip-path", "url(#myClip)");
            

        // Draw the second modified path
       svg.append("path")
            .datum(points2)
            .attr("d", lineGenerator)
            .attr("fill", "red")
            .attr("stroke", "red") // Second modified path in green
            .attr("stroke-width", 100) 
            .attr("stroke-linejoin", "bevel")
            .attr("stroke-linecap", "round")
            .attr('width', img.width)
            .attr('height', img.height)
            
    }
}



async function checkImageTypeAndConvert(src) {
    const fileType = src.split('.').pop().toLowerCase();
    let imgToProcess;

    if (fileType === 'svg') {
        imgToProcess = await loadImage(src);
    } else {
        const svgDataURL = await traceImage(src);
        imgToProcess = await convertSVGtoPNG(svgDataURL);
    }

    return generatePathData(imgToProcess);
}



export const imageDieCutFunction = async (url) => {
    try {
        const pathData = await checkImageTypeAndConvert(url);
        console.log('Generated Path Data:', pathData);
        return pathData;
    } catch (error) {
        console.error('Error processing image:', error);
    }
}

