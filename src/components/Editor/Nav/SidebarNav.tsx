"use client"

import Image from "next/image"
import { AppDispatch, useAppSelector } from "@/redux/store"
import { sideNavs } from "@/store/sideNavStore"
import { useDispatch } from "react-redux"
import { selectedSideNav } from "@/redux/features/sideNavSlice";
import { useEffect, useState } from "react"
import { SideNavState } from "@/types/types"

const SidebarNav = () => {
    const sideNavDispatch = useDispatch<AppDispatch>();

    const SideNavSelected = useAppSelector(state => state.sideNav);

    const [selected, setSelected] = useState<SideNavState>(SideNavSelected);

    useEffect(() => {

        setSelected(SideNavSelected)

    }, [SideNavSelected]);


    return (
        <div className="flex lg:flex-col bg-black w-full justify-start divide-y divide-white/30 pb-5">
            {sideNavs && sideNavs.map(nav => (
                <div key={nav.id} className={`flex flex-col items-center 2xl:gap-1.5 pt-2.5 pb-3 px-3 cursor-pointer group ${(nav.id === selected.id) ? "bg-white" : "hover:bg-so-deep-gray/80"}`} onClick={() => sideNavDispatch(selectedSideNav({ id: nav.id }))}>
                    <div className="w-[22px]">
                        <Image src={nav.icon} alt={nav.name} width={20} height={20} className={`w-full h-auto group-hover:filter group-hover:invert ${(nav.id === selected.id) ? "filter invert" : ""}`} />
                    </div>
                    <h4 className={`text-xxs xl:text-xs font-semibold group-hover:text-black ${(nav.id === selected.id) ? "text-black" : ""}`}>{nav.name}</h4>
                </div>
            ))}
        </div>
    )
}

export default SidebarNav