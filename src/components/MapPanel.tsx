import './MapPanel.css'
import {Box, Container, Fab} from "@mui/material";
import {CourseSymbol} from "../enums/CourseItems.enum.ts";
import React from "react";
import {ControlItem} from "../types/ControlItem.type.ts";
import MapContainer from "./MapContainer.tsx";
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import ZoomControls from "./ZoomControls.tsx";
import Canvas from "./Canvas.tsx";

type Props = {
    image: string,
    activeItem: CourseSymbol | undefined,
    setControlItems: (items: ControlItem[]) => void,
    controlItems: ControlItem[],
    path: ControlItem[]
}

function MapPanel({ image, activeItem, controlItems, setControlItems, path }: Props) {

    return <>
        {image ?
            <Container sx={{
                maxWidth: '100%',
                maxHeight: '100vh',
                p: 0,
            }}>
                <TransformWrapper
                    wheel={{ disabled: true }}
                    doubleClick={{ disabled: true }}
                    pinch={{ disabled: true }} panning={{ disabled: true }} minScale={.1} centerZoomedOut={true} initialScale={.6}>
                    <ZoomControls/>
                    <TransformComponent>
                        {path && !!path.length && <Box sx={{
                            position: 'absolute',
                            height: 'auto',
                            width: 'auto'

                        }}>
                            <Canvas course={path} />
                        </Box> }
                        <MapContainer image={image} activeItem={activeItem} controlItems={controlItems} setControlItems={setControlItems}/>
                    </TransformComponent>
                </TransformWrapper>

            </Container>
        :
           <>
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
            </Box></>
        }
    </>
}

export default MapPanel