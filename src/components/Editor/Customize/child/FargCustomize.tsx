import { customizeFonts } from "@/store/customizeFontStore";

const FargCustomize = () => {
    return (
        <div className="w-full">
            <div className="p-3 space-y-5 overflow-y-auto">
                <h2 className="text-sm sm:text-lg font-bold">Lägg till text</h2>
            </div>

            <div className="flex flex-wrap flex-grow justify-start items-center gap-3 p-3">
                {customizeFonts.map(customFonts => (
                    <div key={customFonts.id} className="bg-so-deep-gray flex justify-center items-center w-20 h-20 rounded">
                        <p className={`${customFonts.font.className} text-lg`}>
                            Text
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FargCustomize