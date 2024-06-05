import { ReactNode, useState, useEffect, useRef } from "react";

type TooltipProps = {
    message: string;
    children: ReactNode;
    direction?: 'auto' | 'up' | 'down'; // Add direction as an optional prop
};

export const Tooltip = ({ message, children, direction = 'down' }: TooltipProps) => {
    const [show, setShow] = useState(false);
    const [calculatedDirection, setCalculatedDirection] = useState(direction);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleShow = () => {
            if (tooltipRef.current) {
                const tooltipRect = tooltipRef.current.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                if (tooltipRect.bottom > windowHeight && tooltipRect.top - tooltipRect.height >= 0) {
                    setCalculatedDirection('up');
                } else {
                    setCalculatedDirection('down');
                }
            }
        };

        if (show && direction === 'auto') {
            handleShow();
        } else {
            setCalculatedDirection(direction);
        }
    }, [show, direction]);

    return (
        <div className="relative flex flex-col items-center group">
            <span className="flex justify-center" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
                {children}
            </span>
            <div
                ref={tooltipRef}
                className={`absolute whitespace-nowrap flex flex-col items-center ${!show ? "hidden" : ""} ${calculatedDirection === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'}`}
            >
                <div className="relative z-10 p-2 text-xs leading-none text-white bg-gray-600 shadow-lg rounded-md">
                    {message}
                </div>
                <div className={`w-3 h-3 bg-gray-600 z-0 ${calculatedDirection === 'up' ? '-mt-1.5 rotate-45' : '-mb-[32px] -rotate-45'}`} />
            </div>
        </div>
    );
};
