import React from 'react';
import { fabric } from 'fabric';

interface ControlsProps {
  canvasRef: React.MutableRefObject<fabric.Canvas | null>;
}

const Controls: React.FC<ControlsProps> = ({ canvasRef }) => {
  const exportToSVG = () => {
    if (canvasRef.current) {
      const svgData = canvasRef.current.toSVG();
      console.log(svgData);

      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'canvas.svg';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return <button onClick={exportToSVG}>Export to SVG</button>;
};

export default Controls;
