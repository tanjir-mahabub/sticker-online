import Form from "./lib/Form/Form"

const Footer = () => {
    return (
        <footer className="flex h-full items-center border-t px-7">
            <div className="flex-auto py-7 border-r border-so-black/20">
                <Form />
            </div>
            <div className="w-[20%] flex h-full gap-6 justify-end items-center py-7">
                <div>
                    <h6 className="text-xs font-bold">Totalt</h6>
                    <p className="text-so-orange text-lg font-bold">2 495 kr</p>
                </div>
                <button className="bg-so-orange hover:bg-so-orange/90 text-base font-bold text-white px-7 py-3 rounded shadow-md shadow-so-orange/50 hover:shadow-so-orange/70 transition-all duration-300">Lägg i kundvagnen</button>
            </div>
        </footer>
    )
}

export default Footer