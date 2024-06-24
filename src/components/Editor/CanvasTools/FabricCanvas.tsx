import React, { useEffect } from 'react';
import Controls from './Controls';
import AddPath from './AddPath';
import { useAppSelector } from '@/redux/store';
import ImageComponent from './ImageComponent';
import { useCanvas } from '@/context/CanvasContext';
import { useCanvasSetup } from '@/hooks/useCanvasSetup';

const FabricCanvas: React.FC = () => {
  const { fabricCanvasRef, htmlCanvasRef, historyControllerRef, iconImageRef, saveState } = useCanvas();
  const canvasProperties = useAppSelector((state) => state.canvas);
  const imagePreviews = useAppSelector((state) => state.imagePreview.images);

  useCanvasSetup(htmlCanvasRef, fabricCanvasRef, historyControllerRef, iconImageRef, saveState);

  useEffect(() => {
    console.log(fabricCanvasRef, htmlCanvasRef, historyControllerRef, imagePreviews);
  },[fabricCanvasRef, htmlCanvasRef, historyControllerRef, imagePreviews])

  return (
    <div>
      <div className='absolute z-[100]'>
        <Controls canvasRef={fabricCanvasRef} />
      </div>

        {fabricCanvasRef.current && <AddPath fabricCanvas={fabricCanvasRef} saveState={saveState} />}
      {fabricCanvasRef.current && historyControllerRef.current && <ImageComponent fabricCanvas={fabricCanvasRef} images={imagePreviews} saveState={saveState} />}

      <canvas ref={htmlCanvasRef} width={canvasProperties.canvasWidth} height={canvasProperties.canvasHeight} className="border border-black" />
    </div>
  );
};

export default FabricCanvas;
