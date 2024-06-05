import Spinner from "@/components/Utils/Spinner"

const Loading = () => {
    return (
        <div className="w-full h-screen overflow-hidden bg-black">
            <div className="relative flex w-full h-full justify-center items-center">
                <Spinner />
            </div>
        </div>
    )
}

export default Loading