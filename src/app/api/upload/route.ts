import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: Request) {
  const data = await req.formData();
  const files = data.getAll('file') as Blob[];

  if (files.length === 0) {
    return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
  }

  const uploadPromises = files.map(async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Trim transparent areas and resize the image
    const trimmedBuffer = await sharp(buffer)
      .trim()
      .resize({ width: 1920, height: 1080, fit: 'inside', withoutEnlargement: true })
      .toFormat('webp')
      .toBuffer();

    const outputPath = path.join(process.cwd(), 'public/uploads', `${uuidv4()}.webp`);
    //@ts-ignore
    await fs.writeFile(outputPath, trimmedBuffer);

    return { path: `/uploads/${path.basename(outputPath)}` };
  });

  try {
    const results = await Promise.all(uploadPromises);
    return NextResponse.json({ message: 'Images uploaded and processed successfully', files: results });
  } catch (error) {
    console.error('Error processing images:', error);
    return NextResponse.json({ error: 'Failed to process images' }, { status: 500 });
  }
}
