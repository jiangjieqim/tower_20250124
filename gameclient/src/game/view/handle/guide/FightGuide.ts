// import { ButtonCtl } from "../../../../frame/view/ButtonCtl";
import { EViewType } from "../../../common/defines/EnumDefine";
import { E } from "../../../G";
import { FCardInnerInit_revc, FightResult_revc, PvPRoomInfo_revc, SommonHeroCost_revc, stCellValue, stElement, stFCardInner, stFightResult, stMonsterBirth, stPlayerInRoom, StrengthenList_revc, stStrengthenItem } from "../../../network/protocols/BaseProto";
import { ComposeEvent } from "../compose/ComposeEvent";
import { ComposeModel } from "../compose/ComposeModel";
import { EFightReson } from "../compose/EFightReson";
import { EBattle_Config, t_Battle_Config } from "../compose/t_Battle_Config";
// import { t_Monster } from "../compose/t_Monster_Template";
import { FightGuideDebug } from "../compose/views/debug/FightGuideDebug";
// import { EFightReson } from "../compose/views/FightResonView";
import { ClientMonsterBirthVo, EFightMode } from "../compose/vos/EFightEnum";
import { ESystemRefreshTime } from "../main/ctl/ESystemRefreshTime";
import { System_RefreshTimeProxy } from "../main/ctl/System_RefreshTimeProxy";
import { ItemViewFactory } from "../main/model/ItemViewFactory";
import { MainModel } from "../main/model/MainModel";
import { TowerMainEvent } from "../towertmain/model/TowerMainEvent";
import { FightGuideData } from "./FightGuideData";
import { FightGuideUtils } from "./FightGuideUtils";
import { FightStopMgr } from "./FightStopMgr";
import { EGuideEvent, GuideModel, t_Tasks_Guide } from "./GuideModel";
import { GuideUtils } from "./GuideUtils";
import { HeroAi } from "./HeroAi";
import { EFightGuide, t_FightGuideConfig } from "./t_FightGuideConfig";
/*
/*

1、玩家进入游戏，我方场上有许多的怪物，营造十分紧急的感觉，然后引导玩家使用功能卡1，功能卡1效果”消灭场上所有的怪物“，让玩家感受到功能卡的强大
2、这时候玩家身上没什么钱，引导玩家使用功能卡2，功能卡2效果”与敌人的金钱数量平分“，使用后一下子获得了很多的金钱
3、引导玩家点击召唤卡开始召唤英雄，前几次召唤到的都是白色品质英雄，然后引导玩家进行3张相同卡牌的合成（0，2位置的英雄 出来-7）

    <1>.3,2,3,1,3
    // 20-22-24-26-28-30-32-34-36-38-40
5、然后开始出小怪，前几波都是一刀秒(开始动)

6、第3波开始出现boss，这时候发现打不动boss，引导玩家强化
(关卡配置)

7、强化后伤害明显变高，但boss逃出了攻击范围，引导玩家移动英雄，然后击杀了boss

8、击杀boss后获得幸运币，引导玩家进行祈愿

9、祈愿成功获得紫色英雄

11、出现大boss，敌我双方都打不动boss，这时候弹出神话合成按钮，引导玩家合成孙悟空，几棒子就把boss打到了。

12、敌人明显吃力，但也合成出了唐僧，这时候引导玩家使用卡牌3，卡牌3效果“随机消灭敌方的一个英雄”，正好消灭了唐僧

倒计时Boss

// sommon
*/

/*
强化 11-betterBtn
神话 11-fairyBtn
*/


//用池子的概念出来异常溢出的操作
//定死不能点击任何区域
// guidestart的死后使点击区域不可使用

export class FightGuideWaveVo{
    /**出生时间间隔 */
    birthOffsetMS:number;
    wave:number;
    sec:number;
    monsterId:number;
    // maxBlood:number;
    monsterCount:number;
}
export interface IFightGuideWaveUpdate{
    /**当前波次 */
    wave:number;
    /**本波次剩余时间(毫秒) */
    sub:number;
}

