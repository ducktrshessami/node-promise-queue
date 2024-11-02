import { PromiseQueue } from "./PromiseQueue";
import { PromiseOrLazy } from "./util";

export class PromiseQueueGroup<Group extends any[] = []> {
    private readonly promises: Group;
    private _all: Promise<Group> | null;

    constructor(public readonly queue: PromiseQueue, public readonly name: string) {
        this.promises = [] as any as Group;
        this._all = null;
    }

    public get all(): Promise<Group> {
        this._all ??= Promise.all(this.promises);
        return this._all;
    }

    public add<T>(promise: PromiseOrLazy<T>): asserts this is PromiseQueueGroup<[...Group, T]> {
        const p = typeof promise === "object" ? promise : this.all.then(promise);
        this.promises.push(p);
        this._all = null;
    }

    public clear(): asserts this is PromiseQueueGroup<[]> {
        this.promises.length = 0;
        this._all = null;
    }
}
