import Image from "next/image"
import Link from "next/link"
import { useState } from 'react';

const Header = () => {
    const [isDisabledUndo, setDisabledUndo] = useState(false);
    const [isDisabledRedo, setDisabledRedo] = useState(true);

    return (
        <header className="flex items-center border-b-2 border-black/10 shadow-sm px-3 py-3">
            <div className="flex w-40">
                <Link href={"/"}>
                    <Image src="/logo.svg" alt="logo" width={130} height={100} />
                </Link>
            </div>

            <div className="flex-auto flex justify-center items-center gap-2">
                <div className={`group flex flex-col justify-center items-center gap-2 p-2 rounded-md ${isDisabledUndo ? 'opacity-50 pointer-events-none' : ''}`}>
                    <Image
                        src="/editor/icon/undo.svg"
                        alt="undo-icon"
                        width={18}
                        height={100}
                        className={`group-hover:filter group-hover:contrast-0 ${isDisabledUndo ? 'filter-contrast-0' : ''}`}
                    />
                    <span className={`text-xs ${isDisabledUndo ? 'text-gray-500' : 'group-hover:text-so-black'}`}>Undo</span>
                </div>
                <div className={`group flex flex-col justify-center items-center gap-2 p-2 rounded-md ${isDisabledRedo ? 'opacity-50 pointer-events-none' : ''}`}>
                    <Image
                        src="/editor/icon/redo.svg"
                        alt="redo-icon"
                        width={18}
                        height={100}
                        className={`group-hover:filter group-hover:contrast-0 ${isDisabledRedo ? 'filter-contrast-0' : ''}`}
                    />
                    <span className={`text-xs ${isDisabledRedo ? 'text-gray-500' : 'group-hover:text-so-black'}`}>Redo</span>
                </div>
            </div>
        </header>
    )
}

export default Header