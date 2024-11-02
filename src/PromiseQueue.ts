import { PromiseQueueGroup } from "./PromiseQueueGroup";
import { PromiseOrLazy } from "./util";

export class PromiseQueue extends PromiseQueueGroup {
    public static readonly DefaultGroup = "default";

    private readonly groups: Map<string, PromiseQueueGroup> = new Map();

    private ensureGroup(name: string): PromiseQueueGroup {
        let group = this.groups.get(name);
        if (!group) {
            group = new PromiseQueueGroup();
            this.groups.set(name, group);
        }
        return group;
    }

    public add(promise: PromiseOrLazy<any>, groupName: string = PromiseQueue.DefaultGroup): void {
        const group = this.ensureGroup(groupName);
        const p = group.resolveLazy(promise);
        group.add(p);
        this.push(p);
    }

    public clear(): void {
        this.groups.forEach(group => group.clear());
        this.groups.clear();
        super.clear();
    }
}
