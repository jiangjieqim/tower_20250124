import { GameList, GamePanel } from "../../../../../frame/view/GameList";
import { EViewType } from "../../../../common/defines/EnumDefine";
import { E } from "../../../../G";
import { CommonClaimRewards_req, ComposeUpdate_revc, FuncardDanMu_revc, PvpTurnBasedHpList_revc, PvpTurnBasedHpUpdate_revc, PvpTurnBasedStartFight_revc, RougeChoose_revc, RougeList_revc, stCellValue, stCellValueConvert, stElement, stPvpTurnBasedHp } from "../../../../network/protocols/BaseProto";
import { SocketMgr } from "../../../../network/SocketMgr";
import { NoContainerSimpleEffect } from "../../avatar/NoContainerSimpleEffect";
import { SpineEffectMgr } from "../../avatar/SpineEffectMgr";
import { ComposeEvent } from "../../compose/ComposeEvent";
import { EFightReson } from "../../compose/EFightReson";
import { t_Battle_Config } from "../../compose/t_Battle_Config";
import { EComposeUpdateType } from "../../compose/vos/EComposeUpdateType";
import { EFightMode } from "../../compose/vos/EFightEnum";
import { FightValueConfig } from "../../compose/vos/FightValueConfig";
import { MainModel } from "../../main/model/MainModel";
import { VoUtils } from "../../main/model/VoUtils";
import { ItemProxy } from "../../main/proxy/ItemProxy";
import { ECellType } from "../../main/vos/ECellType";
import { ESub_type } from "../../main/vos/ItemVo";
import { TowerMainEvent } from "../../towertmain/model/TowerMainEvent";
import { TowertMainCardModel } from "../../towertmaincard/model/TowertMainCardModel";
import { t_Function_Card } from "../../towertmaincard/proxy/t_Function_Card";
import { IFightGuideWaveUpdate } from "../FightGuide";
import { ActionGogo, EGuideEvent, FuncOpenData, GuideModel, IGuideCardShow, IGuideModel } from "../GuideModel";
import { GuideUtils } from "../GuideUtils";
import { HandAnim } from "../HandAnim";
import { ETemplateCardId } from "../t_FightGuideConfig";

interface IGuideAction {
    list:Configs.t_Tasks_Guide_dat[];
    guide: IGuideModel;
    dispose();
    f_id: number;
    param: string;
    init( s: string);
    ms:number;
    toString();
    /**是否添加到列表 */
    mAddList:boolean;
}
export enum EActionType{
    Stop = 19,
    CreateRoom = 58,
    Task = 64
}
export interface IGuideCreateRoom{
    nickName:string;
    lv:number;
    trophy:number;
    headUrl:string;
    /**创建的战斗类型 */
    mode:EFightMode;
    ownerMonsterMaxCount:number;
    enemyMonsterMaxCount:number;
}

export interface IGuideFightResult{
    type:EFightReson;
    itemStr:string;
    trophy:number;
    isWin:number;// = 1
}

class BaseAction {
    mAddList:boolean = true;
    list:Configs.t_Tasks_Guide_dat[];
    guide: IGuideModel;
    f_id: number;
    ms: number;
    param: string;
    init( s?: string) {

    }
    /**步自动下一步 */
    protected disableNextStep(){
        this.ms = -1;
    }
    protected goto(id:number){
        this.guide.gotoByfid(id);
        this.disableNextStep();
    }

    toString(){
        return `[Action: f_id:${this.f_id} param:${this.param}]`;
    }
    /**获取后置参数 */
    protected getBackParam(){
        let arr: string[] = this.param.split("|");
        let s1 = "";
        for(let i = 1;i < arr.length;i++){
            s1 += arr[i];
            if(i < arr.length - 1){
                s1 += "|";
            }
        }
        return s1;
    }
}
/**
 * 祈愿检测
 * 1|1|17 祈愿成功一次偏移17
 */
class GambleAction extends BaseAction implements IGuideAction {
    private _needCount: number;
    private curCount: number = 0;
    private _target_fid: number;
    // private _guide: IGuideModel;

    init( s: string) {
        // this._guide = guide;
        let arr: string[] = s.split("|");
        this._needCount = parseInt(arr[1]);
        this._target_fid = this.f_id + parseInt(arr[2]);
        this.guide.on(EGuideEvent.GuideGambleSucceed, this, this.onGuideGambleSucceed);
    }
    dispose() {
        this.guide.off(EGuideEvent.GuideGambleSucceed, this, this.onGuideGambleSucceed);
    }

    private onGuideGambleSucceed() {
        this.curCount++;
        if (this.curCount >= this._needCount) {
            this.guide.gotoByfid(this._target_fid);
            // this.goto(this._target_fid);
            LogSys.Log(this.toString()+` 祈愿检测的数量为:${this.curCount} 跳转到步骤:${this._target_fid}`);
            this.dispose();
        }
    }
}

/**
 * 卡牌数量检测
 */
class CardCountCheck extends BaseAction implements IGuideAction {
    // private _guide: IGuideModel;
    private _target_fid: number;
    private _checkCount: number;

    init(s: string) {
        // this._guide = guide;
        let arr: string[] = s.split("|");
        this._checkCount = parseInt(arr[1]);
        this._target_fid = parseInt(arr[2]) + this.f_id;
        Laya.timer.once(1, this, this.onTimeCheck);
    }

    private onTimeCheck() {
        Laya.timer.once(1, this, this.onTimeCheck);
        let cardList = this.guide.model.cardList;
        if (cardList && cardList.length < this._checkCount) {
            LogSys.Log(this.toString()+` 卡牌数量检测:${cardList.length} 跳转到:${this._target_fid}`);
            this.guide.gotoByfid(this._target_fid);
            this.dispose();
        }
    }

    dispose() {
        Laya.timer.clear(this, this.onTimeCheck);
    }
}
/**
 * 3|5|10 召唤了5次以上 偏移10 
 * 英雄召唤次数检测 
 **/
class SummonCheck extends BaseAction implements IGuideAction {
    // private _guide: IGuideModel;
    private _target_fid: number;
    private _checkCount: number;

    init( s: string) {
        // this._guide = guide;
        let arr: string[] = s.split("|");
        this._checkCount = parseInt(arr[1]);
        this._target_fid = parseInt(arr[2]) + this.f_id;
        Laya.timer.once(1, this, this.onTimeCheck);
        LogSys.Log(this.toString()+`监听添加`);
    }

    private onTimeCheck() {
        let cnt: number = this.guide.model.curAdapter.guide.sommonCount;
        if (cnt >= this._checkCount) {
            LogSys.Log(this.toString()+`监听触发 英雄召唤的数量为:${cnt} 跳转到步骤:${this._target_fid}`);
            this.guide.gotoByfid(this._target_fid);
            this.dispose();
        }else{
            Laya.timer.once(1, this, this.onTimeCheck);
        }
    }

    dispose() {
        Laya.timer.clear(this, this.onTimeCheck);
    }

}
/**
 * 4|5|15 出现了uid==5的英雄 偏移15
 */
class HeroUidCheck extends BaseAction implements IGuideAction {
    // private _guide: IGuideModel;
    private _target_fid: number;
    private heroUID: number;

    init( s: string) {
        // this._guide = guide;
        let arr: string[] = s.split("|");
        this.heroUID = parseInt(arr[1]);
        this._target_fid = this.f_id+parseInt(arr[2])
        Laya.timer.once(1, this, this.onTimeCheck);
    }
    private onTimeCheck() {
        Laya.timer.once(1, this, this.onTimeCheck);
        if (this.guide.model.refreshList.find(o => o.uid == this.heroUID)) {
            LogSys.Log(this.toString()+` 找到英雄uid为:${this.heroUID} 跳转到步骤:${this._target_fid}`);
            this.guide.gotoByfid(this._target_fid);
            this.dispose();
        }
    }

    dispose() {
        Laya.timer.clear(this, this.onTimeCheck);
    }
}

/**
 * 英雄拖拽 5|0
 */
class HeroDrag extends BaseAction implements IGuideAction {
    init( s: string) {
        let arr: string[] = s.split("|");
        let _status: number = parseInt(arr[1]);
        this.guide.model.curAdapter.mDrag = _status == 1;
        LogSys.Log(this.toString()+"设置英雄Drag状态")
    }

    dispose() {

    }
}

/**6|0    0禁用使用卡牌 1启用使用卡牌 */
class UseCardAction extends BaseAction implements IGuideAction {
    init( s: string) {
        let arr: string[] = s.split("|");
        let _status: number = parseInt(arr[1]);
        this.guide.model.curAdapter.mUseCard = _status == 1;
        LogSys.Log(this.toString()+"设置卡牌使用状态")
    }

    dispose() {

    }
}

/**
 *7 第三章节 到24步开始触发引导点击使用卡牌， 到25步关闭分线引导
分线引导：只要玩家当前还有卡牌，引导点击最左侧卡牌的使用按钮
 */
export class CardHandAction extends BaseAction implements IGuideAction {
    private _handAnim: HandAnim;
    private ox: number = 0;
    private oy: number = 0;
    dispose() {
        // throw new Error("Method not implemented.");
        if (this._handAnim) {
            this._handAnim.dispose();
            this._handAnim = null;
        }
        Laya.timer.clear(this, this.onTimeCheck);
        LogSys.Log(this.toString()+`CardHandAction 退出引导删除掉小手特效...`);
    }
    // private _guide: IGuideModel;
    private uiType: number;

