import AnimateIn from "@/lib/AnimateIn";
import { hidePopup } from "@/redux/features/popupSlice";
import { useAppSelector } from "@/redux/store";
import Image from "next/image"
import { useDispatch } from "react-redux";

const OverlayPopUp = () => {
    const { isVisible, content } = useAppSelector((state) => state.popup);

    const dispatch = useDispatch();

    if (!isVisible || !content) return null;

    return (
        <div className='absolute left-0 right-0 w-full h-full flex justify-center items-center bg-black/70 z-[200]'>
            <AnimateIn
                from="opacity-0 translate-y-4"
                to="opacity-100 translate-y-0 translate-x-0"
                duration={1000}
            >
                <div className='flex flex-col gap-5 lg:gap-7 w-[500px] h-auto bg-white p-5 lg:p-7 rounded-lg'>
                    <div className="flex justify-between items-center">
                        <h2 className="text-sm lg:text-lg font-bold">{content.title}</h2>
                        <div onClick={() => dispatch(hidePopup())} className="">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 18L18 2" stroke="#121212" strokeWidth="3" />
                                <path d="M2 2L18 18" stroke="#121212" strokeWidth="3" />
                            </svg>

                        </div>
                    </div>
                    <div>
                        <Image className='w-full object-contain' src={content.imgSrc} width={400} height={400} alt={content.title} />
                    </div>

                    <div>
                        <p className="text-sm font-regular">{content.content}</p>
                    </div>
                </div>
            </AnimateIn>
        </div>
    )
}

export default OverlayPopUp