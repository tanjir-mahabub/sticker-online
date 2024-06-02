import dynamic from 'next/dynamic';
import { useRef, useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { setCanvasProperties } from '@/redux/features/canvasSlice';

const RaphaelComponentNoSSR = dynamic(() => import('@/components/Editor/VectorTools/Vector'), {
    ssr: false, // This line disables server-side rendering
});

const Dashboard = () => {
    const divRef = useRef<HTMLDivElement | null>(null);

    const [containerDimensions, setContainerDimensions] = useState<{
        width: number;
        height: number;
    }>({ width: 0, height: 0 });

    const dispatch = useDispatch();

    const CanvasProperties = useAppSelector(state => state.canvas);

    const { centerX, centerY, frameWidth, frameHeight } = CanvasProperties;

    useEffect(() => {
        const handleResize = () => {
            if (divRef?.current) {
                const { clientWidth, clientHeight } = divRef.current;
                setContainerDimensions({ width: clientWidth, height: clientHeight });
                console.log('handleResize', clientWidth, clientHeight);
                dispatch(setCanvasProperties({
                    canvasWidth: clientWidth,
                    canvasHeight: clientHeight
                }))
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [dispatch]);

    useEffect(() => {
        if(containerDimensions) {
            const { width, height } = containerDimensions;
        // Calculate the aspect ratios
        const canvasAspectRatio = width / height;

        // Calculate the frame dimensions to maintain 75% aspect ratio of container dimensions
        let scaledFrameWidth = width * 0.70;
        let scaledFrameHeight = height * 0.70;

        // If the frame aspect ratio is wider than the canvas, adjust height
        if (frameWidth / frameHeight > canvasAspectRatio) {
            scaledFrameHeight = (width * 0.70) / (frameWidth / frameHeight);
        }
        // If the frame aspect ratio is taller than the canvas, adjust width
        else {
            scaledFrameWidth = (height * 0.70) * (frameWidth / frameHeight);
        }

        // Calculate center position based on scaled size
        const scaledCenterX = width / 2 - scaledFrameWidth / 2;
        const scaledCenterY = height / 2 - scaledFrameHeight / 2;

        dispatch(setCanvasProperties({      
            canvasWidth: width,
            canvasHeight: height,      
            frameWidth: scaledFrameWidth,
            frameHeight: scaledFrameHeight,
            centerX: scaledCenterX + scaledFrameWidth / 2, // Center of the scaled frame
            centerY: scaledCenterY + scaledFrameHeight / 2, // Center of the scaled frame            
        }))
        }
    }, [containerDimensions, frameWidth, frameHeight, dispatch]);


    return (
        <div ref={divRef} className="relative top-0 left-0 w-full h-full overflow-hidden lg:border-l bg-so-deep-gray">
            <RaphaelComponentNoSSR />
        </div>
    );
};

export default Dashboard;
