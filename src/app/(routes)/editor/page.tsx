"use client"

import Script from "next/script"

import { PaperProvider } from "@/context/PaperContext"

import Customize from "@/components/Editor/Customize/Customize"
import Dashboard from "@/components/Editor/Dashboard"
import Header from "@/components/Editor/Header"
import Footer from "@/components/Editor/Footer"
import Sidebar from "@/components/Editor/Sidebar"
import OverlayPopUp from "@/components/Utils/OverlayPopUp"
import { useDispatch } from "react-redux"
import { useEffect } from "react"
import { setCanvasProperties } from "@/redux/features/canvasSlice"

const Editor = () => {

    const dispatch = useDispatch();
    
    useEffect(() => {
      const setInitialCanvasDimensions = () => {
          const clientWidth = window.innerWidth;
          const clientHeight = window.innerHeight;

          dispatch(setCanvasProperties({ clientWidth, clientHeight }));
          console.log("window size", clientWidth, clientHeight);
      };

      const handleDOMContentLoaded = () => {
          setInitialCanvasDimensions();
      };

      setInitialCanvasDimensions(); // Ensure dimensions are set on first render

      window.addEventListener("resize", setInitialCanvasDimensions);

      return () => {
          window.removeEventListener("resize", setInitialCanvasDimensions);
      };
  }, [dispatch]);

    return (
        <section>
            <Script src="https://d3js.org/d3.v7.min.js" strategy="lazyOnload" />
            <Script src="https://unpkg.com/opentype.js/dist/opentype.min.js" strategy="lazyOnload" />

            <PaperProvider>
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
            </PaperProvider>
        </section>
    )
}

export default Editor