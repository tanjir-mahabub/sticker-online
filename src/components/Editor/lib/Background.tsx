import React, { forwardRef, useEffect, useRef } from 'react';
import Konva from 'konva';
import { Stage, Layer, Transformer } from 'react-konva';

type positionProps = {
    x: number,
    y: number
}

const Background: React.FC = () => {
    const stageRef = useRef<Konva.Stage | null>(null);
    const layerRef = useRef<Konva.Layer | null>(null);
    const transformerRef = useRef<Konva.Transformer | null>(null);

    useEffect(() => {
        const wrapper = stageRef.current?.content.parentElement?.parentElement?.parentElement;
        console.log(wrapper);
        const width = wrapper?.offsetWidth;
        const height = wrapper?.offsetHeight;

        if (width && height) {
            const stage = new Konva.Stage({
                container: 'konva-container',
                width: width,
                height: height,
            });

            const layer = new Konva.Layer();
            stage.add(layer);

            const xSnaps = Math.round(stage.width() / 100);
            const ySnaps = Math.round(stage.height() / 100);
            const cellWidth = stage.width() / xSnaps;
            const cellHeight = stage.height() / ySnaps;

            // for (let i = 0; i < xSnaps; i++) {
            //     layer.add(
            //         new Konva.Line({
            //             x: i * cellWidth,
            //             points: [0, 0, 0, stage.height()],
            //             stroke: 'rgba(0, 0, 0, 0.2)',
            //             strokeWidth: 1,
            //         })
            //     );
            // }

            // for (let i = 0; i < ySnaps; i++) {
            //     layer.add(
            //         new Konva.Line({
            //             y: i * cellHeight,
            //             points: [0, 0, stage.width(), 0],
            //             stroke: 'rgba(0, 0, 0, 0.2)',
            //             strokeWidth: 1,
            //         })
            //     );
            // }

            const rect = new Konva.Rect({
                x: 20,
                y: 20,
                width: 500,
                height: 500,
                fill: 'red',
                draggable: false
            });

            rect.position({
                x: 400,
                y: 100,
            });

            layer.add(rect);

            const tr = new Konva.Transformer({
                nodes: [rect],
                anchorDragBoundFunc: function (oldPos: positionProps, newPos: positionProps) {

                    // do not snap rotating point
                    if (tr.getActiveAnchor() === 'rotater') {
                        return newPos;
                    }

                    const dist = Math.sqrt(
                        Math.pow(newPos.x - oldPos.x, 2) + Math.pow(newPos.y - oldPos.y, 2)
                    );

                    // do not do any snapping with new absolute position (pointer position)
                    // is too far away from old position
                    if (dist > 10) {
                        return newPos;
                    }

                    const closestX = Math.round(newPos.x / cellWidth) * cellWidth;
                    const diffX = Math.abs(newPos.x - closestX);

                    const closestY = Math.round(newPos.y / cellHeight) * cellHeight;
                    const diffY = Math.abs(newPos.y - closestY);

                    const snappedX = diffX < 10;
                    const snappedY = diffY < 10;

                    // a bit different snap strategies based on snap direction
                    // we need to reuse old position for better UX
                    if (snappedX && !snappedY) {
                        return {
                            x: closestX,
                            y: oldPos.y,
                        };
                    } else if (snappedY && !snappedX) {
                        return {
                            x: oldPos.x,
                            y: closestY,
                        };
                    } else if (snappedX && snappedY) {
                        return {
                            x: closestX,
                            y: closestY,
                        };
                    }
                    return newPos;
                },
            });
            layer.add(tr);

            stageRef.current = stage;
            layerRef.current = layer;
            transformerRef.current = tr;

            // Clean up Konva objects on component unmount
            return () => {
                if (stageRef.current) {
                    stageRef.current.destroy();
                }
            };
        }
    }, []); // Empty dependency array ensures that the effect runs only once on component mount

    return (
        <div id="konva-container">
            <Stage width={window.innerWidth} height={window.innerHeight} ref={stageRef}>
                <Layer ref={layerRef} />
                {transformerRef.current && (
                    <Transformer ref={transformerRef} boundBoxFunc={(oldBox, newBox) => newBox} />
                )}
            </Stage>
        </div>
    );
};

export default Background;
