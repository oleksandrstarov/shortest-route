import {Box, Fab} from "@mui/material";
import {AddRounded, CropFreeRounded, RemoveRounded} from "@mui/icons-material";
import React from "react";
import {useControls} from "react-zoom-pan-pinch";

function ZoomControls() {
    const { zoomIn, zoomOut, resetTransform } = useControls();

    const zoom = (action: 'in' | 'out') => {
        console.log(action);
        if (action === 'in') {
            zoomIn();
        }

        if (action === 'out') {
            zoomOut();
        }
    }

    return <Box sx={{
        position: 'fixed',
        height: '170px',
        top: '80px',
        right: '50px',
        display: 'flex',
        zIndex: 10000000,
        flexDirection: 'column',
        justifyContent: 'space-around'
    }}>
        <Fab size="medium" color="secondary" aria-label="add" onClick={() => zoomIn()}>
            <AddRounded />
        </Fab>
        <Fab size="medium" color="secondary" aria-label="remove" onClick={() => zoomOut()}>
            <RemoveRounded />
        </Fab>
        <Fab size="medium" color="secondary" aria-label="reset" onClick={() => resetTransform()}>
            <CropFreeRounded />
        </Fab>

    </Box>
}

export default ZoomControls;