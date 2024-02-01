import StickerSelector from "@/components/Homepage/Selector/StickerSelector"

const FormCustomize = () => {
    return (
        <div className="w-full overflow-y-auto">
            <div className="p-4 space-y-5 overflow-y-auto">
                <h2 className="text-sm sm:text-lg font-bold">Välj bakgrundsfärg</h2>
            </div>

            <div className="grid grid-cols-2 justify-start items-center gap-3 h-[10%] p-4">
                <StickerSelector />
            </div>
        </div>
    )
}

export default FormCustomize
