import React, { useCallback, useEffect, useRef, useState } from 'react';
import Controls from './Controls';
import TextPath from './TextPath';
import { useAppSelector } from '@/redux/store';
import ImageComponent from './ImageComponent';
import { useCanvas } from '@/context/CanvasContext';
import { useCanvasSetup } from '@/hooks/useCanvasSetup';
import ControlElements from './ControlElements';
import Spinner from '@/components/Utils/Spinner';
import { useDispatch } from 'react-redux';
import { setCanvasProperties } from '@/redux/features/canvasSlice';
import CanvasFrame from './CanvasFrame';
import { useDieCutEffect } from '@/hooks/useDieCutEffect';
import { DIE_CUT_BACKGROUND_ID, DIE_CUT_LAMINATE_ID, DIE_CUT_LINE_ID } from '@/lib/sticker-contour/StickerContourEngine';
import EditorCommandBar from './EditorCommandBar';
import { expandArtboardToArtwork } from './eventHandlers/expandArtboardToArtwork';

const FabricCanvas: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  const contourTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const artboardFrameRef = useRef<number | null>(null);

  const { fabricCanvasRef, htmlCanvasRef, historyControllerRef, iconImageRef, saveState } = useCanvas();
  const canvasProperties = useAppSelector((state) => state.canvas);
  const imagePreviews = useAppSelector((state) => state.imagePreview.images);

  const dispatch = useDispatch();

  useCanvasSetup(htmlCanvasRef, fabricCanvasRef, historyControllerRef, iconImageRef, saveState);

  const { handleDieCut } = useDieCutEffect();

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    const width = Math.round(canvasProperties.canvasWidth);
    const height = Math.round(canvasProperties.canvasHeight);
    if (!canvas || width < 1 || height < 1) return;

    canvas.setDimensions({ width, height });

    const viewport = canvas.viewportTransform;
    if (!viewport || !viewport.every(Number.isFinite) || viewport[0] <= 0 || viewport[3] <= 0) {
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    }
    canvas.calcOffset();
    canvas.requestRenderAll();
  }, [canvasProperties.canvasHeight, canvasProperties.canvasWidth, fabricCanvasRef]);

  const handleMouseDown = useCallback((e: any) => {
    if (e.target !== null) {
      dispatch(setCanvasProperties({ hasSelected: true }));
    } else {
      dispatch(setCanvasProperties({ hasSelected: false }));
    }
  }, [dispatch]);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      canvas.preserveObjectStacking = true;
      canvas.renderAll();
      setIsReady(true);

      canvas.on('mouse:down', handleMouseDown);

      dispatch(setCanvasProperties({
        isLoading: false
      }));

      return () => {
        canvas.off('mouse:down', handleMouseDown);
      };
    }
  }, [fabricCanvasRef, handleMouseDown, dispatch]);  

  
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isReady) return;

    const scheduleContour = (event?: { target?: { id?: string } }) => {
      const id = event?.target?.id;
      const category = event?.target && 'data' in event.target
        ? (event.target as fabric.Object).data?.category
        : undefined;
      // Background, laminate and cutline are derived output. Observing their
      // own add/remove events creates an endless contour regeneration loop.
      if (category === 'generated' || id === DIE_CUT_BACKGROUND_ID || id === DIE_CUT_LINE_ID || id === DIE_CUT_LAMINATE_ID) return;
      if (contourTimerRef.current) clearTimeout(contourTimerRef.current);
      contourTimerRef.current = setTimeout(() => handleDieCut(canvasProperties.grow), 220);
    };

    canvas.on('object:added', scheduleContour);
    canvas.on('object:modified', scheduleContour);
    canvas.on('object:removed', scheduleContour);
    if (canvas.getObjects().some((object) => object.data?.category)) scheduleContour();

    return () => {
      if (contourTimerRef.current) clearTimeout(contourTimerRef.current);
      canvas.off('object:added', scheduleContour);
      canvas.off('object:modified', scheduleContour);
      canvas.off('object:removed', scheduleContour);
    };
  }, [canvasProperties.grow, fabricCanvasRef, handleDieCut, isReady]);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isReady) return;

    const resizeArtboard = (fitViewport: boolean) => {
      const result = expandArtboardToArtwork(canvas, {
        frameWidth: canvasProperties.frameWidth,
        frameHeight: canvasProperties.frameHeight,
        cutlinePadding: Math.min(30, Math.max(4, canvasProperties.grow)),
        fitViewport,
      });
      if (!result || (!result.expanded && !result.zoomChanged)) return;
      dispatch(setCanvasProperties({
        frameWidth: result.frameWidth,
        frameHeight: result.frameHeight,
        bredd: result.bredd,
        hojd: result.hojd,
        canvasInitialZoom: result.zoom,
      }));
      canvas.requestRenderAll();
    };

    const scheduleLiveResize = () => {
      if (artboardFrameRef.current !== null) return;
      artboardFrameRef.current = requestAnimationFrame(() => {
        artboardFrameRef.current = null;
        resizeArtboard(false);
      });
    };
    const settleArtboard = () => resizeArtboard(true);

    canvas.on('object:moving', scheduleLiveResize);
    canvas.on('object:scaling', scheduleLiveResize);
    canvas.on('object:rotating', scheduleLiveResize);
    canvas.on('object:modified', settleArtboard);
    resizeArtboard(true);

    return () => {
      if (artboardFrameRef.current !== null) {
        cancelAnimationFrame(artboardFrameRef.current);
        artboardFrameRef.current = null;
      }
      canvas.off('object:moving', scheduleLiveResize);
      canvas.off('object:scaling', scheduleLiveResize);
      canvas.off('object:rotating', scheduleLiveResize);
      canvas.off('object:modified', settleArtboard);
    };
  }, [canvasProperties.frameHeight, canvasProperties.frameWidth, canvasProperties.grow, dispatch, fabricCanvasRef, isReady]);
  
  
  
  
  useEffect(() => {
    
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // If you want to show a confirmation dialog to the user, set event.returnValue
      event.returnValue = ''; // Setting this property shows the confirmation dialog in some browsers.
      return ''; // This line is necessary for some browsers to show the confirmation dialog.
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
  
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [fabricCanvasRef, dispatch]);
  


  // useEffect(() => {
  //   const canvas = fabricCanvasRef.current;
  //   if (!canvas) {
  //     console.error('Canvas reference is not available');
  //     return;
  //   }
  
  //   const handleActiveObjectChange = () => {
  //     const activeObject = canvas.getActiveObject();
  //     if (activeObject) {
  //       console.log('Active object found:', activeObject);
  //       dispatch(setCanvasProperties({ hasSelected: true }));
  //     } else {
  //       console.log('No active object found');
  //       dispatch(setCanvasProperties({ hasSelected: false }));
  //     }
  //   };
  
  //   // Set up the event listener for when objects are added or modified
  //   canvas.on('object:selected', handleActiveObjectChange);
  //   canvas.on('selection:cleared', handleActiveObjectChange);
  //   canvas.on('object:added', handleActiveObjectChange);
  
  //   // Initial check
  //   handleActiveObjectChange();
  
  //   // Clean up event listeners on component unmount
  //   return () => {
  //     canvas.off('object:selected', handleActiveObjectChange);
  //     canvas.off('selection:cleared', handleActiveObjectChange);
  //     canvas.off('object:added', handleActiveObjectChange);
  //   };
  // }, [fabricCanvasRef, dispatch]);
  

  return (
    <div className="absolute inset-0">
      {canvasProperties.isLoading && <Spinner />}
      <div className="pointer-events-none absolute inset-0 z-10">
        <CanvasFrame fabricCanvas={fabricCanvasRef.current} />
      </div>
      <div className='absolute left-3 top-3 z-[100]'>
        <Controls canvasRef={fabricCanvasRef} />
      </div>
      <EditorCommandBar />
      {fabricCanvasRef.current && isReady && <TextPath fabricCanvas={fabricCanvasRef} saveState={saveState} />}
      {fabricCanvasRef.current && isReady && <ImageComponent fabricCanvas={fabricCanvasRef} images={imagePreviews} saveState={saveState} />}
      <ControlElements canvasRef={fabricCanvasRef} selected={canvasProperties.hasSelected} ready={isReady} />
      <canvas ref={htmlCanvasRef} width={Math.max(1, Math.round(canvasProperties.canvasWidth))} height={Math.max(1, Math.round(canvasProperties.canvasHeight))} className="absolute inset-0 bg-transparent" />
    </div>
  );
};

export default React.memo(FabricCanvas);
