import { usePaper } from "@/context/PaperContext";
import { useAppSelector } from "@/redux/store";
import Image from "next/image";
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch } from "react-redux";

const UndoRedo = () => {
    const canvasProperties = useAppSelector(state => state.canvas);
    const { clientWidth, clientHeight } = canvasProperties;

    const { paper, elementActive, selectedItem, historyState, historyDispatch } = usePaper();
    const [isDisabledUndo, setDisabledUndo] = useState(false);
    const [isDisabledRedo, setDisabledRedo] = useState(false);

    const [responsiveTasks, setResponsiveTasks] = useState({
        color: "#121212"
    })

    const dispatch = useDispatch();

    const applyHistoryState = useCallback((itemSelected: any) => {
        if (historyState && itemSelected) {
            const filteredHistory = historyState.objectHistories.find(history => history.id === itemSelected.id);
            const step = filteredHistory?.historyStep;
            const history = filteredHistory?.history;

            if (history && step !== undefined) {
                if (itemSelected) {
                    console.log('from header', history[step], history[step].rotate);
                    const elem = paper.getById(itemSelected.id)
                    if (elem) {

                        // console.log(elem);
                        const ft = elem.freeTransform;
                        // ft.unplug()
                        // console.log(ft);                                                                                                                                          

                        ft.attrs.x = history[step]?.x
                        ft.attrs.y = history[step]?.y
                        ft.attrs.translate = history[step]?.translate
                        ft.attrs.center = history[step]?.center

                        ft.attrs.rotate = history[step].rotate
                        ft.attrs.scale.x = history[step]?.scaleX
                        ft.attrs.scale.y = history[step]?.scaleY
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

    useEffect(() => {
        if(clientWidth) {
            if(clientWidth >= 1024) {
                setResponsiveTasks({
                    color: "#121212",
                })
                console.log('clientWidth', clientWidth);
            } else {
                setResponsiveTasks({
                    color: "white",
                })
                console.log('clientWidth', clientWidth);
            }
        }
    }, [setResponsiveTasks, clientWidth])

    return (
        <>
            <div
                onClick={handleUndo}
                className={`group flex flex-col justify-center items-center gap-2 p-2 rounded-md cursor-pointer select-none ${isDisabledUndo ? 'opacity-80 lg:opacity-30 pointer-events-none' : ''}`}
            >
                <svg width="22" height="10" viewBox="0 0 22 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.86365 2.4989V8.4989H7.86365" stroke={responsiveTasks.color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M21.3536 7.49885C20.8465 6.06564 19.9845 4.78426 18.8482 3.77427C17.7118 2.76429 16.3382 2.05862 14.8554 1.72311C13.3725 1.38761 11.8289 1.4332 10.3685 1.85563C8.90802 2.27806 7.57839 3.06357 6.50365 4.13885L1.86365 8.49885" stroke={responsiveTasks.color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                {/* <Image
                    src="/editor/icon/undo.svg"
                    alt="undo-icon"
                    width={18}
                    height={100}
                    className={`w-auto h-auto group-hover:filter group-hover:contrast-0 ${isDisabledUndo ? 'filter-contrast-100 lg:filter-contrast-0' : ''}`}
                /> */}
                <span className={`text-xxs lg:text-xs text-white lg:text-so-black ${isDisabledUndo ? 'text-white lg:text-gray-500' : 'group-hover:text-white lg:group-hover:text-so-black'}`}>Undo</span>
            </div>
            <div
                onClick={handleRedo}
                className={`group flex flex-col justify-center items-center gap-2 p-2 rounded-md cursor-pointer select-none ${isDisabledRedo ? 'opacity-80 lg:opacity-30 pointer-events-none' : ''}`}
            >
                <svg width="22" height="10" viewBox="0 0 22 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.8538 2.4989V8.4989H14.8538" stroke={responsiveTasks.color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M1.36353 7.49885C1.87069 6.06564 2.73266 4.78426 3.86899 3.77427C5.00533 2.76429 6.37899 2.05862 7.86181 1.72311C9.34463 1.38761 10.8883 1.4332 12.3487 1.85563C13.8092 2.27806 15.1388 3.06357 16.2135 4.13885L20.8535 8.49885" stroke={responsiveTasks.color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

                {/* <Image
                    src="/editor/icon/redo.svg"
                    alt="redo-icon"
                    width={18}
                    height={100}
                    className={`w-auto h-auto group-hover:filter group-hover:contrast-0 ${isDisabledRedo ? 'filter-contrast-100 lg:filter-contrast-0' : ''}`}
                /> */}
                <span className={`text-xxs lg:text-xs text-white lg:text-so-black ${isDisabledRedo ? 'text-white lg:text-gray-500' : 'group-hover:text-white lg:group-hover:text-so-black'}`}>Redo</span>
            </div>
        </>
    )
}

export default UndoRedo