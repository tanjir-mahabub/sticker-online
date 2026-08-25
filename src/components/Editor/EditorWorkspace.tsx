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

export default function EditorWorkspace() {
  const dispatch = useDispatch();
  const [stickerData, setStickerData] = useState<StickerData | null>(null);

  useEffect(() => {
    fetchStickerData().then(setStickerData);
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

  if (!stickerData) {
    return <div className="editor-boot" role="status"><span /><strong>Preparing your studio</strong><small>Loading canvas tools and materials…</small></div>;
  }

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
