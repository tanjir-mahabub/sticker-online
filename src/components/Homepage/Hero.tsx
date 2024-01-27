import Link from "next/link"
import Image from "next/image"

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
                    <div className="flex flex-col justify-around items-center bg-white border border-white drop-shadow-2xl rounded w-40 h-40 px-1">
                        <div className="flex items-center h-[60%]">
                            <Image src="/homepage/hero/cut.svg" alt="cut-icon" width={120} height={100} />
                        </div>
                        <span className="font-bold">Die cut stickers</span>
                    </div>
                    <div className="flex flex-col justify-around items-center border-2 border-so-black/50 border-dashed rounded w-40 h-40 px-1">
                        <div className="flex items-center h-[60%]">
                            <Image src="/homepage/hero/square.svg" alt="square-icon" width={100} height={100} />
                        </div>
                        <span className="font-bold">Fyrkantiga</span>
                    </div>
                    <div className="flex flex-col justify-around items-center border-2 border-so-black/50 border-dashed rounded w-40 h-40 px-1">
                        <div className="flex items-center h-[60%]">
                            <Image src="/homepage/hero/circle.svg" alt="circle-icon" width={100} height={100} />
                        </div>
                        <span className="font-bold">Runda</span>
                    </div>
                    <div className="flex flex-col justify-around items-center border-2 border-so-black/50 border-dashed rounded w-40 h-40 px-1">
                        <div className="flex items-center h-[60%]">
                            <Image src="/homepage/hero/square-2.svg" alt="squareTwoIcon" width={90} height={100} />
                        </div>
                        <span className="font-bold">Runda hörn</span>
                    </div>
                </div>
                <div>
                    <Link href={"/editor"} className="bg-so-orange hover:bg-so-orange/90 text-white text-sm px-7 py-3 rounded shadow-md shadow-so-orange/50 hover:shadow-so-orange/70 transition-all duration-300">Börja designa</Link>
                </div>
            </div>

            <div className="absolute bottom-[7%] left-[7%]">
                <Image src="/homepage/hero/toung.svg" alt="toung-icon" width={200} height={100} />
            </div>
            <div className="absolute bottom-0 -right-20">
                <Image src="/homepage/hero/watermelon.svg" alt="watermelon-icon" width={385} height={100} />
            </div>
        </section>
    )
}

export default Hero