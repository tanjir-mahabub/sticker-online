"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
export type EditorLanguage = "en" | "sv";
const copy = {
  en:{width:"Width",height:"Height",laminate:"Laminate",material:"Material",quantity:"Quantity",edge:"Cutline spacing",total:"Total",order:"Order stickers",review:"Review & checkout",print:"Production file after payment"},
  sv:{width:"Bredd",height:"Höjd",laminate:"Laminat",material:"Material",quantity:"Antal",edge:"Kantlinje",total:"Totalt",order:"Beställ stickers",review:"Granska & betala",print:"Produktionsfil efter betalning"},
} as const;
type Key=keyof typeof copy.en;
const Context=createContext({language:"en" as EditorLanguage,setLanguage:(_:EditorLanguage)=>{},t:(key:Key)=>copy.en[key] as string});
export function EditorI18nProvider({children}:{children:React.ReactNode}){
 const [language,setLanguage]=useState<EditorLanguage>("en");
 useEffect(()=>{if(localStorage.getItem("sticker-online-language")==="sv")setLanguage("sv")},[]);
 useEffect(()=>{localStorage.setItem("sticker-online-language",language);document.documentElement.lang=language},[language]);
 const value=useMemo(()=>({language,setLanguage,t:(key:Key)=>copy[language][key] as string}),[language]);
 return <Context.Provider value={value}>{children}</Context.Provider>;
}
export const useEditorI18n=()=>useContext(Context);
