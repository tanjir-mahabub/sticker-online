import { defaultOptions } from "@/components/Utils/vectorFunction";
import { usePaper } from "@/context/PaperContext";
import { useCallback, useEffect, useMemo } from "react";

export const useTransformUtils = () => {
    const { paper, elementActive, selectedItem, setSelectedItem, setFTEndData } = usePaper();

    const hideExtraHandles = useCallback((ft: any) => {
        if (ft.handles) {
            if (ft.handles.x?.line) ft.handles.x.line.hide();
            if (ft.handles.x?.disc) ft.handles.x.disc.hide();
            if(ft.handles.center?.disc) ft.handles.center.disc.node.setAttribute("cursor", "move");
            //if (ft.handles.center?.disc) ft.handles.center.disc.node.setAttribute("pointer-events", "none");
        }

        ft?.updateHandles();

        ft?.apply();

    }, []);

    const updateFTEndData = useCallback((ft: any, el: any) => {
        const bbox = el.getBBox();
        setFTEndData({
            id: ft.subject.id,
            category: ft.subject.data().data,
            position: {
                x: bbox.x,
                y: bbox.y,
                width: bbox.width,
                height: bbox.height,
                center: ft.attrs.center,
                translate: ft.attrs.translate,
                scaleX: ft.attrs.scale.x,
                scaleY: ft.attrs.scale.y,
                rotate: ft.attrs.rotate,
            }
        });
    }, [setFTEndData]);

    const initialTransform = useCallback((el: any) => {
        const ft = paper?.freeTransform(el, `freeTransform stickerHandle-${el.id}`, defaultOptions, (ft: any, events: any) => {
            if (events.includes("drag end") || events.includes("scale end") || events.includes("rotate end")) {
                updateFTEndData(ft, el);
                if (events.includes("drag end")) {
                    ft && setSelectedItem(ft.subject);
                }
            }
        });

        if (ft) {
            hideExtraHandles(ft);
        }
        return ft;
    }, [paper, updateFTEndData, setSelectedItem, hideExtraHandles]);

    const addOrRemoveTransform = useCallback((el: any, show?: boolean) => {
        if (el) {
            const ft = initialTransform(el);
            if (ft) {
                ft.hideHandles({ undrag: false });
                if (show) {
                    ft.showHandles();
                    ft?.updateHandles();

                    ft?.apply();
                }
                ft && hideExtraHandles(ft);
            }
        }
    }, [initialTransform, hideExtraHandles]);

    useEffect(() => {
        if (selectedItem) {
            elementActive?.forEach((el: any) => {
                if (el.id !== selectedItem.id) {
                    el?.freeTransform?.hideHandles({ undrag: false });
                }
            });

            const ft = selectedItem.freeTransform;
            if (ft) {
                ft.showHandles();
                ft && hideExtraHandles(ft);
            }
        } 
        
        // if (elementActive.length > 0) {
        //     const lastEL = elementActive[elementActive.length - 1];
        //     setSelectedItem(lastEL);
        // }
    }, [selectedItem, elementActive, setSelectedItem, hideExtraHandles]);

    return useMemo(() => ({ addOrRemoveTransform }), [addOrRemoveTransform]);
};