    init( s: string) {

        let arr = s.split("|");
        this.ox = parseInt(arr[1]);
        this.oy = parseInt(arr[2]);
        // this._guide = guide;
        Laya.timer.once(500, this, this.onTimeCheck);

        this.uiType = EViewType.FuncCard2;
    }

    private onTimeCheck() {
        let mShowHand: boolean = false;
        Laya.timer.once(500, this, this.onTimeCheck);
        if (E.ViewMgr.isOpenReg(this.uiType)) {
            if (this.guide.model.cardList.length >= 1) {
                mShowHand = true;

                if (!this._handAnim) {
                    this._handAnim = new HandAnim(E.ViewMgr.Get(this.uiType).UI, this.ox, this.oy);
                }
            }
        }
        if (this._handAnim) {
            this._handAnim.visible = mShowHand;
        }
    }
}
/**主动技能显示 */
class SkillVisAct extends BaseAction implements IGuideAction {
    init( s: string) {
        // this.guide = guide;
        let arr: string[] = s.split("|");
        let _status: number = parseInt(arr[1]);
        this.guide.model.curAdapter.mSkillVis = _status == 1;
        LogSys.Log(this.toString()+"主动技能显示状态");
    }

    dispose() {
        this.guide.model.curAdapter.mSkillVis = true;
    }
}

/**召唤按钮锁定样式 */
class SommonLockedStyle extends BaseAction implements IGuideAction {
    init( s: string) {
        // this.guide = guide;
        let arr: string[] = s.split("|");
        let _status: number = parseInt(arr[1]);
        this.guide.model.curAdapter.sommonUnLockedStyle = _status == 1;
        this.guide.event(EGuideEvent.SommonUnlock);
        LogSys.Log(this.toString()+'召唤按钮样式状态')
    }

    dispose() {
        this.guide.model.curAdapter.sommonUnLockedStyle = true;
        this.guide.event(EGuideEvent.SommonUnlock);
    }
}

/** 怪物死亡检测 */
class MonsterDeadAction extends BaseAction implements IGuideAction {
    private monsterUID: number;
    private targetId: number;
    init( s: string) {
        // this.guide = guide;
        let arr: string[] = s.split("|");
        this.monsterUID = parseInt(arr[1]);
        this.targetId = parseInt(arr[2]) + this.f_id;
        Laya.timer.once(1, this, this.onTimeCheck);
    }
    private onTimeCheck() {
        if (this.guide.model.removeUIDs.indexOf(this.monsterUID) != -1) {
            this.guide.gotoByfid(this.targetId);
            LogSys.Log(this.toString()+` 触发怪物死亡检测`);
            this.dispose();
            return;
        }
        Laya.timer.once(1, this, this.onTimeCheck);
    }
    dispose() {
        Laya.timer.clear(this, this.onTimeCheck);
    }
}
/**11|1000 延迟1000毫秒下一步 */
class DelayTimeAction extends BaseAction implements IGuideAction {
    // ms: number;
    // init( s: string) {
    //     // this.guide = guide;
    //     let arr: string[] = s.split("|");
    //     let ms = parseInt(arr[1]);
    //     // Laya.timer.once(ms, this, this.onTimeCheck);
    //     LogSys.Log(this.toString()+` DelayTimeAction ${this.param}`)
    //     this.ms = ms;
    // }
    // dispose() {
    // }

    private targetTime:number;
    private offset:number;
    init( s: string) {
        let arr: string[] = s.split("|");
        this.targetTime = TimeUtil.serverTimeMS + parseInt(arr[1]);
        this.offset = 1;//parseInt(arr[2]);
        this.disableNextStep();
        Laya.timer.once(1, this, this.onTimeCheck);
    }
    private onTimeCheck() {
        if(TimeUtil.serverTimeMS >= this.targetTime){
            LogSys.Log(this.toString()+`延迟触发成功`);
            this.goto(this.f_id + this.offset);
            this.dispose();
            return;
        }
        Laya.timer.once(1, this, this.onTimeCheck);
    }
    dispose() {
        Laya.timer.clear(this, this.onTimeCheck);
    }

}
/**道具不足事件 */
class ItemNotEnoughAction extends BaseAction implements IGuideAction {
    dispose() {
        // throw new Error("Method not implemented.");
    }
    init( s: string) {
        // this.guide = guide;
        let arr: string[] = s.split("|");
        let item = arr[1].replace("&", "|");
        if (!this.guide.model.curAdapter.isItemEnoughSt(item, false)) {
            let id:number = this.f_id + parseInt(arr[2]);
            LogSys.Log(this.toString()+` ItemNotEnoughAction ${this.param} 跳转至f_id:${id}`);
            this.goto(id);
        } else {
            this.ms = 0;
        }
    }

}
/**13 关闭ui特效事件 */
class CloseUIEffectAction extends BaseAction implements IGuideAction {
    dispose() {
        // throw new Error("Method not implemented.");
    }
    init( s: string) {
        let arr: string[] = s.split("|");
        // this.guide = guide;
        let uiType: number = parseInt(arr[1]);
        if (this.guide.uiCloseEffect.indexOf(uiType) == -1) {
            this.guide.uiCloseEffect.push(uiType);
            LogSys.Log(this.toString()+"设置打开关闭特效的UI")
        }
    }
}

/**
 * 14 Panel滑动控制
 */
class ScrollPanelAction extends BaseAction implements IGuideAction {
    dispose() {

    }
    init(s: string) {
        let arr: string[] = s.split("|");
        let uiItem = arr[1];
        let panel: GamePanel = GuideUtils.getUIByKeySt(uiItem) as any;
        if (!(panel instanceof GamePanel)) {
            LogSys.Error(this.toString() + `must be GamePanel!`);
        }
        let status: boolean = parseInt(arr[2]) == 0;
        if (panel) {
            panel.disableScroll = status;
            LogSys.Log(this.toString()+"Panel滑动控制");
        } else {
            LogSys.Warn(this.toString()+`Action ScrollPanelAction ${this.param} fail`);
        }
    }
}

/**15 储存红点值 */
class RedSaveAction extends BaseAction implements IGuideAction {
    dispose() {

    }
    init( s: string) {
        let arr: string[] = s.split("|");
        LogSys.Log(this.toString()+`储存数据Action:${this.f_id} ${this.param}`);
        if(Laya.Utils.getQueryString("disable_save_guide") || initConfig.disable_save_guide){

        }else{
            MainModel.Ins.red.save(parseInt(arr[1]),parseInt(arr[2]));
        }
    }
}
/*
 * 16|47|10  界面EViewType(47)退出的时候触发[偏移10]
 * 界面关闭的时候 偏移步骤 */
class CloseAutoGotoStep extends BaseAction implements IGuideAction {
    dispose() {

    }
    init( s: string) {
        let arr: string[] = s.split("|");
        let id = parseInt(arr[1]);
        let offset:number = parseInt(arr[2]);
        // if(guide.uiCloseAutoNextStep.indexOf(id) == -1){
        if(!this.guide.uiCloseAutoNextStep.find(o=>o.f_id == this.f_id)){
            LogSys.Log(this.toString()+`构建界面关闭Action:${this.f_id} ${this.param}`);
            let vo = new ActionGogo();
            vo.f_id = this.f_id;
            vo.viewType = id;
            vo.targetId = vo.f_id + offset;
            this.checkErr(vo);
            this.guide.uiCloseAutoNextStep.push(vo);
        }
        // this.disableNextStep();
    }

    private checkErr(vo:ActionGogo){
        if(this.list.find(o=>o.f_id == this.f_id).f_TaskID != this.list.find(o=>o.f_id == vo.targetId).f_TaskID){
            LogSys.Error(this.toString()+` 只能跳跃到相同的taskId,配置错误`)
        }

    }

}

/**17 商店购买检测 */
class ShopBuyNotEnoughCheck extends BaseAction implements IGuideAction {
    dispose() {
        // throw new Error("Method not implemented.");
    }

    init( s: string) {
        // this.guide = guide;
        let arr: string[] = s.split("|");
        let shop_f_id:number = parseInt(arr[1]);
        let targetId:number = parseInt(arr[2]) + this.f_id;

        let shopEnoughHandler:Laya.Handler =  GuideUtils.shopEnoughHandler;

        if(shopEnoughHandler && !shopEnoughHandler.runWith(shop_f_id)){
            LogSys.Log(this.toString()+`商店购买检测${this.f_id}跳转 ${this.param}  goto f_id:${targetId}`);
            this.goto(targetId);
        }

    }
}
/**18 等级检测 */
class LevelUpCheck extends BaseAction implements IGuideAction {
    private checkLv:number;
    dispose() {
        // throw new Error("Method not implemented.");
        this.guide.towerModel.off(TowerMainEvent.UpdateRoleLv,this,this.onUpdateRoleLv);
    }

    init( s: string){
        // this.guide = guide;
        let arr: string[] = s.split("|");
        this.checkLv = parseInt(arr[1]);
    
        if(MainModel.Ins.mRoleData.lv >= this.checkLv){
            LogSys.Log(this.toString()+` 等级检测lv:${this.checkLv}无需监听`);
        }else{
            LogSys.Log(this.toString()+` 等级检测lv:${this.checkLv}添加监听...`);
            this.guide.towerModel.on(TowerMainEvent.UpdateRoleLv,this,this.onUpdateRoleLv);
            this.disableNextStep();
        }
    }

