import React from 'react';
import { Stage, Layer, Rect } from 'react-konva';

interface CanvasProps {
    width?: number;
    height?: number;
}

const Canvas: React.FC<CanvasProps> = (props) => {
    return (
        <Stage width={window.innerWidth} height={window.innerHeight}>
            <Layer>
                <Rect width={500} height={500} x={400} y={80} fill="green" />
            </Layer>
        </Stage>
    );
};

export default Canvas;
