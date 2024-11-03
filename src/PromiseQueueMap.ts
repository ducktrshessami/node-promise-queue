import { PromiseQueue } from "./PromiseQueue";
import { PromiseOrLazy } from "./util";

export class PromiseQueueMap {
    public static readonly DefaultGroup = "default";

    private readonly groups: Map<string, PromiseQueue> = new Map();
    private _all: Promise<any[]> | null = null;

    public get all(): Promise<any[]> {
        if (this._all) {
            return this._all;
        }
        const allPromises: Promise<any>[] = [];
        this.groups.forEach(group => allPromises.push(...group.promises));
        this._all = Promise.all(allPromises);
        return this._all;
    }

    private ensureGroup(name: string): PromiseQueue {
        let group = this.groups.get(name);
        if (!group) {
            group = new PromiseQueue();
            this.groups.set(name, group);
        }
        return group;
    }

    public add(promise: PromiseOrLazy<any>, groupName: string = PromiseQueueMap.DefaultGroup): this {
        const group = this.ensureGroup(groupName);
        const p = group.resolveLazy(promise);
        group.add(p);
        this._all = null;
        return this;
    }

    public group(groupName: string = PromiseQueueMap.DefaultGroup): Promise<any[]> {
        const group = this.groups.get(groupName);
        return group?.all ?? Promise.resolve([]);
    }

    public clearGroup(groupName: string = PromiseQueueMap.DefaultGroup): Promise<any[]> {
        const group = this.groups.get(groupName);
        this._all = null;
        return group?.clear() ?? Promise.resolve([]);
    }

    public clear(): Promise<any[]> {
        const all = this.all;
        this.groups.forEach(group => group.clear());
        this.groups.clear();
        this._all = null;
        return all;
    }
}
