import { checkAndAdjust } from '@/components/Editor/CanvasTools/eventHandlers/checkAndAdjust';
import { handleScaling } from '@/components/Editor/CanvasTools/eventHandlers/handleScaling';
import HistoryController from '@/components/Editor/CanvasTools/eventHandlers/historyController';
import { fabric } from 'fabric';
import { MutableRefObject, useEffect, useRef } from 'react';

export const useCanvasSetup = (
  htmlCanvasRef: MutableRefObject<HTMLCanvasElement | null>,
  fabricCanvasRef: MutableRefObject<fabric.Canvas | null>,
  historyControllerRef: MutableRefObject<HistoryController | null>,
  iconImageRef: MutableRefObject<HTMLImageElement | null>,
  saveState: () => void
) => {
  const scaling = useRef(false);

  useEffect(() => {
    const iconImage = new Image();
    iconImage.src = '/rotateIcon.svg'; // Replace with the path to your icon image
    iconImage.onload = () => {
      iconImageRef.current = iconImage;
    };

    if (htmlCanvasRef.current) {
      // console.log('use canvas setup', htmlCanvasRef.current);
      const fabricCanvas = new fabric.Canvas(htmlCanvasRef.current);
      fabricCanvasRef.current = fabricCanvas;
      historyControllerRef.current = new HistoryController(fabricCanvas, 10);

      fabric.Object.prototype.controls.mtr = new fabric.Control({
        x: 0,
        y: 0.5,
        offsetY: 34,
        withConnection: true,
        visible: true,
        //@ts-ignore
        cursorStyleHandler: fabric.controlsUtils.rotationStyleHandler,
        //@ts-ignore
        actionHandler: fabric.controlsUtils.rotationWithSnapping,
        actionName: 'rotate',
        render: (ctx, left, top, styleOverride, fabricObject) => {
          const size = 24;
          ctx.save();
          ctx.translate(left, top);
          ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle || 0));
          if (iconImageRef.current) {
            const img = iconImageRef.current;
            ctx.drawImage(img, -size / 2, -size / 2, size, size);
          } else {
            ctx.fillStyle = 'black';
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
        objectCaching: false,
      });

      const checkAndAdjustHandler = checkAndAdjust(fabricCanvas);

      const handleObjectModified = () => {
        checkAndAdjustHandler();
        saveState();
      };

      const handleObjectScaling = () => {
        scaling.current = true;
        handleScaling(fabricCanvas);
      };

      const handleObjectScaled = () => {
        if (scaling.current) {
          checkAndAdjustHandler();
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

      // fabricCanvas.on('mouse:wheel', handleMouseWheel(fabricCanvas));

      checkAndAdjustHandler(); // Initial check and adjustment
      saveState(); // Save initial state
      // console.log(fabricCanvas);
    }

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, [
    htmlCanvasRef,
    fabricCanvasRef,
    historyControllerRef,
    iconImageRef,
    saveState,
  ]);
};
