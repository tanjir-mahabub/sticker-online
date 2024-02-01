import StickerSelector from "@/components/Homepage/Selector/StickerSelector"

const FormCustomize = () => {
    return (
        <div className="w-full h-full overflow-y-auto">
            <div className="p-4 space-y-5">
                <h2 className="text-sm sm:text-lg font-bold">Välj bakgrundsfärg</h2>
            </div>

            <div className="flex flex-wrap flex-grow justify-around items-center gap-3 p-4">
                <StickerSelector />
            </div>
        </div>
    )
}

export default FormCustomize
