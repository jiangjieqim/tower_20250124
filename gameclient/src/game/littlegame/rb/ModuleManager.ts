import { mvc } from "../rb/Mvc";

export class ModuleManager {

    private static _inst: ModuleManager;

    static get inst(): ModuleManager {
        if (!ModuleManager._inst) {
            ModuleManager._inst = new ModuleManager();
        }
        return ModuleManager._inst;
    }

    moduleMaps: { [key: string]: mvc.BaseModule };

    private constructor() {
        this.moduleMaps = {};
    }

    /**请慎用，销毁的时候一定要去除这个引用 */
    get gameContext() {
        return this.moduleMaps["GameModule"].getContext("gameCtx");
    }
}