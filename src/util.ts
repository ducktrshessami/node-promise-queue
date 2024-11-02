export type PromiseOrLazy<T> = Promise<T> | (() => Promise<T>);

export type MergeGroupType<Groups extends {}, Group extends string, T> = Group extends keyof Groups ?
    (Groups[Group] extends any[] ? [...Groups[Group], T] : []) :
    [T];
export type MergeGroup<Groups extends {}, Group extends string, T> = Omit<Groups, Group> & { [K in Group]: MergeGroupType<Groups, K, T> };
