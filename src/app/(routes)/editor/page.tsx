"use client"

import Customize from "@/components/Editor/Customize/Customize"
import Dashboard from "@/components/Editor/Dashboard"
import Header from "@/components/Editor/Header"
import Footer from "@/components/Editor/Footer"
import Sidebar from "@/components/Editor/Sidebar"
import { useStickerContext } from "@/context/StickerContext"

const Editor = () => {
    const { selectedSticker, setSticker } = useStickerContext();

    console.log(selectedSticker);

    return (
        <section>
            <div className="h-auto">
                <Header />
            </div>
            <div className="flex divide-x h-[78vh]">
                <Sidebar />
                <Customize />
                <Dashboard />
            </div>
            <div className="h-auto">
                <Footer />
            </div>
        </section>
    )
}

export default Editor