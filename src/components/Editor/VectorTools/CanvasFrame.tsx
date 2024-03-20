import { useAppSelector } from "@/redux/store";

interface FrameProps {

}

const VectorFrame: React.FC<FrameProps> = ({ }) => {

    const CanvasProperties = useAppSelector(state => state.canvas);
    const { centerX, centerY, frameWidth, frameHeight, bredd, hojd } = CanvasProperties;

    return (
        <div className="relative flex justify-center h-full transition">
            <div
                className="absolute h-3 flex justify-center items-center border-x border-gray-800/20 -my-[35px] transition-all duration-300"
                style={{
                    top: `${centerY - frameHeight / 2}px`,
                    left: `${centerX - frameWidth / 2}px`,
                    width: `${frameWidth}px`,
                }}
            >
                <hr className="w-full border-t border-gray-800/20" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-so-deep-gray p-2 rounded">
                    <span className="text-black font-bold">{bredd.toFixed(1).replace('.', ',')} cm</span>
                </div>
            </div>
            {/* <div
                className="absolute h-3 flex justify-center items-center border-x border-gray-800/20 rotate-90"
                style={{
                    top: `${centerY}px`,
                    left: `${centerX + frameWidth / 2}px`,
                    width: `${frameHeight}px`
                }}
            >
                <hr className="w-full border-t border-gray-800/20" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-so-deep-gray p-2 rounded">
                    <span className="text-black font-bold">{hojd.toFixed(1).replace('.', ',')} cm</span>
                </div>
            </div> */}

            <div className="absolute flex justify-center items-center border-gray-800/20 border-r mx-[30px] transition-all duration-300"
                style={{
                    top: `${centerY - frameHeight / 2}px`,
                    left: `${centerX - frameWidth / 2}px`,
                    width: `${frameWidth}px`,
                    height: `${frameHeight}px`,
                }}>

                <div className="absolute -right-1.5 w-3 top-0 border-y border-gray-800/20"
                    style={{
                        height: `${frameHeight}px`,
                    }}></div>
                <div className="absolute bg-so-deep-gray py-6 rounded flex justify-end items-end w-fit -right-[25px]">
                    <span className="text-black font-bold rotate-90">{hojd.toFixed(1).replace('.', ',')} cm</span>
                </div>
            </div>
            {/* <div className="absolute bottom-40 -right-40 w-full mx-auto h-3 flex justify-center items-center gap-5 z-50">
                <button onClick={() => stage && handleExport('png', stage)}>Export as PNG</button>
                <button onClick={() => stage && handleExport('jpg', stage)}>Export as JPG</button>
                <button onClick={() => stage && handleExport('svg', stage)}>Export as SVG</button>
                <button onClick={() => stage && handleExport('pdf', stage)}>Export as PDF</button>
            </div> */}


        </div>
    )
}

export default VectorFrame;