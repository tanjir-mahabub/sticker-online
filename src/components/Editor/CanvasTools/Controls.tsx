import React from 'react';
import { fabric } from 'fabric';
import { useDieCutEffect } from '@/hooks/useDieCutEffect';

interface ControlsProps {
  canvasRef: React.MutableRefObject<fabric.Canvas | null>;
}

const Controls: React.FC<ControlsProps> = ({ canvasRef }) => {  

  const { handleDownloadSVG } = useDieCutEffect();

  return <button onClick={handleDownloadSVG}>Export to SVG</button>;
};

export default Controls;
