import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import Controls from './Controls';
import LoadImage from './LoadImage';
import AddPath from './AddPath';
import { checkAndAdjust } from './eventHandlers/checkAndAdjust';
import { handleMouseWheel } from './eventHandlers/handleMouseWheel';
import { handleScaling } from './eventHandlers/handleScaling';
import HistoryController from './eventHandlers/historyController';
import { useAppSelector } from '@/redux/store';
import ImageComponent from './ImageComponent';

const FabricCanvas: React.FC = () => {
    const canvasProperties = useAppSelector((state) => state.canvas);   
    const imagePreviews = useAppSelector((state) => state.imagePreview.images);   
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const historyControllerRef = useRef<HistoryController | null>(null);
  const scaling = useRef(false);
  const iconImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const iconImage = new Image();
    iconImage.src = '/rotateIcon.svg'; // Replace with the path to your icon image
    iconImage.onload = () => {
      iconImageRef.current = iconImage;
    };

    if (canvasRef.current) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current);
      fabricCanvasRef.current = fabricCanvas;
      historyControllerRef.current = new HistoryController(fabricCanvas);

      fabric.Object.prototype.controls.mtr = new fabric.Control({
        x: 0,
        y: 0.50,
        offsetY: 34,
        withConnection: true,
        visible: true,
        /*@ts-ignore*/
        cursorStyleHandler: fabric.controlsUtils.rotationStyleHandler,
        /*@ts-ignore*/
        actionHandler: fabric.controlsUtils.rotationWithSnapping,
        actionName: 'rotate',
        /*@ts-ignore*/
        render: (ctx, left, top, styleOverride, fabricObject) => {
          const size = 24;
          ctx.save();
          ctx.translate(left, top);
          ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle || 0));
          if (iconImageRef.current) {
            const img = iconImageRef.current;
            ctx.drawImage(img, -size / 2, -size / 2, size, size);
          } else {
            ctx.fillStyle = 'yellow';
            ctx.beginPath();
            ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }
          ctx.restore();
        },
      });

      fabric.Object.prototype.set({
        borderColor: 'black',
        cornerColor: 'white',
        cornerSize: 12,
        transparentCorners: false,
        cornerStyle: 'circle',
        rotatingPointOffset: 20,
        cornerStrokeColor: 'black',
        borderDashArray: [5, 5],
      });

      const saveState = () => {
        historyControllerRef.current?.saveState();
      };

      const checkAndAdjustHandler = checkAndAdjust(fabricCanvas);

      const handleObjectModified = () => {
        saveState();
      };

      const handleObjectScaling = () => {
        scaling.current = true;
        handleScaling(fabricCanvas);
      };

      const handleObjectScaled = () => {
        if (scaling.current) {
          saveState();
          scaling.current = false;
        }
      };

      // Handle group modifications and scaling
      fabricCanvas.on('object:modified', (e) => {
        if (e.target) {
          handleObjectModified();
        }
      });

      fabricCanvas.on('object:scaling', (e) => {
        if (e.target) {
          handleObjectScaling();
        }
      });

      fabricCanvas.on('object:scaled', (e) => {
        if (e.target) {
          handleObjectScaled();
        }
      });

      fabricCanvas.on('mouse:wheel', handleMouseWheel(fabricCanvas));

      checkAndAdjustHandler(); // Initial check and adjustment
      saveState(); // Save initial state
    }

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, []);
  

  return (
    <div>
      <div className='absolute z-[100]'>
      <Controls canvasRef={fabricCanvasRef} />      
      <AddPath canvasRef={fabricCanvasRef} />
        <button onClick={() => historyControllerRef.current?.undo()}>Undo</button>
        <button onClick={() => historyControllerRef.current?.redo()}>Redo</button>
      </div>

      {historyControllerRef.current && (
        <ImageComponent
          canvasRef={fabricCanvasRef}
          images={imagePreviews}
          saveState={historyControllerRef.current.saveState.bind(historyControllerRef.current)}
        />
      )}

      <canvas ref={canvasRef} width={canvasProperties.canvasWidth} height={canvasProperties.canvasHeight} className="border border-black" />
    </div>
  );
};

export default FabricCanvas;
