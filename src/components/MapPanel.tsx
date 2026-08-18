import './MapPanel.css'
import {Box, Container} from "@mui/material";
import {CourseSymbol} from "../enums/CourseItems.enum";
import {ControlItem} from "../types/ControlItem.type";
import MapContainer from "./MapContainer";
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import ZoomControls from "./ZoomControls";
import Canvas from "./Canvas";

type Props = {
    image: string;
    controlItems: ControlItem[];
    path: ControlItem[];
    updateImage: (img: string) => void;
    updateActiveItem: (id: string) => void;
    solve: () => void;
    setControlItems: (items: ControlItem[]) => void;
};

function MapPanel({ image, controlItems, path, updateImage, updateActiveItem, solve, setControlItems }: Props) {
    return image ? (
        <Container sx={{
            maxWidth: '100%',
            maxHeight: '100vh',
            p: 0,
        }}>
            <TransformWrapper
                wheel={{ disabled: true }}
                doubleClick={{ disabled: true }}
                pinch={{ disabled: true }} 
                panning={{ disabled: true }} 
                minScale={.1} 
                centerZoomedOut={true} 
                initialScale={.6}
            >
                <ZoomControls/>
                <TransformComponent>
                    {path && path.length > 0 && (
                        <Box sx={{
                            position: 'absolute',
                            height: 'auto',
                            width: 'auto'
                        }}>
                            <Canvas course={path} />
                        </Box>
                    )}
                    <MapContainer image={image} controlItems={controlItems} path={path} setControlItems={setControlItems}/>
                </TransformComponent>
            </TransformWrapper>
        </Container>
    ) : (
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
    );
}

export default MapPanel;