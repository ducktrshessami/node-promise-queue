import { PromiseOrLazy } from "./util";

export class PromiseQueueGroup<GroupTypes extends any[] = []> {
    private readonly promises: GroupTypes;
    private _all: Promise<GroupTypes> | null;

    constructor() {
        this.promises = [] as any as GroupTypes;
        this._all = null;
    }

    public get all(): Promise<GroupTypes> {
        this._all ??= Promise.all(this.promises);
        return this._all;
    }

    protected push<T>(promise: Promise<T>): asserts this is PromiseQueueGroup<[...GroupTypes, T]> {
        this.promises.push(promise);
        this._all = null;
    }

    public resolveLazy<T>(promise: PromiseOrLazy<T>): Promise<T> {
        return typeof promise === "function" ? this.all.then(promise) : promise;
    }

    public add<T>(promise: PromiseOrLazy<T>): asserts this is PromiseQueueGroup<[...GroupTypes, T]> {
        const p = this.resolveLazy(promise);
        this.push(p);
    }

    public clear(): asserts this is PromiseQueueGroup<[]> {
        this.promises.length = 0;
        this._all = null;
    }
}
