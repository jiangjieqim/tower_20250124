import { ScreenAdapter } from "../../../../../G";
import { BaseGuide } from "../../../guide/BaseGuide";
export class FightGuideDebug extends Laya.Sprite{
    private readonly offsetX:number = 100;
    private readonly offsetY:number = 100;
    private tf:Laya.Label;
    private readonly h:number = 30;
    private target:BaseGuide;

    constructor(target:BaseGuide){
        super();
        this.target = target;
        this.alpha = 0.75;
        this.tf = new Laya.Label();
        this.tf.fontSize = 22;
        this.tf.stroke = 2;
        this.tf.strokeColor = "#000000";
        this.tf.color = "#ffffff";
        this.tf.bgColor = "#777777";
        this.tf.y = this.h;
        this.addChild(this.tf);
        Laya.timer.frameLoop(1,this,this.onLoop);
    }

    private onLoop(){
        Laya.stage.addChild(this);
        let w:number = 200;
        let h:number = this.h;
        this.x = Laya.stage.width/2 - ScreenAdapter.UIRefWidth/2 + this.offsetX;
        this.y = this.offsetY;
        let n:number = 1;
        let vo = this.target;//FightGuide.Ins;
        let curMs:number =vo.curMs;
        let all = vo.allMs;
        let per = curMs / all;
        this.graphics.clear();
        this.graphics.drawRect(0,0,w,h,null,"#ffffff");
        this.graphics.drawRect(n,n,w*per-n*2,h-n*2,"#ff0000");
        this.tf.text = `${curMs}/${all} ms`;
    }
}