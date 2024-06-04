import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { usePaper } from '@/context/PaperContext';
import { setCanvasProperties } from "@/redux/features/canvasSlice";
import { FrameAdjustment } from "@/components/Utils/FrameAdjustment";
import { createDieCut, extractDAttributeValue, generateSVGImageData } from "@/components/Utils/DieCutFunction";
import { calculateBoundingBox, convertJpgToBase64, defaultOptions, pixelToCm } from "@/components/Utils/vectorFunction";
import { debounce } from "lodash";
import { useAppSelector } from '@/redux/store';
import materialStore from '@/store/materialStore';

export const useDieCut = () => {
    const [dieCutResult, setDieCutResult] = useState<string | null>(null);
    const { paper, selectedItem, setSelectedItem, setIsLoading, elementActive } = usePaper();        

    const materialDefault = useAppSelector(state => state.formValues.materialLastSelected);
    const CanvasProperties = useAppSelector(state => state.canvas);
    const { centerX, centerY, frameWidth, frameHeight, grow, backgroundColor } = CanvasProperties;

    const dispatch = useDispatch();

    const debouncedHandleDieCut = debounce(async () => {
        setIsLoading(true);
        const set = paper.set()
        elementActive?.forEach((el: any) => {
            if(el.data().data === "image" ||el.data().data === "text") {
                set.push(el)
            }
            el?.freeTransform?.hideHandles({ undrag: false })
        });

       const BoundingBox = calculateBoundingBox(paper, set);
        console.log('total length', BoundingBox);
    
        selectedItem && setSelectedItem(null);
    
        try {
            const svgData = await paper.toSVG(0, 0, paper.width, paper.height, "", true);
    
            if (svgData) {
                const modifiedSVG = await generateSVGImageData(svgData, paper.width, paper.height, grow, "white");
                const dAttributeValue = await extractDAttributeValue(modifiedSVG);
    
                if (dAttributeValue) {
                    // createDieCut(paper, dAttributeValue, CanvasProperties)
                    setDieCutResult(dAttributeValue);
                    setIsLoading(false);
                }
            }
        } catch (error: any) {
            console.error('Error:', error);
        }
    }, 300);

    const handleDieCut = async () => {
        debouncedHandleDieCut();        
    }

    // Die cut integration
    useEffect(() => {

        if (paper && dieCutResult && backgroundColor && materialDefault) {
            const dieCutX: number = centerX - frameWidth / 2;
            const dieCutY: number = centerY - frameHeight / 2;

            // Remove existing dieCutImage if it exists
            paper?.forEach((element: any) => {
                const { data } = element.data();
                if (data === "dieCutImage") {
                    element?.unplug?.();
                    element?.clear?.();
                    element?.freeTransform?.unplug?.();
                    element?.attr?.({ href: null, src: null });
                    element.remove();
                }
            });

            // Create the dieCutImage using the generated SVG image data                    
            const dieCutImage = paper.path(dieCutResult)

            const strokeColor = "rgba(0,0,0,0.3)";

            dieCutImage?.attr({
                stroke: strokeColor
            })

            dieCutImage?.data('data', 'dieCutImage');                                                                       

            const selectedMaterial = materialStore.find(material => material.id === materialDefault);
            // console.log(selectedMaterial);

            //pattern add
            selectedMaterial && selectedMaterial.src ? convertJpgToBase64(selectedMaterial.src)
                .then((base64Data) => {
                    // console.log('Base64-encoded data:', base64Data);
                    // Handle the base64-encoded data as needed
                    dieCutImage.attr({ fill: `url(${base64Data})` });
                })
                .catch((error) => {
                    console.error('Error converting JPG to base64:', error);
                }) : (
                (selectedMaterial?.value === "clear") ? dieCutImage.attr({ fill: "transparent" }) : dieCutImage.attr({ fill: backgroundColor })
            )

            paper.forEach((element: any) => {
                const { data } = element.data();
                const isRectOrCircle = data === "frame-rect" || data === "frame-circle";
                const isCircle = data === "frame-circle";

                if (isRectOrCircle) {
                    dieCutImage.insertAfter(element);
                    // testImage.insertAfter(element);

                }
            })   
            
            
            if(dieCutImage) {
                // const viewBoxModule = FrameAdjustment(paper, dieCutImage, 0, 0, paper.width, paper.height, 1,  0.65); 
                // console.log(viewBoxModule, 'llll', viewBoxModule.getViewBox());                
                                
                // elementActive.forEach((el:any) => {
                //     el.freeTransform?.unplug()  
                    
                //     const ft = paper?.freeTransform(el, `freeTransform stickerHandle-${el.id}`, defaultOptions, (ft: any, events: any) => {
                                            
                //         if(events.includes("drag start")) {                                                    
                //             ft && hideFreeTransform(ft, paper)
                //         }
        
                //         if(events.includes("drag end")) {                                                    
                //             ft && setSelectedItem(ft.subject)
                //             ft && showFreeTransform(ft)
                //         }
                //     })
                //     ft && hideFreeTransform(ft)                  
                //     // ft && showFreeTransform(ft)
                // })

                // Adjust frame ratio by die cut image
                const bbox = dieCutImage?.getBBox();
                if(bbox) {
                    const { x, y, width, height } = bbox;
                    dispatch(setCanvasProperties({                       
                        centerX: x,
                        centerY: y,                 
                        frameWidth: width,
                        frameHeight: height,
                        bredd: pixelToCm(width),
                        hojd: pixelToCm(height)
                    }))

                    const paperCenter: { x: number, y: number } = { x: paper.width / 2, y: paper.height / 2 };
                    const elCenter = { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 };
                    const translation = { x: paperCenter.x - elCenter.x, y: paperCenter.y - elCenter.y };
                    dieCutImage.attr({ x: translation.x, y: translation.y });
                // paper?.setViewBox(0, 0, width, height, true);
                
                console.log(bbox);
                    console.log( centerX - width/2,  centerY - height/2, y, centerX, centerY);   
                }      
            
            }
        }
    }, [dieCutResult, backgroundColor, centerX, centerY, frameWidth, frameHeight, paper, materialDefault, dispatch, elementActive, setSelectedItem])
 

     /**
     * Svg export function
     */
     const handleDownloadSVG = async (): Promise<void> => {        

        if (paper) {

            elementActive?.forEach((el: any) => el?.freeTransform?.hideHandles({ undrag: false }))

            const strokeColor = "rgba(255,0,255, 1)";
            // Proceed with SVG export and download
            const svgData = paper.toSVG(centerX - frameWidth / 2, centerY - frameHeight / 2, frameWidth, frameHeight, strokeColor, false);

            // Create a Blob from the SVG data
            const blob = new Blob([svgData], { type: 'image/svg+xml' });

            // Create a URL for the Blob
            const url = window.URL.createObjectURL(blob);

            // Create a temporary anchor element
            const a = document.createElement('a');
            a.href = url;
            a.download = 'image.svg'; // Set the download filename
            document.body.appendChild(a);

            // Trigger a click event on the anchor to start the download
            a.click();

            // Cleanup
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }
    };    

    return { dieCutResult, handleDownloadSVG, handleDieCut };
};
