import StickerSelector from "@/components/Homepage/Selector/StickerSelector"

const FormCustomize = () => {
    return (
        <div className="w-full h-full overflow-y-auto">
            <div className="px-3 py-3 lg:p-4 space-y-5">
                <h2 className="text-sm md:text-base xl:text-lg font-bold">Välj bakgrundsfärg</h2>
            </div>

            <div className="flex flex-wrap flex-grow justify-around items-center gap-3 pb-5">
                <StickerSelector />
            </div>
        </div>
    )
}

export default FormCustomize
