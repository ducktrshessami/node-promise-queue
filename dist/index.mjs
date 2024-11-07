var PromiseQueue=class{promises=[];_all=null;get all(){return this._all??=Promise.all(this.promises),this._all}push(promise){this.promises.push(promise),this._all=null}resolveLazy(promise){return typeof promise=="function"?this.all.then(promise):promise}add(promise){let p=this.resolveLazy(promise);return this.push(p),this}clear(){let all=this.all;return this.promises.length=0,this._all=null,all}};var PromiseQueueMap=class _PromiseQueueMap{static DefaultGroup="default";groups=new Map;_all=null;get all(){if(this._all)return this._all;let allPromises=[];return this.groups.forEach(group=>allPromises.push(...group.promises)),this._all=Promise.all(allPromises),this._all}ensureGroup(name){let group=this.groups.get(name);return group||(group=new PromiseQueue,this.groups.set(name,group)),group}add(promise,groupName=_PromiseQueueMap.DefaultGroup){let group=this.ensureGroup(groupName),p=group.resolveLazy(promise);return group.add(p),this._all=null,this}group(groupName=_PromiseQueueMap.DefaultGroup){return this.groups.get(groupName)?.all??Promise.resolve([])}clearGroup(groupName=_PromiseQueueMap.DefaultGroup){let group=this.groups.get(groupName);return this._all=null,group?.clear()??Promise.resolve([])}clear(){let all=this.all;return this.groups.forEach(group=>group.clear()),this.groups.clear(),this._all=null,all}};export{PromiseQueue,PromiseQueueMap};
//# sourceMappingURL=index.mjs.map