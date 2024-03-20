import "../../lib/geom";

export const fontDieCutFunction = (inputText, fontFamilyPath, fontSize, svgWidth, svgHeight, fillColor, strokeColor, strokeWidth) => {
    // const fillColor = "red";
    // const strokeColor = "red";
    // const strokeWidth = 10;
    // const fontSize = 72;
    // const inputText = "Sample Text";

    // const svgWidth = 800; 
    // const svgHeight = 300;
    
    opentype.load(fontFamilyPath, (err, font) => {
        if (err) {
           console.error('Font could not be loaded: ', err);
        } else {                   
                        
            const textPath = font.getPath(inputText, 50, 150, fontSize);
            const pathData = textPath.toPathData();

            const bbox = textPath.getBoundingBox();
            console.log(bbox);
           // const svgWidth = bbox.x2 - bbox.x1 + 100; 
            //const svgHeight = bbox.y2 - bbox.y1 + 100;

            const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}">
                <path d="${pathData}" fill='${fillColor}' stroke='${strokeColor}' stroke-width="30" stroke-linejoin="bevel" stroke-linecap="round"/>
                </svg>`;

            drawImageOutline(svgString, svgWidth, svgHeight);
            console.log('opentype running', svgString);

        }        
    });

    
    const drawImageOutline = (svgString, svgWidth, svgHeight) => {
    
        
        const imgSrc = 'data:image/svg+xml;base64,' + btoa(svgString);
        
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const cw = canvas.width = svgWidth; 
            const ch = canvas.height = svgHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            const pngUrl = canvas.toDataURL('image/png');
            const imgData = ctx.getImageData(0, 0, cw, ch);
    
            const points = geom.contour(function(x, y) {
                let i = (y * cw + x) * 4;
                return imgData.data[i + 3] > 20;
            });
    
            redraw(img, ctx, cw, ch, points, pngUrl);
          
        };
        img.src = imgSrc;

        console.log('drawImageoutline');
    }

    const redraw = (img, ctx, cw, ch, points, pngUrl) => {
        ctx.clearRect(0, 0, cw, ch); 
    
        ctx.drawImage(img, cw / 2 - img.width / 2, ch / 2 - img.height / 2);
                    
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]); 
                        
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i][0], points[i][1]);
        }
        
        ctx.closePath(); 
                    
        ctx.clip();            
        
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = strokeColor;
        
        ctx.fillRect(0, 0, cw, ch); 

        
        const svg = d3.select('svg');
        svg.append('image')
            .attr('xlink:href', pngUrl)
            .attr('width', img.width)
            .attr('height', img.height)
            .attr('x', 0)
            .attr('y', 0);

            
        const lineGenerator = d3.line()
            .x(function(d) { return d[0]; })  // d[0] is the x-coordinate of a point
            .y(function(d) { return d[1]; })  // d[1] is the y-coordinate of a point
            .curve(d3.curveBasis); // Apply a smoothing algorithm

    
        // Draw the first modified path
        const pathData = lineGenerator(points);

        svg.append('path')
        .attr('d', pathData)
        .attr('fill', fillColor)
        .attr('stroke', strokeColor)
        .attr('stroke-width', strokeWidth)
            
        
        combineTextPaths();
        console.log('redrawing');
    }


    const combineTextPaths = () => {
        console.log('function called');
        const svg = document.getElementById('svg');
        const paths = svg.querySelectorAll('path');
        let combinedPathData = '';
    
        paths.forEach(path => {
            const dAttribute = path.getAttribute('d');
            combinedPathData += dAttribute + ' ';
        });
    
        // Create a new path element
        const combinedPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        combinedPath.setAttribute('d', combinedPathData.trim());
        combinedPath.setAttribute('fill', 'red');
        combinedPath.setAttribute('stroke', 'red');
        combinedPath.setAttribute('stroke-width', '10');
        
    console.log(combinedPath);
        // Optionally, clear existing paths and append the combined path
        svg.innerHTML = ''; // Caution: This removes all existing children of the SVG
        svg.appendChild(combinedPath);
    }
}