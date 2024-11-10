type LazyPromise<T> = () => Promise<T>;
type PromiseOrLazy<T> = Promise<T> | LazyPromise<T>;

declare class PromiseQueue {
    readonly promises: Promise<any>[];
    private _all;
    private _allSettled;
    get all(): Promise<any[]>;
    get allSettled(): Promise<PromiseSettledResult<any>[]>;
    protected push(promise: Promise<any>): void;
    resolveLazy<T>(promise: PromiseOrLazy<T>): Promise<T>;
    add(promise: PromiseOrLazy<any>): this;
    clear(): Promise<any[]>;
}

declare class PromiseQueueMap {
    static readonly DefaultGroup = "default";
    private readonly groups;
    private _all;
    private _allSettled;
    protected static allPromises(groups: Iterable<PromiseQueue>): Set<Promise<any>>;
    get all(): Promise<any[]>;
    get allSettled(): Promise<PromiseSettledResult<any>[]>;
    private ensureGroup;
    protected cleanAll(): void;
    static resolveLazy<T>(promise: PromiseOrLazy<T>, groups: Iterable<PromiseQueue>): Promise<T>;
    add(promise: PromiseOrLazy<any>, groupNames?: string | string[]): this;
    group(groupName?: string): Promise<any[]>;
    clearGroup(groupName?: string): Promise<any[]>;
    clear(): Promise<any[]>;
}

export { type LazyPromise, type PromiseOrLazy, PromiseQueue, PromiseQueueMap };
