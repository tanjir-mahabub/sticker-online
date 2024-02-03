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
        <div className="w-[20vw]">
            {SelectCustomizeSettings.map(settings => {
                if (settings.id === SideNavSelected.id) {
                    return <settings.component key={settings.id} />;
                }
                return null;
            })}
        </div>
    )
}

export default Customize
