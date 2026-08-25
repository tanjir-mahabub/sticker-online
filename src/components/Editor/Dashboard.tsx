import dynamic from 'next/dynamic';
import { useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCanvasProperties } from '@/redux/features/canvasSlice';

const FabricCanvasNoSSR = dynamic(() => import('@/components/Editor/CanvasTools/FabricCanvas'), {
  ssr: false, // This line disables server-side rendering
});

const Dashboard = () => {
  const divRef = useRef<HTMLDivElement | null>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const element = divRef.current;
    if (!element) return;

    const syncDimensions = () => {
      const width = Math.round(element.clientWidth);
      const height = Math.round(element.clientHeight);

      // Fabric cannot recover from a zero-sized backstore or viewport matrix.
      if (width < 1 || height < 1) return;

      dispatch(setCanvasProperties({ canvasWidth: width, canvasHeight: height }));
    };

    const observer = new ResizeObserver(syncDimensions);
    observer.observe(element);
    syncDimensions();

    return () => observer.disconnect();
  }, [dispatch]);

  return (
    <main ref={divRef} className="editor-canvas relative min-h-0 min-w-0 flex-1 overflow-hidden">
      <FabricCanvasNoSSR />
    </main>
  );
};

export default Dashboard;
