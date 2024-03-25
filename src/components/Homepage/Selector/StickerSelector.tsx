"use client"
import Image from "next/image";
import selectorStyles from "./stickerSelector.module.css";
import { useEffect, useState } from "react";
import { StickerSelectorStore } from "@/store/stickerSelectorStore";
import { selectedSticker } from "@/redux/features/stickerSlice";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { StickerState } from "@/types/types";

const StickerSelector = () => {

    const stickerDispatch = useDispatch<AppDispatch>();

    const StickerSelected = useAppSelector(state => state.sticker);

    const [selected, setSelected] = useState<StickerState>(StickerSelected);

    useEffect(() => {

        setSelected(StickerSelected)

    }, [StickerSelected]);


    return (
        <>
            {StickerSelectorStore.map((sticker) => (
                <div
                    key={sticker.id}
                    className={`${selectorStyles.stickerWrapper} ${selected.id === sticker.id && selectorStyles.selected
                        }`}
                    onClick={() => stickerDispatch(selectedSticker({ id: sticker.id }))}
                >
                    <div className="flex items-center justify-center w-full h-[60%]">
                        <Image
                            className={`w-full h-auto`}
                            src={sticker.img}
                            alt={sticker.altTxt}
                            width={sticker.width}
                            height={100}
                            priority
                            style={{
                                padding: `${sticker.padding}px`,
                            }}
                        />
                    </div>
                    <span className="font-bold">{sticker.title}</span>
                </div>
            ))}
        </>
    );
};

export default StickerSelector;
