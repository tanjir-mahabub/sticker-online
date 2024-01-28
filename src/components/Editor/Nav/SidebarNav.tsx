import { sideNavs } from "@/store/sideNavStore"
import Image from "next/image"

const SidebarNav = () => {

    return (
        <div className="flex flex-col w-full justify-center divide-y divide-white/30 py-5">
            {sideNavs && sideNavs.map(nav => (
                <div key={nav.id} className="flex flex-col h-full items-center gap-3 pt-2.5 pb-3 cursor-pointer group hover:bg-white">
                    <Image src={nav.icon} alt={nav.name} width={25} height={25} className="group-hover:filter group-hover:invert" />
                    <h4 className="text-xs font-semibold group-hover:text-black">{nav.name}</h4>
                </div>
            ))}
        </div>
    )
}

export default SidebarNav