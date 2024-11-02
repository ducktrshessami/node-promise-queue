type LazyPromise<T> = () => Promise<T>;
type PromiseOrLazy<T> = Promise<T> | LazyPromise<T>;
type MergeGroupType<Groups extends {}, Group extends string, T> = Group extends keyof Groups ? (Groups[Group] extends any[] ? [...Groups[Group], T] : []) : [
    T
];
type MergeGroup<Groups extends {}, Group extends string, T> = Omit<Groups, Group> & {
    [K in Group]: MergeGroupType<Groups, K, T>;
};

declare class PromiseQueueGroup<GroupTypes extends any[] = []> {
    private readonly promises;
    private _all;
    constructor();
    get all(): Promise<GroupTypes>;
    protected push<T>(promise: Promise<T>): asserts this is PromiseQueueGroup<[...GroupTypes, T]>;
    resolveLazy<T>(promise: PromiseOrLazy<T>): Promise<T>;
    add<T>(promise: PromiseOrLazy<T>): asserts this is PromiseQueueGroup<[...GroupTypes, T]>;
    clear(): asserts this is PromiseQueueGroup<[]>;
}

declare class PromiseQueue<GroupMap extends {} = {}, AllTypes extends any[] = []> extends PromiseQueueGroup<AllTypes> {
    static readonly DefaultGroup = "default";
    private readonly groups;
    private ensureGroup;
    add<T>(promise: PromiseOrLazy<T>): asserts this is PromiseQueue<MergeGroup<GroupMap, typeof PromiseQueue.DefaultGroup, T>, [...AllTypes, T]>;
    add<T, Group extends string>(promise: PromiseOrLazy<T>, groupName: Group): asserts this is PromiseQueue<MergeGroup<GroupMap, Group, T>, [...AllTypes, T]>;
    clear(): asserts this is PromiseQueue<{}, []>;
}

export { type LazyPromise, type PromiseOrLazy, PromiseQueue, PromiseQueueGroup };
