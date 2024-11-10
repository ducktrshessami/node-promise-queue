import { PromiseQueue } from "./PromiseQueue";
import { PromiseOrLazy } from "./util";

export class PromiseQueueMap {
    public static readonly DefaultGroup = "default";

    private readonly groups: Map<string, PromiseQueue> = new Map();
    private _all: Promise<any[]> | null = null;
    private _allSettled: Promise<PromiseSettledResult<any>[]> | null = null;

    protected static allPromises(groups: Iterable<PromiseQueue>): Set<Promise<any>> {
        const allPromises: Set<Promise<any>> = new Set();
        for (const group of groups) {
            group.promises.forEach(promise => allPromises.add(promise));
        }
        return allPromises;
    }

    public get all(): Promise<any[]> {
        if (this._all) {
            return this._all;
        }
        this._all = Promise.all(PromiseQueueMap.allPromises(this.groups.values()));
        return this._all;
    }

    public get allSettled(): Promise<PromiseSettledResult<any>[]> {
        if (this._allSettled) {
            return this._allSettled;
        }
        this._allSettled = Promise.allSettled(PromiseQueueMap.allPromises(this.groups.values()));
        return this._allSettled;
    }

    private ensureGroup(name: string): PromiseQueue {
        let group = this.groups.get(name);
        if (!group) {
            group = new PromiseQueue();
            this.groups.set(name, group);
        }
        return group;
    }

    protected cleanAll(): void {
        this._all = null;
        this._allSettled = null;
    }

    public static resolveLazy<T>(promise: PromiseOrLazy<T>, groups: Iterable<PromiseQueue>): Promise<T> {
        return typeof promise === "function" ? Promise.all(PromiseQueueMap.allPromises(groups)).then(promise) : promise;
    }

    public add(promise: PromiseOrLazy<any>, groupNames: string | string[] = PromiseQueueMap.DefaultGroup): this {
        const names = typeof groupNames === "string" ? [groupNames] : groupNames;
        const groups = names.map(name => this.ensureGroup(name));
        const p = PromiseQueueMap.resolveLazy(promise, groups);
        groups.forEach(group => group.add(p));
        this.cleanAll();
        return this;
    }

    public group(groupName: string = PromiseQueueMap.DefaultGroup): Promise<any[]> {
        const group = this.groups.get(groupName);
        return group?.all ?? Promise.resolve([]);
    }

    public clearGroup(groupName: string = PromiseQueueMap.DefaultGroup): Promise<any[]> {
        const group = this.groups.get(groupName);
        this.cleanAll();
        return group?.clear() ?? Promise.resolve([]);
    }

    public clear(): Promise<any[]> {
        const all = this.all;
        this.groups.forEach(group => group.clear());
        this.groups.clear();
        this.cleanAll();
        return all;
    }
}
