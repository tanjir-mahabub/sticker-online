"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Customize from "./Customize/Customize";
import Dashboard from "./Dashboard";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import OverlayPopUp from "../Utils/OverlayPopUp";
import { setCanvasProperties } from "@/redux/features/canvasSlice";
import { CanvasProvider } from "@/context/CanvasContext";
import { fetchStickerData } from "@/services/stickerDataService";
import type { StickerData } from "@/types/types";
import { EditorI18nProvider } from "@/context/EditorI18nContext";
import OrderReviewModal from "./OrderReviewModal";
import { stickerCatalog } from "@/data/stickerCatalog";

export default function EditorWorkspace() {
  const dispatch = useDispatch();
  // The bundled catalogue makes first paint deterministic. The API refresh is
  // progressive, so a slow request can never replace the editor with a loader.
  const [stickerData, setStickerData] = useState<StickerData>(stickerCatalog);

  useEffect(() => {
    let active = true;
    fetchStickerData().then((data) => { if (active) setStickerData(data); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const syncViewport = () => dispatch(setCanvasProperties({
      clientWidth: window.innerWidth,
      clientHeight: window.innerHeight,
    }));
    syncViewport();
    window.addEventListener("resize", syncViewport, { passive: true });
    return () => window.removeEventListener("resize", syncViewport);
  }, [dispatch]);

  return <EditorI18nProvider><CanvasProvider stickerData={stickerData}>
    <div className="editor-shell flex h-[100dvh] min-h-[100dvh] w-full flex-col overflow-hidden">
      <Header />
      <div className="flex min-h-0 flex-1 overflow-hidden lg:divide-x">
        <Sidebar />
        <div className="hidden lg:flex"><Customize /></div>
        <Dashboard />
      </div>
      <Footer />
      <OverlayPopUp />
      <OrderReviewModal />
    </div>
  </CanvasProvider></EditorI18nProvider>;
}
