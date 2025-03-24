import { E } from "../../../../G";
import { ComposeFresh_req, FCardUse_req, FightStart_req, Gamble_req, HeroUpgrade_req, RougeChoose_req, SkillActive_req, stElement, stHero, StrengthenUpdate_req, SuperHero_req, WatchHero_req } from "../../../../network/protocols/BaseProto";
import { SocketMgr } from "../../../../network/SocketMgr";
import { FightGuide, IFightGuide } from "../../guide/FightGuide";
import { MainModel } from "../../main/model/MainModel";
import { ItemProxy } from "../../main/proxy/ItemProxy";
import { ItemVo } from "../../main/vos/ItemVo";
import { TowertMainHeroModel } from "../../towertmainhero/model/TowertMainHeroModel";
import { HeroListProxy } from "../../towertmainhero/proxy/HeroProxy";
import { EComposeRefreshType } from "../ComposeConfig";
import { ComposeModel } from "../ComposeModel";
import { FightUtils } from "../FightUtils";
import { EBattle_Config, EHeroQua, EMonsterType, t_Battle_Config } from "../t_Battle_Config";
// import { t_Monster } from "../t_Monster_Template";
import { IUpdateHero } from "../vos/EFightEnum";
import { FightValueConfig } from "../vos/FightValueConfig";
import { EGambleType } from "../vos/GambleCfgVo";
import { HeroWeight } from "../vos/HeroWeight";
import { IFightMainView } from "../vos/IFightMainView";

export class ComposeHero{
    /**拥有 */
    have:boolean;
    heroId:number;
    constructor(heroId:number,have:boolean = false){
        this.heroId = heroId;
        this.have = have;
    }
}
/**可合成的神话英雄 */
export class ComposeMythosVo {
    /**神话英雄id */
    mythosHeroId: number;
    /**拥有的英雄id */
    heroIdsOut: number[];
    /**还缺少的英雄 */
    withoutHeros:number[];
    heros:ComposeHero[] = [];
    //=================================================================================
    private get model() {
        return ComposeModel.Ins;
    }
    get curHeros(){
        let l:ComposeHero[] = [];
        for(let i = 0;i < this.heroIdsOut.length;i++){
            l.push(new ComposeHero(this.heroIdsOut[i],true));
        }
        for(let i = 0;i < this.withoutHeros.length;i++){
            l.push(new ComposeHero(this.withoutHeros[i]));
        }
        return l;
    }
    /**用heroId作为键值的英雄数量 */
    private createHeroMap(){
        let _heroCountMaps = {};//英雄数量maps
        let heroList:stElement[] = this.model.refreshList;
        for(let i = 0;i < heroList.length;i++){
            let cell = heroList[i];
            if(cell.playerId == this.model.ownerPlayer.playerId){
                let cfg = HeroListProxy.Ins.getCfgById(cell.fid);
                if (!cfg.f_if_transform && cfg.f_qua == EHeroQua.Red) {
                    //神话
                }
                else{
                    //非神话
                    if (!_heroCountMaps[cell.fid]) {
                        _heroCountMaps[cell.fid] = 0;
                    }
                    _heroCountMaps[cell.fid] += cell.num;
                }

            }
        }
        return _heroCountMaps;
    }
    check() {
        this.heroIdsOut = [];
        this.withoutHeros = [];
        if (this.model.ownerPlayer) {
            //=============================================================
            let cfg = HeroListProxy.Ins.getCfgById(this.mythosHeroId);
            if (!StringUtil.IsNullOrEmpty(cfg.f_synthesis)) {

                let _heroCountMaps = this.createHeroMap();
                
                let arr: string[] = cfg.f_synthesis.split("|");

                for (let i = 0; i < arr.length; i++) {
                    let __heroid: number = parseInt(arr[i]);

                    if (_heroCountMaps[__heroid] && _heroCountMaps[__heroid] > 0) {
                        _heroCountMaps[__heroid]--;
                        this.heroIdsOut.push(__heroid);
                    }else{
                        this.withoutHeros.push(__heroid);
                    }
                }
            }
        }
        this.heros = this.curHeros;
        return this.heroIdsOut.length > 0;
    }
    /**收藏中的值 */
    get collect(){
        let l = TowertMainHeroModel.Ins.getHeroList();
        if(l){
            let hero = l.find(o=>o.id == this.mythosHeroId);
            if(hero){
                return hero.collect;
            }
        }
        return -1;
    }
}

