import assert from "assert";
import { PromiseQueueMap } from "../";

describe("PromiseQueueMap", function () {
    it("should contain stored Promises from all groups", async function () {
        const queue = new PromiseQueueMap()
            .add(Promise.resolve(1), "default")
            .add(Promise.resolve(2), "other");
        const results = await queue.all;
        assert.deepStrictEqual(results, [1, 2]);
    });

    it("should organize Promises by group", async function () {
        const queue = new PromiseQueueMap()
            .add(Promise.resolve(1), "default")
            .add(Promise.resolve(2), "other")
            .add(Promise.resolve(3), "default")
            .add(Promise.resolve(4), "other");
        const results = await queue.group("default");
        assert.deepStrictEqual(results, [1, 3]);
        const results2 = await queue.group("other");
        assert.deepStrictEqual(results2, [2, 4]);
    });

    it("should properly clear groups", async function () {
        const queue = new PromiseQueueMap()
            .add(Promise.resolve(1), "default")
            .add(Promise.resolve(2), "other");
        queue.clear();
        const a = await queue.group("default");
        assert.deepStrictEqual(a, []);
        const b = await queue.group("other");
        assert.deepStrictEqual(b, []);
        const results = await queue.all;
        assert.deepStrictEqual(results, []);
    });

    it("should return grouped Promises on clear", async function () {
        const queue = new PromiseQueueMap()
            .add(Promise.resolve(1), "default")
            .add(Promise.resolve(2), "other");
        const results = await queue.clearGroup("default");
        assert.deepStrictEqual(results, [1]);
    });

    it("should clear Promises from all when clearing a group", async function () {
        const queue = new PromiseQueueMap()
            .add(Promise.resolve(1), "default")
            .add(Promise.resolve(2), "other")
            .add(Promise.resolve(3), "default")
            .add(Promise.resolve(4), "other");
        queue.clearGroup("other");
        const results = await queue.all;
        assert.deepStrictEqual(results, [1, 3]);
    });
});
