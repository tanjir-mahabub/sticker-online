import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const fileName = url.searchParams.get('fileName') || '';

    if (!fileName) {
      return NextResponse.json({ error: 'No file specified' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'public/uploads', fileName);

    // Check if the file exists before attempting to delete
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    await fs.unlink(filePath);
    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
