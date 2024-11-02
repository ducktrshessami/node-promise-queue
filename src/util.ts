export type LazyPromise<T> = () => Promise<T>;
export type PromiseOrLazy<T> = Promise<T> | LazyPromise<T>;
