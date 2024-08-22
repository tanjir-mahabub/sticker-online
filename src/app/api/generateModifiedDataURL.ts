"use server";

import sharp from "sharp";

export async function generateModifiedDataURL(base64Image: string): Promise<string> {
    const imageBuffer = Buffer.from(base64Image, 'base64');

    const data = await sharp(imageBuffer)
        .trim()
        .toBuffer();

    return `data:image/jpeg;base64,${data.toString('base64')}`;
}
