import { formattedTotalCost } from "@/components/Utils/function";
import { useAppSelector } from "@/redux/store"

const PriceCartBtn = () => {
    const calculation = useAppSelector(state => state.calculation)

    const { totalCost } = calculation;

    return (
        <>
             <div className="editor-total w-fit flex lg:block items-center px-1.5 lg:px-3 gap-1.5">
                    <h6 className="text-white lg:text-so-black text-xxs font-bold">Totalt</h6>
                    <p className="text-so-orange text-xs lg:text-lg font-bold">{formattedTotalCost(totalCost)}</p>
              </div>
            <button className="editor-cart-button text-xs xl:text-base font-bold text-white px-3 xl:px-7 py-2 md:py-3">Lägg i kundvagnen</button>
        </>
    )
}

export default PriceCartBtn