// class StopGuideVo{
//     // taskId:number;
//     time:number;
//     /**未使用 */
//     used:boolean;
// }

// 2-02-5
export interface IEnemyHero{
    heroId:number;
    x:number;
    y:number;
    time:number;
}

export enum FightGuideEvent{
    Next = "Next",
    // FightResonShow = "FightResonShow",
    // FightResult = "FightResult"
}
export interface IFightGuide{
    /**已经召唤了的次数 */
    sommonCount:number;
    /**初始化数据 */
    initData();
    /**清理数据 */
    clearData();
    selfId:number;//自己的id
    enemyId:number;//敌方id

    curMs:number;
    allMs:number;
    //=====================================
    curWave:number;
    /**召唤英雄 */
    clientFresh();
    /**合成英雄 */
    // clientHeroUpgrade(uid:number);
    // updateMoney(str:string);
    /**敌方货币 */
    enemyMoney:stCellValue[];
    // setMoney(arr);
    createSelfHero(str:string);
    enemyHeros:IEnemyHero[];
    /**查看英雄 */
    // clientWatchHero(uid:number);
    // addHero(hero:stElement);
    // createHero(str:string,playerId:number,type:EHeroClone);
    curWaveSec:number;
    //=====================================
}
export class FightGuide extends Laya.EventDispatcher implements IFightGuide {
    /**已经召唤了的次数 */
    sommonCount:number;
    enemyMoney:stCellValue[];
    enemyHeros:IEnemyHero[] = [];
    enemyId:number;//敌方id
    selfId:number;//自己的id
    /**引导已经执行了的毫秒数 */
    curMs:number = 0;
    allMs:number = 0;
    //====================================================
    private fightStopMgr:FightStopMgr;// = new FightStopMgr();
    private proxy:t_Tasks_Guide;
    // private _ttUploadList:number[] = [];
    private _lock:boolean = false;
    /**英雄的品质伤害 */
    // private _hurtQua: number[] = [];
    // private _stopList:StopGuideVo[] = [];
    private ai:HeroAi = new HeroAi();
    private static _ins: FightGuide;
    static get Ins() {
        if (!this._ins) {
            this._ins = new FightGuide();
        }
        return this._ins;
    }
    private _cfgData:FightGuideData = new FightGuideData();

    // private _monsterTempCfg:Configs.t_Monster_Template_dat;
    private _brithInfoList:ClientMonsterBirthVo[] = [];//怪物出生信息
    get brithInfoList(){
        return this._brithInfoList;
    }
    // private _speed:number;
    private get delayMs():number{
        return 1000;//1000;//1000;
    }
    /**波次数据 */
    private waveList:FightGuideWaveVo[] = [];
    // private waveMax:number;
    curWave:number;//当前的波次值
    private _ownerHerosPool:stElement[] = [];//英雄卡池
    /**每次召唤的价格*/
    // private sommonOffsetPrice:number;
    private sommonNeedVal:number;

    /**当前的波次时间 */
    get curWaveSec(){
        let o = this.waveList.find(cell=>cell.wave == this.curWave);
        if(o){
            return o.sec;
        }
        return this.waveList[this.waveList.length-1].sec;
    }
    private updateSommonHeroCost(){
        let revc = new SommonHeroCost_revc();
        revc.moneyInfo = ItemViewFactory.convertCellList(`${this._cfgData.sommonPriceItemId}-${this.sommonNeedVal}`);
        this.sommonNeedVal += this._cfgData.sommonOffsetPrice;
        this.model.onSommonHeroCost(revc);
    }

    createSelfHero(str:string){
        return FightGuideUtils.createHeroVo(str,this.selfId);
    }

