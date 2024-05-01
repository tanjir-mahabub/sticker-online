import "../../lib/geom";


export const fontDieCutFunction = async (inputText, fontFamilyPath, fontSize, svgWidth, svgHeight, fillColor, strokeColor) => {

    const drawImageOutline = async (svgString, svgWidth, svgHeight) => {
        const imgSrc = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));

        const img = await new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = reject;
            image.src = imgSrc;
        });

        const canvas = document.createElement('canvas');
        const cw = canvas.width = svgWidth;
        const ch = canvas.height = svgHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const pngUrl = canvas.toDataURL('image/png');
        const imgData = ctx.getImageData(0, 0, cw, ch);

        const points = geom.contour(function (x, y) {
            let i = (y * cw + x) * 4;
            return imgData.data[i + 3] > 20;
        });

        const pathData = redraw(img, ctx, svgWidth, svgHeight, points, pngUrl);

        return pathData;
    };

    const redraw = async (img, ctx, cw, ch, points, pngUrl) => {
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

        const lineGenerator = d3.line()
            .x(function (d) { return d[0]; })
            .y(function (d) { return d[1]; })
            .curve(d3.curveBasis);

        const pathData = lineGenerator(points);

        return pathData
    }

    try {
        const font = await new Promise((resolve, reject) => {
            opentype.load(fontFamilyPath, (err, loadedFont) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(loadedFont);
                }
            });
        });

        const textPath = font.getPath(inputText, 50, 150, fontSize);
        const pathData = textPath.toPathData();

        const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}">
            <path d="${pathData}" fill='${fillColor}' stroke='${strokeColor}' stroke-width="40" stroke-linejoin="bevel" stroke-linecap="round"/>
            </svg>`;

        const newPathData = await drawImageOutline(svgString, svgWidth, svgHeight);

        return newPathData;

    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
};
