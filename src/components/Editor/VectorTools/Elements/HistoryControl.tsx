import { defaultOptions, hideFreeTransform, showFreeTransform } from "@/components/Utils/vectorFunction";
import { usePaper } from "@/context/PaperContext";
import { useEffect, useCallback } from "react";

const HistoryControl = () => {    
    const { paper, elementActive, selectedItem,setSelectedItem, ftEndData, historyState, historyDispatch } = usePaper();

    const addToHistory = useCallback(() => {
        if (ftEndData) {
            console.log(ftEndData);
            historyDispatch({
                type: 'addedToHistory',
                payload: { 
                    id: ftEndData.id, 
                    category: ftEndData.category, 
                    position: ftEndData.position
                }
            });               
        }
    }, [ftEndData, historyDispatch]);

    // const logHistoryState = useCallback(() => {
    //     if (historyState && selectedItem) {
    //         const filteredHistory = historyState.objectHistories.find(history => history.id === selectedItem.id);
    //         const step = filteredHistory?.historyStep;
    //         const history = filteredHistory?.history;
    //         if (history && step !== undefined) {
    //             // console.log(step, history[step]);
    //             const { x, y, scaleX, scaleY, rotate } = history[step]; 
    //             if (selectedItem) {
    //                 const element = elementActive.find((el: any) => el.id === selectedItem.id)   
    //                 console.log(element.freeTransform.attrs);
    //                 console.log(element.freeTransform);
    //                console.log(step);

    //                 // ft && showFreeTransform(ft)
    //                 // ft && hideFreeTransform(ft)
                    
    //             //    if(scaleX && scaleY) element.scale(scaleX, scaleY)
    //                 // rotate ? element.rotate(rotate) : element.rotate(0)
    //             }
    //         }
    //     }
    // }, [historyState, selectedItem, elementActive, paper, setSelectedItem]);


    // useEffect(() => {
    //    selectedItem && elementActive && elementActive.forEach((el: any) => {
    //         if(el.id === selectedItem.id) {
    //             el.scale(0.5, 0.5)
    //             el.rotate(45)        
    //             console.log(el);        
    //         }
    //     })
    // })

    useEffect(() => {
        addToHistory();
    }, [addToHistory]);

    // useEffect(() => {
    //     logHistoryState();
    // }, [logHistoryState]);

    return null;
}

export default HistoryControl;
