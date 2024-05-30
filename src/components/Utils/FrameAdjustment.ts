export const FrameAdjustment = (
    paper: any,
    target: any,
    viewBoxX: number,
    viewBoxY: number,
    viewBoxWidth: number,
    viewBoxHeight: number,
    scale: number,
    percentage: number
): {
    performAction: (action: string) => void;
    increaseScale: () => void;
    zoomOut: () => void;
    resetZoom: () => void;    
    updateViewBox: (element: any, currentScale: number) => void;
    getViewBox: () => { viewBoxX: number; viewBoxY: number; viewBoxWidth: number; viewBoxHeight: number };
} => {

    const defaultReturn = {
        performAction: (action: string) => {},
        increaseScale: () => {},
        zoomOut: () => {},
        resetZoom: () => {},
        increaseRectSize: () => {},
        updateViewBox: (element: any, currentScale: number) => {},
        getViewBox: () => ({ viewBoxX: 0, viewBoxY: 0, viewBoxWidth: 0, viewBoxHeight: 0 })
    };

    if (!paper || !target) return defaultReturn;

    function performAction(action: string) {
        switch (action) {
            case 'increaseScale':
                increaseScale();
                break;
            case 'zoomOut':
                zoomOut();
                break;
            case 'resetZoom':
                resetZoom();
                break;           
            default:
                console.error('Unknown action:', action);
        }
    }

    function increaseScale() {
        scale *= 1.1;
        updateViewBox(target, scale);
    }

    function zoomOut() {
        scale /= 1.1;
        updateViewBox(target, scale);
    }

    function resetZoom() {
        scale = 1;
        updateViewBox(target, scale);
    }
    
    function updateViewBox(element: any, currentScale: number) {
        const rectBBox = element.getBBox();
        if (rectBBox) {
            console.log(rectBBox);
            const rectCenterX = rectBBox.x + rectBBox.width / 2;
            const rectCenterY = rectBBox.y + rectBBox.height / 2;

            viewBoxWidth = paper.width * percentage / currentScale;
            viewBoxHeight = paper.height * percentage / currentScale;

            // Ensure the viewbox is large enough to contain the entire rectangle
            if (rectBBox.width > viewBoxWidth) {
                viewBoxWidth = rectBBox.width / percentage; // Adjust padding
            }
            if (rectBBox.height > viewBoxHeight) {
                viewBoxHeight = rectBBox.height / percentage; // Adjust padding
            }

            viewBoxX = rectCenterX - viewBoxWidth / 2;
            viewBoxY = rectCenterY - viewBoxHeight / 2;

            paper.setViewBox(viewBoxX, viewBoxY, viewBoxWidth, viewBoxHeight, true);
            console.log('viewBox', `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`);
            console.log('rect size', target.getBBox());
        } else {
            console.error('Element bounding box not found');
        }
    }

    async function resizeToFit(status: string) {
        const viewBoxArea = viewBoxWidth * viewBoxHeight;
        const targetArea = viewBoxArea * percentage;
        
        const targetBBox = await target?.getBBox();  
        console.log('test', targetBBox);          
        
        if(!targetBBox) return

        function step() {
            if (targetBBox) {
                const currentWidth = targetBBox.width;
                const currentHeight = targetBBox.height;
                const scaledWidth = currentWidth * scale;
                const scaledHeight = currentHeight * scale;
                const currentArea = (scaledWidth * scaledHeight) / percentage;

                console.log('current area', currentArea, targetArea);                        

                if (status === 'increase' && currentArea < targetArea) {
                    increaseScale();                    
                } else if (status === 'decrease' && currentArea > targetArea) {
                    zoomOut();                    
                } else {
                    console.log('our target',target);
                    target && centerTargetInViewBox(target); // Center the target element after resizing
                }
            } else {
                console.error('Target bounding box not found');
            }
        }

        step();
    }

    async function centerTargetInViewBox(element: any) {
        const rectBBox = await element?.getBBox();
        if (rectBBox) {
            const rectCenterX = rectBBox.x + rectBBox.width / 2;
            const rectCenterY = rectBBox.y + rectBBox.height / 2;

            viewBoxX = rectCenterX - viewBoxWidth / 2;
            viewBoxY = rectCenterY - viewBoxHeight / 2;

            // Adjust viewBox position to ensure it doesn't go beyond the bounds of the canvas
            viewBoxX = Math.max(0, Math.min(viewBoxX, paper.width - viewBoxWidth));
            viewBoxY = Math.max(0, Math.min(viewBoxY, paper.height - viewBoxHeight));

            paper.setViewBox(viewBoxX, viewBoxY, viewBoxWidth, viewBoxHeight, true);
        } else {
            console.error('Element bounding box not found');
        }
    }

    function getViewBox() {
        return {
            viewBoxX,
            viewBoxY,
            viewBoxWidth,
            viewBoxHeight
        };
    }

    updateViewBox(target, scale); // Initialize the viewBox

    const rectBBox = target?.getBBox();
    if (rectBBox) {
        const rectWidth = parseFloat(rectBBox.width);
        const rectHeight = parseFloat(rectBBox.height);

        if (rectWidth > paper.width || rectHeight > paper.height) {
            resizeToFit("decrease");
        } else {
            resizeToFit("increase");
        }
    } else {
        console.error('Rect bounding box not found');
    }

    return {
        performAction,
        increaseScale,
        zoomOut,
        resetZoom,
        updateViewBox,
        getViewBox
    };
}
