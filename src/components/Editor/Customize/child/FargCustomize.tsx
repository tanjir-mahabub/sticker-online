import ColorInput from "./Input/ColorInput";
import RangeSlider from "./Input/RangeSlider";

const FargCustomize = () => {
    return (
        <div className="w-full overflow-y-auto">
            <div className="p-4 space-y-5 overflow-y-auto">
                <h2 className="text-sm sm:text-lg font-bold">Välj bakgrundsfärg</h2>
            </div>

            <div className="p-4 space-y-3">
                <ColorInput />
                <RangeSlider minValue={0} maxValue={100} step={1} />
            </div>
        </div>
    );
};

export default FargCustomize