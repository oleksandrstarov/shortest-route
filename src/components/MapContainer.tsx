import {Box} from "@mui/material";
import React, {useEffect, useState} from "react";
import {CourseSymbol} from "../enums/CourseItems.enum";
import Start from "./Start";
import Finish from "./Finish";
import Control from "./Control";
import {ControlItem} from "../types/ControlItem.type";

type Props = {
    image: string;
    controlItems: ControlItem[];
    setControlItems: (items: ControlItem[]) => void;
    path: ControlItem[];
};

function MapContainer({ image, controlItems, setControlItems, path }: Props) {
    const [children, setChildren] = useState<React.ReactElement[]>([]);

    const removeItem = (e: React.MouseEvent, key: string) => {
        e.stopPropagation();
        setControlItems(controlItems.filter((child) => child.id !== key));
    };

    useEffect(() => {
        const items = controlItems.map(({ x, y, id, type}) => createItem(x, y, id, type));
        setChildren(items);
    }, [controlItems]);

    const createItem = (x: number, y: number, key: string, type: CourseSymbol): React.ReactElement => {
        let item, left, top;
        const label = key.substring(key.length - 5);
        
        if (type === CourseSymbol.Start) {
            left = x;
            top = y - 22;
            item = <><Start/> <div className='label-control'>{label}</div></>;
        }
        if (type === CourseSymbol.Finish) {
            left = x - 27;
            top = y - 27;
            item =  <><Finish/><div  className='label-control'>{label}</div></>;
        }
        if (type === CourseSymbol.Control) {
            left = x - 27;
            top = y - 27;
            item = <> <Control/><div  className='label-control'>{label}</div></>;
        }

        return (
            <Box 
                sx={{
                    position: 'absolute',
                    top: top,
                    left: left,
                    transform: `scale(3)`
                }} 
                onClick={(e) => {
                    removeItem(e, key);
                }}
                key={key}
            >
                {item}
            </Box>
        );
    };

    return (
        <Box sx={{
            display: 'inline-block',
            p: 0
        }} onClick={(e) => {
            // Handle click to add item logic if needed here
        }}>
            {children}
            {path.map((p, index) => (
                <Box
                    key={`path-${index}`}
                    sx={{
                        position: 'absolute',
                        left: p.x,
                        top: p.y,
                        width: 10,
                        height: 10,
                        backgroundColor: 'red',
                        borderRadius: '50%',
                        zIndex: 1,
                    }}
                />
            ))}
            <Box
                component="img"
                src={ image }
                sx={{ width: '100%', height: '100%' }}
            />
        </Box>
    );
}

export default MapContainer;