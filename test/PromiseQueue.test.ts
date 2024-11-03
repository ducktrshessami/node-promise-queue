import assert from "assert";
import { PromiseQueue } from "../";

describe("PromiseQueue", function () {
    it("should contain stored Promises", async function () {
        const queue = new PromiseQueue();
        queue.add(Promise.resolve(1));
        queue.add(Promise.resolve(2));
        const results = await queue.all;
        assert.deepStrictEqual(results, [1, 2]);
    });

    it("should resolve lazy Promises after stored Promises", async function () {
        const queue = new PromiseQueue();
        let resolve: () => void;
        queue.add(new Promise(res => resolve = () => {
            const t = Date.now();
            setTimeout(() => res(t), 2);
        }));
        queue.add(() => new Promise(res => {
            const t = Date.now();
            setTimeout(() => res(t), 2);
        }));
        queue.add(() => Promise.resolve(Date.now()));
        resolve!();
        const results = await queue.all;
        for (let i = 0; i < results.length - 1; i++) {
            assert(results[i] < results[i + 1]);
        }
    });

    it("should return all Promises on clear", async function () {
        const queue = new PromiseQueue();
        queue.add(Promise.resolve(1));
        queue.add(Promise.resolve(2));
        const results = await queue.clear();
        assert.deepStrictEqual(results, [1, 2]);
    });
});
