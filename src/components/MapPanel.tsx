import './MapPanel.css'
import {Box, Container} from "@mui/material";
import {CourseSymbol} from "../enums/CourseItems.enum.ts";
import React, {useEffect, useState} from "react";
import Control from "./Control.tsx";
import Finish from "./Finish.tsx";
import Start from "./Start.tsx";
import {ControlItem} from "../types/ControlItem.type.ts";

type Props = {
    image: string,
    activeItem: CourseSymbol | undefined,
    setControlItems: (items: ControlItem[]) => void,
    controlItems: ControlItem[]
}

function MapPanel({ image, activeItem, controlItems, setControlItems }: Props) {
    const [children, setChildren] = useState<React.ReactElement[]>([]);

    const removeItem = (e: MouseEvent, key: number) => {
        e.stopPropagation();
        setControlItems(controlItems.filter((child) => child.id !== key))
    };

    useEffect(() => {
        const items = controlItems.map(({ x, y, id, type}) => createItem(x, y, id, type));
        setChildren(items);
        console.log(controlItems)

    }, [controlItems]);

    const createItem = (x: number, y: number, key: number, type: CourseSymbol): React.ReactElement => {
        let item, left, top;
        if (type === CourseSymbol.Start) {
            left = x-18;
            top = y-26;
            item = <Start/>
        }

        if (type === CourseSymbol.Finish) {
            left = x-27;
            top = y-27;
            item =  <Finish/>
        }

        if (type === CourseSymbol.Control) {
            left = x-27;
            top = y-27;
            item =  <Control/>
        }

        return (
            <Box sx={{
                position: 'absolute',
                top: top,
                left: left
            }} onClick={(e) => removeItem(e, key)}
                 key={key}>{item}</Box>
        )
    }

    const handleClick = (e: any) => {
        if (!activeItem) return;

        const x = e.nativeEvent.layerX;
        const y = e.nativeEvent.layerY;

        const controlItem = {
            x,
            y,
            id: new Date().valueOf(),
            type: activeItem
        }

        setControlItems([...controlItems, controlItem]);
    }

    return <>
        {image ?
        <Container sx={{
            maxWidth: '100%',
            maxHeight: '100vh',
            position: 'relative'
        }}>
           <Box sx={{
               display: 'inline-block'
           }} onClick={(e) => handleClick(e)}>
               {children}
               <Box
                   component="img"
                   src={ image }
               />
           </Box>

        </Container>
        :
            <Box sx={{
                display: 'flex',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Box sx={{
                    marginLeft: '50%',
                    width: '100%'
                }}>
                    <h4>Select map first</h4>
                </Box>
            </Box>
        }
    </>
}

export default MapPanel