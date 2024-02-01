import Image from 'next/image';
import React from 'react';
import { Stage, Layer, Rect } from 'react-konva';

interface CanvasProps {
    width?: number;
    height?: number;
    originalWidth?: number;
    originalHeight?: number;
}

const Canvas: React.FC<CanvasProps> = ({
    width = 0,
    height = 0,
    originalWidth = 6.5, // default value for originalWidth
    originalHeight = 5, // default value for originalHeight
}) => {
    const centerX = width / 2;
    const centerY = height / 2;

    // Calculate adjusted dimensions (30% smaller)
    const adjustedWidth = originalWidth * 0.7;
    const adjustedHeight = originalHeight * 0.7;

    // Calculate the scale factor to maintain aspect ratio
    const scaleFactor = Math.min(width / originalWidth, height / originalHeight);

    // Calculate the actual width and height of the Rect based on the scale factor
    const rectWidth = adjustedWidth * scaleFactor;
    const rectHeight = adjustedHeight * scaleFactor;

    const labelTop = centerY - rectHeight / 2 - (rectHeight * 0.07);
    const labelLeft = centerX - rectWidth / 2;

    const labelRightTop = centerY - rectHeight / 2 + (rectHeight * 0.485);
    const labelRight = centerX + rectWidth / 2 - (rectHeight * 0.42);

    return (
        <>
            <div className="absolute top-0 left-0 flex justify-center h-full">
                <div
                    className="absolute h-3 flex justify-center items-center border-x border-gray-800/20"
                    style={{ top: `${labelTop}px`, left: `${labelLeft}px`, width: `${rectWidth}px` }}
                >
                    <hr className="w-full border-t border-gray-800/20" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-so-deep-gray p-2 rounded">
                        <span className="text-black font-bold">6,5 cm</span>
                    </div>
                </div>

                <div
                    className="absolute h-3 flex justify-center items-center border-x border-gray-800/20 rotate-90"
                    style={{ top: `${labelRightTop}px`, left: `${labelRight}px`, width: `${rectHeight}px` }}
                >
                    <hr className="w-full border-t border-gray-800/20" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-so-deep-gray p-2 rounded">
                        <span className="text-black font-bold">5 cm</span>
                    </div>
                </div>

                <div className="absolute bottom-0 right-0 w-full mx-auto h-3 flex justify-center items-center">
                    <Image src="/editor/icon/revert.svg" alt="icon" width={25} height={25} />
                </div>
            </div>

            <Stage width={width} height={height}>
                <Layer>
                    {rectWidth && rectHeight && (
                        <Rect
                            width={rectWidth}
                            height={rectHeight}
                            x={centerX - rectWidth / 2}
                            y={centerY - rectHeight / 2}
                            fill="white"
                        />
                    )}
                </Layer>
            </Stage>
        </>
    );
};

export default Canvas;
