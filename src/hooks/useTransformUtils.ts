import { CustomTransform } from '@/components/Editor/VectorTools/CustomTransform';
import { useCallback } from 'react';

export const useTransformUtils = (dispatch: any, currentFtRef: any, setSelectedItem: any) => {
    const handleElementInteraction = useCallback((el: any) => {
        if (currentFtRef.current && currentFtRef.current.subject.id !== el.id) {
            currentFtRef.current.unplug();
        }
        setSelectedItem(el);
        // el.toFront();
        const ft = CustomTransform(el, {}, dispatch);
        currentFtRef.current = ft;
    }, [dispatch, setSelectedItem, currentFtRef]);

    /**
     * Free Transform Logic
     * 
     * @param el any
     */
    const reapplyFreeTransform = useCallback((el: any) => {
        if (currentFtRef.current) {
            currentFtRef.current.unplug(); // Remove current free transform
        }
        const ft = CustomTransform(el, {}, dispatch); // Reapply with new settings
        currentFtRef.current = ft;
    }, [dispatch, currentFtRef]);

    const deselect = useCallback(() => {
        if (currentFtRef.current) {
            currentFtRef.current.unplug();
            currentFtRef.current = null;
            setSelectedItem(null);
        }
    }, [currentFtRef, setSelectedItem]);

    return { handleElementInteraction, reapplyFreeTransform, deselect };
};
