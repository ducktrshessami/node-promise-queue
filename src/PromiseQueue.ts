import { PromiseQueueGroup } from "./PromiseQueueGroup";
import { GroupType, MergeGroup, PromiseOrLazy } from "./util";

export class PromiseQueue<GroupMap extends {} = {}, AllTypes extends any[] = []> extends PromiseQueueGroup<AllTypes> {
    public static readonly DefaultGroup = "default";

    private readonly groups: Map<string, PromiseQueueGroup> = new Map();

    private ensureGroup<Group extends string>(name: Group): PromiseQueueGroup<GroupType<GroupMap, Group>> {
        let group = this.groups.get(name);
        if (!group) {
            group = new PromiseQueueGroup();
            this.groups.set(name, group);
        }
        return group as PromiseQueueGroup<GroupType<GroupMap, Group>>;
    }

    public add<T>(promise: PromiseOrLazy<T>): asserts this is PromiseQueue<MergeGroup<GroupMap, typeof PromiseQueue.DefaultGroup, T>, [...AllTypes, T]>;
    public add<T, Group extends string>(promise: PromiseOrLazy<T>, groupName: Group): asserts this is PromiseQueue<MergeGroup<GroupMap, Group, T>, [...AllTypes, T]>;
    public add<T>(promise: PromiseOrLazy<T>, groupName: string = PromiseQueue.DefaultGroup): void {
        const group: PromiseQueueGroup<any[]> = this.ensureGroup(groupName);
        const p = group.resolveLazy(promise);
        group.add(p);
        this.push(p);
    }

    public clear(): asserts this is PromiseQueue<{}, []> {
        this.groups.forEach(group => group.clear());
        this.groups.clear();
        super.clear();
    }
}
