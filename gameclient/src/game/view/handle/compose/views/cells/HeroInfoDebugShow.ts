import { WatchHero_revc } from "../../../../../network/protocols/BaseProto";
import { ComposeModel } from "../../ComposeModel";

export class HeroInfoDebugShow extends Laya.Script {
    private tf: Laya.Label;
    revc:WatchHero_revc;
    onAwake() {
        let name = "debugTF";
        if(this.owner.getChildByName(name)){
            this.tf = this.owner.getChildByName(name) as Laya.Label;
        }
        if (!this.tf) {
            this.tf = new Laya.Label();
            this.tf.fontSize = 22;
            this.tf.color = "#ffffff";
            this.tf.stroke = 2;
            this.tf.strokeColor = "#000000";
            this.tf.name = name;
            // this.tf.alpha = 0.75;
            // this.tf.y = 22;
            this.tf.bgColor = "#777777";
            this.owner.addChild(this.tf);
        }
        Laya.timer.callLater(this,this.onCallLayer)
    }

    private onCallLayer(){
        let vo = ComposeModel.Ins.getHeroVo(this.revc.uid);
        if(vo){
            let s = `uid:${vo.uid} heroid:${vo.fid} x:${vo.x} y:${vo.y} num:${vo.num} lv:${this.revc.lv}`;
            this.tf.text = s;
        }
        if(this.tf.parent){
            let parent = this.tf.parent as Laya.Sprite;
            this.tf.pos(0,parent.height);
        }
        // FunctionModel.Ins.showSmallTips('tips', s, this.tf);
    }
}