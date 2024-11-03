// src/PromiseQueue.ts
var PromiseQueue = class {
  promises;
  _all;
  constructor() {
    this.promises = [];
    this._all = null;
  }
  get all() {
    this._all ??= Promise.all(this.promises);
    return this._all;
  }
  push(promise) {
    this.promises.push(promise);
    this._all = null;
  }
  resolveLazy(promise) {
    return typeof promise === "function" ? this.all.then(promise) : promise;
  }
  add(promise) {
    const p = this.resolveLazy(promise);
    this.push(p);
  }
  clear() {
    this.promises.length = 0;
    this._all = null;
  }
  allClear() {
    const all = this.all;
    this.clear();
    return all;
  }
};

// src/PromiseQueueMap.ts
var PromiseQueueMap = class _PromiseQueueMap extends PromiseQueue {
  static DefaultGroup = "default";
  groups = /* @__PURE__ */ new Map();
  ensureGroup(name) {
    let group = this.groups.get(name);
    if (!group) {
      group = new PromiseQueue();
      this.groups.set(name, group);
    }
    return group;
  }
  add(promise, groupName = _PromiseQueueMap.DefaultGroup) {
    const group = this.ensureGroup(groupName);
    const p = group.resolveLazy(promise);
    group.add(p);
    this.push(p);
  }
  clear() {
    this.groups.forEach((group) => group.clear());
    this.groups.clear();
    super.clear();
  }
};
export {
  PromiseQueue,
  PromiseQueueMap
};
//# sourceMappingURL=index.mjs.map