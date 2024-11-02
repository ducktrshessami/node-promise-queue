export type LazyPromise<T> = () => Promise<T>;
export type PromiseOrLazy<T> = Promise<T> | LazyPromise<T>;

export type GroupType<Groups extends {}, Group extends string> = Group extends keyof Groups ?
    (Groups[Group] extends any[] ? Groups[Group] : []) :
    [];
export type MergeGroupType<Groups extends {}, Group extends string, T> = Group extends keyof Groups ?
    (Groups[Group] extends any[] ? [...Groups[Group], T] : []) :
    [T];
export type MergeGroup<Groups extends {}, Group extends string, T> = Omit<Groups, Group> & { [K in Group]: MergeGroupType<Groups, K, T> };
