import { PromiseQueue } from "./PromiseQueue";
import { PromiseOrLazy } from "./util";

export class PromiseQueueGroup<Group extends any[] = []> {
    private readonly promises: Group;

    constructor(public readonly queue: PromiseQueue, public readonly name: string) {
        this.promises = [] as any as Group;
    }

    public add<T>(promise: PromiseOrLazy<T>): asserts this is PromiseQueueGroup<[...Group, T]> {
        const p = typeof promise === "object" ? promise : Promise.all(this.promises).then(promise);
        this.promises.push(p);
    }
}
