"use client"

import { SideNavStore } from "@/store/sideNav";
import { FC, ReactNode, createContext, useContext, useState } from "react";

interface EditorContextProps {
    selectedSideNav: number;
    setSideNav: (id: number) => void;
}

interface EditorProviderProps {
    children: ReactNode;
}


const EditorContext = createContext<EditorContextProps | undefined>(undefined);

export const EditorProvider: FC<EditorProviderProps> = ({ children }) => {
    const initialSideNavId = SideNavStore[0].id;

    const [selectedSideNav, setSelectedSideNav] = useState<number>(initialSideNavId);

    const setSideNav = (id: number) => {
        setSelectedSideNav(id);
    };
    return (
        <EditorContext.Provider value={{ selectedSideNav, setSideNav }}>
            {children}
        </EditorContext.Provider>
    );
};


export const useEditorContext = () => {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error('useEditorContext must be used within a EditorProvider');
    }
    return context;
};