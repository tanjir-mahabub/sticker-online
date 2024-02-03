import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addedImage } from "@/redux/features/imageSlice";
import { RootState } from "@/redux/store";

interface SerializedFile {
  identifier: string;
  lastModified: number;
  webkitRelativePath: string;
  size: number;
  type: string;
}

const LOCAL_STORAGE_KEY = "serializedImages";

export const useLocalStorageImages = () => {
  const dispatch = useDispatch();
  const reduxImages = useSelector((state: RootState) => state.imageUploader) as SerializedFile[];

  useEffect(() => {
    // Load serializedImages from local storage on component mount
    const storedSerializedImages = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedSerializedImages) {
      const parsedImages: SerializedFile[] = JSON.parse(storedSerializedImages);
      dispatch(addedImage(parsedImages));
    }
  }, [dispatch]);

  const setImages = (images: SerializedFile[]) => {
    // Save serializedImages to local storage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(images));
    dispatch(addedImage(images));
  };

  const getImages = (): SerializedFile[] | null => {
    // Get serializedImages from local storage
    const storedSerializedImages = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedSerializedImages) {
      return JSON.parse(storedSerializedImages);
    }
    return null;
  };

  return { setImages, getImages };
};
