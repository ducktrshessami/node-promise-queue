import { PromiseOrLazy } from "./util";

export class PromiseQueue {
    public readonly promises: Promise<any>[] = [];
    private _all: Promise<any[]> | null = null;
    private _allSettled: Promise<PromiseSettledResult<any>[]> | null = null;

    public get all(): Promise<any[]> {
        this._all ??= Promise.all(this.promises);
        return this._all;
    }

    public get allSettled(): Promise<PromiseSettledResult<any>[]> {
        this._allSettled ??= Promise.allSettled(this.promises);
        return this._allSettled;
    }

    protected push(promise: Promise<any>): void {
        this.promises.push(promise);
        this._all = null;
        this._allSettled = null;
    }

    public resolveLazy<T>(promise: PromiseOrLazy<T>): Promise<T> {
        return typeof promise === "function" ? this.all.then(promise) : promise;
    }

    public add(promise: PromiseOrLazy<any>): this {
        const p = this.resolveLazy(promise);
        this.push(p);
        return this;
    }

    public clear(): Promise<any[]> {
        const all = this.all;
        this.promises.length = 0;
        this._all = null;
        return all;
    }
}
