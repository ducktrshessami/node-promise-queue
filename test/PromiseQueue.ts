import assert from "assert";
import { PromiseQueue } from "../";

describe("PromiseQueue", function () {
    it("should contain stored Promises", async function () {
        const queue: PromiseQueue = new PromiseQueue();
        queue.add(Promise.resolve(1));
        queue.add(Promise.resolve(2));
        const results = await queue.all;
        assert.deepStrictEqual(results, [1, 2]);
    });
});
