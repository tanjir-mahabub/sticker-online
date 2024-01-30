"use client"

import { useEditorContext } from "@/context/EditorContext"
import { sideNavs } from "@/store/sideNavStore"
import Image from "next/image"

const SidebarNav = () => {
    const { selectedSideNav, setSideNav } = useEditorContext();

    console.log(selectedSideNav);

    return (
        <div className="flex flex-col w-full justify-center divide-y divide-white/30 pb-5">
            {sideNavs && sideNavs.map(nav => (
                <div key={nav.id} className={`flex flex-col h-full items-center gap-3 pt-2.5 pb-3 cursor-pointer group hover:bg-so-deep-gray ${(nav.id === selectedSideNav) ? "bg-white" : ""}`} onClick={() => setSideNav(nav.id)}>
                    <Image src={nav.icon} alt={nav.name} width={25} height={25} className={`group-hover:filter group-hover:invert ${(nav.id === selectedSideNav) ? "filter invert" : ""}`} />
                    <h4 className={`text-xs font-semibold group-hover:text-black ${(nav.id === selectedSideNav) ? "text-black" : ""}`}>{nav.name}</h4>
                </div>
            ))}
        </div>
    )
}

export default SidebarNav