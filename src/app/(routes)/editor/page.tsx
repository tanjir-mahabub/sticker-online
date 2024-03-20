"use client"

import Customize from "@/components/Editor/Customize/Customize"
import Dashboard from "@/components/Editor/Dashboard"
import Header from "@/components/Editor/Header"
import Footer from "@/components/Editor/Footer"
import Sidebar from "@/components/Editor/Sidebar"
import { useImageStorage } from "@/hooks/useImageStorage"
import { useEffect } from "react"
import { useAppSelector } from "@/redux/store"
import { useDispatch } from "react-redux"
import { addImages } from "@/redux/features/imagePreviewSlice"
import { ImageInfo } from "@/types/types"
import Head from "next/head"
import Script from "next/script"
import OverlayPopUp from "@/components/Utils/OverlayPopUp"

const Editor = () => {
    const { data: previewImages, updateData: updatePreviewImages } = useImageStorage('imageStore');
    const imagePreviews = useAppSelector(state => state.imagePreview)
    const dispatch = useDispatch();

    useEffect(() => {
        // Only update local storage if imagePreviews.images is not empty.
        if (imagePreviews.images && imagePreviews.images.length > 0) {
            console.log("Updating previewImages with:", imagePreviews.images);
            updatePreviewImages(imagePreviews.images);
        } else {
            console.log("No images to update in localStorage.");
        }
    }, [imagePreviews, updatePreviewImages]);


    useEffect(() => {
        if (previewImages && previewImages.length > 0) {
            const imagesToDispatch: ImageInfo[] = previewImages.map(image => ({
                ...image,
                x: image?.x,
                y: image?.y,
                width: image?.width,
                height: image?.height,
                scaleX: image?.scaleX,
                scaleY: image?.scaleY
            }));
            dispatch(addImages(imagesToDispatch));
        }
    }, [dispatch, previewImages]);

    return (
        <section>
            <Script src="https://d3js.org/d3.v7.min.js" strategy="lazyOnload" />
            <Script src="https://unpkg.com/opentype.js/dist/opentype.min.js" strategy="lazyOnload" />

            <div className="grid">
                <div className="h-auto">
                    <Header />
                </div>
                <div className="flex overflow-hidden divide-x h-[78vh]">
                    <Sidebar />
                    <Customize />
                    <Dashboard />
                </div>
                <div className="h-auto">
                    <Footer />
                </div>

                <OverlayPopUp />
            </div>
        </section>
    )
}

export default Editor