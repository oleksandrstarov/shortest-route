import { useEffect, useRef } from "react";
import { ControlItem } from "../types/ControlItem.type.ts";

type Props = {
    course: ControlItem[];
    width: number;
    height: number;
}

export default function Canvas({ course, width, height }: Props) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;
        context.clearRect(0, 0, width, height);
        context.strokeStyle = '#c000c0';
        context.lineWidth = 4;
        context.beginPath();

        course.forEach((item, index) => {
            if(index === 0) {
                context.moveTo(item.x, item.y);
                return;
            }
            context.lineTo(item.x, item.y);
        })

        context.stroke();
    }, [course, width, height]);



    return <canvas className="route-canvas" ref={canvasRef} width={width} height={height} aria-label="Calculated route" />
}
