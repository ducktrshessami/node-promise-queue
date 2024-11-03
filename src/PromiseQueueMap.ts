import { PromiseQueue } from "./PromiseQueue";
import { PromiseOrLazy } from "./util";

export class PromiseQueueMap extends PromiseQueue {
    public static readonly DefaultGroup = "default";

    private readonly groups: Map<string, PromiseQueue> = new Map();

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
        this.push(p);
        return this;
    }

    public group(groupName: string = PromiseQueueMap.DefaultGroup): Promise<any[]> {
        const group = this.groups.get(groupName);
        return group?.all ?? Promise.resolve([]);
    }

    public clearGroup(groupName: string = PromiseQueueMap.DefaultGroup): Promise<any[]> {
        const group = this.groups.get(groupName);
        return group?.clear() ?? Promise.resolve([]);
    }

    public clear(): Promise<any[]> {
        const all = super.clear();
        this.groups.forEach(group => group.clear());
        this.groups.clear();
        return all;
    }
}
