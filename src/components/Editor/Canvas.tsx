import Konva from 'konva';
import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Rect, Image as KonvaImage, Transformer } from 'react-konva';
import jsPDF from 'jspdf';

interface CanvasProps {
    width?: number;
    height?: number;
    originalWidth?: number;
    originalHeight?: number;
}

const Canvas: React.FC<CanvasProps> = ({
    width = 0,
    height = 0,
    originalWidth = 6.5,
    originalHeight = 5,
}) => {
    const frameRef = useRef<Konva.Rect>(null);

    const [images, setImages] = useState<Konva.Image[]>([]);
    const [selectedImage, setSelectedImage] = useState<number | null>(null);

    const stageRef = useRef<Konva.Stage>(null);
    const transformerRef = useRef<Konva.Transformer | null>(null);

    const dpi = 300;
    const cmToPx = (cm: number, dpi: number) => (cm / 2.54) * dpi;

    const widthInPixels = cmToPx(originalWidth, dpi);
    const heightInPixels = cmToPx(originalHeight, dpi);

    const centerX = width / 2;
    const centerY = height / 2;

    const frameWidth = widthInPixels * 0.7;
    const frameHeight = heightInPixels * 0.7;

    const handleSelectImage = (index: number) => {
        setSelectedImage(index);
    };

    const handleDeselectImage = () => {
        setSelectedImage(null);
    };

    const handleAddImage = () => {
        const imageUrl = '/editor/sidebar/sticker-sample.svg';

        Konva.Image.fromURL(imageUrl, (konvaImage) => {
            // Set initial properties for the Konva.Image
            konvaImage.setAttrs({
                x: centerX - frameWidth / 3,
                y: centerY - frameHeight / 3,
                width: frameWidth * 0.7,
                height: frameHeight * 0.7,
                draggable: true,
            });

            // Update the state with the new Konva.Image
            setImages([...images, konvaImage]);
        });
    };


    const handleDragMove = (index: number, e: Konva.KonvaEventObject<DragEvent>) => {
        const image = images[index];
        const frame = frameRef.current; // Use frameRef here

        // Check if frameRef is defined
        if (!frame) return;

        // Calculate the frame boundaries
        const frameLeft = frame.x();
        const frameTop = frame.y();
        const frameRight = frameLeft + frame.width();
        const frameBottom = frameTop + frame.height();

        // Calculate the image boundaries
        const imageLeft = e.target.x();
        const imageTop = e.target.y();
        const imageRight = imageLeft + e.target.width();
        const imageBottom = imageTop + e.target.height();

        // Check if the image is crossing over the frame boundaries
        if (imageLeft < frameLeft || imageTop < frameTop || imageRight > frameRight || imageBottom > frameBottom) {
            // Adjust the image position to stay within the frame boundaries
            e.target.x(Math.min(Math.max(imageLeft, frameLeft), frameRight - e.target.width()));
            e.target.y(Math.min(Math.max(imageTop, frameTop), frameBottom - e.target.height()));
        }
    };

    useEffect(() => {
        // Wait for images to load before drawing them on the canvas
        const loadImage = async (image: Konva.Image) => {
            return new Promise<void>((resolve) => {
                image.on('image', () => {
                    resolve(); // Resolve without any argument
                });
            });
        };

        const drawImages = async () => {
            const layer = stageRef.current?.findOne('.images-layer') as Konva.Layer;

            for (const image of images) {
                await loadImage(image);
                layer.add(image);
            }

            layer.draw();
        };


        drawImages();
    }, [images]);

    const canvasToSvgString = (canvas: HTMLCanvasElement): string => {
        const dataUrl = canvas.toDataURL('image/png');
        const svgString = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${canvas.width}" height="${canvas.height}">
            <image xlink:href="${dataUrl}" width="${canvas.width}" height="${canvas.height}" />
          </svg>`;
        return svgString;
    };

    const downloadURI = (uri: string, name: string) => {
        var link = document.createElement('a');
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExport = (format: 'png' | 'jpg' | 'svg' | 'pdf') => {
        console.log('clicked', format);
        if (transformerRef.current) {
            const stage = transformerRef.current.getStage();

            if (stage) {
                switch (format) {
                    case 'png':
                        const pngDataURL = stage.toDataURL({ pixelRatio: 3, mimeType: 'image/png' });

                        downloadURI(pngDataURL, `export_sticker.${format}`);

                        break;
                    case 'jpg':
                        const jpgDataURL = stage.toDataURL({ pixelRatio: 3, mimeType: 'image/jpeg' });

                        downloadURI(jpgDataURL, `export_sticker.${format}`);

                        break;
                    case 'svg':
                        const svgString = canvasToSvgString(stage.toCanvas());
                        const blob = new Blob([svgString], { type: 'image/svg+xml' });
                        const svgURL = URL.createObjectURL(blob);
                        const svgA = document.createElement('a');
                        svgA.href = svgURL;
                        svgA.download = `exported_image.svg`;
                        document.body.appendChild(svgA);
                        svgA.click();
                        document.body.removeChild(svgA);
                        URL.revokeObjectURL(svgURL);
                        break;
                    case 'pdf':
                        const pdf = new jsPDF({
                            orientation: 'landscape', // Set the orientation to landscape
                            unit: 'px',
                            format: 'a4',
                        });
                        console.log(stage);
                        const pdfDataURL = stage.toDataURL({ pixelRatio: 3, mimeType: 'image/png' });

                        // Add image to PDF

                        pdf.addImage(pdfDataURL, 'PNG', -20, -250, widthInPixels, heightInPixels, 'abc', 'FAST', 0);

                        // Save the PDF
                        pdf.save('exported_image.pdf');
                        break;
                    default:
                        console.error('Unsupported format:', format);
                }
            } else {
                console.error('Stage not available');
            }
        } else {
            console.log('Transformer not available');
        }
    };

    return (
        <>
            <div className="absolute top-0 left-0 flex justify-center h-full">
                <div
                    className="absolute h-3 flex justify-center items-center border-x border-gray-800/20"
                    style={{
                        top: `${centerY - frameHeight / 2 - (frameHeight * 0.07)}px`,
                        left: `${centerX - frameWidth / 2}px`,
                        width: `${frameWidth}px`,
                    }}
                >
                    <hr className="w-full border-t border-gray-800/20" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-so-deep-gray p-2 rounded">
                        <span className="text-black font-bold">6.5 cm</span>
                    </div>
                </div>
                <div
                    className="absolute h-3 flex justify-center items-center border-x border-gray-800/20 rotate-90"
                    style={{
                        top: `${centerY - frameHeight / 2 + (frameHeight * 0.485)}px`,
                        left: `${centerX + frameWidth / 2 - (frameHeight * 0.42)}px`,
                        width: `${frameHeight}px`,
                    }}
                >
                    <hr className="w-full border-t border-gray-800/20" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-so-deep-gray p-2 rounded">
                        <span className="text-black font-bold">5 cm</span>
                    </div>
                </div>
                {/* <div className="absolute bottom-40 -right-40 w-full mx-auto h-3 flex justify-center items-center gap-5 z-50">
                    <button onClick={() => handleExport('png')}>Export as PNG</button>
                    <button onClick={() => handleExport('jpg')}>Export as JPG</button>
                    <button onClick={() => handleExport('svg')}>Export as SVG</button>
                    <button onClick={() => handleExport('pdf')}>Export as PDF</button>
                    <button onClick={handleAddImage}>Add Image</button>
                </div> */}
            </div>

            <Stage width={width} height={height} ref={stageRef}>
                <Layer name="images-layer">
                    <Rect
                        width={frameWidth}
                        height={frameHeight}
                        x={centerX - frameWidth / 2}
                        y={centerY - frameHeight / 2}
                        fill="transparent"
                        stroke="black"
                        strokeWidth={0.2}
                        ref={frameRef} // Use frameRef directly
                    />

                    {images.map((image, index) => (
                        <React.Fragment key={index}>
                            <KonvaImage
                                image={image.image()}
                                x={image.x()}
                                y={image.y()}
                                width={image.width()}
                                height={image.height()}
                                draggable
                                onDragMove={(e) => handleDragMove(index, e)}
                                onTransform={() => { }}
                                onClick={() => handleSelectImage(index)}
                            />
                            {selectedImage === index && transformerRef.current && (
                                <Transformer
                                    ref={(node) => (transformerRef.current![index] = node as any)}
                                    node={image}
                                    boundBoxFunc={(oldBox, newBox) => {
                                        if (newBox.width !== oldBox.width || newBox.height !== oldBox.height) {
                                            return oldBox;
                                        }
                                        return newBox;
                                    }}
                                    keepRatio={true}
                                    enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                                    anchorSize={6}
                                    borderDash={[6, 2]}
                                />
                            )}

                        </React.Fragment>
                    ))}
                </Layer>
            </Stage>
        </>
    );
};

export default Canvas;
