import Image from "next/image";
import Link from "next/link";
import UndoRedo from "./Child/UndoRedo";
import PriceCartBtn from "./Child/PriceCartBtn";
import { Tooltip } from "../Utils/ToolTips";
import { useRouter } from "next/navigation";
import { useEditorI18n } from "@/context/EditorI18nContext";

const Header = () => {
    const router = useRouter();    
    const { language, setLanguage } = useEditorI18n();

    const handleExitClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        if (window.confirm("Are you sure you want to exit?")) {
            router.push("/");
        }
    };


    return (
        <>
            {/* Desktop version */}
            <header className="editor-header hidden lg:flex items-center px-5 py-3">
                <div className="editor-wordmark flex w-40">
                    <Link href={"/"}>
                        <div className="w-full h-auto">
                            <Image className="w-full h-auto" src="/logo.png" alt="logo" width={130} height={100} />
                        </div>
                    </Link>
                </div>

                <div className="editor-history flex-auto flex justify-center items-center gap-2">
                    <UndoRedo />
                </div>
                <div className="editor-language" aria-label="Language"><button className={language==="en"?"is-active":""} onClick={()=>setLanguage("en")}>EN</button><button className={language==="sv"?"is-active":""} onClick={()=>setLanguage("sv")}>SV</button></div>
            </header>

            {/* Mobile version */}
            <header className="editor-header-mobile flex lg:hidden items-center px-2 sm:px-3 py-2">

                <div className="flex-auto flex justify-between items-center gap-2">

                    <div className="flex justify-center items-center gap-2">
                        <div className="w-full h-auto" onClick={handleExitClick}>
                            <Tooltip message={"Exit"}>
                                <Image className="w-full h-auto" src="/editor/icon/return.svg" alt="logo" width={100} height={100} />
                            </Tooltip>
                        </div>

                        <UndoRedo />
                    </div>

                    <div className="flex justify-center items-center gap-2">
                        <PriceCartBtn />
                    </div>

                </div>
            </header>

            {/* Debugging window */}
            {/* <div className="absolute h-[700px] overflow-auto right-0 z-[150]">
                <pre>{JSON.stringify(ftEndData, null, 2)}</pre>
            </div> */}
        </>
    );
};

export default Header;
