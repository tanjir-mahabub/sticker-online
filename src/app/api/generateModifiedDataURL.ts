export async function generateModifiedDataURL(base64Image: string): Promise<string> {
    const source = `data:image/png;base64,${base64Image}`;
    if (typeof window === "undefined") return source;

    return new Promise((resolve) => {
        const image = new window.Image();
        image.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            const context = canvas.getContext("2d", { willReadFrequently: true });
            if (!context) return resolve(source);

            context.drawImage(image, 0, 0);
            const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
            let left = canvas.width;
            let top = canvas.height;
            let right = -1;
            let bottom = -1;

            for (let y = 0; y < canvas.height; y += 1) {
                for (let x = 0; x < canvas.width; x += 1) {
                    if (pixels.data[(y * canvas.width + x) * 4 + 3] > 8) {
                        left = Math.min(left, x);
                        right = Math.max(right, x);
                        top = Math.min(top, y);
                        bottom = Math.max(bottom, y);
                    }
                }
            }

            if (right < left || bottom < top) return resolve(source);
            const width = right - left + 1;
            const height = bottom - top + 1;
            const trimmed = document.createElement("canvas");
            trimmed.width = width;
            trimmed.height = height;
            trimmed.getContext("2d")?.drawImage(canvas, left, top, width, height, 0, 0, width, height);
            resolve(trimmed.toDataURL("image/png"));
        };
        image.onerror = () => resolve(source);
        image.src = source;
    });
}