    /**清理战斗引导数据 */
    clearData(){
        if(this.proxy){
            this.proxy.dispose();
            this.proxy = null;
        }
        if(this.ai){
            this.ai.exit();
            this.ai = null;
        }
        if(this.fightStopMgr){
            this.fightStopMgr.dispose();
            this.fightStopMgr = null;
        }
        GuideUtils.guidestart = null;
        // GuideModel.Ins.off(EGuideEvent.ThinkdataUploadTa,this,this.onThinkdataUpload);
        E.EventMgr.off(EventID.ButtonDisable,this,this.onButtonDisable);
        this.off(FightGuideEvent.Next,this,this.onNext);

        this.enemyId = 0;
        this.selfId = 0;
        // this.model.curAdapter = this.model.fightAdapter;
        this.model.resetFightAdapter();
        // ButtonCtl.useDelay = false;
        this._brithInfoList = [];
    }
    /** clone一个怪物数据*/
    private cloneMonsterData(monster:stMonsterBirth){
        let _new = new stMonsterBirth();
        _new.blood = monster.blood;
        _new.curBlood = monster.curBlood;
        _new.disappearTime = monster.disappearTime;
        _new.fid = monster.fid;
        _new.index = monster.index;
        _new.playerId = monster.playerId;
        _new.time = monster.time;
        _new.uid = monster.uid;
        return _new;
    }
    
    private onNext(){
        this.next(GuideModel.Ins.taskId + 1);
    }
    private onButtonDisable(){
        E.ViewMgr.ShowMidError(E.getLang("guidetips"));
    }
    // private onThinkdataUpload(id:number){
    //     if(this._ttUploadList.indexOf(id)==-1){
    //         this._ttUploadList.push(id);
    //         E.sendTrack(`new_player_guide_${id}`);
    //     }
    // }

