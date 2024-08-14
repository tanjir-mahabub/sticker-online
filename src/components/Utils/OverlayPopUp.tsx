import AnimateIn from "@/lib/AnimateIn";
import { hidePopup } from "@/redux/features/popupSlice";
import { useAppSelector } from "@/redux/store";
import Image from "next/image"
import { useDispatch } from "react-redux";
import Loading from "./Loading";

const OverlayPopUp = () => {
    const { isVisible, content } = useAppSelector((state) => state.popup);

    const dispatch = useDispatch();

    if (!isVisible || !content) return null;

    return (
        <div className='fixed left-0 right-0 w-full h-full flex justify-center items-center bg-black/80 z-[200] overflow-hidden px-3'>
            <AnimateIn
                className="flex justify-center items-center w-full"
                from="opacity-0 translate-y-4"
                to="opacity-100 translate-y-0 translate-x-0"
                duration={500}
            >
                <div className='flex flex-col gap-5 lg:gap-7 lg:w-[500px] h-auto bg-white p-5 lg:p-7 rounded-lg'>
                    <div className="flex justify-between items-center">
                        <h2 className="text-sm lg:text-lg font-bold">{content.title}</h2>
                        <div onClick={() => dispatch(hidePopup())} className="cursor-pointer">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 18L18 2" stroke="#121212" strokeWidth="3" />
                                <path d="M2 2L18 18" stroke="#121212" strokeWidth="3" />
                            </svg>

                        </div>
                    </div>
                 
                    <div>
                        {content.imgSrc ? (
                            <Image
                            className='w-full object-contain'
                            src={content.imgSrc}
                            width={400}
                            height={400}
                            alt={content.title}
                            loading="lazy" 
                        />
                        ): (
                            <Loading />
                        )}
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