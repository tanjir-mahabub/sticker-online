import Image from "next/image"
// import Link from "next/link"

const Header = () => {
    return (
        <section className="w-full">
            <header className="flex w-full justify-center items-center gap-5 border-b py-3 lg:py-5 text-so-black font-extrabold">
                {/* <div className="flex-auto flex justify-end gap-10">
                    <Link href={"/die-cut-stickers"}>Die Cut Stickers</Link>
                    <Link href={"/runda-stickers"}>Runda stickers</Link>
                </div> */}
                <div className="w-[25%] flex justify-center">
                    <Image className="w-auto h-auto" src="/logo.png" alt="logo" width={150} height={100} />
                </div>
                {/* <div className="flex-auto flex justify-start gap-10">
                    <Link href={"/die-cut-stickers"}>Die Cut Stickers</Link>
                    <Link href={"/runda-stickers"}>Runda stickers</Link>
                </div> */}
            </header>
            <div className="bg-so-black text-white flex w-full justify-center items-center gap-3 lg:gap-10 h-10 text-xxs sm:text-sm drop-shadow-lg">
                <div className="flex gap-2 justify-center items-center">
                    <Image src="/homepage/truck.svg" alt="truck-icon" width={18} height={18} />
                    <span>Leverans  2-3 dagar</span>
                </div>
                <div className="flex gap-2 justify-center items-center">
                    <Image src="/homepage/package.svg" alt="package-icon" width={18} height={18} />
                    <span>Frakt endast 39 kr</span>
                </div>
                <div className="flex gap-2 justify-center items-center">
                    <Image src="/homepage/smile.svg" alt="smile-icon" width={18} height={18} />
                    <span>Egen design</span>
                </div>
            </div>
        </section>
    )
}

export default Header