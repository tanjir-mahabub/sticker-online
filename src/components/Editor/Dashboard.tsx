import dynamic from 'next/dynamic';
import { useRef, useEffect, useState } from 'react';
import Loading from '../Utils/Loading';
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { setCanvasProperties } from '@/redux/features/canvasSlice';


const Canvas = dynamic(() => import('./CanvasTools/Canvas'), {
    loading: () => <Loading />,
    ssr: false,
});

const RaphaelComponentNoSSR = dynamic(() => import('@/components/Editor/VectorTools/Vector'), {
    ssr: false, // This line disables server-side rendering
});

const Dashboard = () => {
    const divRef = useRef<HTMLDivElement>(null);
    const [innerWidth, setInnerWidth] = useState(0);
    const [innerHeight, setInnerHeight] = useState(0);
    const [CanvasProps, setCanvasProps] = useState({});

    const dispatch = useDispatch();

    const CanvasProperties = useAppSelector(state => state.canvas);

    const { centerX, centerY, frameWidth, frameHeight } = CanvasProperties;

    const FileState = useAppSelector(state => state.file)

    useEffect(() => {
        const handleResize = () => {
            if (divRef.current) {
                setInnerWidth(divRef.current.clientWidth);
                setInnerHeight(divRef.current.clientHeight);
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // useEffect(() => {
    //     setCanvasProps({
    //         width: innerWidth,
    //         height: innerHeight,
    //         frameWidth: frameWidth,
    //         frameHeight: frameHeight,
    //         centerX: innerWidth / 2,
    //         centerY: innerHeight / 2
    //     })
    // }, [innerWidth, innerHeight, frameWidth, frameHeight]);

    useEffect(() => {
        // Calculate the aspect ratios
        const canvasAspectRatio = innerWidth / innerHeight;
        const frameAspectRatio = frameWidth / frameHeight;

        // Calculate the scale to fit the frame within 90% of the canvas
        let scale;
        if (frameAspectRatio > canvasAspectRatio) {
            // Frame is wider than canvas, scale based on width
            scale = (innerWidth * 0.75) / frameWidth;
        } else {
            // Frame is taller than canvas, scale based on height
            scale = (innerHeight * 0.75) / frameHeight;
        }

        // Calculate new frame dimensions
        const scaledFrameWidth = frameWidth * scale;
        const scaledFrameHeight = frameHeight * scale;

        // Adjust center position based on scaled size
        const scaledCenterX = innerWidth / 2 - scaledFrameWidth / 2;
        const scaledCenterY = innerHeight / 2 - scaledFrameHeight / 2;

        setCanvasProps({
            width: innerWidth,
            height: innerHeight,
            frameWidth: scaledFrameWidth,
            frameHeight: scaledFrameHeight,
            centerX: scaledCenterX + scaledFrameWidth / 2, // Center of the scaled frame
            centerY: scaledCenterY + scaledFrameHeight / 2, // Center of the scaled frame
            scale // You might need to adjust how this scale is applied within your Canvas component
        });

        dispatch(setCanvasProperties({
            frameWidth: scaledFrameWidth,
            frameHeight: scaledFrameHeight,
            centerX: scaledCenterX + scaledFrameWidth / 2, // Center of the scaled frame
            centerY: scaledCenterY + scaledFrameHeight / 2, // Center of the scaled frame            
        }))
    }, [innerWidth, innerHeight, frameWidth, frameHeight, dispatch]);


    return (
        <div ref={divRef} className="relative top-0 left-0 w-[75vw] overflow-hidden border-l bg-so-deep-gray">
            {CanvasProps && (
                // <Canvas {...CanvasProps} />
                <RaphaelComponentNoSSR />
            )}
        </div>
    );
};

export default Dashboard;
