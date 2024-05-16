import { redo, undo } from "@/redux/features/historySlice";
import { RootState, useAppSelector } from "@/redux/store";
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";

const Header = () => {
    const [isDisabledUndo, setDisabledUndo] = useState(false);
    const [isDisabledRedo, setDisabledRedo] = useState(false);

    const dispatch = useDispatch();
    const objectHistories = useAppSelector((state: RootState) => state.history.objectHistories);

    const handleUndo = () => {
        objectHistories?.forEach((objectHistory) => {
            dispatch(undo(objectHistory.objectId));
        });
    };

    const handleRedo = () => {
        objectHistories?.forEach((objectHistory) => {
            dispatch(redo(objectHistory.objectId));
        });
    };


    useEffect(() => {

        if (objectHistories) {

            const canUndo = objectHistories?.some((objectHistory) => objectHistory.historyStep > 0);
            setDisabledUndo(!canUndo);


            const canRedo = objectHistories?.some((objectHistory) => objectHistory.historyStep < objectHistory.history.length - 1);
            setDisabledRedo(!canRedo);
        }
    }, [objectHistories]);

    return (
        <header className="flex items-center border-b border-black/10 shadow-sm px-3 py-3">
            <div className="flex w-40">
                <Link href={"/"}>
                    <div className="w-full h-auto">
                        <Image className="w-full h-auto" src="/logo.png" alt="logo" width={130} height={100} />
                    </div>
                </Link>
            </div>

            <div className="flex-auto flex justify-center items-center gap-2">
                <div onClick={handleUndo} className={`group flex flex-col justify-center items-center gap-2 p-2 rounded-md cursor-pointer select-none ${isDisabledUndo ? 'opacity-30 pointer-events-none' : ''}`}>
                    <Image
                        src="/editor/icon/undo.svg"
                        alt="undo-icon"
                        width={18}
                        height={100}
                        className={`w-auto h-auto group-hover:filter group-hover:contrast-0 ${isDisabledUndo ? 'filter-contrast-0' : ''}`}
                    />
                    <span className={`text-xs ${isDisabledUndo ? 'text-gray-500' : 'group-hover:text-so-black'}`}>Undo</span>
                </div>
                <div onClick={handleRedo} className={`group flex flex-col justify-center items-center gap-2 p-2 rounded-md cursor-pointer select-none ${isDisabledRedo ? 'opacity-30 pointer-events-none' : ''}`}>
                    <Image
                        src="/editor/icon/redo.svg"
                        alt="redo-icon"
                        width={18}
                        height={100}
                        className={`w-auto h-auto group-hover:filter group-hover:contrast-0 ${isDisabledRedo ? 'filter-contrast-0' : ''}`}
                    />
                    <span className={`text-xs ${isDisabledRedo ? 'text-gray-500' : 'group-hover:text-so-black'}`}>Redo</span>
                </div>
            </div>
        </header>
    )
}

export default Header
