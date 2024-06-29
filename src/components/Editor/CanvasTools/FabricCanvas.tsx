import React, { useEffect, useState } from 'react';
import Controls from './Controls';
import AddPath from './AddPath';
import { useAppSelector } from '@/redux/store';
import ImageComponent from './ImageComponent';
import { useCanvas } from '@/context/CanvasContext';
import { useCanvasSetup } from '@/hooks/useCanvasSetup';
import ControlElements from './ControlElements';

const FabricCanvas: React.FC = () => {
  const [selected, setSelected] = useState(false);

  const { fabricCanvasRef, htmlCanvasRef, historyControllerRef, iconImageRef, saveState } = useCanvas();
  const canvasProperties = useAppSelector((state) => state.canvas);
  const imagePreviews = useAppSelector((state) => state.imagePreview.images);

  useCanvasSetup(htmlCanvasRef, fabricCanvasRef, historyControllerRef, iconImageRef, saveState);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      canvas.preserveObjectStacking = true;
      canvas.renderAll();
      
      const handleMouseDown = (e: any) => {
        if (e.target !== null) {
          setSelected(true);
        } else {
          setSelected(false);
        }
      };
      canvas.on('mouse:down', handleMouseDown);

      return () => {
        canvas.off('mouse:down', handleMouseDown);
      };
    }
  }, [fabricCanvasRef]);

  return (
    <div>
      <div className='absolute z-[100]'>
        <Controls canvasRef={fabricCanvasRef} />
      </div>
      {fabricCanvasRef.current && <AddPath fabricCanvas={fabricCanvasRef} saveState={saveState} />}
      {fabricCanvasRef.current && historyControllerRef.current && <ImageComponent fabricCanvas={fabricCanvasRef} images={imagePreviews} saveState={saveState} />}
      <ControlElements canvasRef={fabricCanvasRef} selected={selected} />
      <canvas ref={htmlCanvasRef} width={canvasProperties.canvasWidth} height={canvasProperties.canvasHeight} className="border border-black" />
    </div>
  );
};

export default FabricCanvas;
