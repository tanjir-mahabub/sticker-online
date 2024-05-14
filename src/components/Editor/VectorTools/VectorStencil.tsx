import Raphael from 'raphael';
import '@/lib/raphael.export';
import '@/lib/raphael.free_transform';
import '@/lib/raphael.group';
import { usePaper } from "@/context/PaperContext";
import { useEffect, useRef, useState } from "react";
import VectorFrame from './CanvasFrame';
import Spinner from '@/components/Utils/Spinner';
import FrameBackground from './Elements/FrameBackground';
import ImageElement from './Elements/ImageElement';
import TextElement from './Elements/TextElement';
import ControlElement from './Elements/ControlElement';
import CleanUpElement from './Elements/CleanUpElement';
import { useTransformUtils } from '@/hooks/useTransformUtils';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/redux/store';
import FreeTransform from './Elements/FreeTransform';

const VectorStencil = () => {
    const objectHistories = useAppSelector((state) => state.history.objectHistories);

    const { paper, currentFtRef, selectedItem, setSelectedItem, setPaper, isLoading } = usePaper();
    const raphaelRef = useRef<HTMLDivElement | null>(null);
    const [StickerWrapper, setStickerWrapper] = useState<HTMLDivElement | null>(null);
    const isLayoutEffectExecuted = useRef(false);

    const dispatch = useDispatch();
    const { deselect } = useTransformUtils(dispatch, currentFtRef, setSelectedItem);

    useEffect(() => {
        if (!isLayoutEffectExecuted.current && typeof window !== "undefined" && raphaelRef.current && !paper) {
            const width = raphaelRef.current.clientWidth;
            const height = raphaelRef.current.clientHeight;
            const paperInstance = new Raphael(raphaelRef.current, width, height);
            const svgElement = paperInstance.canvas;
            svgElement.id = "VECTORSVGId";

            const StickerMainWrapper = paperInstance.rect(0, 0, width, height).attr({
                fill: "transparent",
                stroke: "none"
            });

            setPaper(paperInstance);
            setStickerWrapper(StickerMainWrapper);

            StickerMainWrapper.click(() => {
                paper?.forEach((el: any) => {
                    el?.freeTransform?.unplug();
                    console.log('clicked');
                })
            });
            isLayoutEffectExecuted.current = true;
        }
    }, [paper, setPaper]);


    useEffect(() => {
        if (objectHistories[0]?.objectId && paper) {
            paper.forEach((el: any) => {
                if (objectHistories[0].objectId === el.id) {
                    console.log(objectHistories[0].history[objectHistories[0].historyStep]);
                }
            })
        }
    }, [objectHistories, paper])


    return (
        <div className="relative w-full h-full">
            {isLoading && <Spinner />}
            <VectorFrame />
            <div ref={raphaelRef} className="absolute left-0 top-0 z-50 w-full h-full mx-auto"></div>
            <FrameBackground />
            <ImageElement />
            <TextElement />
            <ControlElement />
            <CleanUpElement />
            <FreeTransform />
        </div>
    );
};

export default VectorStencil;
