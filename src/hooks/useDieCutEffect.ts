import { useCallback, useMemo, useRef } from "react";
import { fabric } from "fabric";
import { useDispatch } from "react-redux";
import { useCanvas } from "@/context/CanvasContext";
import { useAppSelector } from "@/redux/store";
import { setCanvasProperties } from "@/redux/features/canvasSlice";
import materialStore from "@/store/materialStore";
import {
  DIE_CUT_BACKGROUND_ID,
  DIE_CUT_LINE_ID,
  StickerContourEngine,
  getArtworkObjects,
} from "@/lib/sticker-contour/StickerContourEngine";
import { pixelToCm } from "@/components/Utils/function";

export interface ObjectWithPercentage { object: fabric.Object; percentageInside: number; }
export type ObjectsWithPercentageArray = ObjectWithPercentage[];
type OnDieCutReady = (result: React.MutableRefObject<fabric.Canvas | null>) => void;

export const useDieCutEffect = (onDieCutReady?: OnDieCutReady) => {
  const { fabricCanvasRef, stickerData } = useCanvas();
  const canvasProperties = useAppSelector((state) => state.canvas);
  const materialId = useAppSelector((state) => state.formValues.materialLastSelected);
  const dispatch = useDispatch();
  const engine = useMemo(() => new StickerContourEngine(), []);
  const generationRef = useRef(0);

  const deletePrevDieCut = useCallback((canvas: fabric.Canvas) => {
    const generated = canvas.getObjects().filter((object) =>
      object.id === DIE_CUT_BACKGROUND_ID || object.id === DIE_CUT_LINE_ID
    );
    generated.forEach((object) => canvas.remove(object));
    if (generated.length) canvas.requestRenderAll();
  }, []);

  const applyMaterial = useCallback((background: fabric.Path) => {
    const materials = stickerData?.materials?.length ? stickerData.materials : materialStore;
    const material = materials.find((entry) => entry.id === materialId);
    if (material?.value === "clear") {
      background.set({ fill: "rgba(255,255,255,0.06)" });
      return;
    }
    if (!material?.label_icon) {
      background.set({ fill: canvasProperties.backgroundColor });
      return;
    }
    fabric.Image.fromURL(material.label_icon, (image) => {
      const element = image.getElement();
      if (!(element instanceof HTMLImageElement)) return;
      background.set({ fill: new fabric.Pattern({ source: element, repeat: "repeat" }) });
      fabricCanvasRef.current?.requestRenderAll();
    }, { crossOrigin: "anonymous" });
  }, [canvasProperties.backgroundColor, fabricCanvasRef, materialId, stickerData]);

  const handleDieCut = useCallback(async (padding = canvasProperties.grow) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const generation = ++generationRef.current;
    if (!getArtworkObjects(canvas).length) {
      deletePrevDieCut(canvas);
      dispatch(setCanvasProperties({ isLoading: false }));
      return;
    }

    dispatch(setCanvasProperties({ isLoading: true, grow: padding }));
    try {
      const result = await engine.generate(canvas, {
        padding,
        resolution: 2,
        alphaThreshold: 28,
        simplifyTolerance: 0.65,
      });
      if (generation !== generationRef.current || !result) return;

      deletePrevDieCut(canvas);
      const background = new fabric.Path(result.pathData, {
        id: DIE_CUT_BACKGROUND_ID,
        data: { category: "generated", role: "sticker-background", componentCount: result.componentCount },
        fill: canvasProperties.backgroundColor,
        stroke: "rgba(15,23,42,0.12)",
        strokeWidth: 1,
        strokeUniform: true,
        selectable: false,
        evented: false,
        objectCaching: true,
      });
      const cutline = new fabric.Path(result.pathData, {
        id: DIE_CUT_LINE_ID,
        data: { category: "generated", role: "cutline" },
        fill: "transparent",
        stroke: "#7c3aed",
        strokeWidth: 1.25,
        strokeDashArray: [7, 5],
        strokeUniform: true,
        selectable: false,
        evented: false,
        objectCaching: true,
      });
      canvas.insertAt(background, 0, false);
      canvas.insertAt(cutline, 1, false);
      applyMaterial(background);

      const box = background.getBoundingRect(true, true);
      dispatch(setCanvasProperties({
        bredd: pixelToCm(box.width), hojd: pixelToCm(box.height),
        frameWidth: box.width, frameHeight: box.height, isLoading: false,
      }));
      canvas.requestRenderAll();
      onDieCutReady?.(fabricCanvasRef);
    } catch (error) {
      if (generation === generationRef.current) {
        console.error("Unable to generate sticker contour", error);
        dispatch(setCanvasProperties({ isLoading: false }));
      }
    }
  }, [applyMaterial, canvasProperties.backgroundColor, canvasProperties.grow, deletePrevDieCut, dispatch, engine, fabricCanvasRef, onDieCutReady]);

  const handleDownloadSVG = useCallback(async () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const background = canvas.getObjects().find((object) => object.id === DIE_CUT_BACKGROUND_ID);
    if (!background) { await handleDieCut(canvasProperties.grow); return; }
    canvas.discardActiveObject();
    canvas.requestRenderAll();
    const box = background.getBoundingRect(true, true);
    const margin = 12;
    const svg = canvas.toSVG({
      viewBox: { x: box.left - margin, y: box.top - margin, width: box.width + margin * 2, height: box.height + margin * 2 },
      width: `${Math.ceil(box.width + margin * 2)}`,
      height: `${Math.ceil(box.height + margin * 2)}`,
    });
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "sticker-online-design.svg";
    anchor.click();
    URL.revokeObjectURL(url);
  }, [canvasProperties.grow, fabricCanvasRef, handleDieCut]);

  return { handleDownloadSVG, handleDieCut, deletePrevDieCut };
};
