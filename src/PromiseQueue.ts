import { PromiseQueueGroup } from "./PromiseQueueGroup";
import { MergeGroup, PromiseOrLazy } from "./util";

export class PromiseQueue<Groups extends {} = {}> {
    public static readonly DefaultGroup = "default";

    private readonly groups: Map<string, PromiseQueueGroup> = new Map();

    private ensureGroup(name: string): PromiseQueueGroup<any[]> {
        let group = this.groups.get(name);
        if (!group) {
            group = new PromiseQueueGroup(this, name);
            this.groups.set(name, group);
        }
        return group;
    }

    public add<T>(promise: PromiseOrLazy<T>): asserts this is PromiseQueue<MergeGroup<Groups, typeof PromiseQueue.DefaultGroup, T>>;
    public add<T, Group extends string>(promise: PromiseOrLazy<T>, groupName: Group): asserts this is PromiseQueue<MergeGroup<Groups, Group, T>>;
    public add<T>(promise: PromiseOrLazy<T>, groupName: string = PromiseQueue.DefaultGroup): void {
        const group: PromiseQueueGroup<any[]> = this.ensureGroup(groupName);
        group.add(promise);
    }
}
