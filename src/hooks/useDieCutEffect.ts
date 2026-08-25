import { useCallback, useMemo, useRef } from "react";
import { fabric } from "fabric";
import { useDispatch } from "react-redux";
import { useCanvas } from "@/context/CanvasContext";
import { useAppSelector } from "@/redux/store";
import { setCanvasProperties } from "@/redux/features/canvasSlice";
import materialStore from "@/store/materialStore";
import {
  DIE_CUT_BACKGROUND_ID,
  DIE_CUT_LAMINATE_ID,
  DIE_CUT_LINE_ID,
  StickerContourEngine,
  getArtworkObjects,
} from "@/lib/sticker-contour/StickerContourEngine";
import { expandArtboardToArtwork } from "@/components/Editor/CanvasTools/eventHandlers/expandArtboardToArtwork";

export interface ObjectWithPercentage { object: fabric.Object; percentageInside: number; }
export type ObjectsWithPercentageArray = ObjectWithPercentage[];
type OnDieCutReady = (result: React.MutableRefObject<fabric.Canvas | null>) => void;

export const useDieCutEffect = (onDieCutReady?: OnDieCutReady) => {
  const { fabricCanvasRef, stickerData } = useCanvas();
  const canvasProperties = useAppSelector((state) => state.canvas);
  const materialId = useAppSelector((state) => state.formValues.materialLastSelected);
  const laminateId = useAppSelector((state) => state.formValues.laminatingLastSelected);
  const dispatch = useDispatch();
  const engine = useMemo(() => new StickerContourEngine(), []);
  const generationRef = useRef(0);

  const deletePrevDieCut = useCallback((canvas: fabric.Canvas) => {
    const generated = canvas.getObjects().filter((object) =>
      object.id === DIE_CUT_BACKGROUND_ID || object.id === DIE_CUT_LINE_ID || object.id === DIE_CUT_LAMINATE_ID
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
    if (!material?.src) {
      const colors:Record<string,string>={mirror:"#d9e2ec","pixie-dust":"#eadcff",prismatic:"#d8f8f0","brushed-alloy":"#cbd5e1"};
      if(material?.value && colors[material.value]) background.set({fill:colors[material.value]});
      else
      background.set({ fill: canvasProperties.backgroundColor });
      return;
    }
    fabric.Image.fromURL(material.src, (image) => {
      const element = image.getElement();
      if (!(element instanceof HTMLImageElement)) return;
      background.set({ fill: new fabric.Pattern({ source: element, repeat: "repeat" }) });
      fabricCanvasRef.current?.requestRenderAll();
    }, { crossOrigin: "anonymous" });
  }, [canvasProperties.backgroundColor, fabricCanvasRef, materialId, stickerData]);

  const applyLaminate = useCallback((pathData:string, canvas:fabric.Canvas) => {
    const laminate=stickerData?.laminates.find(item=>item.id===laminateId);
    if(!laminate)return;
    const source=document.createElement("canvas");source.width=160;source.height=160;const context=source.getContext("2d");if(!context)return;
    if(laminate.value==="glossy"){const gradient=context.createLinearGradient(0,0,160,160);gradient.addColorStop(0,"rgba(255,255,255,0)");gradient.addColorStop(.45,"rgba(255,255,255,.58)");gradient.addColorStop(.58,"rgba(255,255,255,0)");context.fillStyle=gradient;context.fillRect(0,0,160,160)}
    else if(laminate.value==="matte"){context.fillStyle="rgba(255,255,255,.16)";context.fillRect(0,0,160,160);for(let i=0;i<260;i++){context.fillStyle="rgba(255,255,255,.2)";context.fillRect(Math.random()*160,Math.random()*160,1,1)}}
    else {const gradient=context.createRadialGradient(60,50,5,80,80,110);gradient.addColorStop(0,"rgba(255,255,255,.2)");gradient.addColorStop(1,"rgba(230,226,255,.04)");context.fillStyle=gradient;context.fillRect(0,0,160,160)}
    const overlay=new fabric.Path(pathData,{id:DIE_CUT_LAMINATE_ID,data:{category:"generated",role:"laminate",finish:laminate.value},fill:new fabric.Pattern({source:source as unknown as HTMLImageElement,repeat:"repeat"}),opacity:.32,selectable:false,evented:false,objectCaching:true});
    canvas.add(overlay);
  },[laminateId,stickerData]);

  const handleDieCut = useCallback(async (padding = canvasProperties.grow) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const generation = ++generationRef.current;
    if (!getArtworkObjects(canvas).length) {
      deletePrevDieCut(canvas);
      dispatch(setCanvasProperties({ isLoading: false }));
      return;
    }

    const safePadding = Math.min(30, Math.max(4, padding));
    dispatch(setCanvasProperties({ isLoading: true, grow: safePadding }));
    try {
      const result = await engine.generate(canvas, {
        padding: safePadding,
        resolution: 3,
        alphaThreshold: 12,
        simplifyTolerance: 0.3,
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
      applyLaminate(result.pathData,canvas);
      cutline.bringToFront();

      // Contour generation is the authoritative completion point for artwork
      // geometry. Reconcile the production frame here as a safety net for
      // transforms whose final Fabric event is interrupted by a React render.
      const artboard = expandArtboardToArtwork(canvas, {
        frameWidth: canvasProperties.frameWidth,
        frameHeight: canvasProperties.frameHeight,
        cutlinePadding: safePadding,
        fitViewport: true,
      });
      dispatch(setCanvasProperties({
        isLoading: false,
        ...(artboard?.expanded || artboard?.zoomChanged ? {
          frameWidth: artboard.frameWidth,
          frameHeight: artboard.frameHeight,
          bredd: artboard.bredd,
          hojd: artboard.hojd,
          canvasInitialZoom: artboard.zoom,
        } : {}),
      }));
      canvas.requestRenderAll();
      onDieCutReady?.(fabricCanvasRef);
    } catch (error) {
      if (generation === generationRef.current) {
        console.error("Unable to generate sticker contour", error);
        dispatch(setCanvasProperties({ isLoading: false }));
      }
    }
  }, [applyLaminate, applyMaterial, canvasProperties.backgroundColor, canvasProperties.frameHeight, canvasProperties.frameWidth, canvasProperties.grow, deletePrevDieCut, dispatch, engine, fabricCanvasRef, onDieCutReady]);

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
