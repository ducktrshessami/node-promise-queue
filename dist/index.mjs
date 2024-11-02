// src/PromiseQueueGroup.ts
var PromiseQueueGroup = class {
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
};

// src/PromiseQueue.ts
var PromiseQueue = class _PromiseQueue extends PromiseQueueGroup {
  static DefaultGroup = "default";
  groups = /* @__PURE__ */ new Map();
  ensureGroup(name) {
    let group = this.groups.get(name);
    if (!group) {
      group = new PromiseQueueGroup();
      this.groups.set(name, group);
    }
    return group;
  }
  add(promise, groupName = _PromiseQueue.DefaultGroup) {
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
  PromiseQueueGroup
};
//# sourceMappingURL=index.mjs.map