import { ISimpleEffect } from "../../../avatar/NoContainerSimpleEffect";
import { SpineEffectMgr } from "../../../avatar/SpineEffectMgr";
import { FightValueConfig } from "../../vos/FightValueConfig";
import { IceEffect } from "../cells/IceEffect";
import { TowerBaseAvatar } from "./TowerBaseAvatar";

/**普通角色常驻挂载特效 */
export class NormalAvatarEffect {
    parent: Laya.Sprite;
    avatar: TowerBaseAvatar;
    /**资源链接 */
    resURL:string;
    offsetX:number;
    offsetY:number;
    private effect:ISimpleEffect;
    private sumTime: number = 0;
    constructor() {
    }

    private onLoop() {
        this.sumTime += Laya.timer.delta;

        if (this.sumTime < FightValueConfig.delayMS) {
            return;
        }
        if (this.avatar.isDestory) {
            this.dispose();
            return;
        }
        //update...
        if (this.avatar.coreSpine) {
            let skel = this.avatar.coreSpine.skeleton;
            if (skel && skel.parent) {
                if (!this.effect) {
                    if(this.resURL.indexOf(".png") !=-1){
                        this.effect = new IceEffect(this.resURL);
                        this.effect.setParent(this.parent);
                    }else{
                        this.effect = SpineEffectMgr.createLoopNoSimpleEffect(this.resURL, this.parent);
                    }
                }
                let parent: Laya.Sprite = skel.parent as Laya.Sprite;
                // let ox:number = 0;
                // let oy:number = 0;
                // if(this.data.type == EEffectTarget.Hero){
                //     ox = ComposeConfig.cellW;
                //     oy = ComposeConfig.cellH;
                // }
                // ox += this.offsetX || 0;
                // oy += this.offsetY || 0;
                this.effect.setPos(parent.x + this.offsetX + skel.x, parent.y + this.offsetY + skel.y);
            }
        }
    }
    dispose() {
        Laya.timer.clear(this, this.onLoop);
        if (this.effect) {
            this.effect.dispose();
            this.effect = null;
        }
        if(this.avatar ){
            // let cellIndex = this.avatar.effectList.findIndex(o=>o.resURL == this.resURL);
            // if(cellIndex!=-1){
            //     this.avatar.effectList.splice(cellIndex,1);
            // }
            this.avatar.disposeBindEffect(this.resURL);
        }
    }

    load() {
        Laya.timer.frameLoop(1, this, this.onLoop);
    }
}