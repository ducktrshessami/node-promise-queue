# promise-queue

Break a word into syllables

## Usage

```js
import { PromiseQueue } from "promise-queue";

async function a() {}
async function b() {}
async function c() {}

const queue = new PromiseQueue()
  .add(a(), "foo")
  .add(b(), "bar")
  .add(() => c(), "foo"); // Lazily call c() only when a() resolves

await queue.all; // Await a(), b(), and c()
```
