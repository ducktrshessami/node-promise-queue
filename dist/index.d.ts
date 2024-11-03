type LazyPromise<T> = () => Promise<T>;
type PromiseOrLazy<T> = Promise<T> | LazyPromise<T>;

declare class PromiseQueue {
    readonly promises: Promise<any>[];
    private _all;
    constructor();
    get all(): Promise<any[]>;
    protected push(promise: Promise<any>): void;
    resolveLazy<T>(promise: PromiseOrLazy<T>): Promise<T>;
    add(promise: PromiseOrLazy<any>): void;
    clear(): void;
    allClear(): Promise<any[]>;
}

declare class PromiseQueueMap extends PromiseQueue {
    static readonly DefaultGroup = "default";
    private readonly groups;
    private ensureGroup;
    add(promise: PromiseOrLazy<any>, groupName?: string): void;
    clear(): void;
}

export { type LazyPromise, type PromiseOrLazy, PromiseQueue, PromiseQueueMap };
