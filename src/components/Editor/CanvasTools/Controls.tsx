import React from 'react';
import { fabric } from 'fabric';
import { useDieCutEffect } from '@/hooks/useDieCutEffect';

interface ControlsProps {
  canvasRef: React.MutableRefObject<fabric.Canvas | null>;
}

const Controls: React.FC<ControlsProps> = ({ canvasRef }) => {  

  const { handleDownloadSVG } = useDieCutEffect();

  return <button className="editor-export-button" onClick={handleDownloadSVG} title="Export a print-ready vector file">
    <span>↗</span><div><small>Print ready</small><strong>Export SVG</strong></div>
  </button>;
};

export default Controls;
