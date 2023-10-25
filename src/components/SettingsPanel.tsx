import './SettingsPanel.css'
import {Box, Button, Paper} from "@mui/material";
import {ChangeEvent, ChangeEventHandler, useEffect, useMemo, useState} from "react";
import Start from "./Start.tsx";
import Control from "./Control.tsx";
import Finish from "./Finish.tsx";
import {CourseSymbol} from "../enums/CourseItems.enum.ts";
import {ControlItem} from "../types/ControlItem.type.ts";

type Props = {
    updateImage: (image: string)=> void,
    image: string,
    updateActiveItem: (item: CourseSymbol | undefined) => void,
    controlItems: ControlItem[],
    setControlItems: (controlItems: ControlItem[]) => void
}

function SettingsPanel({ updateImage, image, updateActiveItem, controlItems, setControlItems }: Props) {
    const [mapName, setMapName] = useState('');
    const [activeCourseItem, setActiveCourseItem] = useState<CourseSymbol | undefined>(undefined);

    useEffect(() => {
        updateActiveItem(activeCourseItem)
    }, [activeCourseItem]);

    const counter = useMemo(() => {
        return controlItems.reduce((acc, item) => {
            acc[item.type]++;
            return acc;
        }, {
            [CourseSymbol.Start]: 0,
            [CourseSymbol.Control]: 0,
            [CourseSymbol.Finish]: 0
        })
    }, [controlItems])

    const setImage: ChangeEventHandler<HTMLInputElement> = (event: ChangeEvent<HTMLInputElement>) => {
        const input: HTMLInputElement  = event.target as HTMLInputElement;

        const file = input?.files?.[0];

        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);


            reader.onloadend = () => {
                setMapName(file.name);
                updateImage(reader.result as string);
            }
        }
    }

    const resetCourse = () => {
        setControlItems([]);
    }

    const removeMap = () => {
        setMapName('');
        updateImage('');
        resetCourse();
    }

    const handleActiveItem = (item: CourseSymbol) => {
        if (activeCourseItem === item) {
            setActiveCourseItem(undefined);
        } else {
            setActiveCourseItem(item)
        }
    }

    return <>
        <Box sx={{
            py: 4,
        }}>
        <Box
            sx={{
                py: 4,
                px: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Paper sx={{
                minWidth: '100%',
                px: 4,
                py:4,
                display: 'flex',
                flexDirection: 'column'
            }}>
                { mapName && <Box sx={{
                    mb: 2,
                    display: 'flex',
                    flexDirection: 'row-reverse'
                }} >
                    <label>{mapName}</label>
                </Box>}

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row-reverse'
                }}>
                    {!!image && <Button
                        sx={{
                            ml: 2
                        }}
                        variant="contained"
                        component="label"
                        onClick={removeMap}
                    >
                        Remove
                    </Button>}
                    <Button
                        variant="contained"
                        component="label"
                    >
                        Upload File
                        <input
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={(e) => setImage(e)}
                            hidden
                        />
                    </Button>
                </Box>


            </Paper>
            <Paper sx={{
                minWidth: '100%',
                m: 1,
                px: 4,
                py:4,
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Box sx={{
                    height: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around'
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-around'
                    }}>
                        <div className={activeCourseItem === CourseSymbol.Start ? "active" : ""}
                             onClick={() => handleActiveItem(CourseSymbol.Start)}><Start/></div>
                        <h3>{counter[CourseSymbol.Start]}</h3>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-around'
                    }}>
                        <div className={activeCourseItem === CourseSymbol.Control ? "active" : ""}
                             onClick={() => handleActiveItem(CourseSymbol.Control)}><Control/></div>
                        <h3>{counter[CourseSymbol.Control]}</h3>
                    </Box>


                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-around'
                    }}>
                        <div className={activeCourseItem === CourseSymbol.Finish ? "active" : ""}
                             onClick={() => handleActiveItem(CourseSymbol.Finish)}><Finish/></div>
                        <h3>{counter[CourseSymbol.Finish]}</h3>
                    </Box>

                </Box>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row-reverse'
                }}>
                    <Button
                        sx={{
                            ml: 2
                        }}
                        variant="contained"
                        component="label"
                        onClick={resetCourse}
                    >
                        Reset
                    </Button>

                    <Button
                        variant="contained"
                        component="label"
                    >
                        Calculate
                    </Button>
                </Box>

            </Paper>
            <Paper sx={{
                minWidth: '100%',
                m: 1,
                px: 4,
                py:4,
                display: 'flex',
                flexDirection: 'row-reverse'
            }}>
                <Button
                    variant="contained"
                    component="label"
                >
                    Solution
                </Button>
            </Paper>
        </Box>
        </Box>
    </>
}

export default SettingsPanel;