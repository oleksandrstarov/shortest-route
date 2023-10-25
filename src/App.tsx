import './App.css'
import SettingsPanel from "./components/SettingsPanel.tsx";
import MapPanel from "./components/MapPanel.tsx";
import {Container, Grid} from "@mui/material";
import {useState} from "react";
import {CourseSymbol} from "./enums/CourseItems.enum.ts";
import {ControlItem} from "./types/ControlItem.type.ts";

function App() {
    const [img, setImg] = useState('');
    const [activeItem, setActiveItem] = useState<CourseSymbol | undefined>(undefined);
    const [controlItems, setControlItems] = useState<ControlItem[]>([]);

    const handleImageUpdate = (img: string) => {
        // do cleanup
        setImg(img);
    }

    const updateActiveItem = (item: CourseSymbol | undefined) => {
        setActiveItem(item);
    }


    return (
        <>
         <Grid container component="main" sx={{ height: '100vh' }}>
            <Container sx={{
                display: 'flex',
                flexDirection: 'row',
                minWidth: '100vw',
                p: 0,
                m: 0
            }}>
                <Container sx={{
                    p: 0,
                    m: 0,
                    flex: '0 0 400px',
                    borderRight: '1px solid grey',
                }}>
                    <SettingsPanel updateImage={handleImageUpdate} image={img} updateActiveItem={updateActiveItem} controlItems={controlItems} setControlItems={setControlItems}></SettingsPanel>
                </Container>
                <Container sx={{
                    m: 0,
                    overflow: 'auto'
                }}>
                    <MapPanel image={img} activeItem={activeItem} controlItems={controlItems} setControlItems={setControlItems}></MapPanel>
                </Container>
            </Container>

        </Grid>
    </>
  )
}

export default App
