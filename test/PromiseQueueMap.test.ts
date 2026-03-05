import { describe, expect, it } from "vitest";
import { PromiseQueueMap } from "../";

describe("PromiseQueueMap", function () {
    it("should contain stored Promises from all groups", async function () {
        const queue = new PromiseQueueMap()
            .add(Promise.resolve(1), "default")
            .add(Promise.resolve(2), "other");
        const results = await queue.all;
        expect(results).toStrictEqual([1, 2]);
    });

    it("should organize Promises by group", async function () {
        const queue = new PromiseQueueMap()
            .add(Promise.resolve(1), "default")
            .add(Promise.resolve(2), "other")
            .add(Promise.resolve(3), "default")
            .add(Promise.resolve(4), "other");
        const results = await queue.group("default");
        expect(results).toStrictEqual([1, 3]);
        const results2 = await queue.group("other");
        expect(results2).toStrictEqual([2, 4]);
    });

    it("should resolve multi-group lazy Promises after those grouped promises", async function () {
        const queue = new PromiseQueueMap();
        let a = 0;
        let b = 0;
        let c = 0;
        let resolve: () => void;
        queue
            .add(new Promise(res => resolve = () => {
                a++;
                setTimeout(() => res(a), 2);
            }), "default")
            .add(new Promise(res => {
                b = a + 2;
                setTimeout(() => res(b), 2);
            }), "other")
            .add(() => {
                c = a + b;
                return Promise.resolve(c);
            }, ["default", "other"]);
        resolve!();
        await queue.all;
        expect([a, b, c]).toStrictEqual([1, 2, 3]);
    });

    it("should properly clear groups", async function () {
        const queue = new PromiseQueueMap()
            .add(Promise.resolve(1), "default")
            .add(Promise.resolve(2), "other");
        queue.clear();
        const a = await queue.group("default");
        expect(a).toStrictEqual([]);
        const b = await queue.group("other");
        expect(b).toStrictEqual([]);
        const results = await queue.all;
        expect(results).toStrictEqual([]);
    });

    it("should return grouped Promises on clear", async function () {
        const queue = new PromiseQueueMap()
            .add(Promise.resolve(1), "default")
            .add(Promise.resolve(2), "other");
        const results = await queue.clearGroup("default");
        expect(results).toStrictEqual([1]);
    });

    it("should clear Promises from all when clearing a group", async function () {
        const queue = new PromiseQueueMap()
            .add(Promise.resolve(1), "default")
            .add(Promise.resolve(2), "other")
            .add(Promise.resolve(3), "default")
            .add(Promise.resolve(4), "other");
        queue.clearGroup("other");
        const results = await queue.all;
        expect(results).toStrictEqual([1, 3]);
    });
});
