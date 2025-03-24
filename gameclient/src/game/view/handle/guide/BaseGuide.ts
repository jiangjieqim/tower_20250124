import { EViewType } from "../../../common/defines/EnumDefine";
import { E } from "../../../G";
import { FightResult_revc, stCellValue, stElement, stFightResult } from "../../../network/protocols/BaseProto";
import { ComposeEvent } from "../compose/ComposeEvent";
import { ComposeModel } from "../compose/ComposeModel";
import { FightGuideDebug } from "../compose/views/debug/FightGuideDebug";
import { HeroCirleYellow } from "../compose/views/HeroCirleYellow";
import { ClientMonsterBirthVo, EFightMode } from "../compose/vos/EFightEnum";
import { ItemViewFactory } from "../main/model/ItemViewFactory";
import { MainModel } from "../main/model/MainModel";
import { VoUtils } from "../main/model/VoUtils";
import { TowerMainEvent } from "../towertmain/model/TowerMainEvent";
import { FightGuideWaveVo } from "./FightGuide";
import { FightGuideUtils } from "./FightGuideUtils";
import { IGuideFightResult } from "./guideaction/actionMgr";
import { EGuideEvent, GuideModel } from "./GuideModel";
import { GuideUtils } from "./GuideUtils";
import { HeroAi } from "./HeroAi";
import { IPveGuideData } from "./PveGuideData";

/**引导基类 */
export abstract class BaseGuide {
    allMs:number;
    enemyMoney: stCellValue[] = [];//敌方货币
    curData:IPveGuideData;
    protected ai:HeroAi = new HeroAi();//英雄AI
    // protected proxy: t_Tasks_Guide;//当前的引导配置
    protected waveList: FightGuideWaveVo[] = [];
    private _brithInfoList: ClientMonsterBirthVo[] = [];//怪物出生信息
    private _tempTimeMs:number;
    selfId: number;//自己的id
    enemyId: number;//敌方id
    curMs: number;//当前已经执行了的毫秒数
    ownerHerosPool: stElement[] = [];//己方英雄卡池
    ownerGamblePool:string[] = [];//己方祈愿卡池
    ownerMythosPool:string[] = [];//己方神话卡池
    mythosHerosPool:string = "";//预览list的召唤的神话英雄id卡池
    constructor() {
        this.guideModel.on(EGuideEvent.ClearData, this, this.clearData);
    }
    protected initDebugTools(){
        if(debug){
            new FightGuideDebug(this);
        }
    }
    /**创建己方英雄卡池 */
    createHeroPool(str:string) {
        let heroArr: string[] = str.split("|");
        this.ownerHerosPool = [];
        for (let i = 0; i < heroArr.length; i++) {
            let a = heroArr[i];
            if (!StringUtil.IsNullOrEmpty(a)) {
                let o = FightGuideUtils.createHeroVo(a, this.selfId)
                this.ownerHerosPool.push(o);
            }
        }
    }
    abstract clearData();
    private get guideModel(){
        return GuideModel.Ins;
    }
    protected initEvt() {
        E.EventMgr.on(EventID.ButtonDisable, this, this.onButtonDisable);
        this.guideModel.on(EGuideEvent.Wave, this, this.onWave);
        this.guideModel.on(EGuideEvent.EnemyWave, this, this.onEnemyWave);
        this.guideModel.on(EGuideEvent.GuideViewHide, this, this.onGuideViewHide);
        this.guideModel.on(EGuideEvent.GuideAddMoney, this, this.onAddMoney);
        this.guideModel.on(EGuideEvent.GuideCreateHero, this, this.onGuideCreateHero);
        this.guideModel.on(EGuideEvent.GuideCreateEnemyIdHero, this, this.onGuideCreateEnemyIdHero);
        this.guideModel.on(EGuideEvent.GuideCreateCard, this, this.onGuideCreateCard);
        this.guideModel.on(EGuideEvent.WaveDataCreate, this, this.onWaveDataCreate);
        this.guideModel.on(EGuideEvent.FrameStop, this, this.stop);
        this.guideModel.on(EGuideEvent.FrameStart, this, this.start);
        this.guideModel.on(EGuideEvent.EnemyActionMoneyGive, this, this.onEnemyActionMoneyGive);
        this.guideModel.on(EGuideEvent.GuideFightResult, this, this.onGuideFightResult);
        this.guideModel.on(EGuideEvent.CreateHeroPool, this, this.onCreateHeroPool);
        // this.guideModel.on(EGuideEvent.CreateRoom,this,this.onCreateRoom);
        this.guideModel.on(EGuideEvent.MultiplyingPower,this,this.onMultiplyingPower);
        this.guideModel.on(EGuideEvent.CreateOwnerGamblePool,this,this.onCreateOwnerGamblePool);
        this.guideModel.on(EGuideEvent.CreareOwnerMythosPool,this,this.onCreareOwnerMythosPool);
        this.guideModel.on(EGuideEvent.CreateMythosHerosPool,this,this.onCreateMythosHerosPool);
    }