    private onUpdateRoleLv(){
        //gm("exp 50")
        if(MainModel.Ins.mRoleData.lv >= this.checkLv){
            this.dispose();
            LogSys.Log(this.toString()+` 等级检测lv:${this.checkLv}成功 下一步`);
            this.guide.nextGuideStep();
        }
    }
}

/**19 终止位 */
class StopAction extends BaseAction implements IGuideAction {
    dispose() {
        // throw new Error("Method not implemented.");
    }
    init( s: string){
        LogSys.Log(this.toString() + ` Stop f_id:${this.f_id} 触发Stop事件`);
        this.disableNextStep();
    }
}

/**
 * 20 列表滑动控制
 */
class ListScrollAction extends BaseAction implements IGuideAction {
    dispose() {

    }
    init( s: string) {
        let arr: string[] = s.split("|");
        let uiItem:string = arr[1];
        let _list: GameList = GuideUtils.getUIByKeySt(uiItem) as any;
        if(!(_list instanceof GameList)){
            LogSys.Error(this.toString() + `must be GameList`);
        }
        let status: boolean = parseInt(arr[2]) == 0;
        if (_list) {
            _list.disableScroll = status;
            LogSys.Log(this.toString()+"列表滑动控制");
        } else {
            LogSys.Warn(`Action ListScrollAction ${this.param} fail`);
        }
    }
}

/**21 Image disable不可用状态检测 */
class ImageDisableAction extends BaseAction implements IGuideAction {
    dispose() {

    }
    init(s: string) {
        // this.guide = guide;
        this.check();
    }

    private check() {
        let s = this.param;
        let arr: string[] = s.split("|");
        let img: Laya.Image = GuideUtils.getUIByKeySt(arr[1]) as any;
        let offset: number = parseInt(arr[2]);
        if (img) {
            if(img.disabled){
                let targetId:number = this.f_id + offset;
                LogSys.Log(this.toString()+` ImageDisableAction 的状态 disable == true,执行跳转 f_id:${targetId}`);
                this.goto(targetId);
            }
            else{
                this.goto(this.f_id+1);
            }
        } else {
            this.disableNextStep();
            LogSys.Warn(this.toString()+` ImageDisableAction 未找到显示组件 下一次继续检测`);
            Laya.timer.once(1,this,this.check);
        }
    }
}

/**
 * 22|5|1  5(关闭界面5)|1(禁用 TowerMainEvent.MainViewLayerChange)
 * CloseUIAction 关闭界面 */
class CloseUIAction extends BaseAction implements IGuideAction{
    dispose() {

    }
    init( s: string) {
        let arr: string[] = s.split("|");

        let view = parseInt(arr[1]);
        if(E.ViewMgr.isOpenReg(view)){
            if(arr[2]!=undefined){
                //禁用 TowerMainEvent.MainViewLayerChange
                if(this.guide.closeMainViewLayerChange.indexOf(view) == -1){
                    this.guide.closeMainViewLayerChange.push(view);
                }
            }
            LogSys.Log(this.toString()+` 关闭界面${this.toString()}`);
            E.ViewMgr.Close(view);

        }
    }
}
/**23|1 
 * 检测组件是否再舞台的小工具
 * 检测偏移的f_id 的 f_GuidePosition对象是否存在 */
class WaitCheckExistView extends BaseAction implements IGuideAction{
    private serachStr:string = "";
    private id:number;
    private readonly delayMs:number = 500;
    dispose() {

    }
    init( s: string) {
        let arr: string[] = s.split("|");
        let id:number = parseInt(arr[1]) + this.f_id;
        this.id = id;
        let cfg = this.list.find(o=>o.f_id == id);
        if(!cfg){
            LogSys.Error(this.toString()+` WaitCheckExistView 配置错误`);
            return;
        }
        this.serachStr = cfg.f_GuidePosition;

        if(this.isInStage){
            LogSys.Log(this.toString() + "同步模式 WaitCheckExistView 找到显示对象 进入下一步");
        }else{
            this.disableNextStep();
            Laya.timer.once(this.delayMs, this, this.onTimeCheck);
        }
    }

    private get isInStage(){
        let sp = GuideUtils.getUIByKeySt(this.serachStr);
        if(sp){
            if(sp.displayedInStage){
                return true;
            }else{
                // LogSys.Warn(this.toString()+` not in Stage...`);
            }
        }else{
            // LogSys.Warn(this.toString()+` is null...`);
        }
    }

    private onTimeCheck(){
        if(this.isInStage){
            LogSys.Log(this.toString() + "异步模式 WaitCheckExistView 找到显示对象 进入下一步");
            this.goto(this.f_id+1);
            this.dispose();
        }else{
            LogSys.Log(this.toString() + `异步模式 WaitCheckExistView 未找到f_id:${this.id}--->${this.serachStr} 继续检测...`);
            Laya.timer.once(this.delayMs, this, this.onTimeCheck);
        }
    }
}
/**
 * 24|1 偏移1 跳转到指定f_id, 不受taskId影响
 */
class ActionfidOffset extends BaseAction implements IGuideAction{
    dispose(){

    }
    init( s: string) {
        let arr: string[] = s.split("|");
        let id:number = parseInt(arr[1]);
        LogSys.Log(this.toString() + "ActionfidOffset 进入下一步");
        this.goto(id + this.f_id);
    }
}

/**
 * 25抽取自动选择
 */
class ActionCQ_Card extends BaseAction implements IGuideAction{
    dispose(){

    }
    init( s: string) {
        let arr: string[] = s.split("|");
        let status:number = parseInt(arr[1]);
        TowertMainCardModel.Ins.isYD = status == 1;
        LogSys.Log(this.toString() + "ActionCQ_Card 进入下一步");
    }
}

// 26|1   抽卡主界面打开启完毕
class ActionCardUIOpenComplete extends BaseAction implements IGuideAction{
    dispose(){
        TowertMainCardModel.Ins.off(TowertMainCardModel.CQYD1,this,this.onComplete);
    }
    private offset:number;
    init( s: string) {
        let arr: string[] = s.split("|");
        this.offset = parseInt(arr[1]);
        LogSys.Log(this.toString() + "注册 ActionCardUIOpenComplete 进入下一步");
        TowertMainCardModel.Ins.once(TowertMainCardModel.CQYD1,this,this.onComplete);
        let nextCfg:Configs.t_Tasks_Guide_dat = this.list.find(o=>o.f_id == this.f_id + 1);
        let err:boolean;
        if(nextCfg){
            if(nextCfg.f_param!=EActionType.Stop+""){
                err = true;
            }
        }else{
            err = true;
        }
        if(err){
            LogSys.Error(this.toString() + `下一步必须为停止行为`);
        }
    }

    private onComplete(){
        LogSys.Log(this.toString() + "触发 ActionCardUIOpenComplete 进入下一步");
        this.goto(this.f_id + this.offset);
    }
}
//27|1   抽取卡牌  获取卡牌完毕
class ActionCardGetResult extends BaseAction implements IGuideAction{
    dispose(){
        TowertMainCardModel.Ins.off(TowertMainCardModel.CQYD2,this,this.onComplete);
    }
    private offset:number;

    init( s: string) {
        let arr: string[] = s.split("|");
        this.offset = parseInt(arr[1]);
        LogSys.Log(this.toString() + "注册 ActionCardGetResult 进入下一步");
        TowertMainCardModel.Ins.once(TowertMainCardModel.CQYD2,this,this.onComplete);
    }
    private onComplete(){
        LogSys.Log(this.toString() + "触发 ActionCardGetResult 进入下一步");
        this.goto(this.f_id + this.offset)
    }
}

// class ActionUtils{
//     static createAutoStep(guide:IGuideModel){
//         if(!guide.uiCloseAutoNextStep.find(o=>o.f_id == this.f_id)){
//             LogSys.Log(this.toString()+`构建界面关闭Action:${this.f_id} ${this.param}`);
//             let vo = new ActionGogo();
//             vo.f_id = this.f_id;
//             vo.viewType = id;
//             vo.targetId = vo.f_id + offset;
//             this.checkErr(vo);
//             this.guide.uiCloseAutoNextStep.push(vo);
//         }
//     }
// }


// 28|0|1
class ActionFuncPopup extends BaseAction implements IGuideAction{
    /**失败的偏移 */
    private failId:number;
    /**成功的偏移 */
    private succeedId:number;
    dispose(){

    }
    init( s: string) {
        let arr: string[] = s.split("|");
        this.failId = this.f_id + parseInt(arr[1]);
        this.succeedId = this.f_id+parseInt(arr[2]);
        // LogSys.Log(this.toString() + "注册 ActionCardGetResult 进入下一步");
        // TowertMainCardModel.Ins.once(TowertMainCardModel.CQYD2,this,this.onComplete);
        // let list:Configs.t_Func_Popup_dat[] = t_Func_Popup.Ins.List;

        
        let nextCfg = this.list.find(o=>o.f_id == this.f_id + 1);
        let list:number[] = [];

        if(nextCfg){
            // 29|77-89-105-130

            let a1 = nextCfg.f_param.split("|");
            if(parseInt(a1[0]) == 29){
                let b1 = a1[1].split("-");
                for(let n = 0;n < b1.length;n++){
                    let cur:string = b1[n];
                    if(!StringUtil.IsNullOrEmpty(cur)){
                        list.push(parseInt(cur));
                    }
                }

                if(list.length > 0){
                    //ok
                }
                else{
                    LogSys.Error(this.toString()+`长度异常 配置错误`);
                    return;
                }
            }else{
                LogSys.Error(this.toString()+`类型异常 配置错误`);
                return
            }
        }
        let f_viewtype:number = 0;
        for(let i = 0;i < list.length;i++){
            let cView = list[i];
            if(E.ViewMgr.isOpenReg(cView)){
                f_viewtype = cView;
                break;
            }
        }
        LogSys.Log(`${this.toString()},ActionFuncPopup 检测界面列表${JSON.stringify(list)}是否开着!`);

        if(f_viewtype > 0){
            //有pop窗口

            let _cell = this.guide.uiCloseAutoNextStep.find(o=>o.f_id == this.f_id)

            this.mAddList = false;
            this.disableNextStep();

            if(!_cell){
                LogSys.Log(this.toString()+`构建界面f_viewtype:${f_viewtype}关闭行为`);
                let vo = new ActionGogo();
                vo.f_id = this.failId;
                vo.viewType = f_viewtype;
                vo.targetId = vo.f_id;
                this.guide.uiCloseAutoNextStep.push(vo);
              
            }else{
                LogSys.Log(`${this.toString()},uiCloseAutoNextStep 列表中有重复的 [${JSON.stringify(_cell)}],无需添加`);
            }

        }else{
            LogSys.Log(`${this.toString()} 没有窗口在引导之上,继续一个步骤...`);
            //没有窗口
            this.goto(this.succeedId);
        }
    }
}


