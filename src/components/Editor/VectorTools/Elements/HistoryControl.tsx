import { usePaper } from "@/context/PaperContext";
import { useEffect, useCallback } from "react";

const HistoryControl = () => {    
    const { ftEndData, historyDispatch } = usePaper();

    const addToHistory = useCallback(() => {
        if (ftEndData) {
            // console.log(ftEndData);
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

    useEffect(() => {
        addToHistory();
    }, [addToHistory]);
  

    return null;
}

export default HistoryControl;
