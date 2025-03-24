import { ComposeUpdate_revc, FightResult_revc, FuncardDanMu_revc, MonsterWave_revc, PvpTurnBasedHpList_revc, PvpTurnBasedHpUpdate_revc, PvpTurnBasedStartFight_revc, RougeChoose_revc, RougeList_revc, stElement, stPlayerInRoom } from "../../../network/protocols/BaseProto";
import { FightAdapter } from "./adapter/FightAdapter";
import { IFightTypeAdapter } from "./adapter/FightTypeAdapter";
import { IEffectAnimVo } from "./ComposeModel";
import { CardMsgVo } from "./vos/CardMsgVo";
import { EAvatarLayar, EEffectTarget, EFightSceneStatus } from "./vos/EFightEnum";
import { FuncCardVo } from "./vos/FuncCardVo";
import { IFightMainView } from "./vos/IFightMainView";

export interface IComposeModel extends Laya.EventDispatcher{
    wave:number;
    refreshList:stElement[];
    cardList:FuncCardVo[];
    curAdapter:FightAdapter;
    clearScene(_source?:EFightSceneStatus);
    fightView:IFightMainView;
    removeUIDs:number[];
    onComposeUpdate(revc: ComposeUpdate_revc,sync?:boolean);
    ownerPlayer:stPlayerInRoom;//自己的数据
    enemyPlayer:stPlayerInRoom;//敌方的数据
    msgList:CardMsgVo[];
    createMsg(revc:FuncardDanMu_revc,hideTime?:number);
    onFightResult(revc:FightResult_revc);
    fightTypeAdaper:IFightTypeAdapter;
    onPvpTurnBasedHpList(revc:PvpTurnBasedHpList_revc);
    onRougeList(revc:RougeList_revc);
    onPvpTurnBasedStartFight(revc:PvpTurnBasedStartFight_revc);
    onPvpTurnBasedHpUpdate(revc:PvpTurnBasedHpUpdate_revc);
    onMonsterWave(revc:MonsterWave_revc);
    /**客户端弹幕 */
    clientBroadcast(playerId:number,f_cardid:number);
    onRougeChoose(revc:RougeChoose_revc);
    playEffectAvatar(type:EEffectTarget,url:string,layer:EAvatarLayar,uid:number,_offsetY?:number);
    addLoopEffectLoop(type:EEffectTarget,deadMonsterUID:number,uid:number,url:string);
    getTargetLayerXY(_targetPos:number,playerId:number):IEffectAnimVo;
}

export interface ITowerMainModel extends Laya.EventDispatcher{

}