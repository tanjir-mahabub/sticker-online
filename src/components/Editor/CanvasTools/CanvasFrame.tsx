import { setCanvasProperties } from "@/redux/features/canvasSlice";
import { useAppSelector } from "@/redux/store";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

interface CustomFabricCanvas extends fabric.Canvas {
    wrapperEl?: HTMLElement | null; // Add wrapperEl property
}

interface FrameProps {
    fabricCanvas: CustomFabricCanvas | null;
}

const CanvasFrame: React.FC<FrameProps> = ({ fabricCanvas }) => {
    
    const CanvasProperties = useAppSelector(state => state.canvas);
    const { canvasWidth, canvasHeight, canvasInitialZoom, frameWidth, frameHeight, bredd, hojd, backgroundColor } = CanvasProperties;
    
    const [canvasZoom, setCanvasZoom] = useState(canvasInitialZoom)
    const divElement = useRef<HTMLDivElement | null>(null); // Ref to store the created div element
    const StickerNavID = useAppSelector(state => state.sticker.id);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!divElement.current && fabricCanvas?.wrapperEl) {
            const div = document.createElement('div');
            div.classList.add("border", "border-gray-300", "transition-all");
            div.style.position = "absolute"; // Position absolute to position it within the wrapper
            div.style.background = backgroundColor;

            fabricCanvas.wrapperEl.prepend(div);
            divElement.current = div; // Store the created div in the ref
        }
    }, [fabricCanvas, backgroundColor]);

    useEffect(() => {
        if (divElement.current && frameWidth && frameHeight && fabricCanvas) {
            // Get the current zoom level of the canvas
            const zoom = fabricCanvas.getZoom() || 1;
            console.log('zoom ----', zoom);
            
            setCanvasZoom(zoom);   
            dispatch(setCanvasProperties({
                canvasInitialZoom: zoom
            }))    

            divElement.current.style.width = `${frameWidth * zoom}px`;
            divElement.current.style.height = `${frameHeight * zoom}px`;
            divElement.current.style.top = `${(canvasHeight / 2 - frameHeight * zoom / 2) - 30}px`;
            divElement.current.style.left = `${canvasWidth / 2 - frameWidth * zoom / 2}px`;
            
            // Update the canvas properties
            // dispatch(setCanvasProperties({
            //     frameWidth: adjustedFrameWidth * zoom, // Save the frame width and height in canvas units
            //     frameHeight: adjustedFrameHeight * zoom // Save the frame height and height in canvas units
            // }));

            // Set initial styles based on StickerNavID
            if (StickerNavID === 1) {
                divElement.current.classList.add("hidden");
            } else if (StickerNavID === 2) {
                divElement.current.style.borderRadius = "0px";
                divElement.current.classList.add("block");
            } else if (StickerNavID === 3) {
                divElement.current.style.borderRadius = "50%"; // Make it a circle
                divElement.current.classList.add("block");
            } else if (StickerNavID === 4) {
                divElement.current.style.borderRadius = "10px";
                divElement.current.classList.add("block");
            }
        }
    }, [fabricCanvas, StickerNavID, frameWidth, frameHeight, canvasWidth, canvasHeight, backgroundColor, dispatch]);    

    useEffect(() => {
        if (divElement.current) {
            if (StickerNavID === 1) {
                divElement.current.classList.add("hidden");
                divElement.current.classList.remove("block");
            } 
            else if (StickerNavID === 2) {
                divElement.current.style.borderRadius = "0px";
                divElement.current.classList.add("block");
                divElement.current.classList.remove("hidden");
            }
            else if (StickerNavID === 3) {
                divElement.current.style.borderRadius = "50%"; // Make it a circle
                divElement.current.classList.add("block");
                divElement.current.classList.remove("hidden");
            }
            else if (StickerNavID === 4) {
                divElement.current.style.borderRadius = "10px";
                divElement.current.classList.add("block");
                divElement.current.classList.remove("hidden");
            }            
        }
    }, [StickerNavID]);

    useEffect(() => {
        if (divElement.current) {
            divElement.current.style.background = backgroundColor;
        }
    }, [backgroundColor]);
      

    return (
        <div className="relative flex justify-center h-full transition">
            <div
                className="absolute h-3 flex justify-center items-center border-x border-gray-800/20 -my-[35px] transition-all duration-300"
                style={{
                    top: `${(canvasHeight / 2 - frameHeight * canvasZoom / 2) - 30}px`,
                    left: `${canvasWidth / 2 - frameWidth * canvasZoom / 2}px`,
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
                    top: `${(canvasHeight / 2 - frameHeight * canvasZoom / 2) - 30}px`,
                    left: `${canvasWidth / 2 - frameWidth * canvasZoom / 2}px`,
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
