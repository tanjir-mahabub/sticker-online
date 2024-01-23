import Image from "next/image"

import VictoryIcon from "@/public/homepage/hero/victory.svg"
import ThumbsIcon from "@/public/homepage/hero/thumbs.svg"
import ToungIcon from "@/public/homepage/hero/toung.svg"
import WatermelonIcon from "@/public/homepage/hero/watermelon.svg"
import StarIcon from "@/public/homepage/hero/stars.svg"

import CutIcon from "@/public/homepage/hero/cut.svg"
import CircleIcon from "@/public/homepage/hero/circle.svg"
import SquareIcon from "@/public/homepage/hero/square.svg"
import SquareTwoIcon from "@/public/homepage/hero/square-2.svg"

const Hero = () => {
    return (
        <section className="relative flex w-full min-h-[90vh] justify-center items-center overflow-hidden">
            <div className="absolute top-5 -left-20">
                <Image src={VictoryIcon} alt="logo" width={240} />
            </div>
            <div className="absolute top-20 right-80">
                <Image src={ThumbsIcon} alt="logo" width={120} />
            </div>

            <div className="relative w-[500px] flex flex-col justify-center items-center text-[#121212]">
                <div className="absolute -top-20 -right-10">
                    <Image src={StarIcon} alt="logo" width={75} />
                </div>
                <h1 className="font-extrabold text-5xl uppercase italic leading-tight text-center">Skapa dina egna klistermärken</h1>
                <p className="text-sm">Du designar, vi trycker och skickar dina stickers på nolltid.</p>

                <div className="py-20 flex gap-7">
                    <div className="flex flex-col justify-around items-center border-2 border-[#121212]/50 border-dashed rounded w-40 h-40 px-1">
                        <div className="flex items-center h-[60%]">
                            <Image src={CutIcon} alt="logo" width={120} />
                        </div>
                        <span className="font-bold">Die cut stickers</span>
                    </div>
                    <div className="flex flex-col justify-around items-center border-2 border-[#121212]/50 border-dashed rounded w-40 h-40 px-1">
                        <div className="flex items-center h-[60%]">
                            <Image src={SquareIcon} alt="logo" width={100} />
                        </div>
                        <span className="font-bold">Fyrkantiga</span>
                    </div>
                    <div className="flex flex-col justify-around items-center border-2 border-[#121212]/50 border-dashed rounded w-40 h-40 px-1">
                        <div className="flex items-center h-[60%]">
                            <Image src={CircleIcon} alt="logo" width={100} />
                        </div>
                        <span className="font-bold">Runda</span>
                    </div>
                    <div className="flex flex-col justify-around items-center border-2 border-[#121212]/50 border-dashed rounded w-40 h-40 px-1">
                        <div className="flex items-center h-[60%]">
                            <Image src={SquareTwoIcon} alt="logo" width={90} />
                        </div>
                        <span className="font-bold">Runda hörn</span>
                    </div>
                </div>
                <div>
                    <button type="button" className="bg-[#F98332] hover:bg-[#F98332]/90 text-white text-sm px-7 py-3 rounded shadow-md shadow-[#F98332]/50 hover:shadow-[#F98332]/70 transition-all duration-300">Börja designa</button>
                </div>
            </div>

            <div className="absolute bottom-32 left-40">
                <Image src={ToungIcon} alt="logo" width={200} />
            </div>
            <div className="absolute bottom-10 -right-20">
                <Image src={WatermelonIcon} alt="logo" width={385} />
            </div>
        </section>
    )
}

export default Hero