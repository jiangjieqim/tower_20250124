import { ISimpleEffect } from "../../../avatar/NoContainerSimpleEffect";
import { SpineEffectMgr } from "../../../avatar/SpineEffectMgr";
import { TowerBaseAvatar } from "../avatar/TowerBaseAvatar";

export class AvatarOnceEffect {
    // private skel: Laya.Sprite;
    private avatar: TowerBaseAvatar;
    private url: string;
    private effect: ISimpleEffect;
    private layer: Laya.Sprite;
    offsetX:number;
    offsetY:number;
    constructor() {

    }

    play(layar: Laya.Sprite, avatar: TowerBaseAvatar, url: string) {
        this.layer = layar;
        this.avatar = avatar;
        this.url = url;
        Laya.timer.frameLoop(1, this, this.onLoop)
    }
    private dispose() {
        Laya.timer.clear(this, this.onLoop);
        this.effect = null;
        this.avatar = null;

    }
    private onLoop() {
        if (this.effect && this.effect.isDestory || this.avatar.isDestory) {
            this.dispose();
            return;
        }

        if (!this.avatar.isDestory && this.avatar.coreSpine && this.avatar.coreSpine.skeleton) {
            let skel = this.avatar.coreSpine.skeleton;

            let parent: Laya.Sprite = skel.parent as Laya.Sprite;
            if (parent && parent.parent) {
                // let skel = this.skel;
                let url = this.url;
                let layer = this.layer;//this.model.fightView.getLayer(EFightLayer.HitMonsterLayer);
                let offset = (layer.parent as Laya.Sprite).localToGlobal(new Laya.Point(layer.x, layer.y));

                let pos = (parent as Laya.Sprite).localToGlobal(new Laya.Point(skel.x, skel.y));

                let ox = pos.x - offset.x + (this.offsetX||0);
                let oy = pos.y - offset.y + (this.offsetY||0);
                if (!this.effect) {
                    this.effect = SpineEffectMgr.playOnce(url, layer, ox, oy, 0);
                    // LogSys.Log(`创建特效...${this.url}`);
                }
                this.effect.setPos(ox, oy);
            } else {
                // LogSys.Warn(`AvatarOnceEffect 未添加到舞台...${this.url}`);
            }
        }
    }
}