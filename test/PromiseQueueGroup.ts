import assert from "assert";
import { PromiseQueueGroup } from "../";

describe("PromiseQueueGroup", function () {
    it("should contain stored Promises", async function () {
        const group: PromiseQueueGroup = new PromiseQueueGroup();
        group.add(Promise.resolve(1));
        group.add(Promise.resolve(2));
        const results = await group.all;
        assert.deepStrictEqual(results, [1, 2]);
    });
});