/**
 * 29|77-89-105 禁用77-89-105界面
 */
class DisableViewTypeAction extends BaseAction implements IGuideAction{
    dispose() {

    }
    init( s: string) {
        let arr: string[] = s.split("|");
        let arr1 = arr[1].split("-");
        for(let i = 0;i < arr1.length;i++){
            let s1 = arr1[i];
            if(!StringUtil.IsNullOrEmpty(s1)){
                let uiType = parseInt(s1);
                if(this.guide.uiDisableViewType.indexOf(uiType) == -1){
                    this.guide.uiDisableViewType.push(uiType);
                }
            }
        }
        LogSys.Log(`${this.toString()},DisableViewTypeAction 禁用界面行为 `);
    }
}
/**30|77-89-105*/
class EnableViewTypeAction extends BaseAction implements IGuideAction{
    dispose() {

    }
    init( s: string) {
        let arr: string[] = s.split("|");
        let arr1 = arr[1].split("-");
        for(let i = 0;i < arr1.length;i++){
            let s1 = arr1[i];
            if(!StringUtil.IsNullOrEmpty(s1)){
                let uiType = parseInt(s1);
                let index =  this.guide.uiDisableViewType.findIndex(e=>e==uiType);
                if(index!=-1){
                    LogSys.Log(`启用界面${uiType}`);
                    this.guide.uiDisableViewType.splice(index,1);
                }
            }
        }
        LogSys.Log(`${this.toString()},EnableViewTypeAction 启用界面行为 `);
    }
}
//31|-10 删除Action
class DelAction extends BaseAction implements IGuideAction{
    dispose(){

    }
    init(s:string){
        let arr: string[] = s.split("|");
        let id = this.f_id+parseInt(arr[1]);
        LogSys.Log(`${this.toString()},DelAction 删除行为 del f_id:${id}`);
        this.guide.actionMgr.del(id);
    }
}

//32|16|1
class KillMonsterAction extends BaseAction implements IGuideAction{
    // this.event(ComposeEvent.MonsterRemove, revc.targetUid);
    private targetId:number;
    private uid:number;
    dispose(){
        this.guide.model.off(ComposeEvent.MonsterRemove,this,this.onCheckMonster);
    }
    private succeed(){
        // this.guide.actionMgr.del(this.f_id);
        LogSys.Log(this.toString() + `KillMonsterAction 击杀检测成功 跳转至${this.targetId}`);
        this.guide.gotoByfid(this.targetId);
    }
    init(s:string){
        let arr: string[] = s.split("|");
        let uid =  parseInt(arr[1]);
        this.uid = uid;
        this.targetId = this.f_id + parseInt(arr[2]);
        if(this.guide.model.removeUIDs.indexOf(this.uid) != -1){
            this.succeed();
            this.dispose();
        }else{
            LogSys.Log(this.toString()+`KillMonsterAction 检测失败 添加击杀监听`);
            this.guide.model.on(ComposeEvent.MonsterRemove,this,this.onCheckMonster);
        }
    }

    private onCheckMonster(){
        if(this.guide.model.removeUIDs.indexOf(this.uid) != -1){
            this.succeed();
            this.dispose();
        }else{

        }
    }
}
//33|23
class GetHeroShowAction extends BaseAction implements IGuideAction{
    dispose(){

    }
    private openGetHeroReward(heroId:number){
        let cell:stCellValueConvert = new stCellValueConvert();
        let vo = new stCellValue();
        vo.count = 1;
        vo.id = ItemProxy.Ins.getByP1(heroId,ESub_type.HeroPiece).f_itemid;
        cell.original = vo;
        cell.convertedId = heroId;
        cell.convertedNum = 1;
        cell.isConverted = 2;
        E.ViewMgr.Open(EViewType.GuideHeroShow,null,cell);
    }
    init(s:string){
        let arr: string[] = s.split("|");
        let heroId =  parseInt(arr[1]);
        LogSys.Log(this.toString() + `GetHeroShowAction 英雄展示`);
        this.openGetHeroReward(heroId);
        this.disableNextStep();
    }
}
//34|1006-1007-1008 预览卡牌
class CardPreviewShowAction extends BaseAction implements IGuideAction{
    dispose(){

    }
    init(s:string){
        LogSys.Log(this.toString() + `CardPreviewShowAction 卡牌展示`);
        let arr: string[] = s.split("|");
        let vo:IGuideCardShow = {} as IGuideCardShow;
        let cardArr = arr[1].split("-");
        vo.cardList = [];
        for(let i = 0;i < cardArr.length;i++){
            let s1 = cardArr[i];
            if(!StringUtil.IsNullOrEmpty(s1)){
                vo.cardList.push(parseInt(s1));
            }
        }
        E.ViewMgr.Open(EViewType.CardTipsGuide,null,vo);
        this.disableNextStep();
    }
}
//35|1 己方波次创建
class WaveAction extends BaseAction implements IGuideAction{
    dispose(){

    }
    init(s:string){
        LogSys.Log(this.toString() + `WaveAction 波次创建`);

        let arr: string[] = s.split("|");
        this.guide.event(EGuideEvent.Wave,parseInt(arr[1]));
    }
}

// 36|1 指定进入一个章节
class ActionPveChapter extends BaseAction implements IGuideAction{
    dispose(){

    }
    init(s:string){
        let arr: string[] = s.split("|");
        this.disableNextStep();
        this.guide.onInitCallBack();
        LogSys.Log(this.toString() + `ActionPveChapter 进入下一个引导章节`);
        this.guide.event(EGuideEvent.GuidePVEChapter,parseInt(arr[1]));
    }
}

//37|o/spine/succeed/diaoluo_baoshi/diaoluo_baoshi 在最后一只死亡的怪物身上播放特效
class ActionPlayEffectInDead extends BaseAction implements IGuideAction{
    dispose(){

    }
    init(s:string){
        let arr: string[] = s.split("|");
        LogSys.Log(this.toString() + `ActionPlayEffectInDead 播放怪物掉落死亡特效`);
        // let vo = new PlayAnimVo();
        let url = arr[1];
        let time = parseInt(arr[2]);
        this.guide.event(EGuideEvent.GuidePlayEffect,url);
        this.disableNextStep();
        Laya.timer.once(time,this,this.onNext);
    }

    private onNext(){
        LogSys.Log(this.toString() + "ActionPlayEffectInDead 播放完成进行下一步");
        this.guide.nextGuideStep();
    }
}
// 38|o/spine/scene/zhangjie_hengfu/zhangjie_hengfu|0
class ActionStagePlayEffect extends BaseAction implements IGuideAction{
    dispose(){
        
    }
    private effect:NoContainerSimpleEffect;

    private playAnim(url:string,animIndex:number){
        if(!StringUtil.IsNullOrEmpty(url)){
            if(this.effect){
                LogSys.Warn(`anim is playing...`);
                return;
            }
            this.effect=SpineEffectMgr.playOnce(url,Laya.stage,Laya.stage.width/2,Laya.stage.height/2,animIndex,undefined,new Laya.Handler(this,this.onPlayEnd));
        }
    }

    private onPlayEnd(){
        if(this.effect){
            this.effect.dispose();
            this.effect = null;
            // this.nextGuideStep();
            this.guide.gotoByfid(this.f_id + 1);
        }
    }
    init(s:string){
        LogSys.Log(this.toString() + `ActionStagePlayEffect 触发中间动画播放`);
        let arr: string[] = s.split("|");
        let url:string = arr[1];
        let animIndex:number = parseInt(arr[2]);
        this.playAnim(url,animIndex);
        this.disableNextStep();
    }
}

