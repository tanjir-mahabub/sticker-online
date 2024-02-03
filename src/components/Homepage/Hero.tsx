import Link from "next/link"
import Image from "next/image"
import StickerSelector from "./Selector/StickerSelector"

const Hero = () => {
    return (
        <section className="relative flex w-full min-h-[90vh] justify-center items-center overflow-hidden py-28">
            <div className="absolute top-5 -left-20">
                <Image src="/homepage/hero/victory.svg" alt="victory-icon" width={240} height={100} />
            </div>
            <div className="absolute top-20 right-[15%]">
                <Image src="/homepage/hero/thumbs.svg" alt="thumbs-icon" width={120} height={100} />
            </div>

            <div className="relative w-[500px] flex flex-col justify-center items-center text-so-black">
                <div className="absolute -top-20 -right-10">
                    <Image src="/homepage/hero/stars.svg" alt="star-icon" width={75} height={100} />
                </div>
                <h1 className="font-extrabold text-5xl uppercase italic leading-tight text-center">Skapa dina egna klistermärken</h1>
                <p className="text-sm">Du designar, vi trycker och skickar dina stickers på nolltid.</p>

                <div className="py-20 flex gap-7">
                    <StickerSelector />
                </div>
                <div>
                    <Link href={"/editor"} className="bg-so-orange hover:bg-so-orange/90 text-white text-sm px-7 py-3 rounded shadow-md shadow-so-orange/50 hover:shadow-so-orange/70 transition-all duration-300">Börja designa</Link>
                </div>
            </div>

            <div className="absolute bottom-[10%] left-[7%]">
                <Image src="/homepage/hero/toung.svg" alt="toung-icon" width={200} height={100} />
            </div>
            <div className="absolute bottom-[2%] -right-20">
                <Image src="/homepage/hero/watermelon.svg" alt="watermelon-icon" width={385} height={100} />
            </div>
        </section>
    )
}

export default Hero