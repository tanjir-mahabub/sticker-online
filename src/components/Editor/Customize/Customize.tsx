import BilderCustomize from "./child/BilderCustomize"
import FargCustomize from "./child/FargCustomize"
import { useEditorContext } from "@/context/EditorContext"

const SelectCustomizeSettings = [
    {
        id: 1,
        component: BilderCustomize
    },
    {
        id: 2,
        component: FargCustomize
    }
]

const Customize = () => {
    const { selectedSideNav } = useEditorContext();

    return (
        <div className="w-[20vw]">
            {SelectCustomizeSettings.map(settings => {
                if (settings.id === selectedSideNav) {
                    return <settings.component key={settings.id} />;
                }
                return null;
            })}
        </div>
    )
}

export default Customize