//39|4-00-1-1|2-01-1-2|7-00-1-3|9-10-1-4|15-11-1-5|13-12-1-6 创建英雄
class ActionCreateHero extends BaseAction implements IGuideAction{
    dispose(){

    }
    init(s:string){
        LogSys.Log(this.toString() + `ActionCreateHero 创建英雄`);
        let s1 = this.getBackParam();
        this.guide.event(EGuideEvent.GuideCreateHero,s1);
    }
}
// 40|1006|1008|1007 创建卡牌
class ActionCreateCard extends BaseAction implements IGuideAction{
    dispose(){

    }
    init(s:string){
        LogSys.Log(this.toString() + `ActionCreateCard 创建卡牌`);
        let s1 = this.getBackParam();
        this.guide.event(EGuideEvent.GuideCreateCard,s1);
    }
}
//41|6-200|5-1 获取道具 guidegive
class ActionGive extends BaseAction implements IGuideAction{
    dispose(){

    }
    init(s:string){
        LogSys.Log(this.toString() + `ActionGive 获取道具`);
        let s1 = this.getBackParam();
        this.guide.event(EGuideEvent.GuideAddMoney,s1);
    }
}
//42|64-betterBtn 功能开启
class ActionFuncOpen extends BaseAction implements IGuideAction{
    dispose(){

    }

    init(s:string){
        LogSys.Log(this.toString() + `ActionFuncOpen 功能开启`);
        let arr: string[] = s.split("|");
        let funcImg:string = arr[1];
        if(!StringUtil.IsNullOrEmpty(funcImg)){
            if(E.ViewMgr.isOpenReg(EViewType.FuncOpenView)){
                LogSys.Warn(this.toString()+`已经打开了...`);
            }else{
                this.disableNextStep();
                let fobj = new FuncOpenData();
                fobj.img = funcImg;
                E.ViewMgr.Open(EViewType.FuncOpenView, null, fobj);
            }
        }else{
            LogSys.Error(this.toString()+`配置有误...`);
        }
    }
}
//43|29-1|2-10|3-1000#继续战斗 奖励结算
class ActionRewardShow extends BaseAction implements IGuideAction{
    dispose(){

    }
    init(s:string){
        this.disableNextStep();
        LogSys.Log(this.toString() + `ActionRewardShow 奖励道具展示`);
        let s1 = this.getBackParam();
        E.ViewMgr.Open(EViewType.GuideRewardView,null,s1);
    }
}

/*
<1>    44|1 结束引导类型为1的引导

enum EGuideExitType{
    //PVE引导
    PVE = 1,
}

<2>     44 结束引导

*/
class ActionFinish extends BaseAction implements IGuideAction{
    dispose(){

    }
    init(s: string) {
        this.disableNextStep();
        let arr: string[] = s.split("|");
        let type: number = 0;
        if (arr[1]) {
            type = parseInt(arr[1]);
        }
        LogSys.Log(this.toString() + `ActionFinish 结束局内PVE引导类型添加:${type}`);
        this.guide.model.clearScene();
        this.guide.onInitCallBack();
        this.guide.event(EGuideEvent.Finish,type);
    }
}
/**45|12-10032-15-700|18-10033-1-1000 波次数据创建 */
class WaveDataCreate extends BaseAction implements IGuideAction{
    dispose(){

    }
    init(s:string){
        LogSys.Log(this.toString() + `WaveDataCreate 波次数据创建`);
        this.guide.event(EGuideEvent.WaveDataCreate,this.getBackParam());
    }
}

/**46|1-02-1-1|5-01-1-2|1-02-2-1|1-02-3-1 英雄卡池数据创建 */
class HeroPoolCreate extends BaseAction implements IGuideAction{
    dispose(){

    }
    init(s:string){
        LogSys.Log(this.toString() + `HeroPoolCreate 英雄卡池数据创建`);
        this.guide.event(EGuideEvent.HeroPoolCreate,this.getBackParam());
    }
}

//47|4-00-1-1|2-01-1-2|7-00-1-3|9-10-1-4|15-11-1-5|13-12-1-6 创建敌方英雄
class GuideCreateEnemyIdHero extends BaseAction implements IGuideAction{
    dispose(){

    }
    init(s:string){
        LogSys.Log(this.toString() + `GuideCreateEnemyIdHero 创建英雄`);
        let s1 = this.getBackParam();
        this.guide.event(EGuideEvent.GuideCreateEnemyIdHero,s1);
    }
}
//48|78|4|1 新手引导EFightSceneStatus.PVP_Fight_New_Guide(4)对决 1停止 0继续下一步
class ActionOpenView extends BaseAction implements IGuideAction{
    dispose(){

    }
    init(s:string){
        LogSys.Log(this.toString() + `ActionOpenView 打开窗口`);
        let arr = s.split("|");
        let type:number = parseInt(arr[1]);
        E.ViewMgr.Open(type,null,parseInt(arr[2]));
        let status:number = parseInt(arr[3]);
        if(status){
            this.disableNextStep();
        }
    }
}

//49 添加一个下一个Step的监听
class ActionNextStep extends BaseAction implements IGuideAction{
    dispose(){

    }
    init(s:string){
        LogSys.Log(this.toString() + `ActionNextStep 下一步监听`);
        GuideModel.Ins.once(EGuideEvent.ActionNextStep,this,this.onNext);
    }

    private onNext(){
        this.guide.nextGuideStep();
    }
}

/** 50|1000|1 1000后停止帧循环 */
class ActionFrameStop extends BaseAction implements IGuideAction{
    private targetId:number;
    dispose(){

    }
    init(s:string){
        LogSys.Log(this.toString() + `ActionFrameStop 关键帧循环停止 监听触发`);
        // GuideModel.Ins.once(EGuideEvent.ActionNextStep,this,this.onNext);
        let arr = s.split("|");
        let ms:number = parseInt(arr[1]);
        this.targetId = parseInt(arr[2]) + this.f_id;
        Laya.timer.once(ms,this,this.onStop);
    }

    private onStop(){
        LogSys.Log(this.toString() + `ActionFrameStop 关键帧循环停止 行为触发`);
        GuideModel.Ins.event(EGuideEvent.FrameStop);
        this.guide.gotoByfid(this.targetId);
    }
}

//51|1 敌方波次创建
class EnemyWaveAction extends BaseAction implements IGuideAction{
    dispose(){

    }
    init(s:string){
        LogSys.Log(this.toString() + `EnemyWaveAction 敌方波次创建`);
        let arr: string[] = s.split("|");
        this.guide.event(EGuideEvent.EnemyWave,parseInt(arr[1]));
    }
}


//52|6-200|5-1 敌方获取获取道具
class EnemyActionMoneyGive extends BaseAction implements IGuideAction{
    dispose(){

    }
    init(s:string){
        LogSys.Log(this.toString() + `EnemyActionMoneyGive 敌方获取道具`);
        let s1 = this.getBackParam();
        this.guide.event(EGuideEvent.EnemyActionMoneyGive,s1);
    }
}

//53 启动帧事件
class ActionFrameStart extends BaseAction implements IGuideAction{
    dispose(){

    }
    init(s:string){
        LogSys.Log(this.toString() + `ActionFrameStart 启动帧事件`);
        this.guide.event(EGuideEvent.FrameStart);
        this.disableNextStep();
    }
}

//54|1009|7|13|2|2 使用卡牌id为1009卡牌 将敌方uid7的英雄抢夺到己方uid13 坐标设置为2,2
class ActionUseCard extends BaseAction implements IGuideAction{
    dispose(){

    }

