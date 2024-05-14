import React, { createContext, useContext, useState, ReactNode, useRef } from 'react';

interface PaperContextType {
    paper: any;
    setPaper: React.Dispatch<React.SetStateAction<any>>;
    selectedItem: any;
    setSelectedItem: React.Dispatch<React.SetStateAction<any>>;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    currentFtRef: React.MutableRefObject<any>;
    lastAddedElement: any;
    setLastAddedElement: React.Dispatch<React.SetStateAction<any>>;
    elementActive: any,
    setElementActive: React.Dispatch<React.SetStateAction<any>>;
}

// Create a context
const PaperContext = createContext<PaperContextType | null>(null);

// Create a provider component
export const PaperProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [paper, setPaper] = useState<any>(null); // Set the initial state of paper to null
    const [selectedItem, setSelectedItem] = useState<any>(null); // Set the initial state of selectedItem to null
    const [isLoading, setIsLoading] = useState<boolean>(false); // Set the initial state of isLoading to false
    const [elementActive, setElementActive] = useState<any[]>([]);
    const currentFtRef = useRef<any>(null);
    const [lastAddedElement, setLastAddedElement] = useState<any>(null);

    return (
        <PaperContext.Provider value={{ paper, setPaper, selectedItem, setSelectedItem, isLoading, setIsLoading, currentFtRef, lastAddedElement, setLastAddedElement, elementActive, setElementActive }}>
            {children}
        </PaperContext.Provider>
    );
};

// Custom hook to use the paper context
export const usePaper = () => {
    const context = useContext(PaperContext);
    if (!context) {
        throw new Error('usePaper must be used within a PaperProvider');
    }
    return context;
};
