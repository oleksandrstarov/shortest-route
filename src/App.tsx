import './App.css'
import SettingsPanel from "./components/SettingsPanel.tsx";
import MapPanel from "./components/MapPanel.tsx";
import {Container, Grid} from "@mui/material";
import {useCallback, useEffect, useState} from "react";
import {CourseSymbol} from "./enums/CourseItems.enum.ts";
import {ControlItem} from "./types/ControlItem.type.ts";
import Calculator from "./models/calculator.model.tsx";

function App() {
    const [img, setImg] = useState('');
    const [activeItem, setActiveItem] = useState<CourseSymbol | undefined>(undefined);
    const [controlItems, setControlItems] = useState<ControlItem[]>([]);
    const [solution, setSolution] = useState<ControlItem[]>([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if(controlItems.length === 0) {
            setSolution([]);
        }
    }, [controlItems]);

    const handleImageUpdate = useCallback((img: string) => {
        setImg(img);
        setMessage('');
    }, []);

    const updateActiveItem = useCallback((item: CourseSymbol | undefined) => {
        setActiveItem(item);
    }, []);

    const solve = () => {
        try {
            const calculator = new Calculator(controlItems);
            setSolution(calculator.getPath());
            setMessage(`Shortest route: ${calculator.getDistance().toFixed(1)} px`);
        } catch (error) {
            setSolution([]);
            setMessage(error instanceof Error ? error.message : 'Unable to calculate the route.');
        }
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
                    <SettingsPanel updateImage={handleImageUpdate} image={img} updateActiveItem={updateActiveItem} controlItems={controlItems} setControlItems={setControlItems} solve={solve} message={message} />
                </Container>
                <Container maxWidth={false} sx={{
                    m: 0,
                    p: 0,
                    overflow: 'scroll',
                    position: 'relative'
                }}>
                    <MapPanel image={img} activeItem={activeItem} controlItems={controlItems} setControlItems={setControlItems} path={solution}></MapPanel>
                </Container>
            </Container>
        </Grid>
    </>
  )
}

export default App