    // private getFightCardIds(){
        // let cardIds:number[] = [];
        // let list1:Configs.t_Tasks_Guide_dat[] = this.List;
        // let realCards:number[] = [];
        // //前置占位
        // this.addCard(cardIds,EFightGuide.PreEmptyCardId);
        // for(let i = 0;i <list1.length;i++ ){
        //     let cfg = list1[i];
        //     if(cfg.f_fight_cardId > 0){
        //         // cardIds.push(cfg.f_fight_cardId);
        //         realCards.push(cfg.f_fight_cardId);
        //     }
        // }
        // cardIds.push(realCards.shift());
        // this.addCard(cardIds,EFightGuide.NextEmptyCardId);
        // while(realCards.length>0){
        //     cardIds.push(realCards.shift());
        // }
        // return cardIds;
        // let arr = t_FightGuideConfig.Ins.getValueById(EFightGuide.PreEmptyCardId).split("|");
        // return arr;
        // return [1,2,1003,1002,4,1001,3,5];
    // }
    /**初始化引导数据 */
    initData(){
        // this.model.clearData();
        FightGuideUtils.clearUID();
        this.proxy = new t_Tasks_Guide("t_Tasks_Guide");
        GuideModel.Ins.proxy = this.proxy;
        GuideModel.Ins.clear();
        GuideModel.Ins.taskId = 0;
        GuideUtils.guidestart = new Laya.Handler(this, this.start);
        //=====================================
        // this._ttUploadList = [];
        // GuideModel.Ins.on(EGuideEvent.ThinkdataUploadTa,this,this.onThinkdataUpload);
        // MainModel.Ins.on(EventID.ButtonDisable,this,this.onButtonDisable);
        E.EventMgr.on(EventID.ButtonDisable,this,this.onButtonDisable);

        this.on(FightGuideEvent.Next,this,this.onNext);
        // this.on(FightGuideEvent.FightResonShow,this,this.onFightResonShow);
        // this.on(FightGuideEvent.FightResult,this,this.onFightResult);
        this.fightStopMgr = new FightStopMgr();
        this.fightStopMgr.init("t_FightGuideStop");
        this.ai.init(t_FightGuideConfig.Ins.getValueById(EFightGuide.HerosHurtAi));
        this._cfgData.init();
        // this.model.curAdapter = this.model.fightAdapterGuide;
        this.model.setOldPvpFightAdapter();
        this._lock = false;
        this.curWave = 1;//0;//1;//波次初始化
        this.curMs = 0;
        // ButtonCtl.useDelay = true;
        this._brithInfoList = [];

        this.selfId = MainModel.Ins.mRoleData.AccountId;
        this.enemyId = this.selfId + 1;
        //=================================================================
        //初始化功能卡
        // let _cartRevc = new FCardInnerInit_revc();
        // _cartRevc.cards = [];
        // // let arr: string[] = t_FightGuideConfig.Ins.getValueById(EFightGuide.FuncCards).split("|");
        // let _cards:string[] = this.getFightCardIds();
        // for (let i = 0; i < _cards.length;i++){
        //     let cardId:number = parseInt(_cards[i]);
        //     let o = new stFCardInner();
        //     o.fCardId = cardId;
        //     o.pos = i;
        //     o.serialNum = i + 1;
        //     o.used = 0;
        //     _cartRevc.cards.push(o);
        // }
        // this.model.onFCardInnerInit(_cartRevc);
        FightGuideUtils.createCards(t_FightGuideConfig.Ins.getValueById(EFightGuide.PreEmptyCardId));
        //==================================================================
        //初始化己方货币
        FightGuideUtils.setMoney(ItemViewFactory.convertCellList(t_FightGuideConfig.Ins.getValueById(EFightGuide.SelfMoney)));

        //==================================================================
        this.enemyMoney = ItemViewFactory.convertCellList(t_FightGuideConfig.Ins.getValueById(EFightGuide.EnemyMoney));

        // 初始化强化数据
        let _strength_revc = new StrengthenList_revc();
        _strength_revc.datalist = [];
        for(let i = 0;i < 4;i++){
            let cell = new stStrengthenItem();
            cell.pos = i;
            cell.level = 1;
            _strength_revc.datalist.push(cell);
        }
        this.model.onStrengthenList(_strength_revc);
        //==================================================================
        //英雄伤害数组
        // let hurtArr: string[] = t_FightGuideConfig.Ins.getValueById(EFightGuide.HurtQua).split("|");
        // this._hurtQua = [];
        // for (let i = 0; i < hurtArr.length; i++) {
        //     this._hurtQua.push(parseInt(hurtArr[i]));
        // }
        //==================================================================
        //英雄卡池
        //3-02-1|2-01-1|3-02-2|1-00-1|3-02-3|5-12-1
        let heroArr:string[] = t_FightGuideConfig.Ins.getValueById(EFightGuide.HeroCards).split("|");
        this._ownerHerosPool = [];
        for(let i = 0;i < heroArr.length;i++){
            let a = heroArr[i];
            this._ownerHerosPool.push(this.createSelfHero(a));
        }
        //==================================================================
        //波次数据

        this.waveList = FightGuideUtils.createWaves(this._cfgData.wave);
        // let wave: string[] = this._cfgData.wave.split("|");
        //时间(秒)-怪物id-怪物血量-怪物数量
        // for(let i = 0;i < wave.length;i++){
        //     let o = wave[i].split("-");
        //     let cell: FightGuideWaveVo = new FightGuideWaveVo();
        //     cell.wave = i + 1;
        //     cell.sec = parseInt(o[0]);
        //     cell.monsterId = parseInt(o[1]);

        //     let bloodVal:number = this.model.fightTypeAdaper.monsterCfg.getMonsterAttrVal(cell.monsterId,ETowerAttr.BloodVal);//当前的血量值

        //     cell.maxBlood = bloodVal;//parseInt(o[2]);
        //     cell.monsterCount = parseInt(o[2]);
        //     // cell.gapTime = parseInt(o[3]);
        //     this.waveList.push(cell);
        // }
        
        this.allMs = this.allSec * 1000;
        // this.waveMax = this.waveList.length;
        //==================================================================
        //初始化召唤价格
        // let sommon:string[] = t_FightGuideConfig.Ins.getValueById(EFightGuide.SommonMoney).split("-");
        // this.sommonOffsetPrice = parseInt(sommon[1]);
        this.sommonNeedVal = this._cfgData.sommonPriceInitVal;//parseInt(sommon[0]);
        this.updateSommonHeroCost();
        //==================================================================
        //敌方英雄
        // 2-02-5
        this.enemyHeros = [];
        let _enemyHerosArr = t_FightGuideConfig.Ins.getValueById(EFightGuide.EnemyHeros).split("|");
        for(let i = 0;i < _enemyHerosArr.length;i++){
            let s1 = _enemyHerosArr[i];
            let sArr = s1.split("-");
            let _eHero = {} as IEnemyHero;
            _eHero.heroId = parseInt(sArr[0]);
            _eHero.x =  parseInt(sArr[1][0]);
            _eHero.y =  parseInt(sArr[1][1]);
            _eHero.time = parseInt(sArr[2]);
            this.enemyHeros.push(_eHero);
        }
        //初始化房间信息==================================================================
       FightGuideUtils.createRoomInfo(this.selfId,this.enemyId,EFightMode.PVP);

        //初始场景中的英雄和怪物数据======================================
        // this.initSceneData();
        // this.start();
        this.stop();
        if(debug){
            new FightGuideDebug(this as any);
        }
    }