    init(s:string){
        if(!this.guide.model.fightView){
            return;
        }
        let arr = s.split("|");
        let params:number[] = [];
        let cardCfg = t_Function_Card.Ins.getCfgById( parseInt(arr[1]));
        if(!cardCfg){
            LogSys.Error(this.toString()+"不存在卡牌");
            return;
        }
        let templateId:number = cardCfg.f_card__templateid;
        switch (templateId) {
            case ETemplateCardId.GetEnemyHero:
                {
                    // 54|7|13|2|2 使用卡牌id为1009卡牌 将敌方uid7的英雄抢夺到己方uid13 坐标设置为2,2
                    //意念之控
                    
                    let revc = new ComposeUpdate_revc();
                    revc.cardId = cardCfg.f_cardid;
                    revc.datalist = [];
                    revc.serialNum = 0;
                    revc.type = EComposeUpdateType.FuncCard;
                    let targetUID:number = parseInt(arr[2]);//目标英雄
                    let saveUID:number = parseInt(arr[3]);//存储英雄
                    let tx:number = parseInt(arr[4]);
                    let ty:number = parseInt(arr[5]);
                    let _findEnemy = this.guide.model.fightView.gridItemList.find(o => o.data.uid == targetUID);
                    if (_findEnemy) {
                        revc.dellist = [targetUID];
                        let cell = new stElement();
                        cell.fid = _findEnemy.data.fid
                        cell.num = _findEnemy.data.num;
                        cell.playerId = this.guide.model.ownerPlayer.playerId;
                        cell.skinId = 0;
                        cell.uid = saveUID;
                        cell.x = tx;
                        cell.y = ty;
                        revc.datalist.push(cell);
                        this.guide.model.onComposeUpdate(revc);
                        //============================================
                        // let _cardVo = new stFuncCardEffect();
                        // _cardVo.cardId = card.data.fCardId;
                        // _cardVo.playerId = this.model.ownerPlayer.playerId;
                        // _cardVo.state = EEffectStatus.Open;
                        // _cardVo.type = EEffectTarget.Hero;
                        // _cardVo.uids = [];
                        // let list = this.model.refreshList;
                        // for(let i = 0;i < list.length;i++){
                        //     let hero = list[i];
                        //     if(hero.playerId == this.guide.selfId){
                        //         _cardVo.uids.push(hero.uid);
                        //     }
                        // }
                        // this.guidemodel.event(EGuideEvent.ParseCardCell,_cardVo);
                        //====================================================
                    
                    } else {
                        LogSys.Error(this.toString()+`didn't find uid = ${targetUID} enemyHero `)
                        return;
                    }
                }
                break;
            case ETemplateCardId.FireHero:
                // 54|1002|9 使用暗杀(1002)对敌方英雄uid==9的英雄使用
                let uid:number = parseInt(arr[2]);
                let _findEnemy = this.guide.model.fightView.gridItemList.find(o => o.data.uid == uid && o.data.playerId == this.guide.model.fightView.enemyPlayerId);
                if (_findEnemy) {
                    let revc = new ComposeUpdate_revc();
                    revc.datalist = [];
                    revc.serialNum = 0;
                    revc.cardId = cardCfg.f_cardid;
                    revc.dellist = [_findEnemy.data.uid];
                    revc.type = EComposeUpdateType.FuncCard;
                    this.guide.model.onComposeUpdate(revc);
                }else{
                    LogSys.Error(this.toString()+"未找到敌方英雄")
                    return;
                }
                break;
            
            case ETemplateCardId.StealMoney:
                // 54|1001|6-5000
                let eff: string[] = cardCfg.f_card_effect.split("|");
                let moneyId: number;
                switch (eff[1]) {
                    case "1":
                        moneyId = ECellType.FIGHT_MONEY;
                        break;
                    case "2":
                        moneyId = ECellType.FIGHT_STONE;
                        break;
                }
                let val = parseInt(eff[2]) / 10000;
                if (eff[0] == "1") {
                    //窃取
                        let cell = VoUtils.convertCellList(arr[2]).find(o=>o.id == moneyId);// = this.guide.enemyMoney.find(o => o.id == moneyId);
                        if (cell) {
                            let stealVal:number = cell.count * val;
                            params.push(stealVal);
                            LogSys.Log(this.toString()+`窃取到${moneyId}-${stealVal}`);
                            // let serverVo = new stCellValue();
                            // serverVo.count = Math.ceil(MainModel.Ins.mRoleData.getVal(moneyId) + stealVal);
                            // serverVo.id = moneyId;
                            // this.guide.event(EGuideEvent.GuideSetMoney,[serverVo]);
                            
                            GuideUtils.addMoney.runWith(`${moneyId}-${stealVal}`);
                        }
                }
                break;

            default:
                LogSys.Error(this.toString()+"未实现该卡牌效果")
                return;
        }

        if(!cardCfg.f_direct_broadcast){
            //模拟后端 推送弹幕消息
            let msg:FuncardDanMu_revc = new FuncardDanMu_revc();
            msg.cardId = cardCfg.f_cardid;
            msg.playerId = this.guide.model.ownerPlayer.playerId;
            msg.datalist = params;

            // let hideTime:number = 0;
            // if(autoHideMsg){
            // hideTime = this.model.curAdapter.clockTimeMs + 500;
            // }
            let vo1 = this.guide.model.createMsg(msg,this.guide.model.curAdapter.clockTimeMs + FightValueConfig.MsgHideTimeOffsetMs);
            this.guide.model.msgList.push(vo1);
            E.ViewMgr.Open(EViewType.CardMsgView);
        }else{
            this.guide.model.clientBroadcast(this.guide.model.ownerPlayer.playerId,cardCfg.f_cardid);
        }
        //======================================================
    }

    // private onGuideSetMoney(list:stCellValue[]){
    // }
}

// 55|1-100#2-200|1000|4 战斗结算 获得道具6-100|7-200和1000积分 4胜利类型
class ActionFightResult extends BaseAction implements IGuideAction{
    dispose(){

    }
 
    init(s:string){
        let arr = s.split("|")
        let items:string = arr[1].replace(/#/g,"|");
        let trophy:number = parseInt(arr[2]);
        let type:number = parseInt(arr[3]);

        let vo:IGuideFightResult = {} as IGuideFightResult;
        vo.type = type;
        vo.isWin = 1;
        vo.itemStr = items;
        vo.trophy = trophy;
        this.guide.event(EGuideEvent.GuideFightResult,vo);
    }
}

// 56|31|2 击杀掉uid31的怪物偏移2步骤
class ActionUIDRemove extends BaseAction implements IGuideAction{
    private targetId:number;
    private uid:number;
    private readonly delayms:number = 1000;
    dispose(){

    }
    init(s:string){
        let arr = s.split("|");
        this.uid =  parseInt(arr[1]);
        this.targetId = this.f_id + parseInt(arr[2]);

        this.onCheckMonster();
    }

    private onCheckMonster(){
        if(this.guide.model.removeUIDs.indexOf(this.uid) !=-1){
            this.guide.gotoByfid(this.targetId);
        }else{
            Laya.timer.once(this.delayms,this,this.onCheckMonster);
        }
    }

}

// 57|0 锁定/授权交换英雄
class ActionEnableSwitchHero extends BaseAction implements IGuideAction{
    dispose(){

    }
    init(s:string){
        let arr = s.split("|");
        this.guide.model.curAdapter.canSwitchHero = parseInt(arr[1]) == 1;
    }
}

/**
 * 58|名字|等级|积分|头像id|竞赛模式|我方的怪物上限|敌方的怪物上限(2/1 PVE/PVP) 
 * 创建房间信息 */
class ActionCreateRoomInfo extends BaseAction implements IGuideAction{
    dispose(){

    }
    init(s:string){
        let arr = s.split("|");
        let obj:IGuideCreateRoom = {} as IGuideCreateRoom;
        obj.nickName = arr[1];
        obj.lv = parseInt(arr[2]);
        obj.trophy = parseInt(arr[3]);
        obj.headUrl = arr[4];
        obj.mode = parseInt(arr[5]);
        // let obj = FightGuideUtils.createRoom(cfg.f_param);
        LogSys.Log(this.toString()+`房间信息`);
        // this.guide.event(EGuideEvent.CreateRoom,obj);
    }
}
/* 59|11-top_container-child0-timeCon 隐藏UI对象 */
class ActionHideUiItem extends BaseAction implements IGuideAction{
    dispose(){

    }
    init(s:string){
        let backArr = this.getBackParam().split("|");
        for(let i = 0;i < backArr.length;i++){
            let itemStr:string = backArr[i];
            let sp = GuideUtils.getUIByKeySt(itemStr);
            if(sp){
                sp.visible = false;
            }
        }
    }
}

/** 60|2 2倍速*/
class ActionMultiplyingPower extends BaseAction implements IGuideAction{
    dispose(){
        
    }
    init(s:string){
        let arr = s.split("|");
        let power:number = parseInt(arr[1]);
        this.guide.event(EGuideEvent.MultiplyingPower,power);
    }
}
/**61|5 5领取局内战斗引导奖励*/
class ActionServerReward extends BaseAction implements IGuideAction{
    dispose(){
        
    }
    init(s:string){
        LogSys.Log(this.toString()+"ActionServerReward 领取后端奖励");
        let arr = s.split("|");
        let type:number = parseInt(arr[1]);
        if(Laya.Utils.getQueryString("disable_save_guide")){
            
        }else{
            let req = new CommonClaimRewards_req();
            req.flag = type;
            SocketMgr.Ins.SendMessageBin(req);
        }
    }
}

/**62 立即停止帧循环*/
class ActionFrameStopRightNow extends BaseAction implements IGuideAction{
    dispose(){

    }
    init(s:string){
        LogSys.Log(this.toString() + `ActionFrameStopRightNow 立即停止帧循环`);
        this.guide.event(EGuideEvent.FrameStop);
    }
}

// 63|1|0 设置PVPRound的状态 并更新UI继续行为   
// 63|1|1 终止行为
class ActionPVPRoundSetStatus extends BaseAction implements IGuideAction{
    dispose(){

    }
    init(s:string){
        LogSys.Log(this.toString() + `ActionPVPRoundSetStatus`);
        let arr = s.split("|")
        this.setPvpRoundStatus(parseInt(arr[1]));
        
        if(parseInt(arr[2]) == 1){
            this.disableNextStep();
        }
    }

    private setPvpRoundStatus(status:number){
        // this.guide.model.fightTypeAdaper.pvpRoundStatus = status;
        let revc = new PvpTurnBasedStartFight_revc();
        revc.state = status;
        this.guide.model.onPvpTurnBasedStartFight(revc);
    }
}

// 64 设置任务
class ActionTask extends BaseAction implements IGuideAction{
    dispose(){

    }
    init(s:string){
        let _cfg:Configs.t_Tasks_Guide_dat = this.guide.proxy.GetDataById(this.f_id);
        let uiType = EViewType.PveTaskGuide;
        // let _taskDesc:string = _cfg.f_guidetask;
        if(E.ViewMgr.isOpenReg(uiType)){
            this.guide.event(EGuideEvent.UpdateTask,_cfg);
        }else{
            E.ViewMgr.Open(EViewType.PveTaskGuide,null,_cfg);
        }
    }
}

/* 65|11-top_container-child0-timeCon 显示UI对象 */
class ActionShowUiItem extends BaseAction implements IGuideAction{
    dispose(){

    }
    init(s:string){
        let backArr = this.getBackParam().split("|");
        for(let i = 0;i < backArr.length;i++){
            let itemStr:string = backArr[i];
            let sp = GuideUtils.getUIByKeySt(itemStr);
            if(sp){
                sp.visible = true;
            }else{
                LogSys.Error(this.toString() + ` is not find!`);
            }
        }
    }
}
// 66|1 PVPRound设置总血量为1
class ActionSetMaxHp extends BaseAction implements IGuideAction{
    dispose(){

    }
    init(s:string){
        let arr = s.split("|");
        let v = parseInt(arr[1]);
        let revc = new PvpTurnBasedHpList_revc();
        let owner = new stPvpTurnBasedHp();
        owner.playerId = this.guide.model.ownerPlayer.playerId;
        owner.hp =  v;

        let enemy = new stPvpTurnBasedHp();
        enemy.playerId = this.guide.model.enemyPlayer.playerId;
        enemy.hp =  v;

        revc.datalist = [];
        revc.datalist.push(owner,enemy);
        this.guide.model.onPvpTurnBasedHpList(revc);
    }
}

/**67 创建己方英雄卡池 */
class CreateHeroPool extends BaseAction implements IGuideAction{
    dispose(){

    }
    init(s:string){
        let s1 = this.getBackParam();
        this.guide.event(EGuideEvent.CreateHeroPool,s1);
    }
}


/*
68|2|9-00-1-11|1 类型2祈愿成功  68|2|9-00-1-11|0 类型2祈愿失败  
*/
class CreateOwnerGamblePool extends BaseAction implements IGuideAction{
    dispose() {

    }
    init(){
        let s1 = this.getBackParam();
        this.guide.event(EGuideEvent.CreateOwnerGamblePool,s1);
    }
}

/*
69|00-8     xy-uid设置下一次神话卡池中的数据
*/
class CreateOwnerMythorsPool extends BaseAction implements IGuideAction{
    dispose(){

    }

