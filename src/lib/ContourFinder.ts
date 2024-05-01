export class ContourFinder {

    pixelsWidth!: number;   // pixels width
    pixelsHeight!: number;  // pixels height
    pixels!: Uint8ClampedArray;  // pixels (single array of r,g,b,a values of image)
    allContours: Array<Array<{ x: number, y: number }>> = [];

    seen: Array<Array<boolean>> = [];

    constructor(canvas?: HTMLCanvasElement) {
        if (canvas) {
            this.init(canvas);
        }
    }

    init(canvas: HTMLCanvasElement): void {
        this.pixelsWidth = canvas.width;
        this.pixelsHeight = canvas.height;
        const imageCtx = canvas.getContext('2d');
        if (!imageCtx) return;
        const imageData = imageCtx.getImageData(0, 0, this.pixelsWidth, this.pixelsHeight);
        this.pixels = imageData.data;
    }

    getPosition(x: number, y: number): number {
        return (y * this.pixelsWidth + x) * 4;
    }

    getPixel(x: number, y: number): { r: number, g: number, b: number, a: number } {
        const position = this.getPosition(x, y);
        return {
            r: this.pixels[position],
            g: this.pixels[position + 1],
            b: this.pixels[position + 2],
            a: this.pixels[position + 3]
        };
    }

    setPixel(x: number, y: number, pixel: [number, number, number, number]): void {
        const position = this.getPosition(x, y);
        this.pixels[position] = pixel[0];
        this.pixels[position + 1] = pixel[1];
        this.pixels[position + 2] = pixel[2];
        this.pixels[position + 3] = pixel[3];
    }

    findContours(): void {
        const w = this.pixelsWidth;
        const h = this.pixelsHeight;

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const pix = this.getPixel(x, y);
                if (pix.r === 255) {
                    const points = this.followContour({ x: x, y: y });
                    if (points !== null) {
                        this.allContours.push(points);
                    }
                }
            }
        }
    }

    markAsSeen(point: { x: number, y: number }): void {
        this.seen[point.x] = this.seen[point.x] || [];
        this.seen[point.x][point.y] = true;
    }

    isSeen(point: { x: number, y: number }): boolean {
        return !!(this.seen[point.x] && this.seen[point.x][point.y]);
    }

    followContour(startPoint: { x: number, y: number }): Array<{ x: number, y: number }> | null {
        const points: Array<{ x: number, y: number }> = [];
        points.push(startPoint);
        this.markAsSeen(startPoint);

        const w = this.pixelsWidth;
        const h = this.pixelsHeight;

        const neighborhood = [
            { xd: -1, yd: 0 }, // west
            { xd: -1, yd: -1 }, // north-west
            { xd: 0, yd: -1 }, // north
            { xd: 1, yd: -1 }, // north-east
            { xd: 1, yd: 0 }, // east
            { xd: 1, yd: 1 }, // south-east
            { xd: 0, yd: 1 }, // south
            { xd: -1, yd: 1 }  // south-west
        ];

        let point = { ...startPoint };
        let tmpPoint = { x: point.x, y: point.y };
        let i = 0;

        while (i < neighborhood.length) {
            tmpPoint.x = point.x + neighborhood[i].xd;
            tmpPoint.y = point.y + neighborhood[i].yd;

            if (!this.isSeen(tmpPoint) &&
                tmpPoint.x < w && tmpPoint.y < h &&
                !(tmpPoint.x === point.x && tmpPoint.y === point.y) &&
                this.getPixel(tmpPoint.x, tmpPoint.y).r === 255) {
                points.push(tmpPoint);
                this.markAsSeen(tmpPoint);
                point = { ...tmpPoint };
                i = 0;
            } else {
                tmpPoint = { ...point };
                i++;
            }
        }

        if (points.length > 5) {
            return points;
        }
        return null;
    }

    getPoints(points: Array<{ x: number, y: number }>): string {
        return points.map(point => `${point.x},${point.y}`).join(' > ');
    }
}
