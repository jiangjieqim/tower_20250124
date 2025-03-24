import {GameModel} from "../module/game/model/GameModel";
import {ModuleManager} from "./ModuleManager";

export class BaseScript extends Laya.Script {
    vars: any;
    isInited = false;
    onStage = false;
    constructor() {
        super();
    }

    private _evts: { [type: string]: { caller: any, listener: Function, target: Laya.EventDispatcher, args?: any[] }[] };

    onEvt(target: Laya.EventDispatcher, type: string, thisObject: any, listener: Function, args?: any[]) {
        target.on(type, thisObject, listener, args);
        this._evts || (this._evts = {});
        this._evts[type] || (this._evts[type] = []);
        this._evts[type].push({ listener: listener, caller: thisObject, target: target });
    }

    _load_all_inview(root, path) {
        for (var i = 0; i < root.numChildren; i++) {
            var child = root.getChildAt(i);
            this.vars[path + child.name] = child;
            this._load_all_inview(child, path + child.name + "/");
        }
    }

    onAwake() {
        super.onAwake();
        this.owner["script"] = this;
        this.vars = {};
        this._load_all_inview(this.owner, "");
        this.init();
    }

    getVar(n: string): any {
        return this.vars[n];
    }

    init() {
        this.isInited = true;
    }

    onEnable() {
        super.onEnable();
        this.onStage = true;
    }

    onDisable() {
        super.onDisable();
        this.onStage = false;
    }

    onDestroy() {
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
        super.onDestroy;
    }
    get model(): GameModel {
        return ModuleManager.inst.gameContext.model as GameModel;
    }
}