export enum EPVPRoundFightStatus{
    /**准备阶段 只有本阶段可以移动 售卖 交换 合成英雄 其他阶段均不可操作*/
    Ready = 1,
    /**战斗状态 */
    Fight = 2,
    /**自己准备结束 */
    SelfReadyComplete = 3,
    /**开始肉鸽选择 */
    StartSelCard = 4,
    /**结束肉鸽选择 */
    EndSelCard = 5,
}

/**通用战斗适配器 */
export class FightAdapter {
    bPvproundTime:boolean = true;

    /**可以切换英雄 */
    canSwitchHero:boolean = true;

    /**是否是引导 */
    isGuide:boolean = false;
    /**是否可以拖拽 */
    mDrag:boolean = true;
    /**是否可以使用卡牌 */
    mUseCard:boolean = true;

    /**是否使用的波次更新 */
    waveCd: boolean = true;

    bMythosShow: boolean = true;//神话立即召唤按钮
    /**是否显示售卖菜单 */
    showSell: boolean = true;

    /**是否屏蔽主动技能菜单 */
    // disableInitiativeSkill: boolean = false;

    /**主动技能按钮显示中 */
    mSkillVis:boolean = true;

    /**召唤按钮锁定样式 */
    sommonUnLockedStyle:boolean = true;

    initUseCd: boolean = true;
    /**卡牌初始化是否使用CD动画 */
    //   useCD: boolean = true;

    /**卡牌移动的动画 */
    get cardMoveTime() {
        return FightValueConfig.cardMoveTime;
    }

    protected get model() {
        return ComposeModel.Ins;
    }
    get guide() :IFightGuide{
        return FightGuide.Ins;
    }
    /**召唤英雄 */
    fresh() {
        let req = new ComposeFresh_req();
        req.type = EComposeRefreshType.Money;
        SocketMgr.Ins.SendMessageBin(req);
    }
    /**英雄合成 */
    heroUpgrade(uid: number) {
        let req = new HeroUpgrade_req();
        req.datalist = [uid];
        SocketMgr.Ins.SendMessageBin(req);
    }
    /**使用功能卡 */
    useCard(uid: number,needItem:ItemVo) {
        let req = new FCardUse_req();
        req.serialNum = uid;
        SocketMgr.Ins.SendMessageBin(req);
    }
    /**查看英雄 */
    watchHero(uid: number) {
        let req: WatchHero_req = new WatchHero_req();
        req.uid = uid;
        SocketMgr.Ins.SendMessageBin(req);
    }

    /**强化 */
    streng(pos: number) {
        let req: StrengthenUpdate_req = new StrengthenUpdate_req();
        req.pos = pos;
        SocketMgr.Ins.SendMessageBin(req);
    }
    /**移动 */
    move(uid: number, x: number, y: number) {
        this.model.moveItemToMap(uid, x, y);
    }
    /**祈愿 */
    gamble(type: EGambleType,need:number) {
        let req = new Gamble_req();
        req.flag = type;
        SocketMgr.Ins.SendMessageBin(req);
    }

    private sortMythosHandler(a:stHero,b:stHero){
        let a1 = HeroWeight.calPercent(a.id);
        let b1 = HeroWeight.calPercent(b.id);
        if(a1 > b1){
            return -1;
        }
        else if(a1 < b1){
            return 1;
        }
        return 0;
    }

    get mythos() {
        let _myThosList: stHero[] = [];
        let _heroList = TowertMainHeroModel.Ins.getHeroList();
        for (let i = 0; i < _heroList.length; i++) {
            let vo = _heroList[i];
            let cfg = HeroListProxy.Ins.getCfgById(vo.id);
            if (!cfg.f_if_transform && cfg.f_qua == EHeroQua.Red) {
                _myThosList.push(vo);
            }
        }
        _myThosList = _myThosList.sort(this.sortMythosHandler);
        return _myThosList;
    }

