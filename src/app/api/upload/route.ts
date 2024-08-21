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

  const uploadsDir = path.join(process.cwd(), 'public/uploads');
  await fs.mkdir(uploadsDir, { recursive: true });

  const uploadPromises = files.map(async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const trimmedBuffer = await sharp(buffer)
      .trim()      
      .toFormat('webp')
      .toBuffer();

    const fileName = `${uuidv4()}.webp`;
    const outputPath = path.join(uploadsDir, fileName);

    try {
      //@ts-ignore
      await fs.writeFile(outputPath, trimmedBuffer);
      return { path: `/uploads/${fileName}` };
    } catch (error) {
      console.error('Error saving file:', error);
      throw new Error('Failed to save file');
    }
  });

  try {
    const results = await Promise.all(uploadPromises);
    return NextResponse.json({ message: 'Images uploaded and processed successfully', files: results });
  } catch (error) {
    console.error('Error processing images:', error);
    return NextResponse.json({ error: 'Failed to process images' }, { status: 500 });
  }
}