import assert from "assert";
import { PromiseQueue } from "../";

describe("PromiseQueue", function () {
    it("should contain stored Promises", async function () {
        const queue = new PromiseQueue()
            .add(Promise.resolve(1))
            .add(Promise.resolve(2));
        const results = await queue.all;
        assert.deepStrictEqual(results, [1, 2]);
    });

    it("should resolve lazy Promises after stored Promises", async function () {
        const queue = new PromiseQueue();
        let a = 0;
        let b: number;
        let resolve: () => void;
        queue
            .add(new Promise(res => resolve = () => {
                a++;
                setTimeout(() => res(a), 2);
            }))
            .add(new Promise(res => {
                b = a + 2;
                setTimeout(() => res(b), 2);
            }))
            .add(() => Promise.resolve(a + b));
        resolve!();
        const results = await queue.all;
        assert.deepStrictEqual(results, [1, 2, 3]);
    });

    it("should return all Promises on clear", async function () {
        const queue = new PromiseQueue()
            .add(Promise.resolve(1))
            .add(Promise.resolve(2));
        const results = await queue.clear();
        assert.deepStrictEqual(results, [1, 2]);
    });
});
