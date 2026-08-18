import {ControlItem} from "../types/ControlItem.type";
import {CourseSymbol} from "../enums/CourseItems.enum";

type DistanceMap = Record<string, number>;

type Model = {
    start?: {
        item: ControlItem;
        distances: DistanceMap;
    };
    finish?: {
        item: ControlItem;
        distances: DistanceMap;
    };
    controls?: Record<string, {
        item: ControlItem;
        distances: DistanceMap;
    }>;
};

export default class Calculator {
    private model: Model;
    private path: string[] = [];
    private currDist = Infinity;
    private counter = 0;
    private counterOpt = 0;
    private counterFin = 0;

    constructor(items: ControlItem[]) {
        this.model = items.reduce((acc: Model, item: ControlItem) => {
            if (item.type === CourseSymbol.Start && !acc.start) {
                acc.start = { item };
            } else if (item.type === CourseSymbol.Finish && !acc.finish) {
                acc.finish = { item };
            } else {
                if (!acc.controls) {
                    acc.controls = {};
                }
                acc.controls[item.id] = { item };
            }
            return acc;
        }, {});

        this.calculateDistances();
        this.solve();
    }

    calculateDistances(): void {
        const controls = Object.values(this.model.controls || {});

        if (this.model.start && controls.length > 0) {
            this.model.start.distances = controls.reduce((acc: DistanceMap, { item }) => {
                acc[item.id] = this.findDistance(this.model.start.item, item);
                return acc;
            }, {});
        }

        if (this.model.finish && controls.length > 0) {
            this.model.finish.distances = controls.reduce((acc: DistanceMap, { item }) => {
                acc[item.id] = this.findDistance(this.model.finish.item, item);
                return acc;
            }, {});
        }

        controls.forEach(control => {
            const controlId = control.item.id;
            if (this.model.controls?.[controlId]) {
                this.model.controls[controlId]!.distances = controls
                    .filter(({ item }) => item.id !== controlId)
                    .reduce((acc: DistanceMap, { item }) => {
                        acc[item.id] = this.findDistance(control.item, item);
                        return acc;
                    }, {});
            }
        });
    }

    public solve(): void {
        const start = new Date();
        const path: string[] = [];
        this.findOptions('start', path, 0);
        const finish = new Date();
        console.log((finish.valueOf() - start.valueOf()) / 1000);
    }

    setFinish(current: string, visited: string[], distance: number): void {
        this.counterFin++;
        const currentItemDist = this.model.finish?.distances?.[current] ?? 0;
        const newDistance = distance + currentItemDist;

        if (newDistance < this.currDist) {
            this.currDist = newDistance;
            this.path = ['start', ...visited, 'finish'];
        }
    }

    findOptions(current: string, visited: string[], distance: number): void {
        this.counter++;

        if (visited.length === Object.keys(this.model.controls || {}).length) {
            this.setFinish(current, visited, distance);
            return;
        }

        Object.keys(this.model.controls || {}).forEach((id) => {
            if (visited.includes(id) || current === id) {
                return;
            }

            let currentItemDist = 0;

            if (current === 'start') {
                currentItemDist = this.model.start?.distances?.[id] ?? 0;
            } else {
                currentItemDist = this.model.controls?.[id]?.distances?.[current] ?? 0;
            }

            const newDistance = distance + currentItemDist;

            if (newDistance > this.currDist) {
                this.counterOpt++;
                return;
            }

            const newVisited = [...visited, id];
            this.findOptions(id, newVisited, newDistance);
        });
    }

    getPath(): ControlItem[] {
        return this.path.map(id => {
            if (id === 'start') {
                return this.model.start?.item;
            } else if (id === 'finish') {
                return this.model.finish?.item;
            } else {
                return this.model.controls?.[id]?.item;
            }
        }).filter(Boolean) as ControlItem[];
    }

    private findDistance(itemA: ControlItem, itemB: ControlItem): number {
        return Math.sqrt(Math.pow(itemA.x - itemB.x, 2) + Math.pow(itemA.y - itemB.y, 2));
    }
}