    private get model(){
        return ComposeModel.Ins;
    }
    private _tempTimeMs:number = 0;
    /**
     * 引导时钟[引导进行执行的时间(毫秒)] 除去引导stop下的记时时间
     */
    // private _guideMs:number = 0;
    // private _walkTimeMs:number = 0;
    /**获取本波的当前的剩余时间 */
    private getSubTime(){
        let waves = this.waveList;
        let cur = waves.find(o => o.wave == this.curWave);
        if (cur) {
            let a: number = 0;;
            for (let i = 0; i < waves.length; i++) {
                let o = waves[i];
                if (o.wave < this.curWave) {
                    a += o.sec * 1000;
                }
            }
            let n = cur.sec * 1000 - (this.curMs - a);
            return n;
        }
        return 0;
    }

    /**波次总时间 */
    private get allSec(){
        let waves = this.waveList;
        let a:number = 0;;
        for(let i = 0;i < waves.length;i++){
            let o = waves[i];
            a+=o.sec;
        }
        return a;
    }

    /**创建所有的阵营的怪物 */
    private createAllWaveMonster(){
        this.createBrithMonster(this.selfId);

        if (Laya.Utils.getQueryString("disableenemy")) return;
        
        this.createBrithMonster(this.enemyId);
    }

    /**敌方英雄创建 */
    private enemyHeroCreate() {
        let _list = this.enemyHeros;
        let results:IEnemyHero[] = [];
        for(let i = 0;i < _list.length;i++){
            let o = _list[i];
            if(Math.floor(o.time/1000) == Math.floor(this.curMs/1000)){
                results.push(o);
            }
        }
        while(results.length){
            let fEnemyHero = results.shift();
            let _hero = new stElement();
            _hero.fid = fEnemyHero.heroId;
            _hero.x = fEnemyHero.x;
            _hero.y = fEnemyHero.y;
            _hero.playerId = this.enemyId;
            _hero.uid = 10000+FightGuideUtils.createMonsterUID();
            _hero.num = 1;
            FightGuideUtils.addHero(_hero);
        }
    }

