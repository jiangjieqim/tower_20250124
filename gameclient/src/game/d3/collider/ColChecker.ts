import { BaseChecker} from "./BaseChecker";
/**碰撞检测器*/
export class ColChecker extends BaseChecker {

    private _enterFunc: Laya.Handler;
    private _stayFunc: Laya.Handler;
    private _exitFunc: Laya.Handler;

    public OnInit(enterFunc: Laya.Handler, stayFunc: Laya.Handler, exitFunc: Laya.Handler) {
        this._enterFunc = enterFunc;
        this._stayFunc = stayFunc;
        this._exitFunc = exitFunc;

    }

    //#region 碰撞事件

    /** 开始碰撞时执行*/
    onCollisionEnter(col: Laya.Collision): void {
        if (this._enterFunc != null)
            this._enterFunc.runWith(col);
    }

    /** 持续碰撞时执行*/
    onCollisionStay(col: Laya.Collision): void {
        if (this._stayFunc != null)
            this._stayFunc.runWith(col);
    }

    /** 结束碰撞时执行*/
    onCollisionExit(col: Laya.Collision): void {
        if (this._exitFunc != null)
            this._exitFunc.runWith(col);
    }

    //#endregion
}