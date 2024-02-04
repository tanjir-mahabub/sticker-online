import { useEffect, useState } from "react";

export const useLocalStorage = (key: string) => {
  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    const storedDataString = localStorage.getItem(key);
    if (storedDataString) {
      const storedData = JSON.parse(storedDataString) as string[];
      setData(storedData);
    }
  }, [key]);

  const updateData = (newData: string[]) => {
    localStorage.setItem(key, JSON.stringify(newData));
    setData(newData);
  };

  return { data, updateData };
};