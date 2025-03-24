import {BaseChecker }from "./BaseChecker";

/**触发检测*/
export class TrigChecker extends BaseChecker {

    private _enterFunc: Laya.Handler;
    private _stayFunc: Laya.Handler;
    private _exitFunc: Laya.Handler;

    public OnInit(enterFunc: Laya.Handler, stayFunc: Laya.Handler, exitFunc: Laya.Handler) {
        this._enterFunc = enterFunc;
        this._stayFunc = stayFunc;
        this._exitFunc = exitFunc;

    }

    //#region 触发事件

    /** 开始触发时执行*/
    onTriggerEnter(other: Laya.PhysicsComponent): void {
        if (this._enterFunc != null)
            this._enterFunc.runWith(other);
    }
    /** 持续触发时执行*/
    onTriggerStay(other: Laya.PhysicsComponent): void {
        if (this._stayFunc != null)
            this._stayFunc.runWith(other);
    }
    /** 结束触发时执行*/
    onTriggerExit(other: Laya.PhysicsComponent): void {
        if (this._exitFunc != null)
            this._exitFunc.runWith(other);
    }
    //#endregion

}