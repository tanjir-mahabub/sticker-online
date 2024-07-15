// import { useEffect, useState } from "react";

// const ErrorDisplay = () => {
//     const { paper, selectedItem, isLoading, isShowError, setIsShowError } = usePaper();
//     const [errMsg, setErrMsg] = useState("");    
    
//     useEffect(() => {
//         if(paper && selectedItem) {
//            const status = selectedItem.data("status")   
//            console.log(selectedItem.getBBox());        
//            if (status === "SD") {
//             setErrMsg("The image resolution is average. Printing result may not be satisfying.")
//             setIsShowError(true)
//            }
//            if (status === "Low") {
//             setErrMsg("The image's resolution is bad, please make it smaller or use a bigger image.")
//             setIsShowError(true)
//            }
//         } 
//     }, [paper, selectedItem, setIsShowError])

//     return (
//         !isLoading && isShowError && errMsg &&(
//             <div className="w-full h-7 bg-red-300 flex justify-center items-center absolute z-[100] transition-all duration-300 ease-in-out">
//                 <p className="text-[14px]">{errMsg}</p>
//             </div>
//         )
//     )
// }

// export default ErrorDisplay