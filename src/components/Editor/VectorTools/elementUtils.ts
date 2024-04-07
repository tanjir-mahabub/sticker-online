import { calculateFrameEdges, isObjectInsideFrame } from "@/components/Utils/functions";
import { BoundingBox, Frame } from "@/types/types";

export const isElementInsideFrame = (
    element: any,
    centerX: number,
    centerY: number,
    frameWidth: number,
    frameHeight: number
): boolean => {

    const frameX = centerX - frameWidth / 2;
    const frameY = centerY - frameHeight / 2;
    const frameX2 = frameX + frameWidth;
    const frameY2 = frameY + frameHeight;

    const frame: Frame = { centerX, centerY, frameWidth, frameHeight };
    const frameEdges = calculateFrameEdges(frame);
    const imagePosition: BoundingBox = element.getBBox();
    const inside = isObjectInsideFrame(imagePosition, frameEdges);

    return inside
}