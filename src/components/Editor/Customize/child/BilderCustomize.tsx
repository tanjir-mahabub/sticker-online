import { useDispatch } from 'react-redux';
import { addImage, clearImages, deleteImage } from '@/redux/features/imagePreviewSlice';
import { deleteAllHistoriesByCategory } from '@/redux/features/historySlice';
import { setCategoryToRemove } from '@/redux/features/categoryToRemove';
import { generateUniqueId } from '@/components/Utils/function';
import ImageUpload from '@/components/Utils/ImageUploader';
import ImagePreview from '@/components/Utils/ImagePreview';
import Image from 'next/image';
import { useAppSelector } from '@/redux/store';

const BilderCustomize = () => {
  const dispatch = useDispatch();
  const imagePreviews = useAppSelector((state) => state.imagePreview.images);

  const handleImageUpload = async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('file', file));
  
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const result = await response.json();
        const uploadedFiles = result.files;
  
        uploadedFiles.forEach((file: { path: string }) => {
          dispatch(addImage({
            id: generateUniqueId(),
            src: file.path,
            width: 0, // Set the width if known or update later
            height: 0, // Set the height if known or update later
            category: 'image',
            status: 'Unknown', // Set status if applicable
          }));
        });
        // console.log('Uploaded Images Paths:', uploadedFiles.map(file => file.path));
      } else {
        console.error('Image upload failed');
      }
    } catch (error) {
      console.error('An error occurred during image upload:', error);
    }
  };
  

  const deleteImageFromServer = async (fileName: string) => {
    try {
      const response = await fetch(`/api/delete-image?fileName=${encodeURIComponent(fileName)}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        console.log(`Image ${fileName} deleted from server`);
      } else {
        console.error('Failed to delete image from server');
      }
    } catch (error) {
      console.error('An error occurred during image deletion:', error);
    }
  };
  
  const handleDeleteBTN = () => {
    imagePreviews.forEach(image => {
      const fileName = image.src.split('/').pop() || '';
      if (fileName) {
        deleteImageFromServer(fileName);
      }
    });
    dispatch(setCategoryToRemove('image'));
    dispatch(clearImages('image'));
    dispatch(deleteAllHistoriesByCategory('image'));
  };
  

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex-auto space-y-3 h-full overflow-y-auto bg-white p-4">
        <h2 className="text-sm md:text-base xl:text-lg font-bold">Ladda upp bild</h2>
        <ImageUpload onImageUpload={handleImageUpload} />
        <div className="py-3">
          {imagePreviews && <ImagePreview images={imagePreviews} />}
        </div>
      </div>
      <div className="flex-auto flex justify-start items-center gap-1 h-[60px] bg-white border-t px-3">
        <div className="hover:bg-so-deep-gray cursor-pointer hover:shadow-lg" onClick={handleDeleteBTN}>
          <Image
            src="/editor/sidebar/trash.svg"
            alt="trash-icon"
            width={18}
            height={18}
            className="w-fit h-fit border rounded-sm p-1"
            priority
          />
        </div>
        <p className="text-xs md:text-sm font-semibold">Ta bort alla bilder</p>
      </div>
    </div>
  );
};

export default BilderCustomize;
