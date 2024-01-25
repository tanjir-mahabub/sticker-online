import Image from "next/image"

const GuideSection = () => {
    return (
        <section className="my-20">
            <div className="relative">

                <Image src="/homepage/waterdrop.svg" alt="waterdrop" width={60} height={100} className="absolute -top-[18px] -right-[18px] z-20" />

                <div className="overflow-hidden rounded-lg relative">
                    <Image src="/homepage/guide.png" alt="guide" width={750} height={100} className="rounded-lg" />

                    <div className="absolute top-0 left-0 z-10 bg-gradient-to-b to-so-black/80 from-white/10 w-full h-full"></div>
                    <div className="absolute bottom-0 left-0 z-20 p-7">
                        <span className="text-white text-xs uppercase">Guide</span>
                        <h5 className="text-white text-2xl font-extrabold uppercase italic max-w-[350px] pt-1">Att tänka på när man beställer stickers</h5>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default GuideSection