import Link from "next/link"
import Image from "next/image"
import StickerSelector from "./Selector/StickerSelector"

const Hero = () => {
    return (
        <section className="relative flex w-full xl:min-h-[90vh] justify-center items-center overflow-hidden py-24 lg:py-28">
            <div className="absolute top-5 -left-5 xl:-left-20">
                <Image className="w-[50px] xs:w-[80px] lg:w-[30%] xl:w-[80%] 3xl:w-full h-auto" src="/homepage/hero/victory.svg" alt="victory-icon" width={240} height={100} />
            </div>
            <div className="absolute top-5 xl:top-20 right-0 sm:right-5 xl:right-28 3xl:right-[15%]">
                <Image className="w-[50px] xs:w-[60px] sm:w-[50%] xl:w-full h-auto" src="/homepage/hero/thumbs.svg" alt="thumbs-icon" width={120} height={100} />
            </div>

            <div className="relative w-[500px] flex flex-col justify-center items-center text-so-black">
                <div className="absolute -top-10 xl:-top-20 right-20 xs:right-28 sm:right-32 xl:-right-10">
                    <Image className="w-[40px] sm:w-[50px] xl:w-full h-auto" src="/homepage/hero/stars.svg" alt="star-icon" width={75} height={100} />
                </div>
                <div className="flex flex-col items-center justify-center gap-3">
                <h1 className="font-extrabold w-[200px] xl:w-full text-3xl xl:text-5xl uppercase italic leading-tight text-center">Skapa dina egna klistermärken</h1>
                <p className="text-sm flex max-w-[200px] xl:max-w-full text-center">Du designar, vi trycker och skickar dina stickers på nolltid.</p>

                </div>
                <div className="py-10 xl:py-20 grid grid-cols-2 lg:flex gap-3 sm:gap-7 px-3 text-xs xl:text-sm">
                    <StickerSelector />
                </div>
                <div>
                    <Link href={"/editor"} className="bg-so-orange hover:bg-so-orange/90 text-white text-sm px-7 py-3 rounded shadow-md shadow-so-orange/50 hover:shadow-so-orange/70 transition-all duration-300">Börja designa</Link>
                </div>
            </div>

            <div className="absolute bottom-[10%] left-5 xl:left-[7%]">
                <Image className="w-[60px] lg:w-[40%] xl:w-[80%] 3xl:w-full h-auto" src="/homepage/hero/toung.svg" alt="toung-icon" width={200} height={100} />
            </div>
            <div className="absolute bottom-[3%] right-0 lg:-right-80 xl:-right-36 3xl:-right-0">
                <Image className="w-[100px] lg:w-[30%] xl:w-[60%] 3xl:w-full h-auto" src="/homepage/hero/watermelon.svg" alt="watermelon-icon" width={385} height={100} />
            </div>
        </section>
    )
}

export default Hero