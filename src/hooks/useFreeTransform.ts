import { useEffect } from 'react';

const useFreeTransform = (selectedItem: any, options: any, paper: any) => {
    useEffect(() => {
        if (selectedItem && paper) {
            const ft = paper.freeTransform(selectedItem, options);


            // Apply free transform
            ft.apply();

            return () => {
                // Unplug free transform on cleanup
                ft.hideHandles();
            };
        }
    }, [selectedItem, options, paper]);
};

export default useFreeTransform;
