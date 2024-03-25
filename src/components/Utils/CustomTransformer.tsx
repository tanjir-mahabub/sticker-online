import Konva from 'konva';
import { FC, RefObject, useEffect, useMemo, useRef } from 'react';
import { Transformer } from 'react-konva';

import RotationIcon from '../../../public/rotateIcon.svg';

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
            trRef.current.moveToTop();
            trRef.current.getLayer()?.batchDraw();
        }

        if (shapeRef.current && trRef.current && !isSelected) {
            trRef.current.nodes([]);
            trRef.current.getLayer()?.batchDraw();
        }
    }, [shapeRef, isSelected]);

    // useEffect(() => {
    //     // Inside your component or a useEffect hook
    //     const stage = shapeRef?.current?.getStage(); // Assuming shapeRef is your shape's ref

    //     if (stage) {
    //         stage.on('mousemove', function (e) {
    //             const pointerPosition = stage.getPointerPosition();
    //             // You'll need to implement logic to determine if the pointer is near the rotate anchor
    //             const nearRotateAnchor = checkIfNearRotateAnchor(pointerPosition);
    //             if (nearRotateAnchor) {
    //                 document.body.style.cursor = "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHZpZXdCb3g9IjAgMCAzNSAzNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxjaXJjbGUgY3g9IjE3LjUiIGN5PSIxNy41IiByPSIxNy41IiBmaWxsPSIjMTIxMjEyIi8+DQo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDBfMTc1XzQ5NTQpIj4NCjxwYXRoIGQ9Ik0yNy4wODM0IDkuNjY2NjlWMTUuMTY2N0gyMS41ODM0IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPg0KPHBhdGggZD0iTTI0Ljc4MjUgMTkuNzVDMjQuMTg2NiAyMS40MzY2IDIzLjA1ODcgMjIuODgzOCAyMS41Njg4IDIzLjg3MzZDMjAuMDc4OCAyNC44NjM0IDE4LjMwNzYgMjUuMzQyMiAxNi41MjE5IDI1LjIzNzdDMTQuNzM2MiAyNS4xMzMyIDEzLjAzMjggMjQuNDUxMiAxMS42Njg0IDIzLjI5NDRDMTAuMzA0IDIyLjEzNzcgOS4zNTI2MSAyMC41Njg4IDguOTU3NDcgMTguODI0MkM4LjU2MjM0IDE3LjA3OTYgOC43NDQ5MSAxNS4yNTM5IDkuNDc3NjggMTMuNjIyMUMxMC4yMTA0IDExLjk5MDQgMTEuNDUzNyAxMC42NDEgMTMuMDIwMSA5Ljc3NzI0QzE0LjU4NjUgOC45MTM1NCAxNi4zOTEyIDguNTgyMzMgMTguMTYyMyA4LjgzMzU0QzE5LjkzMzMgOS4wODQ3NSAyMS41NzQ3IDkuOTA0NzUgMjIuODM5MSAxMS4xN0wyNy4wODMzIDE1LjE2NjciIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+DQo8L2c+DQo8ZGVmcz4NCjxjbGlwUGF0aCBpZD0iY2xpcDBfMTc1XzQ5NTQiPg0KPHJlY3Qgd2lkdGg9IjIyIiBoZWlnaHQ9IjIyIiBmaWxsPSJ3aGl0ZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNiA2KSIvPg0KPC9jbGlwUGF0aD4NCjwvZGVmcz4NCjwvc3ZnPg0K'), auto"; // Your base64 SVG cursor
    //                 console.log('doing');
    //             } else {
    //                 document.body.style.cursor = 'default';
    //                 console.log('not doing');
    //             }
    //         });

    //     }

    // }, [trRef, shapeRef])

    // const checkIfNearRotateAnchor = (pointerPosition: any) => {
    //     // Assuming the transformer is assigned to the shape and trRef.current is the transformer reference
    //     if (!trRef.current) return false;

    //     const node = trRef.current.getNode(); // The node the transformer is attached to
    //     if (!node) return false;

    //     // Approximate rotate anchor position (this is simplistic and might need adjustment)
    //     const anchorOffset = 20; // Assuming the rotate handle is roughly 50 pixels offset from the top
    //     const { x: nodeX, y: nodeY, width, height } = node.getClientRect();
    //     const rotateAnchorX = nodeX + width / 2;
    //     const rotateAnchorY = nodeY - anchorOffset;

    //     // Check if the pointer is within a certain range of the rotate anchor position
    //     const proximityThreshold = 15; // How close the pointer needs to be to the anchor (in pixels)
    //     const isNearX = Math.abs(pointerPosition.x - rotateAnchorX) < proximityThreshold;
    //     const isNearY = Math.abs(pointerPosition.y - rotateAnchorY) < proximityThreshold;

    //     return isNearX && isNearY;
    // }

    // const anchorShape: HTMLCanvasElement | undefined = useMemo(() => {
    //     const canvas = document.createElement("canvas");
    //     canvas.width = 12;
    //     canvas.height = 12;
    //     const ctx = canvas.getContext("2d");
    //     if (ctx) {

    //         const image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAAAXNSR0IArs4c6QAABI1JREFUWEfNWFsodWkYfr69i+S89uYXjRxSfy4cZoYYN8xgUMyEzB1TZChcMbhwmkSUXDg1RTkk4WamFKP5J1Go+XFBOV0whkT2oqQc9ze9328be/9777W2+stXq73X+t73/Z7vPTzvtxaDg0OSpG8ZY19zzr8AEMY5f8MYc+ac3zDGTgDsMsZWOOd/ybL8hyPmmRphSZI+Y4yVcc5/BOCrRudR5pQxNsg575Zl+V8lPUUwkiQ1AahXMqRi/hdZlhvsydkEo9frPzcajb8C+FLFQmpF3ms0mp/Ozs5WrSlYBaPT6b4zGo3jlAtqV1ErR7ml0Wh+MBgMv1vqfASGgHDOf1Nr/KVyjLHvLQGZgaHQPDw8LH4Kj1iCJg9ptdqvnofMDIwkSX+rzRHGGHx8fODv7w9XV1dcXl5ifX0dnHNHnPVeluUYk8ITGLVV4+LigsLCQpSVlQkwz8f5+TkWFhbQ1dWF1VXzHPXy8oKbmxsODw8twT5VmQBDPALgQGlL8fHx6O/vh5+fnxC9vr7Gzs6O8EpYWBh8fT9Q0N3dHSoqKjAxMfFkcn5+HqGhoQgICLC2TCDxkACj0+naOOc/2wNDxuvr60HhWVlZQWdnJ2ZmZp7CQs8TEhJQXl6O5ORkYaqhoQHd3d3iP4HW6XTi+qiKGGs3GAzVJs8Qjdtk1rS0NIyOjgobvb29aGxsxMPDg1XsBKq6uhpVVVVifmBgQNxvb2/bBAPgVJblN4x6DYAZW17x8PDA0tKSCE1LSws6OjqUoinms7KyREi1Wi3Gx8eFt2x55tFgGlMKEe2wpqYGFPPs7GyHqiUlJQXDw8NwcnLC7e2t+LUWJgLDGGsnz/wJ4Btb26W8iImJQWZmJhYXFxW9EhgYiLa2NlHuNDw9PREeHg6NRiPubYEB8I7A/AMg0NoqZHBvbw83NzcIDg7G/f29IpiMjAyMjIxYlSMO0uv1tmwcMG9v72tbjEvlury8jN3dXcTFxSkCMQlERUU9ecb0jDxCdjY3N20BvSHP2KRMYldi1aOjI0RERKgG81JBu55xd3fH/v4+rq6uBGERmTk6QkJCIMsyLi4u7KqKk6K9nCFtondKwIKCAkxNTTmE5e3bt5ibm8Ps7Czy8/OVdA8Uq6moqEhUBxnNyclRMmg2PzY2htTUVMHcPT09SrrvFHmGSG9rawvOzs4oLS016zf2rMfGxmJ6ehrHx8eIjo5WDLGJZ+wyMC2Yl5eHvr4+GI1GVFZWYmhoyO4uc3NzhTepU5eUlGByclLJKzSfpqo3kWRxcTFaW1uFUWoPTU1NWFtbM+MeKum6ujokJiYKOWqmzc3NaoB86E2PrKjYtUkuKSkJ7e3toAqhQWS4sbEh+k9QUJDwBA2i/traWgwODqoBIlrB866t6jxDlqm/0OEqPT1dtAm6Nw0qfepF1ExPTuggoHr8f54hFbUnvefmKakjIyNFcp6enorrBVxkftIzLeDIGVj1nu0LWj8Dk86rejt4TObX8d5k8uireaM0AXo179rPc+4lVWYjZ1/+FcIC0Ov4PmO5y0/55eo/ZrAPXRp/OeMAAAAASUVORK5CYII=';

    //         return canvas;
    //     }
    // }, []);

    // useEffect(() => {
    //     const node = trRef.current;
    //     if (node) {
    //         node.anchorStyleFunc((anchor) => {
    //             if (anchor.hasName('rotater')) {
    //                 anchor.size({ width: 28, height: 28 });
    //                 anchor.x(anchor.x() - 6);
    //                 anchorShape && anchor.fillPatternImage(anchorShape);
    //             }
    //         })
    //     }
    // })

    return (
        <Transformer
            name='custom-transformer'
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
