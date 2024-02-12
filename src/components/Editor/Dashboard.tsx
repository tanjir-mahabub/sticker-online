import dynamic from 'next/dynamic';
import { useRef, useEffect, useState } from 'react';
import Loading from '../Utils/Loading';

const Canvas = dynamic(() => import('./CanvasTools/Canvas'), {
    loading: () => <Loading />,
    ssr: false,
});

const Dashboard = () => {
    const divRef = useRef<HTMLDivElement>(null);
    const [innerWidth, setInnerWidth] = useState(0);
    const [innerHeight, setInnerHeight] = useState(0);

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

    return (
        <div ref={divRef} className="relative top-0 left-0 w-[75vw] overflow-hidden border-l bg-so-deep-gray">
            {/* <Canvas width={innerWidth} height={innerHeight} /> */}
            <Canvas width={innerWidth} height={innerHeight} />
        </div>
    );
};

export default Dashboard;
