import React from 'react';
import { fabric } from 'fabric';
import { useEditorI18n } from '@/context/EditorI18nContext';

interface ControlsProps {
  canvasRef: React.MutableRefObject<fabric.Canvas | null>;
}

const Controls: React.FC<ControlsProps> = ({ canvasRef }) => {  

  const { t } = useEditorI18n();

  return <button className="editor-export-button" onClick={()=>window.dispatchEvent(new Event('sticker:open-order'))} title={t('print')}>
    <span>↗</span><div><small>{t('print')}</small><strong>{t('review')}</strong></div>
  </button>;
};

export default Controls;
