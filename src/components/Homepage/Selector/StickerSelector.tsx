"use client"
import Image from "next/image";
import selectorStyles from "./stickerSelector.module.css";
import { useEffect, useState } from "react";
import { useStickerContext } from "@/context/StickerContext";
import { StickerSelectorStore } from "@/store/stickerSelectorStore";

const StickerSelector = () => {
    const { selectedSticker, setSticker } = useStickerContext();

    const [selected, setSelected] = useState<number>(1);

    useEffect(() => {
        const sticker = StickerSelectorStore.find(sticker => sticker.id === selected);

        sticker && setSticker(sticker.title, sticker.price);
    }, [selected]);

    console.log(selectedSticker);
    return (
        <>
            {StickerSelectorStore.map((sticker) => (
                <div
                    key={sticker.id}
                    className={`${selectorStyles.stickerWrapper} ${selected === sticker.id && selectorStyles.selected
                        }`}
                    onClick={() => setSelected(sticker.id)}
                >
                    <div className="flex items-center h-[60%]">
                        <Image
                            src={sticker.img}
                            alt={sticker.altTxt}
                            width={sticker.width}
                            height={100}
                        />
                    </div>
                    <span className="font-bold">{sticker.title}</span>
                </div>
            ))}
        </>
    );
};

export default StickerSelector;
