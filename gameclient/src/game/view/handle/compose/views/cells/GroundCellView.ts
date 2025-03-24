import { NoContainerSimpleEffect } from "../../../avatar/NoContainerSimpleEffect";
import { SpineEffectMgr } from "../../../avatar/SpineEffectMgr";
import { ComposeConfig } from "../../ComposeConfig";
import { ComposeEvent } from "../../ComposeEvent";
import { ComposeModel } from "../../ComposeModel";
import { FightUtils } from "../../FightUtils";
import { EFightLayer, IBaseAvatarCheckTarget } from "../../vos/EFightEnum";

export interface IAvatarEffectData extends IBaseAvatarCheckTarget{

    /**卡牌流水号 */
    cardUid:number;
    /**目标方玩家流水号 */
    playerId:number;
    
    /**特效链接 */
    url: string;
    offsetX:number;
    offsetY:number;

    /**此怪物死亡时销毁特效 */
    deadMonsterUID:number;
}

// export enum ESceneEffectType {
//     /**角色上层 */
//     Hero = 1,

//     /**怪物上层 */
//     Monster = 2,
// }
/**地板层特效容器
 */
export class GroundCellView {
    //=================================
    url: string;
    ox: number;
    oy: number;
    playerId: number;
    // parent: Laya.Sprite;
    layer:EFightLayer;
    cardUID:number;
    private effect: NoContainerSimpleEffect;
    private img:Laya.Image;
    private model: ComposeModel;
    constructor() {
        this.model = ComposeModel.Ins;
        this.model.on(ComposeEvent.DelEffectCardUid, this, this.onDelEffectCardUid);
    }

    private onDelEffectCardUid(obj: IAvatarEffectData){
        if(obj.cardUid == this.cardUID && this.playerId == obj.playerId){
            this.dispose();
        }
    }

    dispose() {
        this.model.off(ComposeEvent.DelEffectCardUid, this, this.onDelEffectCardUid);
        if (this.effect) {
            this.effect.dispose();
            this.effect = null;
        }
        if(this.img){
            this.img.destroy();
            this.img = null;
        }
    }
    load() {
        let type = this.model.getOwnerType(this.playerId);
        let sx = FightUtils.IsoxToPosX(this.ox);//+ Math.random() * ComposeConfig.cellW/2;
        let sy = FightUtils.IsoyToPosY(this.oy, type);
        let parent = this.model.fightView.getLayer(this.layer);
        let ox:number = 0;
        let oy:number = 0;
        if(this.layer == EFightLayer.HitMonsterLayer){
            ox = ComposeConfig.cellW;
            oy = ComposeConfig.cellH;
        }

        let x: number = sx + ox;
        let y: number = sy + oy;

        if(this.url.indexOf(".png")!=-1){
            this.img = new Laya.Image(this.url);
            this.img.anchorX = this.img.anchorY = 0.5;
            this.img.x = x;
            this.img.y = y;
            parent.addChild(this.img);
        }else{
            this.effect = SpineEffectMgr.createLoopNoSimpleEffect(this.url, parent,x, y);
        }
    }
}