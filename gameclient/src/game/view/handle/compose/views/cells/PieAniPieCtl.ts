import { PlayPieDebug } from "../PlayPieDebug";

/**卡牌扇形控制器 */
export class PieAniPieCtl {
    img: Laya.Image;
    private pie: Laya.Sprite = new Laya.Sprite();
    private maskSpr: Laya.Sprite = new Laya.Sprite();
    // private timer: Laya.Timer = new Laya.Timer();
    // private imgW: number;
    // private imgH: number;
    private sumTime:number = 0;
    private needMs:number;
    private readonly _startAngle:number = 0;
    private _endAngle:number;
    private _curTime:number;
    private r:number;
    private playPieDebug:PlayPieDebug;
    callBack:Laya.Handler;
    play(w: number, h: number, ms: number) {
        this._endAngle = this._startAngle + 360;
        this.sumTime = 0;
        this.needMs = ms;
        this.img.gray = true;
        
        // this.imgW = w;
        // this.imgH = h;

        this.r = Math.sqrt(w * w + h * h);

        this.pie.alpha = 0.5;
        this.pie.rotation = -90;
        this.pie.x = w/2;
        this.pie.y = h/2;
        this.pie.graphics.clear();
        this.maskSpr.graphics.drawRect(-h/2, -w/2, h, w, "#000000");
        this.pie.mask = this.maskSpr;

        this.img.addChild(this.pie);
        this._curTime  = Laya.timer.currTimer;
        Laya.timer.frameLoop(1,this,this.onLoop);

        if(debug){
            this.playPieDebug = this.img.addComponent(PlayPieDebug);
        }
    }

    /**是否在播放 */
    get isPlaying(){
        return this.img && this.img.gray;
    }
 
    private onLoop() {
        this.sumTime += Laya.timer.delta;

        this.playPieDebug && this.playPieDebug.updateView(this.needMs-this.sumTime)
        
        let disable:boolean = this.sumTime <= this.needMs;
        if(disable){
            this.drawPie(this.sumTime/this.needMs * this._endAngle);
        }else{
            this.drawPie(this._endAngle);
            this.img.gray = false;

            this.playPieDebug && this.playPieDebug.destroy();

            Laya.timer.clear(this,this.onLoop);
            this.pie.removeSelf();
            // console.log(`use time: ${Laya.timer.currTimer - this._curTime} ms`);
        }
        if(this.callBack){
            this.callBack.runWith(!disable);
        }
    }

    private drawPie(_curAngle:number) {
        // let w = this.imgW;
        // let h = this.imgH;
        this.pie.graphics.clear();
        // this.pie.graphics.drawPie(w / 2, h / 2, this.r, this._startAngle,(_curAngle - 360), "#000000");
        this.pie.graphics.drawPie(0, 0, this.r,(_curAngle - 360), this._startAngle,"#000000");
        // 360- _curAngle
    }

}
