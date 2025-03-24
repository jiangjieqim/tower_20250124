import { ComposeEvent } from "../ComposeEvent";
import { ComposeModel } from "../ComposeModel";
import { TowerAvatarView } from "./TowerAvatarView";

export class TowerAvatarCheck extends Laya.Script {
    private model: ComposeModel;
    avatar: TowerAvatarView;
    // private tf: Laya.Label;
    onAwake() {
        this.model = ComposeModel.Ins;
        // if (debug) {
        //     let tf = new Laya.Label();
        //     tf.color = "#00ff00";
        //     tf.strokeColor = "#000000";
        //     tf.stroke = 1;
        //     tf.fontSize = 18;
        //     this.tf = tf;
        // }
        Laya.timer.frameLoop(1, this, this.onLoop);
    }

    private onLoop() {
        if (this.owner.parent) {
            // if (this.tf) {
            //     let x = (this.owner as Laya.Sprite).x;
            //     let y = (this.owner as Laya.Sprite).y;
            //     this.owner.parent.addChild(this.tf);
            //     this.tf.x = x;
            //     this.tf.y = y;
            //     if (this.avatar.heroVo) {
            //         this.tf.text = `${this.avatar.heroVo.uid},${this.avatar.heroVo.fid},${this.avatar.parent.zOrder}`;//英雄
            //     }
            //     if (this.avatar.vo) {
            //         // let pos = new Laya.Point();
            //         // if(this.avatar.coreSpine && this.avatar.coreSpine.skeleton){
            //         // }
            //         this.tf.text = this.avatar.vo.uid + "," + this.avatar.vo.fid + "\n" +  this.avatar.region;
            //     }
            // }

            if (this.avatar.vo) {
                let uid = this.avatar.vo.uid;
                if (this.model && this.model.removeUIDs.indexOf(uid) != -1) {
                    // LogSys.Error(`need del ${uid}`);
                    this.model.event(ComposeEvent.MonsterRemove, uid);
                }
            }
        } else {
            this.clear();
            this.destroy();
        }
    }

    private clear() {
        this.model = null;
        Laya.timer.clear(this, this.onLoop);
        // this.tf && this.tf.removeSelf();
    }

    onDestroy() {
        this.clear();
        this.avatar = null;
    }
}