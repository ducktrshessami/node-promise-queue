// src/PromiseQueue.ts
var PromiseQueue = class {
  promises = [];
  _all = null;
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
    return this;
  }
  clear() {
    const all = this.all;
    this.promises.length = 0;
    this._all = null;
    return all;
  }
};

// src/PromiseQueueMap.ts
var PromiseQueueMap = class _PromiseQueueMap {
  static DefaultGroup = "default";
  groups = /* @__PURE__ */ new Map();
  _all = null;
  get all() {
    if (this._all) {
      return this._all;
    }
    const allPromises = [];
    this.groups.forEach((group) => allPromises.push(...group.promises));
    this._all = Promise.all(allPromises);
    return this._all;
  }
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
    this._all = null;
    return this;
  }
  group(groupName = _PromiseQueueMap.DefaultGroup) {
    const group = this.groups.get(groupName);
    return group?.all ?? Promise.resolve([]);
  }
  clearGroup(groupName = _PromiseQueueMap.DefaultGroup) {
    const group = this.groups.get(groupName);
    this._all = null;
    return group?.clear() ?? Promise.resolve([]);
  }
  clear() {
    const all = this.all;
    this.groups.forEach((group) => group.clear());
    this.groups.clear();
    this._all = null;
    return all;
  }
};
export {
  PromiseQueue,
  PromiseQueueMap
};
//# sourceMappingURL=index.mjs.map