// import { DebugUtil } from "../../../../../../frame/util/DebugUtil";
import { FrameMonster } from "../FrameAvatar";

export class FrameMonsterDebug extends Laya.Script {
    monster: FrameMonster;
    private tf: Laya.Label;

    onEnable() {
        this.tf = DebugUtil.createTf();
        this.tf.color = "#ffffff";
        this.tf.alpha = 0.75;
        // this.tf.y = -200;
        this.tf.bgColor = "#000000";
        Laya.timer.frameLoop(1, this, this.onLoop);
    }
    private onLoop() {
        if(this.monster && this.monster['destroyed']){
            this.tf.destroy();
            Laya.timer.clear(this, this.onLoop);
            return;
        }

        if (this.monster && this.monster.skeleton) {
            if(!this.tf.parent){
                this.monster.skeleton.addChild(this.tf);
            }
            if (this.monster['frameList']) {
                let vo = this.monster['frameList'][this.monster.anim];
                if (vo) {
                    this.tf.text = `animIndex:${this.monster.anim} gap:${vo.start}-${(vo.start + vo.count)}\n${this.monster.skeleton.skin}\nfps:${(1000 / this.monster.getCurMS()).toFixed(1)}`;
                    this.tf.y = -this.tf.textField.textHeight - 200;
                }
            }
        }
    }
}