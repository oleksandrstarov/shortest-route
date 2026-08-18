import {Box} from "@mui/material";
import React, {useState, useCallback} from "react";
import {ControlItem} from "../types/ControlItem.type";
import MapContainer from "./MapContainer";
import MapPanel from "./MapPanel";
import SettingsPanel from "./SettingsPanel";
import ZoomControls from "./ZoomControls";
import Calculator from "./models/calculator.model";

export default function App() {
    const [image, setImage] = useState<string>('');
    const [controlItems, setControlItems] = useState<ControlItem[]>([]);
    const [mapName, setMapName] = useState<string>('');
    const [path, setPath] = useState<ControlItem[]>([]);

    const calculator = React.useMemo(() => {
        return new Calculator(controlItems);
    }, [controlItems]);

    const solve = useCallback(() => {
        calculator.solve();
        setPath(calculator.getPath());
    }, [calculator]);

    const updateActiveItem = useCallback((id: string) => {
        // This will be used by SettingsPanel
    }, []);

    const updateImage = useCallback((img: string) => {
        setImage(img);
    }, []);

    return (
        <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
            <SettingsPanel 
                mapName={mapName} 
                setMapName={setMapName} 
                updateActiveItem={updateActiveItem} 
                controlItems={controlItems} 
                setControlItems={(items: ControlItem[]) => setControlItems(items)}
                solve={solve}
                image={image}
                updateImage={updateImage}
            />
            <Box sx={{ flex: 1, display: 'flex' }}>
                <MapContainer 
                    controlItems={controlItems} 
                    setControlItems={(items: ControlItem[]) => setControlItems(items)}
                    image={image}
                    path={path}
                />
                <MapPanel 
                    image={image}
                    updateImage={updateImage}
                    updateActiveItem={updateActiveItem}
                    controlItems={controlItems}
                    setControlItems={(items: ControlItem[]) => setControlItems(items)}
                    solve={solve}
                />
            </Box>
            <ZoomControls />
        </Box>
    );
}