    /**战斗结算 */
    private fightEnd(_isWin:number = 1,type:EFightReson) {
        let _result = new FightResult_revc();
        _result.mode = EFightMode.PVP;
        _result.type = type;
        _result.datalist = [];

        let _self = new stFightResult();
        _self.playerId = this.selfId;
        _self.itemList = ItemViewFactory.convertCellList(System_RefreshTimeProxy.Ins.getVal(ESystemRefreshTime.GUIDE_ITEM));
        _self.boxIds = [parseInt(System_RefreshTimeProxy.Ins.getVal(ESystemRefreshTime.GUIDE_CHEST))];
        _self.trophy = parseInt(System_RefreshTimeProxy.Ins.getVal(ESystemRefreshTime.GUIDE_TROPHY));
        _self.win = _isWin;
        _self.boxPos = _self.boxIds.length;
        _result.datalist.push(_self);

        let _enemy = new stFightResult();
        _enemy.playerId = this.enemyId;
        _enemy.itemList = [];
        _enemy.trophy = 0;//parseInt(t_FightGuideConfig.Ins.getValueById(EFightGuide.EnemyTrophy));
        _enemy.boxIds = [];
        _enemy.win = -_isWin;
        _result.datalist.push(_enemy);
        //============================================================
        MainModel.Ins.finishGuideReward();
        //============================================================
        this.model.onFightResult(_result);
        // this.onNext();

        //======================================================================
        //容错处理 跳转到 74-title1
        //taskid 5 index 1的时候调用             FightGuide.Ins.finish(); 触发bug
        //解决方案 直接跳转到指定的引导
        let cfg;
        if(this.proxy){
            cfg = this.proxy.getIdByUI(EViewType.FightResonView);
        }
        if (cfg) {
            this.next(cfg.f_TaskID);
        } else {
            GuideModel.Ins.removeYD();
        }
        //======================================================================
    }

    private next(taskId:number){
        this.stop();
        //继续下一个引导
        GuideModel.Ins.startTaskId(taskId);
        MainModel.Ins.event(TowerMainEvent.MainViewLayerChange);
    }

    /**更新波次和时间 */
    private updateWaveTime(){
        let _waveResult: IFightGuideWaveUpdate = {} as IFightGuideWaveUpdate;
        _waveResult.wave = this.curWave;
        _waveResult.sub = this.getSubTime();
        if (_waveResult.sub < 0) {
            //倒计时结束
            this.curWave++;
            this.createAllWaveMonster();
        }
        if(_waveResult.sub >= 0){
            this.model.event(ComposeEvent.FightGuideWaveUpdate,_waveResult);
        }
    }

    private finish(){
        this.stop();//波次结束
        this._lock = true;
        // E.ViewMgr.ShowMsgBox(EMsgBoxType.OnlyOk,`引导结束`);
        this.fightEnd(1,EFightReson.KillMBoss);
    }

    /**帧循环 */
    private onLoop(){
        if(this.curMs == 0){
            this.createAllWaveMonster();//初始化第一波怪物
        }
        this.curMs+=Laya.timer.delta;

        if(this.curMs >= this.allMs){
            this.finish();
            return;
        }

        this._tempTimeMs += Laya.timer.delta;

        if(!this.model.fightView){
            return;
        }
        if(!this.model.sceneInfo){
            return;
        }
        //this.walkUpdate();
        this.ai.checkAi(this.selfId,this._brithInfoList);
        this.updateWaveTime();
        if (this._tempTimeMs > this.delayMs) {

            //this.curMs+=this.delayMs;
            //波次更新===================================================================
            //this.updateWaveTime();
            //===========================================================================
            //敌方创建英雄
            this.enemyHeroCreate();
            //===========================================================================
            if(this.fightStopMgr && this.fightStopMgr.check(this.curMs)){
                this.onNext();
                return;
            }
            //===============================================================
            this._tempTimeMs = 0;

            this.walkUpdate();
            //===============================================================
            //英雄攻击AI
        }
    }

