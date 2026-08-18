import {CourseSymbol} from "../enums/CourseItems.enum";

export type ControlItem = {
    x: number;
    y: number;
    id: string;
    type: CourseSymbol;
};