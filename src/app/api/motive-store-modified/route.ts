import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';
import { motiveStore } from "@/store/motiveStore";
import fs from 'fs';

export async function GET(req: NextRequest) {
    try {
        const iconsDir = path.join(process.cwd(), 'public', 'motiv-uploads');

        // Clear the icons directory before saving new files
        if (existsSync(iconsDir)) {
            // Delete existing files in the directory
            const files = fs.readdirSync(iconsDir);
            for (const file of files) {
                fs.unlinkSync(path.join(iconsDir, file));
            }
        } else {
            mkdirSync(iconsDir);
        }

        // Construct the base URL dynamically
        const baseUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}`;

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
                                throw new Error(`Failed to fetch icon: ${iconUrl}`);
                            }
                            const buffer = await response.arrayBuffer();
                            const imageBuffer = Buffer.from(buffer);

                            // Process the SVG without resizing
                            const modifiedImageBuffer = await sharp(imageBuffer)
                                .trim()
                                .toFormat('png')
                                .toBuffer(); 

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
