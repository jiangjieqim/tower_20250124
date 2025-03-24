/**
 * 长按控制器
 */
export class LongTouch{
    private handler:Laya.Handler;
    // private timer:Laya.Timer;
    constructor(btn:Laya.Sprite,run:Laya.Handler){
        this.handler = run;
        btn.on(Laya.Event.MOUSE_DOWN,this,this.onMouseDown);
        btn.on(Laya.Event.MOUSE_UP,this,this.onMouseUp);
        btn.on(Laya.Event.UNDISPLAY,this,this.stop);
        btn.on(Laya.Event.MOUSE_OUT,this,this.stop);
    }

    private onMouseDown(){
        Laya.timer.loop(Laya.timer.delta,this,this.onLoop);
    }

    private stop(){
        Laya.timer.clear(this,this.onLoop);
    }

    private onLoop(){
        this.handler.run();
    }

    private onMouseUp(){
        this.stop();
    }
}