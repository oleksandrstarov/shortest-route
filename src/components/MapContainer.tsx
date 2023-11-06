import {Box, Container, Fab} from "@mui/material";
import {AddRounded, RemoveRounded} from "@mui/icons-material";
import React, {useEffect, useState} from "react";
import {useControls, useTransformContext, useTransformEffect} from "react-zoom-pan-pinch";
import {CourseSymbol} from "../enums/CourseItems.enum.ts";
import Start from "./Start.tsx";
import Finish from "./Finish.tsx";
import Control from "./Control.tsx";
import {ControlItem} from "../types/ControlItem.type.ts";

type Props = {
    image: string,
    activeItem: CourseSymbol | undefined,
    setControlItems: (items: ControlItem[]) => void,
    controlItems: ControlItem[]
}
function MapContainer ({ image, activeItem, controlItems, setControlItems }: Props) {
    const [children, setChildren] = useState<React.ReactElement[]>([]);
    const removeItem = (e: MouseEvent, key: number) => {
        e.stopPropagation();
        setControlItems(controlItems.filter((child) => child.id !== key))
    };

    useEffect(() => {
        const items = controlItems.map(({ x, y, id, type}) => createItem(x, y, id, type));
        setChildren(items);
    }, [controlItems]);

    const createItem = (x: number, y: number, key: number, type: CourseSymbol): React.ReactElement => {
        let item, left, top;
        const label = key.toString().substring(key.toString().length-5);
        if (type === CourseSymbol.Start) {
            left = x;
            top = y-22;
            item = <><Start/> <div className='label-control'>{label}</div></>
        }

        if (type === CourseSymbol.Finish) {
            left = x-27;
            top = y-27;
            item =  <><Finish/><div  className='label-control'>{label}</div></>
        }

        if (type === CourseSymbol.Control) {
            left = x-27;
            top = y-27;
            item = <> <Control/><div  className='label-control'>{label}</div></>
        }

        return (
            <Box sx={{
                position: 'absolute',
                top: top,
                left: left,
                transform: `scale(3)`
            }} onClick={(e) => removeItem(e, key)}
                 key={key}>{item}</Box>
        )
    }

    const handleClick = (e: any) => {
        if (!activeItem) return;

        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;

        const controlItem = {
            x,
            y,
            id: new Date().valueOf(),
            type: activeItem
        }

        setControlItems([...controlItems, controlItem]);
    }

    return (
        <Box sx={{
            display: 'inline-block',
            p: 0
        }} onClick={(e) => handleClick(e)}>
            {children}
            <Box
                component="img"
                src={ image }
            />
        </Box>
    )
}

export default MapContainer;