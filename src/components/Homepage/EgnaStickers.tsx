import Image from "next/image"
import Link from "next/link"


const EgnaStickers = () => {
    return (
        <section className="container mx-auto lg:w-[60%] flex flex-col justify-center items-center gap-3 lg:gap-10 px-3 lg:pt-7 pb-10 lg:pb-14">
            <div className="flex flex-col gap-3 lg:gap-4 justify-center items-center text-center lg:text-left">
                <div className="w-auto h-auto">
                    <Image className="w-[70%] lg:w-full h-auto" src="/homepage/hang-loose.svg" alt="hang-loose" width={120} height={100} />
                </div>
                <h2 className="text-2xl lg:text-5xl leading-6 lg:leading-normal italic uppercase font-extrabold pt-3">Gör dina egna stickers</h2>
                <p>Skapa unika stickers, välj material, redigera i editorn och se direkt hur det kommer se ut.</p>
            </div>

            <div className="flex flex-col lg:flex-row py-5 px-3 gap-3">

                <div className="flex items-start gap-3">
                    <div className="w-auto h-auto">
                        <Image src="/homepage/one.svg" alt="one-icon" width={48} height={100} />
                    </div>
                    <div className="lg:space-y-2">
                        <h4 className="text-base lg:text-xl leading-6 lg:leading-normal font-bold uppercase">Välj format</h4>
                        <p>Lorem ipsum dolor sit amet consectetur. Aliquet cras montes vulputate velit consequat nulla lectus.</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="w-auto h-auto">
                        <Image src="/homepage/two.svg" alt="two-icon" width={48} height={100} />
                    </div>
                    <div className="lg:space-y-2">
                        <h4 className="text-base lg:text-xl leading-6 lg:leading-normal font-bold uppercase">Ladda upp design</h4>
                        <p>Lorem ipsum dolor sit amet consectetur. Aliquet cras montes vulputate velit consequat nulla lectus.</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="w-auto h-auto">
                        <Image src="/homepage/three.svg" alt="three-icon" width={48} height={100} />
                    </div>
                    <div className="lg:space-y-2">
                        <h4 className="text-base lg:text-xl leading-6 lg:leading-normal font-bold uppercase">Beställ stickers</h4>
                        <p>Lorem ipsum dolor sit amet consectetur. Aliquet cras montes vulputate velit consequat nulla lectus.</p>
                    </div>
                </div>

            </div>

            <div className="lg:py-4">
                <Link href={"/editor"} className="bg-[#F15E59] hover:bg-[#F15E59]/90 text-white text-sm px-7 py-3 rounded shadow-md shadow-[#F15E59]/50 hover:shadow-[#F15E59]/70 transition-all duration-300">Börja designa nu</Link>
            </div>

        </section>
    )
}

export default EgnaStickers