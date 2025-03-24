import { ISimpleEffect } from "../../../avatar/NoContainerSimpleEffect";
import { SpineEffectMgr } from "../../../avatar/SpineEffectMgr";
import { ComposeConfig } from "../../ComposeConfig";
import { ComposeEvent } from "../../ComposeEvent";
import { ComposeModel } from "../../ComposeModel";
import { EEffectTarget, IDelEffectCardUid } from "../../vos/EFightEnum";
import { FightValueConfig } from "../../vos/FightValueConfig";
import { TowerAvatarView } from "../TowerAvatarView";
import { IAvatarEffectData } from "./GroundCellView";
import { IceEffect } from "./IceEffect";
/**角色特效 */
export class AvatarEffect {
    data: IAvatarEffectData;
    parent: Laya.Sprite;
    avatar: TowerAvatarView;
    private effect:ISimpleEffect;
    // NoContainerSimpleEffect
    private sumTime: number = 0;

    private model: ComposeModel;
    /**是否是冰块 */
    get isIce(){
        return this.data && (this.data.url == "o/skill/ice.png");
    }
    constructor() {
        this.model = ComposeModel.Ins;
    }

    private onDelEffectCardUid(vo:IDelEffectCardUid){
        if(this.data && this.data.playerId == vo.playerId && this.data.cardUid == vo.cardSerialNum){
            this.dispose();
        }
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
                    if(this.data.url.indexOf(".png") !=-1){
                        this.effect = new IceEffect(this.data.url);
                        this.effect.setParent(this.parent);
                    }else{
                        this.effect = SpineEffectMgr.createLoopNoSimpleEffect(this.data.url, this.parent);
                    }
                }
                let parent: Laya.Sprite = skel.parent as Laya.Sprite;
                let ox:number = 0;
                let oy:number = 0;
                if(this.data.type == EEffectTarget.Hero){
                    ox = ComposeConfig.cellW;
                    oy = ComposeConfig.cellH;
                }
                ox += this.data.offsetX || 0;
                oy += this.data.offsetY || 0;
                this.effect.setPos(parent.x + ox + skel.x, parent.y + oy + skel.y);
            }
        }
    }
    dispose() {
        this.model.off(ComposeEvent.DelEffectCardUid, this, this.onDelEffectCardUid);
        this.model.off(ComposeEvent.MonsterRemove, this,this.onMonsterRemove);
        Laya.timer.clear(this, this.onLoop);
        if (this.effect) {
            this.effect.dispose();
            this.effect = null;
        }
    }
    private onMonsterRemove(uid:number){
        if(this.data.deadMonsterUID == uid){
            this.dispose();
        }
    }
    load() {
        if(this.data.cardUid){
            this.model.on(ComposeEvent.DelEffectCardUid, this, this.onDelEffectCardUid);
        }
        this.model.on(ComposeEvent.MonsterRemove, this,this.onMonsterRemove);
        Laya.timer.frameLoop(1, this, this.onLoop);
    }
}