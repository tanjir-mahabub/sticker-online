import { useEffect, useState } from "react";

export interface TextData {
  id: string;
  x: number;
  y: number;
  fontID: number;
  fontFamily: string;
  text: string;
  fontSize: number;
  fill: string;
}

export const useTextStorage = (key: string) => {
  const [data, setData] = useState<TextData[]>([]);

  useEffect(() => {
    const storedDataString = localStorage.getItem(key);
    // Ensure data is initialized as an empty array if storedDataString is null
    const storedData = storedDataString ? JSON.parse(storedDataString) as TextData[] : [];
    setData(storedData);
  }, [key]);

  const updateData = (newData: TextData) => {
    // Initialize updatedData as a copy of data, ensuring it's always an array
    const updatedData = Array.isArray(data) ? [...data] : [];

    // Add new data
    updatedData.push(newData);
  
    setData(updatedData);
    localStorage.setItem(key, JSON.stringify(updatedData));
  };

  return { data, updateData };
};
