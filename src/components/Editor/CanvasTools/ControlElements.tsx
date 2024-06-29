import { useEffect, useState, useCallback } from "react";
import ButtonControl from "../lib/ButtonControl";
import RangeSlider from "../Customize/child/Input/RangeSlider";
import { Tooltip } from "@/components/Utils/ToolTips";
import { useAppSelector } from "@/redux/store";
import { useControlButtons } from "@/hooks/useControlButtons";
import { fabric } from "fabric";

interface ControlElementsProps {
  canvasRef: React.MutableRefObject<fabric.Canvas | null>;
  selected: boolean;
}

const ControlElements: React.FC<ControlElementsProps> = ({ canvasRef, selected }) => {
  const updateButtonStates = useCallback(() => {
    const activeObject = canvasRef.current?.getActiveObject();
    if (activeObject && canvasRef.current && selected) {
      const objects = canvasRef.current.getObjects();
      const objectIndex = objects.indexOf(activeObject);

      setSendFrontBTN(objectIndex < objects.length - 1);
      setSendBackBTN(objectIndex > 0);
      setSendForwardBTN(objectIndex < objects.length - 1);
      setSendBackwardBTN(objectIndex > 0);
    } else {
      setSendFrontBTN(false);
      setSendBackBTN(false);
      setSendForwardBTN(false);
      setSendBackwardBTN(false);
    }
  }, [canvasRef, selected]);

  const { handleFlipX, handleFlipY, handleSendFront, handleSendBack, handleSendForward, handleSendBackward, handleDelete, handleCenterEL } = useControlButtons({ canvasRef, updateButtonStates });

  const CanvasProperties = useAppSelector(state => state.canvas);
  const { grow } = CanvasProperties;

  const [sendFrontBTN, setSendFrontBTN] = useState(false);
  const [sendBackBTN, setSendBackBTN] = useState(false);
  const [sendForwardBTN, setSendForwardBTN] = useState(false);
  const [sendBackwardBTN, setSendBackwardBTN] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.on('object:selected', updateButtonStates);
      canvas.on('selection:cleared', updateButtonStates);
      canvas.on('object:modified', updateButtonStates);
    }
    return () => {
      if (canvas) {
        canvas.off('object:selected', updateButtonStates);
        canvas.off('selection:cleared', updateButtonStates);
        canvas.off('object:modified', updateButtonStates);
      }
    };
  }, [canvasRef, updateButtonStates]);

  useEffect(() => {
    updateButtonStates(); // Initial update when component mounts
  }, [updateButtonStates]);

  const buttons = [
    { onClick: handleFlipY, iconSrc: "/mirrorUpDownIcon.svg", tooltip: "Flip Vertically", borderClasses: "border-r-0 border-black/20 rounded-l-full", borderRadiusClasses: "pl-3 pr-1" },
    { onClick: handleFlipX, iconSrc: "/mirrorSideIcon.svg", tooltip: "Flip Horizontally", borderClasses: "border-x-0 border-black/20", borderRadiusClasses: "px-1.5" },
    { onClick: handleSendFront, disabled: !sendFrontBTN, iconSrc: "/sendFront.svg", tooltip: "Send to Front", borderClasses: "border-x-0 border-black/20", borderRadiusClasses: "px-1.5" },
    { onClick: handleSendBack, disabled: !sendBackBTN, iconSrc: "/sendBack.svg", tooltip: "Send to Back", borderClasses: "border-x-0 border-black/20", borderRadiusClasses: "px-1.5" },
    { onClick: handleSendForward, disabled: !sendForwardBTN, iconSrc: "/forward.svg", tooltip: "Send Forward", borderClasses: "border-x-0 border-black/20", borderRadiusClasses: "px-1.5" },
    { onClick: handleSendBackward, disabled: !sendBackwardBTN, iconSrc: "/backward.svg", tooltip: "Send Backward", borderClasses: "border-x-0 border-black/20", borderRadiusClasses: "px-1.5" },
    { onClick: handleCenterEL, iconSrc: "/centerIcon.svg", tooltip: "Center Element", borderClasses: "border-x-0 border-black/20", borderRadiusClasses: "px-1.5" },
    { onClick: handleDelete, iconSrc: "/trash.svg", tooltip: "Delete Element", borderClasses: "border-l-0 border-black/20 rounded-r-full", borderRadiusClasses: "pr-3 pl-1" },
  ];

  return (
    <>
      <div className='absolute z-50 left-0 bottom-0 w-full h-fit transition duration-500 delay-300 ease-in-out'>
        <div className="absolute bottom-0 left-0 w-fit mx-auto h-3 hidden lg:flex justify-start items-end gap-5 z-50">
          <div className="flex gap-3 p-4 space-y-3 w-60">
            <RangeSlider minValue={20} maxValue={120} step={1} defaultValue={grow} label="Kantlinje" />
          </div>
        </div>
        <div className="absolute bottom-20 lg:bottom-2 left-0 w-full mx-auto h-3 flex justify-start items-end gap-5 z-40">
          <div className="flex justify-center items-center w-full">
            <div className='flex justify-center items-center bg-white shadow-sm border rounded-full'>
              {buttons.map((button, index) => (
                <ButtonControl key={index} {...button} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ControlElements;
