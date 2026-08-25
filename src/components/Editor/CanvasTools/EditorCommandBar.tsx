import { useCallback, useEffect, useState } from "react";
import { fabric } from "fabric";
import { useCanvas } from "@/context/CanvasContext";
import { DIE_CUT_BACKGROUND_ID, DIE_CUT_LINE_ID, getArtworkObjects } from "@/lib/sticker-contour/StickerContourEngine";

const clampZoom = (value: number) => Math.min(3, Math.max(0.2, value));
const labelFor = (object: fabric.Object, index: number) => {
  const category = object.data?.category;
  if (category === "text") return `Text ${index + 1}`;
  if (category === "motiv") return `Motif ${index + 1}`;
  if (category === "image") return `Image ${index + 1}`;
  return `Layer ${index + 1}`;
};

export default function EditorCommandBar() {
  const { fabricCanvasRef, saveState } = useCanvas();
  const [zoom, setZoom] = useState(1);
  const [layersOpen, setLayersOpen] = useState(false);
  const [, setRevision] = useState(0);

  const canvas = fabricCanvasRef.current;
  const artwork = canvas ? getArtworkObjects(canvas).slice().reverse() : [];

  const setCanvasZoom = useCallback((next: number) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const value = clampZoom(next);
    canvas.zoomToPoint(new fabric.Point(canvas.getWidth() / 2, canvas.getHeight() / 2), value);
    canvas.requestRenderAll();
    setZoom(value);
  }, [fabricCanvasRef]);

  const fitArtwork = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const objects = getArtworkObjects(canvas);
    if (!objects.length) { canvas.setViewportTransform([1, 0, 0, 1, 0, 0]); setZoom(1); return; }
    const boxes = objects.map((object) => object.getBoundingRect(true, true));
    const left = Math.min(...boxes.map((box) => box.left));
    const top = Math.min(...boxes.map((box) => box.top));
    const right = Math.max(...boxes.map((box) => box.left + box.width));
    const bottom = Math.max(...boxes.map((box) => box.top + box.height));
    const width = Math.max(1, right - left);
    const height = Math.max(1, bottom - top);
    const next = clampZoom(Math.min((canvas.getWidth() - 140) / width, (canvas.getHeight() - 180) / height, 1.5));
    canvas.setViewportTransform([
      next, 0, 0, next,
      canvas.getWidth() / 2 - (left + width / 2) * next,
      canvas.getHeight() / 2 - (top + height / 2) * next,
    ]);
    canvas.requestRenderAll();
    setZoom(next);
  }, [fabricCanvasRef]);

  const duplicate = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    const active = canvas?.getActiveObject();
    if (!canvas || !active || active.id === DIE_CUT_BACKGROUND_ID || active.id === DIE_CUT_LINE_ID) return;
    active.clone((clone: fabric.Object) => {
      const id = `${active.data?.category ?? "layer"}-${crypto.randomUUID()}`;
      clone.set({ id, left: (active.left ?? 0) + 18, top: (active.top ?? 0) + 18, data: { ...active.data, id } });
      canvas.add(clone);
      canvas.setActiveObject(clone);
      canvas.requestRenderAll();
      saveState();
    }, ["id", "data"]);
  }, [fabricCanvasRef, saveState]);

  const toggleVisibility = (object: fabric.Object) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    object.set({ visible: object.visible === false });
    object.setCoords();
    canvas.fire("object:modified", { target: object });
    canvas.requestRenderAll();
    setRevision((value) => value + 1);
  };

  const toggleLock = (object: fabric.Object) => {
    const locked = object.selectable === false;
    object.set({ selectable: locked, evented: locked, lockMovementX: !locked, lockMovementY: !locked });
    fabricCanvasRef.current?.requestRenderAll();
    setRevision((value) => value + 1);
  };

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const sync = () => { setRevision((value) => value + 1); setZoom(canvas.getZoom() || 1); };
    canvas.on("object:added", sync);
    canvas.on("object:removed", sync);
    canvas.on("object:modified", sync);
    canvas.on("selection:updated", sync);
    canvas.on("selection:created", sync);
    canvas.on("selection:cleared", sync);
    return () => {
      canvas.off("object:added", sync);
      canvas.off("object:removed", sync);
      canvas.off("object:modified", sync);
      canvas.off("selection:updated", sync);
      canvas.off("selection:created", sync);
      canvas.off("selection:cleared", sync);
    };
  }, [fabricCanvasRef]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, textarea, select, [contenteditable=true]")) return;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "d") { event.preventDefault(); duplicate(); }
      if (event.key === "+" || event.key === "=") setCanvasZoom(zoom + 0.1);
      if (event.key === "-") setCanvasZoom(zoom - 0.1);
      if (event.key === "0") fitArtwork();
      if (event.key === "Escape") fabricCanvasRef.current?.discardActiveObject().requestRenderAll();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [duplicate, fabricCanvasRef, fitArtwork, setCanvasZoom, zoom]);

  return <>
    <div className="editor-commandbar" aria-label="Canvas controls">
      <button onClick={() => setCanvasZoom(zoom - 0.1)} aria-label="Zoom out">−</button>
      <span>{Math.round(zoom * 100)}%</span>
      <button onClick={() => setCanvasZoom(zoom + 0.1)} aria-label="Zoom in">+</button>
      <i />
      <button onClick={fitArtwork} aria-label="Fit artwork">Fit</button>
      <button onClick={duplicate} aria-label="Duplicate selected layer">Duplicate</button>
      <button className={layersOpen ? "is-active" : ""} onClick={() => setLayersOpen((value) => !value)} aria-expanded={layersOpen}>Layers <b>{artwork.length}</b></button>
    </div>
    {layersOpen && <aside className="editor-layers" aria-label="Layers panel">
      <header><div><small>Workspace</small><strong>Layers</strong></div><button onClick={() => setLayersOpen(false)} aria-label="Close layers">×</button></header>
      {artwork.length === 0 ? <div className="editor-layers-empty"><span>◇</span><strong>Your canvas is ready</strong><p>Add an image, motif, or text to create the first layer.</p></div> :
        <ol>{artwork.map((object, index) => <li key={object.id ?? index}>
          <button className="layer-select" onClick={() => { fabricCanvasRef.current?.setActiveObject(object); fabricCanvasRef.current?.requestRenderAll(); }}>
            <span>{object.data?.category?.slice(0, 1)?.toUpperCase() ?? "L"}</span><div><strong>{labelFor(object, index)}</strong><small>{object.type}</small></div>
          </button>
          <button onClick={() => toggleVisibility(object)} aria-label="Toggle visibility">{object.visible === false ? "○" : "●"}</button>
          <button onClick={() => toggleLock(object)} aria-label="Toggle lock">{object.selectable === false ? "Locked" : "Free"}</button>
        </li>)}</ol>}
      <footer><span>Tip</span><p>Ctrl/⌘ + D duplicates · 0 fits artwork</p></footer>
    </aside>}
  </>;
}
