import ColorInput from "./Input/ColorInput";
import { useEditorI18n } from "@/context/EditorI18nContext";

const FargCustomize = () => {
    const { t } = useEditorI18n();
    return (
        <div className="w-full h-full overflow-y-auto">
            <div className="px-3 py-3 lg:p-4 space-y-5 overflow-y-auto">
                <h2 className="text-sm md:text-base xl:text-lg font-bold">{t('backgroundColor')}</h2>
                <p className="text-xs leading-5 text-gray-600">{t('backgroundHelp')}</p>
            </div>

            <div className="flex flex-col gap-7 px-4 pb-7 lg:pb-3 space-y-3">
                <ColorInput sketch type="Background" showValue="Background" />
                {/* <RangeSlider minValue={0} maxValue={100} step={1} /> */}
            </div>
        </div>
    );
};

export default FargCustomize
