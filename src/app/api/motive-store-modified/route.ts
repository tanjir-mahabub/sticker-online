import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { writeFileSync, mkdirSync, existsSync, readdirSync, unlinkSync } from 'fs';
import path from 'path';
import { motiveStore } from "@/store/motiveStore";

// Utility function to clear the directory
const clearDirectory = (dirPath: string) => {
    if (existsSync(dirPath)) {
        const files = readdirSync(dirPath);
        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            unlinkSync(filePath); // Delete the file
        });
    }
};

// Utility function to get the base URL dynamically
const getBaseUrl = (req: NextRequest) => {
    // Construct base URL from the request
    return `${req.nextUrl.protocol}//${req.nextUrl.host}/`;
};

export async function GET(req: NextRequest) {
    try {
        const iconsDir = path.join(process.cwd(), 'public', 'motiv-uploads');

        // Create the icons directory if it doesn't exist
        if (!existsSync(iconsDir)) {
            mkdirSync(iconsDir);
        } else {
            // Clear the directory before saving new images
            clearDirectory(iconsDir);
        }

        const baseUrl = getBaseUrl(req);

        const modifiedMotiveStore = await Promise.all(
            motiveStore.map(async (motive) => {
                const newIcons = await Promise.all(
                    motive.icons.map(async (iconUrl) => {
                        // Ensure that the iconUrl is an absolute URL
                        const absoluteUrl = new URL(iconUrl, baseUrl).href;
                        const iconName = path.basename(iconUrl, path.extname(iconUrl)) + '.png'; // Keep SVG format
                        const iconPath = path.join(iconsDir, iconName);

                        try {
                            // Fetch the icon
                            const response = await fetch(absoluteUrl);
                            if (!response.ok) {
                                throw new Error(`Failed to fetch icon: ${absoluteUrl}`);
                            }
                            const buffer = await response.arrayBuffer();
                            const imageBuffer = Buffer.from(buffer);

                            // Process the SVG without resizing
                            const modifiedImageBuffer = await sharp(imageBuffer)
                                .trim()
                                .toFormat('png')
                                .toBuffer(); // Keep SVG format and original size

                            // Save the processed icon to the icons directory
                            //@ts-ignore
                            writeFileSync(iconPath, modifiedImageBuffer);

                            return `/motiv-uploads/${iconName}`;
                        } catch (fetchError) {
                            console.error(`Error fetching or processing icon ${iconUrl}:`, fetchError);
                            return iconUrl; // Return original URL in case of error
                        }
                    })
                );

                return {
                    ...motive,
                    icons: newIcons,
                };
            })
        );

        return NextResponse.json({ newMotiveStore: modifiedMotiveStore });
    } catch (error) {
        console.error('Error processing icons:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