    init(s:string){
        let arr = s.split("|");
        let s1 = arr[1];
        this.guide.event(EGuideEvent.CreareOwnerMythosPool,s1);
    }
}

/*
70|23|24 设置预览神话英雄展示为23|24英雄 70|0 清空
*/
class ActionCreateMythosHerosPool extends BaseAction implements IGuideAction{
    dispose(){

    }

    init(){
        let s1 =  this.getBackParam()
        this.guide.event(EGuideEvent.CreateMythosHerosPool,s1);
    }
}

/** 
71|3000|1 3000毫秒之后偏移1步
 */
class DelayTimeActionGoto extends BaseAction implements IGuideAction {
    private targetTime:number;
    private offset:number;
    init( s: string) {
        let arr: string[] = s.split("|");
        this.targetTime = TimeUtil.serverTimeMS + parseInt(arr[1]);
        this.offset = parseInt(arr[2]);
        this.disableNextStep();
        Laya.timer.once(1, this, this.onTimeCheck);
    }
    private onTimeCheck() {
        if(TimeUtil.serverTimeMS >= this.targetTime){
            LogSys.Log(this.toString()+`延时触发成功`);
            this.goto(this.f_id + this.offset);
            this.dispose();
            return;
        }
        Laya.timer.once(1, this, this.onTimeCheck);
    }
    dispose() {
        Laya.timer.clear(this, this.onTimeCheck);
    }
}
// 72|54|55|56 肉鸽列表弹出
class ActionRougeList extends BaseAction implements IGuideAction{
    dispose() {
        // throw new Error("Method not implemented.");
    }

    init(){
        let s = this.getBackParam();
        let arr = s.split("|");
        let revc:RougeList_revc = new RougeList_revc();
        revc.datalist = [];
        revc.unix = TimeUtil.serverTime + parseInt(t_Battle_Config.Ins.getValueById(72));
        for(let i = 0;i < arr.length;i++){
            let s1 = arr[i];
            if(!StringUtil.IsNullOrEmpty(s1)){
                revc.datalist.push(parseInt(s1));
            }
        }
        this.guide.model.onRougeList(revc);
    }
}
//73|1 改变己方现在的血量为1
class ActionHpChange extends BaseAction implements IGuideAction{
    dispose(){
        
    }
    init(s:string){
        let arr = s.split("|");
        let hp = parseInt(arr[1]);
        let revc = new PvpTurnBasedHpUpdate_revc();
        revc.datalist = [];
        let _hpVo = new stPvpTurnBasedHp();
        _hpVo.playerId = this.guide.model.ownerPlayer.playerId;
        _hpVo.hp = hp;
        revc.datalist.push(_hpVo);
        this.guide.model.onPvpTurnBasedHpUpdate(revc);
    }
}

//74|1|30000 启动第一波次倒计时30000毫秒
class ActionWaveUpdate extends BaseAction implements IGuideAction{
    dispose(){

    }
    init(s:string){
        let arr = s.split("|");
        let _waveResult: IFightGuideWaveUpdate = {} as IFightGuideWaveUpdate;
        _waveResult.wave = parseInt(arr[1]);
        _waveResult.sub = parseInt(arr[2]);
        MainModel.Ins.pveGuide.curWave = _waveResult.wave;
        this.guide.model.event(ComposeEvent.FightGuideWaveUpdate,_waveResult);
        
        // let revc = new MonsterWave_revc();
        // revc.wave = parseInt(arr[1]);
        // revc.nextWaveTime = TimeUtil.serverTime + parseInt(arr[2])
        // this.guide.model.onMonsterWave(revc);
    }
}
//75|13 为英雄uid==13的英雄添加黄色位置圈
class ActionAddYellowCirle extends BaseAction implements IGuideAction{
    dispose(){

    }

    init(s:string){
        let arr = s.split("|");
        let uid:number = parseInt(arr[1]);
        this.guide.event(EGuideEvent.ShowCirleYellow,uid);
    }
}

/**
 * 76|1 设置为有材料可以使用 76|0 设置为没有材料可以使用
 */
class ActionHaveItemCanUse extends BaseAction implements IGuideAction{
    dispose(){

    }
    init(s:string){
        let haveItemCanUse = parseInt(s.split("|")[1]) == 1;
        this.guide.model.curAdapter.haveItemCanUse = haveItemCanUse;
        this.guide.event(EGuideEvent.EAnimStartEffect);
    }

}
/**
 * 77|1 选择肉鸽fid=1
 */
class ActionrougeSel extends BaseAction implements IGuideAction {
    dispose() {

    }

