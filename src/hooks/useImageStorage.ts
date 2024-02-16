import { useEffect, useState } from "react";

interface ImageData {
  id: string;
  file: string;
}

export const useImageStorage = (key: string) => {
  const [data, setData] = useState<ImageData[]>([]);

  useEffect(() => {
    const storedDataString = localStorage.getItem(key);
    if (storedDataString) {
      const storedData = JSON.parse(storedDataString) as ImageData[];
      setData(storedData);
    }
  }, [key]);

  const updateData = (newData: ImageData[]) => {
    localStorage.setItem(key, JSON.stringify(newData));
    setData(newData);
  };

  return { data, updateData };
};
