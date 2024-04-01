import { addedToHistory } from '@/redux/features/historySlice';
import { updateElementAttributes } from "@/redux/features/imagePreviewSlice";


export const CustomTransform = (element: any, options = {}, dispatch?: any) => {
    if (!element) {
        return {
            unplug: () => {/* Handle deselection */}
        };
    }
    
    const defaultOptions = {
        keepRatio: true,
        rotate: true,
        scale: true,
        drag: true,
        distance: 1.35, 
        size: 7, 
        round: 100,
        draw: ['bbox'],
        attrs: {
            fill: '#fff',
            stroke: '#000'
        },
    };

    const transformOptions = { ...defaultOptions, ...options };    

    const onTransform = (ft: any, events: any) => {
        if (events.includes('scale end') || events.includes('rotate end')) {
            const bbox: any = ft.subject.getBBox();
            console.log('drag start', bbox);
    
            console.log('applied', ft.subject.transform());
    
            const matrix = ft.subject.transform();

            console.log(matrix);
    
            let x = bbox.x;
            let y = bbox.y;
            let scaleX = 1;
            let scaleY = 1;
            let width = bbox.width;
            let height = bbox.height;
            let rotate = 0;
    
            // Capture initial position before any transformation
            const initialPosition = { x: bbox.x, y: bbox.y };
    
            // Extract transformation values from the transformation matrix
            matrix.forEach(([operation, ...params]: any) => {
                switch (operation) {
                    case "T":
                        x = params[0];
                        y = params[1];
                        break;
                    case "S":
                        scaleX = params[0];
                        scaleY = params[1];
                        break;
                    case "R":
                        // If rotation is present, extract the angle from params[0]
                        rotate = params[0];
                        break;
                }
            });
    
            // Calculate width and height based on original dimensions and scaling
            // const originalWidth = 651; // Example original width
            // const originalHeight = 416; // Example original height
            // width = originalWidth * scaleX;
            // height = originalHeight * scaleY;
    
            // Log transformation values
    
            console.log("X:", bbox.x);
            console.log("Y:", bbox.y);
            console.log("ScaleX:", scaleX);
            console.log("ScaleY:", scaleY);
            console.log("Width:", width);
            console.log("Height:", height);
            console.log("Rotate:", rotate);
    
            // dispatch(addedToHistory({
            //     objectId: ft.subject.id,
            //     category: ft.subject.data().data || '',
            //     position: {
            //         x: bbox.x, // Use initial position instead of bbox.x
            //         y: bbox.y, // Use initial position instead of bbox.y
            //         width: width,
            //         height: height,
            //         scaleX: scaleX,
            //         scaleY: scaleY,
            //         rotation: rotate
            //     }
            // }));
        }
    };
    
    
    
    const ft = element.paper.freeTransform(element, transformOptions, onTransform);

    ft.subject.node.addEventListener('mouseup', () => {
        // Check if the current event is a drag end event (consider checking for 'dragmove' before to ensure it's a drag)
        if (ft.subject) {
            const bbox: any = ft.subject.getBBox();
               
            const matrix = ft.subject.transform();
    
            let x = bbox.x;
            let y = bbox.y;
            let scaleX = 1;
            let scaleY = 1;
            let width = bbox.width;
            let height = bbox.height;
            let rotate = 0;
    
            // Capture initial position before any transformation
            const initialPosition = { x: bbox.x, y: bbox.y };
            console.log('initialPosition', initialPosition);
    
            // Extract transformation values from the transformation matrix
            matrix.forEach(([operation, ...params]: any) => {
                switch (operation) {
                    case "T":
                        x = params[0];
                        y = params[1];
                        break;
                    case "S":
                        scaleX = params[0];
                        scaleY = params[1];
                        break;
                    case "R":
                        // If rotation is present, extract the angle from params[0]
                        rotate = params[0];
                        break;
                }
            });
    
            // Calculate width and height based on original dimensions and scaling
            const originalWidth = 651; // Example original width
            const originalHeight = 416; // Example original height
            width = originalWidth * scaleX;
            height = originalHeight * scaleY;
    
            // Log transformation values
            console.log(ft.subject.id);
    
            console.log("Drag end X:", bbox.x);
            console.log("Drag end Y:", bbox.y);
            console.log("Drag end ScaleX:", scaleX);
            console.log("Drag end ScaleY:", scaleY);
            console.log("Drag end Width:", width);
            console.log("Drag end Height:", height);
            console.log("Drag end Rotate:", rotate);
    
            // Dispatch action if necessary
            dispatch(addedToHistory({
                objectId: ft.subject.id,
                category: ft.subject.data().data || '',
                position: {
                    x: bbox.x, // Use initial position instead of bbox.x
                    y: bbox.y, // Use initial position instead of bbox.y
                    // width: width,
                    // height: height,
                    scaleX: scaleX,
                    scaleY: scaleY,
                    rotation: rotate
                }
            }));
        
          // You can potentially dispatch a custom redux action here with final attributes
        }
      });


    if (ft && ft.handles && typeof window !== "undefined" && document) {

        if (ft.handles.x) {            
            if (ft.handles.x.line) ft.handles.x.line.hide();
        
            if (ft.handles.x.disc) ft.handles.x.disc.hide();
        }

        const svgNS = "http://www.w3.org/2000/svg";
        const svgElement = document.querySelector("svg");

        if (svgElement) {
            const pattern = document.createElementNS(svgNS, "pattern");
            // Pattern attributes
            pattern.setAttribute("id", "rotateImageFill");
            pattern.setAttribute("patternUnits", "objectBoundingBox");
            pattern.setAttribute("width", "100%");
            pattern.setAttribute("height", "100%");

            const image = document.createElementNS(svgNS, "image");
            // Image attributes
            image.setAttributeNS("http://www.w3.org/1999/xlink", "href", "/rotateIcon.svg");
            image.setAttribute("width", "22");
            image.setAttribute("height", "22");

            pattern.appendChild(image);

            // Append pattern to defs
            let defs = svgElement.querySelector("defs");
            if (!defs) {
                defs = document.createElementNS(svgNS, "defs");
                svgElement.appendChild(defs);
            }
            defs.appendChild(pattern);
        }
    }
   

    
    ft.apply()

    ft.updateHandles();

    return ft;
};
