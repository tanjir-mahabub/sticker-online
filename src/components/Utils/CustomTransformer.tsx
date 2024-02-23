import Konva from 'konva';
import { FC, RefObject, useEffect, useRef } from 'react';
import { Transformer } from 'react-konva';

import RotationIcon from '/public/rotateIcon.svg'

const CustomTransformer: FC<{
    shapeRef: RefObject<Konva.Shape>;
    rotateEnabled?: boolean;
    keepRatio?: boolean;
    isSelected?: boolean;
    enabledAnchors?: string[];
}> = ({ shapeRef, isSelected, rotateEnabled, keepRatio, enabledAnchors }) => {
    const trRef = useRef<Konva.Transformer>(null);

    useEffect(() => {
        if (shapeRef.current && trRef.current && isSelected) {
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer()?.batchDraw();
        }

        if (shapeRef.current && trRef.current && !isSelected) {
            trRef.current.nodes([]);
            trRef.current.getLayer()?.batchDraw();
        }
    }, [shapeRef, isSelected]);

    useEffect(() => {
        // console.log(trRef.current?.rotateAnchorCursor.prototype);
    }, [trRef])

    return (
        <Transformer
            ref={trRef}
            rotateEnabled={rotateEnabled}
            keepRatio={keepRatio}
            anchorFill={'white'}
            anchorStrokeWidth={1}
            anchorCornerRadius={100}
            anchorStroke={'black'}
            anchorSize={15}
            enabledAnchors={enabledAnchors}
            // rotateAnchorCursor={"move"}
            borderDash={[2, 2]}
            borderStroke={'gray'}
        />);
};

export default CustomTransformer;
