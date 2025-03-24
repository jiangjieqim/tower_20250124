import { ModuleManager } from "./ModuleManager";

export module mvc {

    export class Node {
        private _context: BaseContext;
        protected _isReady: boolean = false;

        public get isReady(): boolean {
            return this._isReady;
        }

        isopen = false;
        isIninted = false;

        openParam: any;

        constructor(context: BaseContext) {
            this._context = context;
            if (this._isReady) {
                this.init();
            }
        }

        private _evts: { [type: string]: { caller: any, listener: Function, target: Laya.EventDispatcher, args?: any[] }[] };

        onEvt(target: Laya.EventDispatcher, type: string, thisObject: any, listener: Function, args?: any[]) {
            target.on(type, thisObject, listener, args);
            this._evts || (this._evts = {});
            this._evts[type] || (this._evts[type] = []);
            this._evts[type].push({ listener: listener, caller: thisObject, target: target });
        }


        init() {
            this.isIninted = true;
        }

        get context(): BaseContext {
            return this._context;
        }

        /**打开 */
        open(param?: any) {
            this.openParam = param;
            this.isopen = true;
        }


        /**关闭 */
        close() {
            this.isopen = false;
        }

        /**重置 */
        reset() {

        }

        private _isDestroy = false;

        /**销毁 */
        destroy() {
            if (this._isDestroy) {
                return;
            }
            this._isDestroy = true;
            this._context = null;
            if (this._evts) {
                for (let type in this._evts) {
                    let item = this._evts[type];
                    if (item) {
                        for (let i = 0; i < item.length; i++) {
                            item[i].target.off(type, item[i].caller, item[i].listener);
                        }
                    }
                }
                this._evts = null;
            }
        }
    }

    export class BaseModule {

        mapId: string;
        curContext: string;
        contexts: BaseContext[] = [];

        constructor() {

            this.init();
        }

        /**添加context  */
        init() {
            ModuleManager.inst.moduleMaps[this.mapId] = this;
            let emptyCtx = new BaseContext("emptyCtx");
            this.contexts.push(emptyCtx);
        }

        /**需要自己实现 */
        open() {

        }

        /**需要自己实现 this.switchContext("main");*/
        close() {
            this.switchContext("emptyCtx");
        }

        /**销毁 */
        destory() {
           
            for (let i = 0; i < this.contexts.length; i++) {
                let c: BaseContext = this.contexts[i];
                if (c) {
                    c.close();
                    c.destory();
                }
            }
            ModuleManager.inst.moduleMaps[this.mapId] = null;
            delete ModuleManager.inst.moduleMaps[this.mapId];
        }

        getContext(name: string): BaseContext {
            for (let i = 0; i < this.contexts.length; i++) {
                if (this.contexts[i].name == name) {
                    return this.contexts[i];
                }
            }
            return null;
        }

        switchContext(name: string) {
            //我们来个向上close 向下open
            if (!this.curContext) {//还没有设置
                this.curContext = name;
                let context = this.getContext(name);
                let parents = context.getPaths();
                parents = parents.reverse();
                for (let i = 0; i < parents.length; i++) {//向下open
                    parents[i].open();
                }
            } else if (this.curContext == name) {
                this.curContext = name;
                return;
            } else {

                let curContex = this.getContext(this.curContext);
                let curParents = curContex.getPaths();

                let context = this.getContext(name);
                let parents = context.getPaths();


                let curLast = curParents[curParents.length - 1];
                let toLast = parents[parents.length - 1];

                while (curLast == toLast) {
                    curParents.pop();
                    parents.pop();

                    curLast = curParents[curParents.length - 1];
                    toLast = parents[parents.length - 1];

                }

                //向上close
                for (let i = 0; i < curParents.length; i++) {
                    curParents[i].close();
                }

                //向下open
                parents = parents.reverse();
                for (let i = 0; i < parents.length; i++) {//向下open
                    parents[i].open();
                }
                this.curContext = name;

            }

        }

    }

    export class BaseContext {

        parent: BaseContext;

        name: string;
        controller: BaseController;
        view: BaseView;
        model: BaseModel;

        constructor(name: string, parent: BaseContext = null) {
            this.name = name;
            this.parent = parent;
            this.init();
        }

        getPaths(): BaseContext[] {
            let paths: BaseContext[] = [];
            paths.push(this);
            let c = this.parent;
            while (c) {
                paths.push(c);
                c = c.parent;
            }

            return paths;
        }

        /**初始化  controller view model*/
        init() {

        }

        open() {
            this.controller && this.controller.open();
            this.view && this.view.open();
            this.model && this.model.open();
        }

        close() {
            this.controller && this.controller.close();
            this.view && this.view.close();
            this.model && this.model.close();
        }

        /**销毁并不保证close */
        destory() {
            if (this.controller) {
                this.controller.destroy();
            }

            if (this.view) {
                this.view.destroy();
            }

            if (this.model) {
                this.model.destroy();
            }
        }
    }

    export class BaseController extends Node {
        constructor(context: BaseContext) {
            super(context);
            this._isReady = true;
            this.init();
        }
    }

    export class BaseView extends Node {
        constructor(context: BaseContext) {
            super(context);
            this._isReady = true;
            this.init();
        }
    }

    export class BaseModel extends Node {
        constructor(context: BaseContext) {
            super(context);
            this._isReady = true;
            this.init();
        }
    }

}
