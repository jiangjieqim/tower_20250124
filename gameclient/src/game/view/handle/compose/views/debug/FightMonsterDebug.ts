import { FrameMonster } from "../FrameAvatar";
import { HeroAvatarView } from "../HeroAvatarView";
import { TowerAvatarView } from "../TowerAvatarView";

export class FightMonsterDebug extends Laya.Script{
    avatar: TowerAvatarView;
    private tf: Laya.Label;
    private spr:Laya.Sprite = new Laya.Sprite();
    onAwake() {
        this.spr.graphics.drawCircle(0,0,3,null,"#ff0000");
        let tf = new Laya.Label();
        tf.color = "#00ff00";
        tf.strokeColor = "#000000";
        tf.stroke = 2;
        tf.fontSize = 18;
        this.tf = tf;
        Laya.timer.frameLoop(1, this, this.onLoop);
    }

    private onLoop() {
        if (this.owner.parent) {
            if (this.tf) {
                let x = (this.owner as Laya.Sprite).x;
                let y = (this.owner as Laya.Sprite).y;
                if(Laya.Utils.getQueryString("show_uid")){
                    this.owner.parent.addChild(this.tf);
                }
                this.spr.pos(x,y);
                this.owner.parent.addChild(this.spr);

                this.tf.x = x;
                this.tf.y = y;
                if(this.avatar){
                    if (this.avatar instanceof HeroAvatarView && this.avatar.heroVo) {
                        // 英雄
                        let coreframe: FrameMonster = this.avatar.coreSpine as any;
                        if (coreframe) {
                            this.tf.text = `${this.avatar.heroVo.uid}`;//英雄
                            // ,${this.avatar.heroVo.fid}[${this.avatar.heroVo.x} ${this.avatar.heroVo.y}]
                            // \n${this.avatar.parent.zOrder}:speed:${this.avatar.playSpeed.toFixed(3)},${coreframe.curMS||0}
                        }
                    }
                    if (this.avatar.vo) {
                        //怪物
                        this.tf.text = `${this.avatar.vo.uid}`;// + "," + this.avatar.vo.fid + "\n" +  this.avatar.region;
                        // \n${this.avatar.curPosIndex}
                        // -${this.avatar.curPosIndex}
                    }
                }
            }
        } else {
            this.clear();
            this.destroy();
        }
    }

    private clear() {
        Laya.timer.clear(this, this.onLoop);
        this.tf && this.tf.removeSelf();
        this.spr && this.spr.destroy();
    }

    onDestroy() {
        this.clear();
        this.avatar = null;
    }
}