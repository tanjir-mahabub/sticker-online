import { useAppSelector } from "@/redux/store"
import Form from "./lib/Form/Form"
import { formattedTotalCost } from "../Utils/vectorFunction";

const Footer = () => {
    const calculation = useAppSelector(state => state.calculation)

    const { totalCost } = calculation;


    return (
        <footer className="flex h-full items-center border-t px-7">
            <div className="flex-auto xl:py-7 border-r border-so-black/20">
                <Form />
            </div>
            <div className="w-fit 4xl:w-[20%] flex h-full xl:gap-6 justify-end items-center xl:py-7">
                <div className="w-fit px-3">
                    <h6 className="text-xs font-bold">Totalt</h6>
                    <p className="text-so-orange text-lg font-bold">{formattedTotalCost(totalCost)}</p>
                </div>
                <button className="bg-so-orange hover:bg-so-orange/90 text-sm xl:text-base font-bold text-white px-7 py-3 rounded shadow-md shadow-so-orange/50 hover:shadow-so-orange/70 transition-all duration-300">Lägg i kundvagnen</button>
            </div>
        </footer>
    )
}

export default Footer