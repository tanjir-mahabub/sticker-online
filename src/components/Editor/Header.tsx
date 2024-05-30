import { usePaper } from "@/context/PaperContext";
import { updateElementAttributes } from "@/redux/features/imagePreviewSlice";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch } from "react-redux";

const Header = () => {
    const { paper, elementActive, selectedItem, historyState, historyDispatch } = usePaper();
    const [isDisabledUndo, setDisabledUndo] = useState(false);
    const [isDisabledRedo, setDisabledRedo] = useState(false);

    const dispatch = useDispatch();   

    const applyHistoryState = useCallback((itemSelected:any) => {
        if (historyState && itemSelected) {
            const filteredHistory = historyState.objectHistories.find(history => history.id === itemSelected.id);
            const step = filteredHistory?.historyStep;
            const history = filteredHistory?.history;
            
            if (history && step !== undefined) {
                if (itemSelected) {
                    console.log('from header', history[step], history[step].rotate);
                    const elem = paper.getById(itemSelected.id)
                    if(elem) {
                        
                        console.log(elem);
                        const ft = elem.freeTransform;
                        // ft.unplug()
                        console.log(ft);                                                                                                                                          
                    
                        ft.attrs.x = history[step]?.x
                        ft.attrs.y = history[step]?.y
                        ft.attrs.translate = history[step]?.translate
                        ft.attrs.center = history[step]?.center
                        
                        ft.attrs.rotate =history[step].rotate
                        ft.attrs.scale.x =history[step]?.scaleX
                        ft.attrs.scale.y =history[step]?.scaleY  
                                         ft.updateHandles()
                                         ft.apply()
                        // elem.freeTransform.attrs = {...history[step]}
                    }
                }
            } else {
                console.log('empty reached');
            }
        }
    }, [historyState, paper]);
   

    const handleUndo = useCallback(() => {
        if (selectedItem) {
            historyDispatch({ type: "undo", payload: selectedItem.id });
            // applyHistoryState(selectedItem)
        }
    }, [selectedItem, historyDispatch]);

    const handleRedo = useCallback(() => {
        if (selectedItem) {
            historyDispatch({ type: "redo", payload: selectedItem.id });
            // applyHistoryState(selectedItem)
        }
    }, [selectedItem, historyDispatch]);

    const canUndo = useMemo(() => {
        return historyState.objectHistories?.some((objectHistory) => objectHistory.historyStep > 0);
    }, [historyState.objectHistories]);

    const canRedo = useMemo(() => {
        return historyState.objectHistories?.some((objectHistory) => objectHistory.historyStep < objectHistory.history.length - 1);
    }, [historyState.objectHistories]);

    useEffect(() => {
        setDisabledUndo(!canUndo);
    }, [canUndo]);

    useEffect(() => {
        setDisabledRedo(!canRedo);
    }, [canRedo]);

    useEffect(() => {
        if (selectedItem) {
            applyHistoryState(selectedItem);
        }
    }, [selectedItem, applyHistoryState]);

    return (
        <>
            <header className="flex items-center border-b border-black/10 shadow-sm px-3 py-3">
                <div className="flex w-40">
                    <Link href={"/"}>
                        <div className="w-full h-auto">
                            <Image className="w-full h-auto" src="/logo.png" alt="logo" width={130} height={100} />
                        </div>
                    </Link>
                </div>

                <div className="flex-auto flex justify-center items-center gap-2">
                    <div
                        onClick={handleUndo}
                        className={`group flex flex-col justify-center items-center gap-2 p-2 rounded-md cursor-pointer select-none ${isDisabledUndo ? 'opacity-30 pointer-events-none' : ''}`}
                    >
                        <Image
                            src="/editor/icon/undo.svg"
                            alt="undo-icon"
                            width={18}
                            height={100}
                            className={`w-auto h-auto group-hover:filter group-hover:contrast-0 ${isDisabledUndo ? 'filter-contrast-0' : ''}`}
                        />
                        <span className={`text-xs ${isDisabledUndo ? 'text-gray-500' : 'group-hover:text-so-black'}`}>Undo</span>
                    </div>
                    <div
                        onClick={handleRedo}
                        className={`group flex flex-col justify-center items-center gap-2 p-2 rounded-md cursor-pointer select-none ${isDisabledRedo ? 'opacity-30 pointer-events-none' : ''}`}
                    >
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

            {/* Debugging window */}
            <div className="absolute h-[700px] overflow-auto right-0 z-[150]">
                <pre>{JSON.stringify(historyState.objectHistories, null, 2)}</pre>
            </div>
        </>
    );
};

export default Header;
