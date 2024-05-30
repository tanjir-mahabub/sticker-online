import Form from "./lib/Form/Form";
import PriceCartBtn from "./Child/PriceCartBtn";
import SidebarNav from "./Nav/SidebarNav";

const Footer = () => {
   
    return (
        <>
        {/* Desktop version */}
        <footer className="hidden lg:flex h-fit items-center border-t px-3 xl:px-7">
            <div className="flex-auto pr-3 py-2.5 lg:py-7 border-r border-so-black/20 text-sm">
                <Form />
            </div>
            <div className="w-fit 4xl:w-[20%] flex h-full gap-1.5 xl:gap-6 justify-end items-center lg:py-7">
               <PriceCartBtn />
            </div>
        </footer>

        {/* Mobile version */}
        <footer className="flex lg:hidden flex-col lg:flex-auto w-full h-fit justify-center items-center border-t px-0 xl:px-7">
            <div className="flex flex-auto w-full py-2.5 lg:py-7 border-r border-so-black/20 text-xs">
                <Form />
            </div>
            <div className="w-full 4xl:w-[20%] flex h-fit gap-1.5 xl:gap-6 justify-end items-center py-5 text-xs">
                <SidebarNav />
            </div>
        </footer>
        </>
    )
}

export default Footer