type LazyPromise<T> = () => Promise<T>;
type PromiseOrLazy<T> = Promise<T> | LazyPromise<T>;

declare class PromiseQueue {
    readonly promises: Promise<any>[];
    private _all;
    get all(): Promise<any[]>;
    protected push(promise: Promise<any>): void;
    resolveLazy<T>(promise: PromiseOrLazy<T>): Promise<T>;
    add(promise: PromiseOrLazy<any>): this;
    clear(): Promise<any[]>;
}

declare class PromiseQueueMap {
    static readonly DefaultGroup = "default";
    private readonly groups;
    private _all;
    get all(): Promise<any[]>;
    private ensureGroup;
    add(promise: PromiseOrLazy<any>, groupName?: string): this;
    group(groupName?: string): Promise<any[]>;
    clearGroup(groupName?: string): Promise<any[]>;
    clear(): Promise<any[]>;
}

export { type LazyPromise, type PromiseOrLazy, PromiseQueue, PromiseQueueMap };
