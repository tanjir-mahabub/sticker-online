import Image from "next/image"

const OverlayPopUp = () => {
    return (
        <div className='absolute left-0 right-0 w-full h-full flex justify-center items-center bg-black/70 z-[200]'>
            <div className='flex flex-col gap-5 lg:gap-7 w-[500px] h-auto bg-white p-5 lg:p-7 rounded-lg'>
                <div className="flex justify-between items-center">
                    <h2 className="text-sm lg:text-lg font-bold">Holografisk</h2>
                    <div className="">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 18L18 2" stroke="#121212" stroke-width="3" />
                            <path d="M2 2L18 18" stroke="#121212" stroke-width="3" />
                        </svg>

                    </div>
                </div>
                <div>
                    <Image className='w-full object-contain' src={"/Holo.png"} width={400} height={400} alt={'Holo'} />
                </div>

                <div>
                    <p className="text-sm font-regular">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Suscipit assumenda delectus hic officia iure necessitatibus excepturi laudantium, sunt eligendi, maiores velit tempora aliquam exercitationem a expedita odio facere modi sequi?</p>
                </div>
            </div>
        </div>
    )
}

export default OverlayPopUp