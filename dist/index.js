"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  PromiseQueue: () => PromiseQueue,
  PromiseQueueMap: () => PromiseQueueMap
});
module.exports = __toCommonJS(src_exports);

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
    return this;
  }
  group(groupName = _PromiseQueueMap.DefaultGroup) {
    const group = this.groups.get(groupName);
    return group?.all ?? Promise.resolve([]);
  }
  clearGroup(groupName = _PromiseQueueMap.DefaultGroup) {
    const group = this.groups.get(groupName);
    return group?.clear() ?? Promise.resolve([]);
  }
  clear() {
    const all = super.clear();
    this.groups.forEach((group) => group.clear());
    this.groups.clear();
    return all;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PromiseQueue,
  PromiseQueueMap
});
//# sourceMappingURL=index.js.map