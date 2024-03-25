// import { useEffect, useState } from "react";

// export interface TextData {
//   id: string;
//   x?: number;
//   y?: number;
//   fontID: number;
//   fontFamily: string;
//   text: string;
//   fontSize: number;
//   fill: string;
// }

// export const useTextStorage = (key: string) => {
//   const [data, setData] = useState<TextData[]>([]);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     setIsLoading(true);
//     const storedDataString = localStorage.getItem(key);
    
//     if (storedDataString) { 
//     const storedData = JSON.parse(storedDataString) as TextData[]    
//     setData(storedData);
//     }
//     setIsLoading(false);

//   }, [key]);

//   const updateData = (newData: TextData[]) => {
//     setIsLoading(true);
//     localStorage.setItem(key, JSON.stringify(newData));
//     setData(newData);
//     setIsLoading(false);
//   };

//   return { data, updateData, isLoading };
// };