    private onCreateMythosHerosPool(str:string){
            this.mythosHerosPool = str;
    }

    private onCreareOwnerMythosPool(str:string){
        this.ownerMythosPool = [];
        this.ownerMythosPool.push(str);
    }

    private onCreateOwnerGamblePool(str:string){
        this.ownerGamblePool = [];
        this.ownerGamblePool.push(str);
    }

    private onCreateHeroPool(str:string){
        this.createHeroPool(str);
    }
    private onMultiplyingPower(pow:number){
        this.power = pow;
    }

    /**引导战斗结算 */
    private onGuideFightResult(vo:IGuideFightResult){
        let _result = new FightResult_revc();
        _result.mode = EFightMode.PVP;
        _result.type = vo.type;
        _result.datalist = [];

        let _self = new stFightResult();
        _self.playerId = this.selfId;
        _self.itemList = VoUtils.convertCellList(vo.itemStr);
        _self.boxIds = [];
        _self.trophy = vo.trophy;
        _self.win = vo.isWin;
        _self.boxPos = _self.boxIds.length;
        _result.datalist.push(_self);

        let _enemy = new stFightResult();
        _enemy.playerId = this.enemyId;
        _enemy.itemList = [];
        _enemy.trophy = 0;
        _enemy.boxIds = [];
        _enemy.win = -vo.isWin;
        _result.datalist.push(_enemy);
        this.model.onFightResult(_result);
    }
    private onEnemyActionMoneyGive(param: string) {
        this.enemyMoney = ItemViewFactory.convertCellList(param);
    }
    private onGuideCreateCard(param: string) {
        FightGuideUtils.changeCards(param);
    }
    private onGuideCreateHero(param: string) {
        this.createHero(param, this.selfId);
    }
    private onAddMoney(param: string) {
        FightGuideUtils.updateMoney(param, true);
    }
    private onWaveDataCreate(s: string) {
        this.waveList = FightGuideUtils.createWaves(s);
    }
    private onGuideViewHide(viewType: EViewType) {
        let cfg = this.guideModel.curCfg;
        if (cfg) {
            this.guideModel.checkParam(cfg.f_check_param, viewType);
        }
    }
    protected get model() {
        return ComposeModel.Ins;
    }
    private onButtonDisable() {
        E.ViewMgr.ShowMidError(E.getLang("guidetips"));
    }
    protected clearEvt() {
        this.ownerHerosPool = [];
        this.ownerGamblePool = [];
        this.ownerMythosPool = [];
        this.mythosHerosPool = "";
        if(this.ai){
            this.ai.exit();
            this.ai = null;
        }
        // if (this.proxy) {
        //     this.proxy.dispose();
        //     this.proxy = null;
        // }
        // if(this.fightStopMgr){
        //     this.fightStopMgr.dispose();
        //     this.fightStopMgr = null;
        // }

        GuideUtils.guidestart = null;
        E.EventMgr.off(EventID.ButtonDisable, this, this.onButtonDisable);
        this.guideModel.off(EGuideEvent.Wave, this, this.onWave);
        this.guideModel.off(EGuideEvent.GuideViewHide, this, this.onGuideViewHide);
        this.guideModel.off(EGuideEvent.GuideAddMoney, this, this.onAddMoney);
        this.guideModel.off(EGuideEvent.GuideCreateHero, this, this.onGuideCreateHero);
        this.guideModel.off(EGuideEvent.GuideCreateCard, this, this.onGuideCreateCard);
        this.guideModel.off(EGuideEvent.WaveDataCreate, this, this.onWaveDataCreate);
        this.guideModel.off(EGuideEvent.GuideCreateEnemyIdHero, this, this.onGuideCreateEnemyIdHero);
        this.guideModel.off(EGuideEvent.FrameStop, this, this.stop);
        this.guideModel.off(EGuideEvent.EnemyWave, this, this.onEnemyWave);
        this.guideModel.off(EGuideEvent.EnemyActionMoneyGive, this, this.onEnemyActionMoneyGive);
        this.guideModel.off(EGuideEvent.FrameStart,this,this.start);
        this.guideModel.off(EGuideEvent.GuideFightResult,this,this.onGuideFightResult);
        // this.guideModel.off(EGuideEvent.CreateRoom,this,this.onCreateRoom);
        this.guideModel.off(EGuideEvent.MultiplyingPower,this,this.onMultiplyingPower);
        this.guideModel.off(EGuideEvent.CreateHeroPool, this, this.onCreateHeroPool);
        this.guideModel.off(EGuideEvent.CreateOwnerGamblePool,this,this.onCreateOwnerGamblePool);
        this.guideModel.off(EGuideEvent.CreareOwnerMythosPool,this,this.onCreareOwnerMythosPool);
        this.guideModel.off(EGuideEvent.CreateMythosHerosPool,this,this.onCreateMythosHerosPool);

        this.model.resetFightAdapter();
        this._brithInfoList = [];
    }

