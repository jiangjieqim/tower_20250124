import { stElement, stFightSkillEffect, stSkillBar, stSubBlood } from "../../../../network/protocols/BaseProto";
import { EAvatarAnim } from "../../avatar/vos/EAvatarAnim";
import { ComposeDragGrid } from "../views/ComposeDragGrid";
import { TopDragYellowView } from "../views/TopDragYellowView";
import { TowerAvatarView } from "../views/TowerAvatarView";
import { EFightLayer, IAddHero, IUpdateHero } from "./EFightEnum";

export interface IFightMainView extends IGetCenter{
    onShow();
    clearTopDragLayer();
    gridItemList: ComposeDragGrid[];
    monsterList: TowerAvatarView[];
    speedScale: number;
    topDragLayer:TopDragYellowView;
    /**添加英雄到舞台 */
    addHeroToStage(_grid: ComposeDragGrid, obj: IAddHero, o: stElement);
    getLayer(type: EFightLayer);
    updateEffectGround(cardUID: number, ox: number, oy: number, playerId: number, url: string, layer: EFightLayer);
    onSkillBar(_l: stSkillBar[]);
    onSubBlood(_l: stSubBlood[]);
    onAtk(_l: stFightSkillEffect[]);
    /**更新英雄 */
    onHeroUpdate(obj: IUpdateHero);
    /**增加英雄 */
    onHeroAdd(obj: IAddHero);
    closeCirleYellow();
    // openCirleYellow(uid: number);
    getSelfBogyBoss();
    setCutdown(num: number);
    // clearTopDragLayer();
    onCreateMonsterList(list);
    /**更新怪物数量 */
    updateMonsterCount();
    /**交换英雄 */
    switchHero(a:number,b:number);
    addToBottomLayer();
    removeBottomLayer();
    heroMove(uid:number,isoX:number,isoY:number);
    outSideUpdate(uid:number);
    onExit();
    onInit();
    openHeroTips(uid:number);
    getMonsterCellView(arr:string[]);
    guideDoor(arr:string[]);
    selfPlayerId:number;//己方id
    enemyPlayerId:number;//敌方id
    onCenter();
    // monsterPlayAnimOnce(uid:number,anim:EAvatarAnim);
}

export interface IGetCenter extends Laya.Sprite{
    /**获取居中的坐标 */
    getCenterXY():Laya.Point;
}