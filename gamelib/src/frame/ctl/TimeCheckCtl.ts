/**
 * 时间戳控制器
 */
export class TimeCheckCtl{
    private curTime:number = 0;
    /**
     * 检查的毫秒数
     */
    private checkSubMs:number = 0;
    private _actionHandler:Laya.Handler;
    constructor(){

    }

    public setTime(ms:number,actionHandler:Laya.Handler){
        this.checkSubMs = ms;
        this._actionHandler = actionHandler;
    }

    public delayStart(){
        Laya.timer.clear(this,this.start);
        Laya.timer.once(this.checkSubMs,this,this.start);
    }

    public start(){
        let sub = Laya.timer.currTimer - this.curTime;
        let _time:number = 0;
        let s = sub - this.checkSubMs
        if(s <  0){
            _time = s;
        }else{
            this.curTime = Laya.timer.currTimer;
        }
        // if(HrefUtils.getHref("debug") == "1") console.log("_time:"+_time);
        this._actionHandler.runWith(_time);
    }

    public dispose(){
        this._actionHandler = null;
    }

}