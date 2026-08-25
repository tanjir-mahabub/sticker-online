import { cmToPixel } from "@/components/Utils/function";
import { setCanvasProperties } from "@/redux/features/canvasSlice";
import { useAppSelector } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fabric } from "fabric";

interface CustomFabricCanvas extends fabric.Canvas {
    wrapperEl?: HTMLElement | null; // Add wrapperEl property
}

interface FrameProps {
    fabricCanvas: CustomFabricCanvas | null;
}

const CanvasFrame: React.FC<FrameProps> = ({ fabricCanvas }) => {
    
    const CanvasProperties = useAppSelector(state => state.canvas);
    const { canvasWidth, canvasHeight, canvasInitialZoom, frameWidth, frameHeight, centerX, centerY, bredd, hojd, grow, backgroundColor } = CanvasProperties;
    const StickerNavID = useAppSelector(state => state.sticker.id);

    const dispatch = useDispatch();

    useEffect(() => {
        if (frameWidth && frameHeight && fabricCanvas) {
            // Get the current zoom level of the canvas
            const zoom = fabricCanvas.getZoom() || 1;
            
            dispatch(setCanvasProperties({
                canvasInitialZoom: zoom
            }))    

        }
    }, [fabricCanvas, frameWidth, frameHeight, dispatch]);

    useEffect(() => {
        if(fabricCanvas) {
            const objectExists = fabricCanvas?.getObjects().length > 0;
            if(!objectExists) {
                const newBredd = cmToPixel(10);
                const newHojd = cmToPixel(10);
                
                dispatch(setCanvasProperties({
                bredd: 10,
                hojd: 10,
                frameWidth: newBredd,
                frameHeight: newHojd,
                centerX: null,
                centerY: null,
                grow: grow,
                canvasInitialZoom: 1
                }));
            }
        }
    }, [fabricCanvas, grow, dispatch])
      

    const canvasZoom = fabricCanvas?.getZoom() || canvasInitialZoom || 1;
    const viewport = fabricCanvas?.viewportTransform;
    const hasContentCenter = Number.isFinite(centerX) && Number.isFinite(centerY);
    const screenCenter = hasContentCenter && viewport
        ? fabric.util.transformPoint(new fabric.Point(centerX!, centerY!), viewport)
        : new fabric.Point(canvasWidth / 2, canvasHeight / 2 - 30);
    const frameLeft = screenCenter.x - frameWidth * canvasZoom / 2;
    const frameTop = screenCenter.y - frameHeight * canvasZoom / 2;

    return (
        <div className="relative flex justify-center h-full transition">
            <div
                aria-hidden="true"
                className={`${StickerNavID === 1 ? 'hidden' : 'block'} absolute border border-gray-300 transition-all duration-300`}
                style={{
                    top: `${frameTop}px`,
                    left: `${frameLeft}px`,
                    width: `${frameWidth * canvasZoom}px`,
                    height: `${frameHeight * canvasZoom}px`,
                    background: backgroundColor,
                    borderRadius: StickerNavID === 3 ? '50%' : StickerNavID === 4 ? '10px' : '0px',
                }}
            />
            <div
                className="absolute h-3 flex justify-center items-center border-x border-gray-800/20 -my-[35px] transition-all duration-300"
                style={{
                    top: `${frameTop}px`,
                    left: `${frameLeft}px`,
                    width: `${frameWidth * canvasZoom}px`,
                }}
            >
                <hr className="w-full border-t border-gray-800/20" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-so-deep-gray p-2 rounded">
                    <span className="text-black font-bold">{bredd.toFixed(1).replace('.', ',')} cm</span>
                </div>
            </div>

            <div className="absolute flex justify-center items-center border-gray-800/20 border-r mx-[30px] transition-all duration-300"
                style={{
                    top: `${frameTop}px`,
                    left: `${frameLeft}px`,
                    width: `${frameWidth * canvasZoom}px`,
                    height: `${frameHeight * canvasZoom}px`,
                }}>

                <div className="absolute -right-1.5 w-3 top-0 border-y border-gray-800/20"
                    style={{
                        height: `${frameHeight * canvasZoom}px`,
                    }}></div>
                <div className="absolute bg-so-deep-gray py-6 rounded flex justify-end items-end w-fit -right-[25px]">
                    <span className="text-black font-bold rotate-90">{hojd.toFixed(1).replace('.', ',')} cm</span>
                </div>
            </div>
        </div>
    );
}

export default CanvasFrame;
