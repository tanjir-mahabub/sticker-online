import Image from "next/image";
import Link from "next/link";
import UndoRedo from "./Child/UndoRedo";
import PriceCartBtn from "./Child/PriceCartBtn";

const Header = () => {    

    return (
        <>
            {/* Desktop version */}
            <header className="hidden lg:flex items-center border-b border-black/10 shadow-sm px-3 py-3">
                <div className="flex w-40">
                    <Link href={"/"}>
                        <div className="w-full h-auto">
                            <Image className="w-full h-auto" src="/logo.png" alt="logo" width={130} height={100} />
                        </div>
                    </Link>
                </div>

                <div className="flex-auto flex justify-center items-center gap-2">
                    <UndoRedo />
                </div>
            </header>

            {/* Mobile version */}
            <header className="flex lg:hidden items-center bg-black border-b border-black/10 shadow-sm px-1.5 sm:px-3 py-1 lg:py-3">               

                <div className="flex-auto flex justify-between items-center gap-2">
                    <div className="flex justify-center items-center">
                    <UndoRedo />
                    </div>

                    <div className="flex justify-center items-center gap-2">
                    <PriceCartBtn />
                    </div>
                    
                </div>
            </header>

            {/* Debugging window */}
            {/* <div className="absolute h-[700px] overflow-auto right-0 z-[150]">
                <pre>{JSON.stringify(historyState.objectHistories, null, 2)}</pre>
            </div> */}
        </>
    );
};

export default Header;
