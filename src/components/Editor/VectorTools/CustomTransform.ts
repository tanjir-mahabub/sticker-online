
export const CustomTransform = (element: any, options = {}, dispatch?: any) => {
    
    if (!element) {
        return {
            unplug: () => {/* Handle deselection */}
        };
    }

       // Default transformation options
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
      
        
    };
    
    


    const ft = element.paper.freeTransform(element, transformOptions, onTransform);

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

    ft.apply();

    return ft;
};
