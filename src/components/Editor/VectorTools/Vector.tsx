import { PaperProvider } from "@/context/PaperContext"
import VectorStencil from "./VectorStencil"

const Vector = () => {

    return (
        <PaperProvider>
            <VectorStencil />
        </PaperProvider>
    )
}

export default Vector