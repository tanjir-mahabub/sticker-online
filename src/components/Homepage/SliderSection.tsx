"use client"
import Image from "next/image"

import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'

const SliderSection = () => {
    const [ref] = useKeenSlider<HTMLDivElement>({
        loop: true,
        mode: "free",
        slides: { origin: "center", perView: 4.5, spacing: 5 },
    })

    return (
        <>
            <section className="my-5 w-full">
                <div ref={ref} className="keen-slider">
                    <div className="keen-slider__slide py-10">
                        <Image src="/homepage/slider/1.png" alt="1" width={380} height={100} className="object-cover rounded-lg drop-shadow-lg" />
                    </div>
                    <div className="keen-slider__slide py-10">
                        <Image src="/homepage/slider/2.png" alt="2" width={380} height={100} className="object-cover rounded-lg drop-shadow-lg" />
                    </div>
                    <div className="keen-slider__slide py-10">
                        <Image src="/homepage/slider/3.png" alt="3" width={380} height={100} className="object-cover rounded-lg drop-shadow-lg" />
                    </div>
                    <div className="keen-slider__slide py-10">
                        <Image src="/homepage/slider/4.png" alt="4" width={380} height={100} className="object-cover rounded-lg drop-shadow-lg" />
                    </div>
                    <div className="keen-slider__slide py-10">
                        <Image src="/homepage/slider/5.png" alt="5" width={380} height={100} className="object-cover rounded-lg drop-shadow-lg" />
                    </div>
                </div>
            </section>
        </>
    )
}

export default SliderSection