    /**有可能可以合成的神话英雄 */
    composeMythos(){
        //============================================================
        // if(initConfig.enable_mythor_heros){
        //     let arr = initConfig.enable_mythor_heros.split("|");
        //     let outList:ComposeMythosVo[] = [];
        //     for(let i = 0;i < arr.length;i++){
        //         let cell = new ComposeMythosVo();
        //         cell.mythosHeroId = parseInt(arr[i]);
        //         cell.check();
        //         outList.push(cell);
        //     }
        //     return outList;
        // }
        //============================================================

        let outList:ComposeMythosVo[] = [];
        let _heroList = TowertMainHeroModel.Ins.getHeroList();
        for (let i = 0; i < _heroList.length; i++) {
            let vo = _heroList[i];
            let cfg = HeroListProxy.Ins.getCfgById(vo.id);
            if (!cfg.f_if_transform && cfg.f_qua == EHeroQua.Red) {
                let pvo = new ComposeMythosVo();
                pvo.mythosHeroId = vo.id;
                if(pvo.check()){
                    outList.push(pvo);
                }
            }
        }
        return outList;
    }

    /**召唤神话英雄 */
    summonHero(heroId: number) {
        let req: SuperHero_req = new SuperHero_req();
        req.heroId = heroId;
        SocketMgr.Ins.SendMessageBin(req);
    }
    clientHeroMove(fightView: IFightMainView, uid: number, x: number, y: number) {
        // if(this.model.fightTypeAdaper.disableDrag){
        //     return;
        // }
        // let fightView:FightMainView = this.model.fightView;
        let _grid = fightView.gridItemList.find(o => o.uid == uid);
        if (_grid) {
            let st = FightUtils.cloneStElement(_grid.data);
            st.x = x;
            st.y = y;

            let o: IUpdateHero = {} as IUpdateHero;
            o.vo = st;
            fightView.onHeroUpdate(o);
        }
    }

    /**战斗准备结束 */
    readyComplete(){
        // if(Laya.Utils.getQueryString("notstartreq")){
        //     return;       
        // }
        let req = new FightStart_req();
        SocketMgr.Ins.SendMessageBin(req);
    }

    /**当前的时钟时间 */
    get clockTimeMs(){
        return TimeUtil.serverTimeMS;
    }
    /**当前波次 */
    get wave(){
        return this.model.wave;
    }

    /**
     * @param st 
     * @param tips default is false
     */
    isItemEnoughSt(st:string,tips:boolean=false){
        let itemid = parseInt(st.split("-")[0]);
        let count = parseInt(st.split("-")[1]);
        let have = MainModel.Ins.mRoleData.getVal(itemid);
        let _status:boolean = false;
        if(have >= count){
            _status = true;
        }
        if(!_status && tips){
            let itemCfg:Configs.t_Item_dat = ItemProxy.Ins.getCfg(itemid);
            let str:string = E.getLang("itemnotenough",itemCfg.f_name);
            E.ViewMgr.ShowMidError(str);
        }
        return _status;
    }

    /**使用主动技能 */
    useMainSkill(uid:number){
        let req = new SkillActive_req();
        req.uid = uid;
        SocketMgr.Ins.SendMessageBin(req);
    }
    
    /**怪物的波次时间 */
    getDisappearTime(monsterId:number){
        let configId:number = EBattle_Config.TenBossSec;//39;
        if(this.model.fightTypeAdaper.monsterCfg.getCfgMonsterid(monsterId).f_monster_type == EMonsterType.LimitTimeBoss){
            configId = EBattle_Config.KILLBOSS_MAX_TIME;//28;
        }
        return parseInt(t_Battle_Config.Ins.getValueById(configId));
    }
    init(){

    }

    /**交换英雄 */
    switchHero(uid1:number,uid2:number,x1,y1,x2,y2){
        if(this.model.fightView){
            this.model.fightView.switchHero(uid1,uid2);
        }
        return false;
    }

    frameLoop(){

    }

    reset(){
        
    }

    /**肉鸽选择弹出 */
    rougeSel(id:number){
        let req = new RougeChoose_req();
        req.fid = id;
        SocketMgr.Ins.SendMessageBin(req);
    }

    get haveItemCanUse(){
        return this.model.bSommonEnough || this.model.bGambleHaveOneEnough;
    }
    protected _haveItemCanUse:boolean;
    set haveItemCanUse(v:boolean){
        this.haveItemCanUse = v;
    }
}