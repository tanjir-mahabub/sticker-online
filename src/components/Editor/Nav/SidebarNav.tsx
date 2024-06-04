import Image from "next/image";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { sideNavs } from "@/store/sideNavStore";
import { useDispatch } from "react-redux";
import { selectedSideNav } from "@/redux/features/sideNavSlice";
import { useEffect, useState } from "react";
import { SideNavState } from "@/types/types";

const SidebarNav = () => {
    const sideNavDispatch = useDispatch<AppDispatch>();
    const SideNavSelected = useAppSelector(state => state.sideNav);
    const [selected, setSelected] = useState<SideNavState>(SideNavSelected);

    const CanvasProperties = useAppSelector(state => state.canvas);

    const { clientWidth } = CanvasProperties;

    useEffect(() => {
        setSelected(SideNavSelected);
    }, [SideNavSelected]);

    useEffect(() => {
        if(clientWidth > 1023) {
            sideNavDispatch(selectedSideNav({ id: 1 }));
        }
    }, [clientWidth, sideNavDispatch])

    const handleNavClick = (navId: number) => {
        if (selected.id === navId && clientWidth <= 1023) {
            sideNavDispatch(selectedSideNav({ id: 0 }));
        } else {
            sideNavDispatch(selectedSideNav({ id: navId }));
        }
    };

    return (
        <div className="flex lg:flex-col bg-black w-full justify-start divide-y divide-white/30 lg:pb-5">
            {sideNavs && sideNavs.map(nav => (
                <div
                    key={nav.id}
                    className={`flex flex-col items-center w-full 2xl:gap-1.5 pt-2 lg:pt-2.5 pb-2 lg:pb-3 px-3 cursor-pointer group ${selected.id === nav.id ? "bg-white" : "lg:hover:bg-so-deep-gray/80"}`}
                    onClick={() => handleNavClick(nav.id)}
                >
                    <div className="w-[22px]">
                        <Image src={nav.icon} alt={nav.name} width={20} height={20} className={`w-full h-auto lg:group-hover:filter lg:group-hover:invert ${selected.id === nav.id ? "filter invert" : ""}`} />
                    </div>
                    <h4 className={`text-xxs xl:text-xs font-semibold lg:group-hover:text-black ${selected.id === nav.id ? "lg:text-black" : "text-white"}`}>{nav.name}</h4>
                </div>
            ))}
        </div>
    );
};

export default SidebarNav;
