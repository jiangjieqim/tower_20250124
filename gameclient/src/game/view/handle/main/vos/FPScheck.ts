import { E } from "../../../../G";
import {SocketMgr} from "../../../../network/SocketMgr";
/**加速齿轮检测 */
export class FPScheck{
    private _count:number = 0;
    private _timer:number = 0;
    constructor(val:number){
        if(!val){
            return;
        }
        Laya.timer.loop(1,this,this.onLoopEvt);
    }

    private onLoopEvt(){
        this._count++;

        var timer = Laya.Browser.now();
        if (timer - this._timer < 1000)
            return;
        // var count = Stat._count;
        
        let FPS = Math.round((this._count * 1000) / (timer - this._timer));
        if (FPS > 120) {
            SocketMgr.Ins.CloseSocket();
            E.ViewMgr.ShowMidError("加速齿轮" + this._count);
            // return;
        }

        this._count = 0;
        this._timer = timer;
    }
}