    init(s: string) {
        let id = parseInt(s.split("|")[1]);
        let revc = new RougeChoose_revc();
        revc.playerId = this.guide.model.ownerPlayer.playerId;
        revc.fid = id;
        this.guide.model.onRougeChoose(revc);
    }
}

//#region params
/*
1|1|17 祈愿成功一次偏移17

2|3|22 当前手牌小于3张 偏移22

3|5|10 召唤了5次以上 偏移10

4|5|15 出现了uid==5的英雄 偏移15

5|0    0禁用拖拽 1启用拖拽 

6|0    0禁用使用卡牌 1启用使用卡牌 

7    分线卡牌引导：只要玩家当前还有卡牌，引导点击最左侧卡牌的使用按钮

8|0 隐藏主动技能 8|1显示主动技能

9|0 锁定召唤按钮 9|1解锁召唤按钮

10|16|2 怪物uid==16的死亡触发 偏移2

11|1000 延迟1000毫秒下一步

12|3-3000&5-3|9 道具3-3000|5-3不满足的时候 [偏移9]

13|15 设置EViewType.HeroTip1(15)的界面为没有打开特效的状态

14|4-sp-child0-panel|0 禁用指定的Panel滑动 14|4-sp-child0-panel|1 启用指定的Panel滑动

15|5|1 存储ERedEnum == 5的值为1

16|47|10  界面EViewType(47)退出的时候触发[偏移10]

17|52|23 t_Shop 检测到商店f_id的商品不能买的时候[偏移23]

18|2 >=2级的时候触发该引导

19   行为终止

20|4-sp-child0-list|0 禁用指定的list滑动 14|4-sp-child0-list|1 启用指定的list滑动

21|4-sp-child0-list-child0-btn1|2 如果4-sp-child0-list-child0-btn1状态为disable则偏移2步骤

22|5|1  5(关闭界面5)|1(禁用 TowerMainEvent.MainViewLayerChange)

23|1 假设23+1的f_id的显示对象为64-betterBtn,检测偏移位置1的显示对象64-betterBtn是否存在 不存在就是一直等待

24|1 偏移1

25|1 设置抽卡自动抽取为选中 25|0设置抽卡自动抽取为未选中s

26|1   抽卡主界面打开启完毕 偏移1

27|1   抽取卡牌  获取卡牌完毕 偏移1

28|0|1  检测t_Func_Popup中是否有开着的界面(检测下一条29type数据中是否有界面开启着) 有就 下行行为不允许(偏移0步) 下行行为允许(没有开着的界面就偏移1步)

29|77-89-105 禁用77-89-105界面

30|77-89-105 解锁77-89-105界面

31|1 删除f_id == 1 的 Action

32|16|1 击杀怪物uid==16的时候偏移1

33|23 打开一个英雄获得面板

34|1006-1007-1008 预览卡牌

35|1 创建波次

36|1 指定进入一个章节

37|o/spine/succeed/diaoluo_baoshi/diaoluo_baoshi 在最后一只死亡的怪物身上播放特效

38|o/spine/scene/zhangjie_hengfu/zhangjie_hengfu|0 播放一个舞台动画

39|4-00-1-1|2-01-1-2|7-00-1-3|9-10-1-4|15-11-1-5|13-12-1-6 创建英雄

40|1006|1008|1007 创建卡牌

41|6-200|5-1 获取道具

42|64-betterBtn 功能开启

43|29-1|2-10|3-1000#继续战斗 奖励结算

44|1 结束局内引导类型1(EGuideExitType)的引导

45|12-10032-15-700|18-10033-1-1000 波次数据创建

46|1-02-1-1|5-01-1-2|1-02-2-1|1-02-3-1 英雄卡池数据创建 

47|4-00-1-1|2-01-1-2|7-00-1-3|9-10-1-4|15-11-1-5|13-12-1-6 创建敌方英雄
        格式 heroId-xy-count-uid

48|78|4|1 开启一个界面   新手引导EFightSceneStatus.PVP_Fight_New_Guide(4)对决 1停止 0继续下一步

49 添加一个下一个Step的监听

50|1000 1000后停止帧循环

51|1 敌方波次创建

52|6-200|5-1 敌方获取道具

53 启动帧事件

-----------------------------------------------------------------------

54|1009|7|13|2|2  使用卡牌id为1009卡牌 将敌方uid7的英雄抢夺到己方uid13 坐标设置为2,2
54|1002|9         使用卡牌暗杀敌方uid9的英雄
54|1001|6-5000    使用窃取
-----------------------------------------------------------------------
    /**1怪物数量 
    MonsterCount = 1,
    /**2未击杀妖王 
    KillMBoss = 2,
    /**3妖王剩余血量 
    BossBlood = 3,
    /**4优先击杀最终妖王
    FirstKillBoss = 4

55|6-100#7-200|1000|4 战斗结算 (获得道具6-100|7-200) (1000积分) (4优先击杀最终妖王)

56|31|2 击杀掉uid31的怪物偏移2步骤

57|0 交换英雄 (0/1)禁用/启用

58|新人导师|1|1000|2|1|50|50    |名字|等级|积分|头像id|竞赛模式|我方怪物上限|敌方怪物上限|(2/1 PVE/PVP) 

59|11-top_container-child0-timeCon 隐藏UI对象

60|2 2倍速

61|5 5领取局内战斗引导奖励

62 立即停止帧循环

63|1|0 设置PVPRound的状态 并更新UI继续行为          63|1|1 终止行为

64 设置任务

65|11-top_container-child0-timeCon 显示UI对象 

66|1 PVPRound设置总血量为1

67|2-02-1-1|7-02-1-2 创建己方英雄卡池

68|2|9-00-1-6|1 类型2祈愿成功  68|2|9-00-1-6|0 类型2祈愿失败  

69|00-8     xy-uid设置下一次神话卡池中的数据

70|23 设置预览神话英雄展示为23英雄 70|0 清空

71|3000|1 3000毫秒之后偏移1步

72|54|55|56 肉鸽列表弹出

73|1 改变己方现在的血量为1

74|1|30000 启动第一波次倒计时30000毫秒

75|13 为英雄uid==13的英雄添加黄色位置圈

76|1 设置为有材料可以使用 76|0 设置为没有材料可以使用
*/
//#endregion
export class ActionMgr {
    private _clsMap;
    private initClsMap() {
        this._clsMap = {};
        this.regCls(1, GambleAction);
        this.regCls(2, CardCountCheck);
        this.regCls(3, SummonCheck);
        this.regCls(4, HeroUidCheck);
        this.regCls(5, HeroDrag);
        this.regCls(6, UseCardAction);
        this.regCls(7, CardHandAction);
        this.regCls(8, SkillVisAct);
        this.regCls(9, SommonLockedStyle);
        this.regCls(10, MonsterDeadAction);
        //===================================================
        this.regCls(11, DelayTimeAction);
        this.regCls(12, ItemNotEnoughAction);
        this.regCls(13, CloseUIEffectAction);
        this.regCls(14, ScrollPanelAction);
        this.regCls(15, RedSaveAction);
        this.regCls(16, CloseAutoGotoStep);
        this.regCls(17, ShopBuyNotEnoughCheck);
        this.regCls(18, LevelUpCheck);
        this.regCls(19, StopAction);
        this.regCls(20, ListScrollAction);
        this.regCls(21, ImageDisableAction);
        this.regCls(22, CloseUIAction);
        this.regCls(23, WaitCheckExistView);
        this.regCls(24, ActionfidOffset);
        this.regCls(25, ActionCQ_Card);
        this.regCls(26, ActionCardUIOpenComplete);
        this.regCls(27, ActionCardGetResult);
        this.regCls(28, ActionFuncPopup);
        this.regCls(29, DisableViewTypeAction);
        this.regCls(30, EnableViewTypeAction);
        this.regCls(31, DelAction);
        this.regCls(32, KillMonsterAction);
        this.regCls(33, GetHeroShowAction);
        this.regCls(34, CardPreviewShowAction);
        this.regCls(35, WaveAction);
        this.regCls(36, ActionPveChapter);
        this.regCls(37, ActionPlayEffectInDead);
        this.regCls(38, ActionStagePlayEffect);
        this.regCls(39, ActionCreateHero);
        this.regCls(40, ActionCreateCard);
        this.regCls(41, ActionGive);
        this.regCls(42, ActionFuncOpen);
        this.regCls(43, ActionRewardShow);
        this.regCls(44, ActionFinish);
        this.regCls(45, WaveDataCreate);
        this.regCls(46, HeroPoolCreate);
        this.regCls(47, GuideCreateEnemyIdHero);
        this.regCls(48, ActionOpenView);
        this.regCls(49, ActionNextStep);
        this.regCls(50, ActionFrameStop);
        this.regCls(51, EnemyWaveAction);
        this.regCls(52, EnemyActionMoneyGive);
        this.regCls(53, ActionFrameStart);
        this.regCls(54, ActionUseCard);
        this.regCls(55, ActionFightResult);
        this.regCls(56, ActionUIDRemove);
        this.regCls(57, ActionEnableSwitchHero);
        this.regCls(58, ActionCreateRoomInfo);
        this.regCls(59, ActionHideUiItem);
        this.regCls(60, ActionMultiplyingPower);
        this.regCls(61, ActionServerReward);
        this.regCls(62, ActionFrameStopRightNow);
        this.regCls(63, ActionPVPRoundSetStatus);
        this.regCls(64, ActionTask);
        this.regCls(65, ActionShowUiItem);
        this.regCls(66, ActionSetMaxHp);
        this.regCls(67, CreateHeroPool);
        this.regCls(68, CreateOwnerGamblePool);
        this.regCls(69, CreateOwnerMythorsPool);
        this.regCls(70, ActionCreateMythosHerosPool);
        this.regCls(71, DelayTimeActionGoto);
        this.regCls(72, ActionRougeList);
        this.regCls(73, ActionHpChange);
        this.regCls(74, ActionWaveUpdate);
        this.regCls(75, ActionAddYellowCirle);
        this.regCls(76, ActionHaveItemCanUse);
        this.regCls(77, ActionrougeSel);
    }
    private _guide: IGuideModel;

    constructor(guide: IGuideModel) {
        this._guide = guide;
        this.initClsMap();
    }

    private regCls(type: number, _cls) {
        if (this._clsMap[type]) {
            throw Error(`ActionMgr type:${type} is exist class`);
        } else {
            this._clsMap[type] = _cls;
        }
    }
    private _list: IGuideAction[] = [];

    parse(list:Configs.t_Tasks_Guide_dat[],cfg: Configs.t_Tasks_Guide_dat): number {
        LogSys.Log(`解析Action: f_id:${cfg.f_id}`);

        let s: string = cfg.f_param;
        let ms: number = 0;//延时时间
        let sArr: string[] = s.split(";");
        let newList:IGuideAction[] = [];
        for (let i = 0; i < sArr.length; i++) {
            let cellStr: string = sArr[i];
            if (!StringUtil.IsNullOrEmpty(cellStr)) {
                let param = cellStr;
                let arr: string[] = param.split("|");
                let type: number = parseInt(arr[0]);
                let act: IGuideAction;

                if (this._list.find(o => o.f_id == cfg.f_id && o.param == param)) {
                    LogSys.Warn(`重复的action!!! f_id:${cfg.f_id},param:${param}`);
                    return -2;
                } else {
                    let _cls1 = this._clsMap[type];
                    if (!_cls1) {
                        LogSys.Error(`未实现类型${type}的Action!`);
                    } else {
                        act = new _cls1();
                        if (act) {
                            act.guide = this._guide;
                            act.list = list;
                            act.f_id = cfg.f_id;
                            act.param = param;
                            act.init( param);
                            let b: BaseAction = (act as any);
                            if (b.ms != undefined) {
                                ms += b.ms;
                            }
                            newList.push(act);
                            if(act.mAddList){
                                this._list.push(act);
                            }
                        }
                    }
                }
            }
        }
        this.checkErr(newList,cfg.f_id);
        return ms;
    }

    private checkErr(_list:IGuideAction[],f_id:number) {
        if (_list.length > 1) {
            let cell = _list.find(o => o.ms == -1);
            if (cell) {
                LogSys.Error(`配置错误!....ms == -1, 存在不自动下一步的引导 只能有且只有一条!!! ${cell.toString()}`);
            }
        }
    }

    del(id: number) {
        for (let i = 0; i < this._list.length; i++) {
            let cell = this._list[i];
            if (cell.f_id == id) {
                LogSys.Log(`ActionMgr del删除事件${id}`);
                cell.dispose();
                this._list.splice(i, 1);
                i--;
            }
        }
    }
    clear() {
        while (this._list.length) {
            let cell = this._list.shift();
            cell.dispose();
        }
    }
}
/*



GM
gm("finish_pveguide")

user=b0&config=initConfig&disableSound=1&debug=1&debugshow=1

gm("table t_Main_Tasks_Guide")

gm('exp 50')

4-1

*/