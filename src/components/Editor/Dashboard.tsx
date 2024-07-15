import dynamic from 'next/dynamic';
import { useRef, useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { setCanvasProperties } from '@/redux/features/canvasSlice';

const FabricCanvasNoSSR = dynamic(() => import('@/components/Editor/CanvasTools/FabricCanvas'), {
  ssr: false, // This line disables server-side rendering
});

const Dashboard = () => {
  const divRef = useRef<HTMLDivElement | null>(null);

  const [containerDimensions, setContainerDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => {
      if (divRef.current) {
        const { clientWidth, clientHeight } = divRef.current;
        setContainerDimensions({ width: clientWidth, height: clientHeight });
        dispatch(setCanvasProperties({
          canvasWidth: clientWidth,
          canvasHeight: clientHeight
        }));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dispatch]);

  return (
    <div ref={divRef} className="relative top-0 left-0 w-full h-full overflow-hidden lg:border-l bg-so-deep-gray">
      <FabricCanvasNoSSR />
    </div>
  );
};

export default Dashboard;
