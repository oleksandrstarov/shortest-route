import {ControlItem} from "../types/ControlItem.type.ts";
import {CourseSymbol} from "../enums/CourseItems.enum.ts";

type Distance = {
    // @ts-ignore
    [ControlItem.id]: number
}

type Model = {
    start?: {
        item: ControlItem,
        distance: Distance
    },
    finish?: {
        item: ControlItem,
        distance: Distance
    },
    controls?: {
        // @ts-ignore
        [ControlItem.id]: {
            item: ControlItem,
            distance: Distance
        }
    }
}

export default class Calculator {
    private model: Model;
    private distances: Record<string, number> = {};
    private path: string[] = [];
    constructor(items: ControlItem[]) {
        this.model = items.reduce((acc: Model, item: ControlItem) => {
            if (item.type === CourseSymbol.Start && !acc.start) {
                acc.start = { item };
            } else if (item.type === CourseSymbol.Finish && !acc.finish) {
                acc.finish = { item };
            } else {
                if(!acc.controls) {
                    acc.controls = {};
                }
                // @ts-ignore
                acc.controls[item.id as string] = { item };
            }
            return acc;
        }, {})

        this.calculateDistances();
        this.solve();
    }

    calculateDistances(): void {

        const controls = Object.values(this.model.controls!);

        // @ts-ignore
        this.model.start!.distance = controls.reduce((acc: any, { item }: { item: ControlItem}) => {
            acc[item.id] = this.findDistance(this.model.start!.item, item);
            return acc
        }, {})

        // @ts-ignore
        this.model.finish!.distance = controls.reduce((acc: any, { item }: { item: ControlItem}) => {
            acc[item.id] = this.findDistance(this.model.finish!.item, item);
            return acc
        }, {})

        // @ts-ignore
        controls.forEach(control => {
            control.distance = controls
                .filter(({ item }: { item: ControlItem}) => item.id !== control.item.id)
                .reduce((acc: any, { item }: { item: ControlItem}) => {
                    acc[item.id] = this.findDistance(control.item, item);
                    return acc
                }, {})
        })
    }

    solve(): void {
        const start = new Date();
        const path: string[] = [];
        console.log(this.model)
        this.findOptions('start', path, 0)
        console.log('counter ', this.counter);
        console.log('counterOpt ', this.counterOpt);
        console.log('counterFin ', this.counterFin);
        const finish = new Date();
        console.log((finish.valueOf() - start.valueOf()) / 1000);
    }

    private currDist = Infinity;
    private counter = 0;
    private counterOpt = 0;
    private counterFin = 0;


    setFinish(current: string, visited: string[], distance: number): void {
        this.counterFin++;
        const currentItemDist = this.model.finish?.distance[current];
        const newDistance = distance + currentItemDist;

        //console.log(newDistance, this.currDist, current);

        if(newDistance < this.currDist) {
            this.currDist = newDistance;
            this.path = ['start', ...visited, 'finish'];
        }
    }

    findOptions(current: string, visited: string[], distance: number): void {
        this.counter++


        if(visited.length === Object.keys(this.model.controls).length) {
            this.setFinish(current, visited, distance);
            return;
        }

        Object.keys(this.model.controls).forEach((id) => {

            if(visited.includes(id) || current === id) {
                return;
            }

            let currentItemDist;

            if (current ==='start') {
                currentItemDist = this.model.start?.distance[id]
            } else {
                currentItemDist = this.model.controls[id]!.distance[current]
            }

            const newDistance = distance + currentItemDist;

            if (newDistance > this.currDist) {
                this.counterOpt++;
                return;
            }

            const newVisited = [...visited, id];
            this.findOptions(id, newVisited, newDistance)
        })
    }

    getPath(): ControlItem[] {
        return this.path.map(id => {
            if (id === 'start') {
                return this.model.start?.item;
            } else if (id === 'finish'){
                return this.model.finish?.item;
            } else {
                return this.model.controls[id]!.item
            }
        })
    }

    private findDistance(itemA: ControlItem, itemB: ControlItem): number {
        return Math.sqrt(Math.pow(itemA.x - itemB.x, 2) + Math.pow(itemA.y - itemB.y, 2));
    }


}