import SidebarNav from "./Nav/SidebarNav"


const Sidebar = () => {
    return (
        <aside className="editor-sidebar hidden lg:flex w-[76px] text-white">
            <SidebarNav />
        </aside>
    )
}

export default Sidebar
