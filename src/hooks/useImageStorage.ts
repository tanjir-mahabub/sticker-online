// import { ImageData, ImageInfo } from "@/types/types";
// import { useEffect, useState } from "react";

// export const useImageStorage = (key: string) => {
//   const [data, setData] = useState<ImageInfo[]>([]);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     setIsLoading(true);
//     const storedDataString = localStorage.getItem(key);
//     if (storedDataString) {
//       const storedData = JSON.parse(storedDataString) as ImageInfo[];
//       setData(storedData);
//     }
//     setIsLoading(false);
//   }, [key]);

//   const updateData = (newData: ImageInfo[]) => {
//     setIsLoading(true);
//     localStorage.setItem(key, JSON.stringify(newData));
//     setData(newData);
//     setIsLoading(false);
//   };

//   // useEffect(() => {
//   //   console.log("Data updated:", data);
//   // }, [data]);

//   return { data, updateData, isLoading };
// };