    /**行走同步更新 */
    private walkUpdate(){
        // let ml = FightUtils.curMoveList;
        // let fullVal:number = (ml.length - 1) * FightValueConfig.DEV_COUNT;//一圈的值

        // let monsters:stMonsterBirth[] = this.model.sceneInfo.monsters;//怪物信息
        // let _walkList:stMonsterWalk[] = [];
        
        // for(let i = 0;i < monsters.length;i++){
        //     let _monsterBrith:stMonsterBirth = monsters[i];

        //     let fvo = this._brithInfoList.find(o=>o.uid == _monsterBrith.uid);

        //     let _curTime:number = this.curMs;//TimeUtil.serverTimeMS;

        //     if(fvo){
        //         if(fvo.birthTime > _curTime){
        //             // LogSys.Log(`${JSON.stringify(fvo)}--->${fvo.birthTime - _curTime}毫秒后出生`);
        //         } else {
        //             let walkVo = new stMonsterWalk();

        //             // let _monsterCfg = t_Monster.Ins.getCfgMonsterid(_monsterBrith.fid);
        //             // let _monsterTempCfg = t_Monster_Template.Ins.getMonsterTemplate(_monsterCfg.f_monster_template_id);
        //             // let _speed:number = parseInt(_monsterTempCfg.f_10003.split(":")[1]);

        //             let _speed:number = this.model.fightTypeAdaper.monsterCfg.getTempSpeed(_monsterBrith.fid);

        //             //偏移
        //             let offset: number = Math.ceil(((_curTime - fvo.birthTime) / _speed) * FightValueConfig.DEV_COUNT);//多少毫秒移动1个最小单位格
                    
        //             let v:number = offset % fullVal;
        //             let index = _monsterBrith.index + v;
        //             // if (index >= fullVal) {
        //             //     if(debug && _monsterBrith.uid == 1){
        //             //         LogSys.Log(`重置坐标 uid:${_monsterBrith.uid}`);
        //             //     }
        //             //     index = 0;
        //             //     _monsterBrith.index = 0;
        //             // }
        //             // _monsterBrith.index = index;

        //             walkVo.index = index;
        //             walkVo.uid = _monsterBrith.uid;

        //             walkVo.time = _speed;
        //             _walkList.push(walkVo);
        //         }
        //     }else{
        //         LogSys.Error(`walkUpdate not found :${_monsterBrith.uid}`);
        //     }
        // }
        // if(_walkList.length > 0){
        //     let walkRevc = new MonsterWalk_revc();
        //     walkRevc.datalist = _walkList;
        //     this.model.onMonsterWalk(walkRevc);
        // }
        this.model.walkUpdate(this.curMs,this._brithInfoList)
    }
    // get debug(){
    // return MainModel.Ins['isInsideFight'] && debug;
    // }
    /**开始帧循环 */
    start(){
        if(this._lock){
            LogSys.Warn(`波次倒计时已经结束`);
            return;
        }

        // this.model.monsterCreateTimeMgr.start();
        ButtonCtl.disable = true;
        Laya.timer.frameLoop(1,this,this.onLoop);
        this.model.event(ComposeEvent.Play);
    }

    /**停止帧循环 */
    stop(){
        ButtonCtl.disable = false;
        // this.model.monsterCreateTimeMgr.stop();
        Laya.timer.clear(this,this.onLoop);
        this.model.event(ComposeEvent.Pause);
    }

   

    // /**添加英雄 */
    // addHero(cell:stElement){
    //     let vo = new ComposeUpdate_revc();
    //     vo.datalist = [];
    //     vo.dellist = [];
    //     vo.datalist.push(cell);
    //     this.model.onComposeUpdate(vo);
    // }
    /**召唤英雄 */
    clientFresh(){
        // if(this._ownerHerosPool.length > 0){
        //     let o = this._ownerHerosPool.shift();
        //     FightGuideUtils.updateMoney(`${ECellType.FIGHT_MONEY}-${this.model.getCost(ECellType.FIGHT_MONEY)}`);
        //     this.updateSommonHeroCost();
        //     FightGuideUtils.addHero(o);
        //     this.model.showEpic(o.fid);
        // }else{
        //     LogSys.Warn(`英雄池子没有英雄了!`);
        // }
        FightGuideUtils.clientFresh(this._ownerHerosPool,this,this.updateSommonHeroCost);
    }

