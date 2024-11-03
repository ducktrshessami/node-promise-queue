import { PromiseOrLazy } from "./util";

export class PromiseQueue {
    public readonly promises: Promise<any>[];
    private _all: Promise<any[]> | null;

    constructor() {
        this.promises = [];
        this._all = null;
    }

    public get all(): Promise<any[]> {
        this._all ??= Promise.all(this.promises);
        return this._all;
    }

    protected push(promise: Promise<any>): void {
        this.promises.push(promise);
        this._all = null;
    }

    public resolveLazy<T>(promise: PromiseOrLazy<T>): Promise<T> {
        return typeof promise === "function" ? this.all.then(promise) : promise;
    }

    public add(promise: PromiseOrLazy<any>): void {
        const p = this.resolveLazy(promise);
        this.push(p);
    }

    public clear(): void {
        this.promises.length = 0;
        this._all = null;
    }

    public allClear(): Promise<any[]> {
        const all = this.all;
        this.clear();
        return all;
    }
}
