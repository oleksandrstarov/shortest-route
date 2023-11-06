import {useEffect, useRef} from "react";
import {ControlItem} from "../types/ControlItem.type.ts";

type Props = {
    course: ControlItem[]
}

export default function Canvas({ course }: Props) {

    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current;

        // @ts-ignore
        const context = canvas.getContext('2d');

        context.clearRect(0, 0, canvas!.width, canvas!.height);

        //Our first draw
        context.strokeStyle = '#ff00ff';
        context.lineWidth = 6;
        context.beginPath();

        course.forEach((item, index) => {
            if(index === 0) {
                context.moveTo(item.x, item.y);
                return;
            }
            context.lineTo(item.x, item.y);
        })

        context.stroke();
    }, [course]);



    return <canvas id='canvas' ref={canvasRef} width={6000} height={6000}></canvas>
}