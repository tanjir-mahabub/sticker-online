import { usePaper } from "@/context/PaperContext";
import { useAppSelector } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const FrameBackground = () => {
    const { paper, currentFtRef, setSelectedItem } = usePaper();
    const [rectElBlank, setRectElBlank] = useState<any>(null);
    const [rectEl, setRectEl] = useState<any>(null);
    const [circleEl, setCircleEl] = useState<any>(null);

    const StickerSelected = useAppSelector(state => state.sticker);
    const CanvasProperties = useAppSelector(state => state.canvas);
    const { centerX, centerY, frameWidth, frameHeight, backgroundColor } = CanvasProperties;        

    useEffect(() => {
        if (!paper || !StickerSelected) return;

        const circleRadius = Math.min(frameWidth, frameHeight) / 2;

        if (StickerSelected.id === 1) {
            if (circleEl) circleEl.hide();
            if (rectEl) rectEl.hide();
            if (rectElBlank) rectElBlank.show();
        } else if (StickerSelected.id === 2 || StickerSelected.id === 4) {
            if (rectElBlank) rectElBlank.hide();
            if (circleEl) circleEl.hide();
            if (rectEl) rectEl.show().attr({ r: StickerSelected.id === 4 ? 10 : 0, rx: StickerSelected.id === 4 ? 10 : 0, ry: StickerSelected.id === 4 ? 10 : 0, fill: backgroundColor, stroke: 'rgba(0,0,0,0.4)' });
        } else if (StickerSelected.id === 2 || StickerSelected.id === 3) {
            if (rectElBlank) rectElBlank.hide();
            if (rectEl) rectEl.hide();
            if (circleEl) circleEl.show().attr({ fill: backgroundColor });
        } else {
            if (rectElBlank) rectElBlank.hide();
            if (circleEl) circleEl.hide();
            if (rectEl) rectEl.hide();
        }

        rectEl?.animate({ x: centerX - frameWidth / 2, y: centerY - frameHeight / 2, width: frameWidth, height: frameHeight }, 300, 'easeInOut');
        circleEl?.animate({ cx: centerX, cy: centerY, r: circleRadius }, 300, 'easeInOut');

    }, [paper, StickerSelected, centerX, centerY, frameWidth, frameHeight, rectEl, rectElBlank, circleEl, backgroundColor]);

    useEffect(() => {
        if (!paper || !StickerSelected) return;

        if (!rectElBlank) {
            const rect = paper.rect(centerX - frameWidth / 2, centerY - frameHeight / 2, frameWidth, frameHeight).attr({
                fill: "transparent",
                stroke: "rgba(0,0,0,0)"
            }).toBack().hide();

            rect.data({ "data": "frame-rect" })

            setRectElBlank(rect);
        }

        if (!circleEl || !rectEl) {
            const circleRadius = Math.min(frameWidth, frameHeight) / 2;
            const circle = paper.circle(centerX, centerY, circleRadius).attr({
                fill: "white",
                stroke: "rgba(0,0,0,0.4)"
            }).hide();

            circle.data({ "data": "frame-circle" })

            const rect = paper.rect(centerX - frameWidth / 2, centerY - frameHeight / 2, frameWidth, frameHeight).attr({
                fill: "white",
                stroke: "rgba(0,0,0,0.4)"
            }).toBack().hide();

            rect.data("data", "frame-rect")

            setCircleEl(circle);
            setRectEl(rect);
        }
    }, [paper, centerX, centerY, frameWidth, frameHeight, circleEl, rectEl, rectElBlank, StickerSelected]);

    return null;
}

export default FrameBackground;
