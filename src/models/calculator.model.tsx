import { ControlItem } from "../types/ControlItem.type.ts";
import { CourseSymbol } from "../enums/CourseItems.enum.ts";

type RouteState = { distance: number; previous: number | null };

/** Finds the exact shortest route that visits every control once. */
export default class Calculator {
    private readonly start: ControlItem;
    private readonly finish: ControlItem;
    private readonly controls: ControlItem[];
    private path: ControlItem[] = [];
    private distance = 0;

    constructor(items: ControlItem[]) {
        const starts = items.filter(({ type }) => type === CourseSymbol.Start);
        const finishes = items.filter(({ type }) => type === CourseSymbol.Finish);

        if (starts.length !== 1 || finishes.length !== 1) {
            throw new Error("A course must contain exactly one start and one finish.");
        }

        this.start = starts[0];
        this.finish = finishes[0];
        this.controls = items.filter(({ type }) => type === CourseSymbol.Control);

        // Held-Karp is exact, but its memory use grows exponentially.
        if (this.controls.length > 16) {
            throw new Error("Exact calculation supports up to 16 controls. Remove controls or use a heuristic route.");
        }

        this.solve();
    }

    getPath(): ControlItem[] {
        return this.path;
    }

    getDistance(): number {
        return this.distance;
    }

    private solve(): void {
        if (this.controls.length === 0) {
            this.path = [this.start, this.finish];
            this.distance = this.findDistance(this.start, this.finish);
            return;
        }

        const states = new Map<string, RouteState>();
        const controlCount = this.controls.length;

        for (let index = 0; index < controlCount; index++) {
            states.set(this.key(1 << index, index), {
                distance: this.findDistance(this.start, this.controls[index]),
                previous: null,
            });
        }

        for (let mask = 1; mask < 1 << controlCount; mask++) {
            for (let last = 0; last < controlCount; last++) {
                if ((mask & (1 << last)) === 0) continue;
                const state = states.get(this.key(mask, last));
                if (!state) continue;

                for (let next = 0; next < controlCount; next++) {
                    if ((mask & (1 << next)) !== 0) continue;
                    const nextMask = mask | (1 << next);
                    const candidateDistance = state.distance + this.findDistance(this.controls[last], this.controls[next]);
                    const nextKey = this.key(nextMask, next);
                    const current = states.get(nextKey);

                    if (!current || candidateDistance < current.distance) {
                        states.set(nextKey, { distance: candidateDistance, previous: last });
                    }
                }
            }
        }

        const fullMask = (1 << controlCount) - 1;
        let lastControl = 0;
        let bestDistance = Infinity;
        for (let index = 0; index < controlCount; index++) {
            const state = states.get(this.key(fullMask, index));
            if (!state) continue;
            const totalDistance = state.distance + this.findDistance(this.controls[index], this.finish);
            if (totalDistance < bestDistance) {
                bestDistance = totalDistance;
                lastControl = index;
            }
        }

        const route: ControlItem[] = [];
        let mask = fullMask;
        let current: number | null = lastControl;
        while (current !== null) {
            route.unshift(this.controls[current]);
            const state = states.get(this.key(mask, current));
            if (!state) throw new Error("Unable to reconstruct the route.");
            mask ^= 1 << current;
            current = state.previous;
        }

        this.path = [this.start, ...route, this.finish];
        this.distance = bestDistance;
    }

    private key(mask: number, last: number): string {
        return `${mask}:${last}`;
    }

    private findDistance(itemA: ControlItem, itemB: ControlItem): number {
        return Math.hypot(itemA.x - itemB.x, itemA.y - itemB.y);
    }
}
