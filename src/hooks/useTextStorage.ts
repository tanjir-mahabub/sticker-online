import { useEffect, useState } from "react";

type TextData = {
    id: number,
    name: string
}
export const useTextStorage = (key: string) => {
  const [data, setData] = useState<TextData>();

  useEffect(() => {
    const storedDataString = localStorage.getItem(key);
    if (storedDataString) {
      const storedData = JSON.parse(storedDataString) as TextData;
      setData(storedData);
    }
  }, [key]);

  const updateData = (newData: TextData) => {
    localStorage.setItem(key, JSON.stringify(newData));
    setData(newData);
  };

  return { data, updateData };
};