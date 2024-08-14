"use client";

import React, { useEffect, useState } from 'react';
import Customize from "@/components/Editor/Customize/Customize";
import Dashboard from "@/components/Editor/Dashboard";
import Header from "@/components/Editor/Header";
import Footer from "@/components/Editor/Footer";
import Sidebar from "@/components/Editor/Sidebar";
import OverlayPopUp from "@/components/Utils/OverlayPopUp";
import { useDispatch } from "react-redux";
import { setCanvasProperties } from "@/redux/features/canvasSlice";
import { CanvasProvider } from "@/context/CanvasContext";
import { fetchStickerData } from "@/services/stickerDataService";

const Editor = () => {
    const dispatch = useDispatch();
    const [stickerData, setStickerData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchStickerData();
                console.log(data);
                setStickerData(data);
            } catch (error) {
                console.error("Failed to fetch sticker data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const setInitialCanvasDimensions = () => {
            const clientWidth = window.innerWidth;
            const clientHeight = window.innerHeight;

            dispatch(setCanvasProperties({ clientWidth, clientHeight }));
            console.log("window size", clientWidth, clientHeight);
        };

        setInitialCanvasDimensions(); // Ensure dimensions are set on first render

        window.addEventListener("resize", setInitialCanvasDimensions);

        return () => {
            window.removeEventListener("resize", setInitialCanvasDimensions);
        };
    }, [dispatch]);

    return (
        <section>
            {stickerData && (
                <CanvasProvider stickerData={stickerData}>
                    <div className="flex flex-col overflow-hidden w-full h-screen">
                        <div className="h-fit">
                            <Header />
                        </div>
                        <div className="flex overflow-hidden lg:divide-x h-full">
                            <Sidebar />
                            <div className="hidden lg:flex">
                                <Customize />
                            </div>
                            <Dashboard />
                        </div>
                        <div className="h-auto">
                            <Footer />
                        </div>

                        <OverlayPopUp />
                    </div>
                </CanvasProvider>
            )}
        </section>
    );
};

export default Editor;
