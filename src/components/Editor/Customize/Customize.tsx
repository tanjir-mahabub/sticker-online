import BilderCustomize from "./child/BilderCustomize"
import FargCustomize from "./child/FargCustomize"
import MotivCustomize from "./child/MotivCustomize"
import TextCustomize from "./child/TextCustomize"
import FormCustomize from "./child/FormCustomize"
import { useAppSelector } from "@/redux/store"

const SelectCustomizeSettings = [
    {
        id: 1,
        component: BilderCustomize
    },
    {
        id: 2,
        component: TextCustomize
    },
    {
        id: 3,
        component: MotivCustomize
    },
    {
        id: 4,
        component: FargCustomize
    },
    {
        id: 5,
        component: FormCustomize
    }
]

const Customize = () => {
    const SideNavSelected = useAppSelector(state => state.sideNav);

    return (
        <section className="editor-properties flex w-full lg:w-[320px] 2xl:w-[380px] h-[40vh] lg:h-full overflow-auto">
            {SelectCustomizeSettings.map(settings => {
                if (settings.id === SideNavSelected.id) {
                    return <settings.component key={settings.id} />;
                }
                return null;
            })}
        </section>
    )
}

export default Customize
