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
    if (storedDataString) {
      const storedData = JSON.parse(storedDataString) as TextData[];
      setData(storedData);
    }
  }, [key]);

  const updateData = (newData: TextData) => {
    const updatedData = [...data];
  
    const existingDataIndex = updatedData.findIndex(d => 
      d.x === newData.x && 
      d.y === newData.y && 
      d.fontID === newData.fontID && 
      d.fontFamily === newData.fontFamily && 
      d.text === newData.text && 
      d.fontSize === newData.fontSize && 
      d.fill === newData.fill
    );
  
    if (existingDataIndex !== -1) {
      // Update existing data
      updatedData[existingDataIndex] = newData;
    } else {
      // Add new data
      updatedData.push(newData);
    }
  
    setData(updatedData);
    localStorage.setItem(key, JSON.stringify(updatedData));
  };
  

  return { data, updateData };
};
