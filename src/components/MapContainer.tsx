import { Box } from "@mui/material";
import { MouseEvent, SyntheticEvent, useState } from "react";
import { CourseSymbol } from "../enums/CourseItems.enum.ts";
import Start from "./Start.tsx";
import Finish from "./Finish.tsx";
import Control from "./Control.tsx";
import { ControlItem } from "../types/ControlItem.type.ts";
import Canvas from "./Canvas.tsx";

type Props = {
    image: string;
    activeItem: CourseSymbol | undefined;
    setControlItems: (items: ControlItem[]) => void;
    controlItems: ControlItem[];
    path: ControlItem[];
}

function MapContainer({ image, activeItem, controlItems, setControlItems, path }: Props) {
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

    const removeItem = (event: MouseEvent, id: string) => {
        event.stopPropagation();
        setControlItems(controlItems.filter((item) => item.id !== id));
    };

    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
        if (!activeItem || imageSize.width === 0) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - bounds.left) * imageSize.width / bounds.width;
        const y = (event.clientY - bounds.top) * imageSize.height / bounds.height;

        if (!Number.isFinite(x) || !Number.isFinite(y)) return;
        setControlItems([...controlItems, { x, y, id: crypto.randomUUID(), type: activeItem }]);
    };

    const createItem = ({ x, y, id, type }: ControlItem) => {
        const label = id.slice(-5);
        const offset = type === CourseSymbol.Start ? { left: x, top: y - 22 } : { left: x - 27, top: y - 27 };
        const symbol = type === CourseSymbol.Start ? <Start /> : type === CourseSymbol.Finish ? <Finish /> : <Control />;

        return (
            <Box key={id} sx={{ position: 'absolute', ...offset, transform: 'scale(3)', zIndex: 2 }} onClick={(event) => removeItem(event, id)}>
                {symbol}<div className="label-control">{label}</div>
            </Box>
        );
    };

    return (
        <Box sx={{ display: 'inline-block', p: 0, position: 'relative' }} onClick={handleClick}>
            <Box
                component="img"
                src={image}
                onLoad={(event: SyntheticEvent<HTMLImageElement>) => {
                    setImageSize({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight });
                }}
            />
            {path.length > 0 && imageSize.width > 0 && <Canvas course={path} width={imageSize.width} height={imageSize.height} />}
            {controlItems.map(createItem)}
        </Box>
    );
}

export default MapContainer;
