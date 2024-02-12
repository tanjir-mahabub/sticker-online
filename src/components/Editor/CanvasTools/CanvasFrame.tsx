import { handleExport } from "@/components/Utils/canvasOperation";
import Konva from "konva";
import { useEffect } from "react";

interface FrameProps {
    stage: Konva.Stage | null;
    centerX: number;
    centerY: number;
    frameWidth: number;
    frameHeight: number;
}

const CanvasFrame: React.FC<FrameProps> = ({ stage, centerX, centerY, frameWidth, frameHeight }) => {

    return (
        <div className="absolute top-0 left-0 flex justify-center h-full">
            <div
                className="absolute h-3 flex justify-center items-center border-x border-gray-800/20"
                style={{
                    top: `${centerY - frameHeight / 2 - (frameHeight * 0.07)}px`,
                    left: `${centerX - frameWidth / 2}px`,
                    width: `${frameWidth}px`,
                }}
            >
                <hr className="w-full border-t border-gray-800/20" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-so-deep-gray p-2 rounded">
                    <span className="text-black font-bold">6.5 cm</span>
                </div>
            </div>
            <div
                className="absolute h-3 flex justify-center items-center border-x border-gray-800/20 rotate-90"
                style={{
                    top: `${centerY - frameHeight / 2 + (frameHeight * 0.485)}px`,
                    left: `${centerX + frameWidth / 2 - (frameHeight * 0.42)}px`,
                    width: `${frameHeight}px`,
                }}
            >
                <hr className="w-full border-t border-gray-800/20" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-so-deep-gray p-2 rounded">
                    <span className="text-black font-bold">5 cm</span>
                </div>
            </div>
            <div className="absolute bottom-40 -right-40 w-full mx-auto h-3 flex justify-center items-center gap-5 z-50">
                <button onClick={() => stage && handleExport('png', stage)}>Export as PNG</button>
                <button onClick={() => stage && handleExport('jpg', stage)}>Export as JPG</button>
                <button onClick={() => stage && handleExport('svg', stage)}>Export as SVG</button>
                <button onClick={() => stage && handleExport('pdf', stage)}>Export as PDF</button>
            </div>
        </div>
    )
}

export default CanvasFrame;