    // /**合成 */
    // clientHeroUpgrade(uid:number){
    //     let vo1 = this.model.refreshList.find(o => o.uid == uid);
    //     if (vo1) {
    //         let vo = new ComposeUpdate_revc();
    //         vo.datalist = [];
    //         vo.dellist = [vo1.uid];

    //         //合成结果 召唤的英雄id--->fid-xy-num-uid  7-02-1-5
    //         let str = "7-02-1-5";
    //         // t_FightGuideConfig.Ins.getValueById(EFightGuide.HeroUpgrade)
    //         let hero = this.createSelfHero(str);
    //         vo.datalist.push(hero);
    //         this.model.onComposeUpdate(vo);
    //     }
    // }

    /**添加怪物出生信息 */
    // private addMonsterBirth(uid:number,_birthTime:number,curBlood:number){
    //     let vo =  this._brithInfoList.find(o=>o.uid == uid);
    //     if(!vo){
    //         vo = new ClientMonsterBirthVo();
    //         vo.uid = uid;
    //         vo.curBlood = curBlood;
    //         this._brithInfoList.push(vo);
    //     }
    //     vo.birthTime = _birthTime;
    // }

    /**
     * 波次怪物的创建
     * @param wave 波次 从1开始
    */
    private createBrithMonster(playerId:number){
        // if(!this.model.sceneInfo){
        //     LogSys.Error(`sceneInfo已经被销毁`);
        //     return;
        // }
        // // this.updateWave(wave);
        // let wave = this.curWave;
        // let revc:MonsterBirth_revc = new MonsterBirth_revc();
        // // revc.serverTime = TimeUtil.serverTimeMS/1000;
        // revc.datalist = [];
        // // let _gapTime = parseInt(t_FightGuideConfig.Ins.getValueById(EFightGuide.BirthMonsterMS));
        // let waveVo = this.waveList.find(o=>o.wave == wave);
        // if(!waveVo){
        //     LogSys.Error(`波次数异常`);
        //     return;
        // }
        // for (let i = 0; i < waveVo.monsterCount; i++) {
        //     let maxBlood = waveVo.maxBlood;
        //     let cell = new stMonsterBirth();
        //     cell.fid = waveVo.monsterId;
        //     cell.playerId = playerId;
        //     cell.curBlood = maxBlood;
        //     cell.blood = maxBlood;

        //     // let _monsterCfg = t_Monster.Ins.getCfgMonsterid(waveVo.monsterId);
        //     // let _monsterTempCfg = t_Monster_Template.Ins.getMonsterTemplate(_monsterCfg.f_monster_template_id);
        //     // let _speed:number = parseInt(_monsterTempCfg.f_10003.split(":")[1]);
            
        //     let _speed:number = this.model.fightTypeAdaper.monsterCfg.getTempSpeed(waveVo.monsterId);

        //     cell.time = i * _speed;
        //     cell.index = 0;
        //     cell.uid = this.createMonsterUID();
        //     FightGuideUtils.addMonsterBirth(this._brithInfoList,cell.uid, this.curMs + cell.time, maxBlood);
        //     revc.datalist.push(cell);
        // }
        // this.model.sceneInfo.monsters = this.model.sceneInfo.monsters.concat(revc.datalist);
        // this.model.onMonsterBirth(revc);

        FightGuideUtils.createBirthMonster(this.curMs,playerId,this.curWave,this._brithInfoList,this.waveList);
    }

    // /**查看英雄 */
    // clientWatchHero(uid:number){
    //     let revc = new WatchHero_revc();
    //     revc.lv = 1;
    //     revc.datalist = [];
    //     revc.uid = uid;
    //     this.model.onWatchHero(revc);
    // }
}