    /**创建房间 */
    // private onCreateRoom(obj:IGuideCreateRoom){
        // FightGuideUtils.createRoomInfo(this.selfId,this.enemyId,obj.mode,obj.lv,obj.nickName,obj.trophy,obj.headUrl);
    // }

    protected onInit(){
        this._brithInfoList = [];
        this.power = 1;
        this.curMs = 0;
        this._tempTimeMs = 0;

        this.guideModel.clear();
        GuideUtils.guidestart = new Laya.Handler(this, this.start);
        this.initEvt();
        this.ai.init("");
        this.stop();
        this.initDebugTools();
    }

    private onWave(wave: number) {
        LogSys.Log("己方波次怪物创建" + wave);
        this.creaeWave(wave,this.selfId);
    }

    private onEnemyWave(wave:number){
        LogSys.Log("敌方波次怪物创建" + wave);
        this.creaeWave(wave,this.enemyId);
    }

    private creaeWave(wave:number,playerId:number){
        FightGuideUtils.createBirthMonster(this.curMs, playerId, wave, this._brithInfoList, this.waveList);
    }

    private onGuideCreateEnemyIdHero(param: string) {
        this.createHero(param, this.enemyId);
    }

    private createHero(param: string, id: number) {
        let arr = param.split("|");
        for (let i = 0; i < arr.length; i++) {
            let s: string = arr[i];
            let _heroVo = FightGuideUtils.createHeroVo(s, id);
            FightGuideUtils.adapterHero(_heroVo);
            FightGuideUtils.addHero(_heroVo, true);
        }
    }
    /**停止帧循环 */
    protected stop() {
        ButtonCtl.disable = false;
        // this.model.monsterCreateTimeMgr.stop();
        Laya.timer.clear(this, this.onLoop);
        this.model.event(ComposeEvent.Pause);
    }
    private get delayMs():number{
        return 1000;
    }
    protected power:number = 1;
    protected onLoop() {

        let delta:number = Laya.timer.delta * this.power;

        this.curMs += delta;

        this._tempTimeMs += delta;

        if(!this.model.fightView){
            return;
        }
        if(!this.model.sceneInfo){
            return;
        }
        this.model.curAdapter.frameLoop();

        this.ai.checkAi(this.selfId,this._brithInfoList);
        // this.updateWaveTime();
        if (this._tempTimeMs > this.delayMs) {


            //波次更新===================================================================
            //this.updateWaveTime();
            //===========================================================================
            //敌方创建英雄
            //this.enemyHeroCreate();
            //===========================================================================
            if(this.curData.check(this.curMs)){
               this.onNext();
                return;
            }
            //===============================================================
            this._tempTimeMs = 0;

            this.model.walkUpdate(this.curMs,this._brithInfoList,this.power);
            //===============================================================
            //英雄攻击AI
        }
    }

    protected onNext() {
        this.next(this.guideModel.taskId + 1);
    }

    private next(taskId: number) {
        //=============================================
        if (this.model.fightView) {
            this.model.fightView.closeCirleYellow();
        }
        E.ViewMgr.Close(EViewType.CompSell);
        E.ViewMgr.Close(EViewType.TopHeroTips);
        //=============================================

        //继续下一个引导
        this.guideModel.startTaskId(taskId);
        if (this.guideModel.isWeak) {
            //弱引导不停止帧循环
            this.start();
        } else {
            this.stop();
        }

        MainModel.Ins.event(TowerMainEvent.MainViewLayerChange);
    }
    start() {
        // if(this._lock){
        // LogSys.Warn(`波次倒计时已经结束`);
        // return;
        // }

        // this.model.monsterCreateTimeMgr.start();
        if (this.guideModel.isWeak) {
            //弱引导
            ButtonCtl.disable = false;
        } else {
            ButtonCtl.disable = true;
        }
        Laya.timer.frameLoop(1, this, this.onLoop);
        this.model.event(ComposeEvent.Play);
    }
}
