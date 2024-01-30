'use client';
import dynamic from 'next/dynamic';
import Loading from '../Utils/Loading';


const Canvas = dynamic(() => import('./Canvas'), {
    loading: () => <Loading />,
    ssr: false,
});


const Dashboard = () => {
    return (
        <div className="w-[75vw] overflow-hidden border-l bg-so-deep-gray">
            <Canvas />
        </div>
    )
}

export default Dashboard