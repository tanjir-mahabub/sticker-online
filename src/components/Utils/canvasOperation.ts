import jsPDF from 'jspdf';
import Konva from "konva";
import { ImageProps } from "../Editor/CanvasTools/Image";
import { RectangleProps } from "../Editor/CanvasTools/Rectangle";
import { TextProps } from "../Editor/CanvasTools/Text";

export const checkDeselect = (e: Konva.KonvaEventObject<MouseEvent> | Konva.KonvaEventObject<TouchEvent>, setSelectedId: React.Dispatch<React.SetStateAction<string | null>>) => {
    if (e.target === e.target.getStage()) {
        setSelectedId(null);
    }
};

export const handleRectChange = (index: number, newAttrs: Partial<RectangleProps['shapeProps']>, rectangles: RectangleProps['shapeProps'][], setRectangles: React.Dispatch<React.SetStateAction<RectangleProps['shapeProps'][]>>) => {
    const updatedRectangles = rectangles.map((rect, i) => (i === index ? { ...rect, ...newAttrs } : rect));
    setRectangles(updatedRectangles);    
};

export const handleImageChange = (index: number, newAttrs: Partial<ImageProps['imageProps']>, images: ImageProps['imageProps'][], setImages: React.Dispatch<React.SetStateAction<ImageProps['imageProps'][]>>) => {
    const updatedImages = images.map((img, i) => (i === index ? { ...img, ...newAttrs } : img));
    setImages(updatedImages);    
};

export const handleMotiveChange = (index: number, newAttrs: Partial<ImageProps['imageProps']>, motives: ImageProps['imageProps'][], setMotives: React.Dispatch<React.SetStateAction<ImageProps['imageProps'][]>>) => {
    const updatedMotives = motives.map((img, i) => (i === index ? { ...img, ...newAttrs } : img));
    setMotives(updatedMotives);    
};

export const handleTextChange = (index: number, newAttrs: Partial<TextProps['textProps']>, texts: TextProps['textProps'][], setTexts: React.Dispatch<React.SetStateAction<TextProps['textProps'][]>>) => {
    const updatedTexts = texts.map((text, i) => (i === index ? { ...text, ...newAttrs } : text));
    setTexts(updatedTexts);    
};



// Export file functions
export const canvasToSvgString = (canvas: HTMLCanvasElement): string => {
    const dataUrl = canvas.toDataURL('image/png');
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${canvas.width}" height="${canvas.height}">
        <image xlink:href="${dataUrl}" width="${canvas.width}" height="${canvas.height}" />
      </svg>`;
    return svgString;
};

export const downloadURI = (uri: string, name: string) => {
    var link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const handleExport = (format: 'png' | 'jpg' | 'svg' | 'pdf', stage: Konva.Stage) => {
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
                    orientation: 'landscape',
                    unit: 'px',
                    format: 'a4',
                });
                const pdfDataURL = stage.toDataURL({ pixelRatio: 3, mimeType: 'image/png' });
                pdf.addImage(pdfDataURL, 'PNG', -20, -250, stage.width(), stage.height(), 'abc', 'FAST', 0);
                pdf.save('exported_image.pdf');
                break;
            default:
                console.error('Unsupported format:', format);
        }
    } else {
        console.error('Stage not available');
    }
};
