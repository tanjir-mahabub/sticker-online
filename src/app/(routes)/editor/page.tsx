"use client"

import Script from "next/script"

import { PaperProvider } from "@/context/PaperContext"

import Customize from "@/components/Editor/Customize/Customize"
import Dashboard from "@/components/Editor/Dashboard"
import Header from "@/components/Editor/Header"
import Footer from "@/components/Editor/Footer"
import Sidebar from "@/components/Editor/Sidebar"
import OverlayPopUp from "@/components/Utils/OverlayPopUp"

const Editor = () => {

    return (
        <section>
            <Script src="https://d3js.org/d3.v7.min.js" strategy="lazyOnload" />
            <Script src="https://unpkg.com/opentype.js/dist/opentype.min.js" strategy="lazyOnload" />

            <PaperProvider>
                <div className="flex flex-col overflow-hidden w-full h-screen">
                    <div className="h-fit">
                        <Header />
                    </div>
                    <div className="flex overflow-hidden divide-x h-full">
                        <Sidebar />
                        <Customize />
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