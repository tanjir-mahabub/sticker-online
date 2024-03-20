import { ImageProps } from "@/components/Editor/CanvasTools/Image";
import { RectangleProps } from "@/components/Editor/CanvasTools/Rectangle";


export const initialRectangles: RectangleProps['shapeProps'][] = [
    {
        x: 10,
        y: 10,
        width: 100,
        height: 100,
        fill: 'white',
        id: 'rect1',
    },
    {
        x: 150,
        y: 150,
        width: 100,
        height: 100,
        fill: 'green',
        id: 'rect2',
    },
];

export const initialImages: ImageProps['imageProps'][] = [
    {
        x: 300,
        y: 50,
        width: 200,
        height: 200,
        src: '/editor/sidebar/sticker-sample.svg',
        id: 'img1',
    },
    {
        x: 600,
        y: 50,
        width: 200,
        height: 200,
        src: '/editor/sidebar/sticker-sample-two.svg',
        id: 'img2',
    },
    {
        x: 650,
        y: 50,
        width: 200,
        height: 200,
        src: '/editor/sidebar/spiderman.png',
        id: 'img2',
    },
];
