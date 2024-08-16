import { formattedTotalCost } from "@/components/Utils/vectorFunction";
import { useAppSelector } from "@/redux/store";

const PriceCartBtn = () => {
    const calculation = useAppSelector((state) => state.calculation);
    const { totalCost } = calculation;

    return (
        <>
            <div className="w-fit flex lg:block items-center px-1.5 lg:px-3 gap-1.5">
                <h6 className="text-white lg:text-so-black text-xxs font-bold">Totalt</h6>
                <p className="text-so-orange text-xs lg:text-lg font-bold">{formattedTotalCost(totalCost)}</p>
            </div>
            <button className="bg-so-orange hover:bg-so-orange/90 text-xs xl:text-base font-bold text-white px-3 xl:px-7 py-1.5 md:py-3 rounded shadow-md shadow-so-orange/50 hover:shadow-so-orange/70 transition-all duration-300">
                Lägg i kundvagnen
            </button>
        </>
    );
};

export default PriceCartBtn;
