import { EViewType } from "../../../../common/defines/EnumDefine";
import { E } from "../../../../G";
import { RougeChoose_revc, RougeList_revc } from "../../../../network/protocols/BaseProto";
import { BaseCfg } from "../../../../static/json/data/BaseCfg";
import { PlayerVoFactory } from "../../main/vos/PlayerVoFactory";
import { HeroListProxy } from "../../towertmainhero/proxy/HeroProxy";
import { ComposeModel } from "../ComposeModel";
import { EBattle_Config, EHeroQua, t_Battle_Config } from "../t_Battle_Config";
import { It_MonsterCfg } from "../t_Monster_Template";
import { IFightHead } from "../views/cells/FightHead";
import { EFightMode } from "../vos/EFightEnum";
import { GambleCfgVo, EGambleType } from "../vos/GambleCfgVo";
import { IBattleTaskCfg } from "../vos/t_Battle_Task";
import { IEnemy_WaveCfg } from "../vos/t_Enemy_Wave";
import { EPVPRoundFightStatus } from "./FightAdapter";
/**战斗样式 */
export class t_FightStyle extends BaseCfg{
    static NAME:string = "t_FightStyle";
    public GetTabelName(): string {
        return t_FightStyle.NAME;
    }
}

/**战斗类型适配器 */
export abstract class IFightTypeAdapter{
    private _gambleVoList:GambleCfgVo[];//赌博配置
    initGambleVos(){
        this._gambleVoList = [];
        let id = this.cfg.f_gambleid;
        this._gambleVoList.push(new GambleCfgVo(id,EGambleType.Blue));
        this._gambleVoList.push(new GambleCfgVo(id+1,EGambleType.Purple));
        this._gambleVoList.push(new GambleCfgVo(id+2,EGambleType.Red));
    }

    get gambleVoList():GambleCfgVo[]{
        if(!this._gambleVoList){
            this.initGambleVos();
        }
        return this._gambleVoList;
    }
    cfg:Configs.t_FightStyle_dat;
    /**pvp 回合制战斗的状态 */
    pvpRoundStatus:EPVPRoundFightStatus = EPVPRoundFightStatus.Fight;
    /**对方的像素偏移 */
    // topOffsetY: number;
    /**怪物预警检测数量 */
    checkCount:number;
    /**背景 */
    bg: string;
    /**战斗舞台坐标 */
    fightViewY: number;
    /**居中的偏移值 */
    // centerOffsetY: number;
    /**进入场景战斗特效 */
    vs: string;
    /*格子偏移 */
    // offsetIsoY:number;

    readonly defaultOffsetY:number = 5;

    get offset_ISO_Y() {
        return this.defaultOffsetY - this.cfg.f_top;
    }
    private _maxCardCount: number;
    /**显示最大的卡牌数量 */
    get maxCardCount(): number {
        return this._maxCardCount;
    }
    /**怪物配置 */
    monsterCfg: It_MonsterCfg;
    /**战斗模式 */
    mode: EFightMode;
    waveCfg: IEnemy_WaveCfg;
    /**局内任务 */
    battleTask:IBattleTaskCfg;
    /**卡牌界面背景 */
    cardBG:string;
    /**是否显示聊天小入口 */
    bChat:boolean;
    /**主界面预览按钮 */
    bPre:boolean;
    //=======================================================
    /**创建战斗中的顶部界面 */
    abstract createFightTop(): IFightHead;

    /**局内任务标题 */
    abstract taskTitle:string;

    /**刷新 */
    refresh(){
        this.initGambleVos();
    }

    /**创建VS界面 */
    abstract createVsSkin();

    protected get model(){
        return ComposeModel.Ins;
    }

    /**是否禁用英雄拖拽 */
    get disableDrag(): boolean {
        return false;
    }
    /**禁用操作状态 */
    get disableOperate(){
        return false;
    }

    /**是否显示合成按钮 */
    bComposeBtnShow(cfg: Configs.t_Hero_dat) {
        if (cfg.f_qua == EHeroQua.Orange) {
            return false;
        }else {
            if (this.disableOperate) {
                return false;
            }
            return true;
        }
    }
    /**是否显示售卖按钮 */
    get bSellBtnShow(){
        if(this.model.curAdapter.showSell){
            if (this.disableOperate) {
                return false;
            }
            return true;
        }
        return false;
    }

    /**祈愿退出 */
    gambleExit() {
        E.ViewMgr.Open(EViewType.FuncCard2);
    }

    /**祈愿打开 */
    gambleOpen() {
        E.ViewMgr.Close(EViewType.FuncCard2);
        E.ViewMgr.Open(EViewType.Gamble);
    }

    /*打开战斗界面*/
    fightEnter() {
        this.model.composeViewOnShow();
    }

    /**主界面是否显示神话按钮列表 */
    get disableShowMythos(){
        return this.cfg.f_disable_mythos == 1;
    }
    /**肉鸽打开 */
    onRougeOpen(revc:RougeList_revc){

    }
    /**肉鸽选择 */
    onRougeSelect(revc:RougeChoose_revc){

    }

    /**肉鸽状态变化 */
    onPvpRoundStatusChange(){

    }
    private getWhiteCost() {
        // 出售价格=（fid_2配置+（召唤次数*f_id=3配置））*第f_id=4配置/10000  最终结果向下取整
        let v2 = parseInt(t_Battle_Config.Ins.getValueById(2).split("-")[1]);
        let itemId: number = parseInt(t_Battle_Config.Ins.getValueById(2).split("-")[0]);
        let v3 = parseInt(t_Battle_Config.Ins.getValueById(3).split("-")[1]);
        let v4 = parseInt(t_Battle_Config.Ins.getValueById(EBattle_Config.BLUE_WHITE_SELL)) / 10000;
        let v = Math.floor((v2 + this.model.sommonTimes * v3) * v4);
        // let s: string = t_Battle_Config.Ins.getValueById(EBattle_Config.BLUE_WHITE_SELL);
        // let v = Math.floor(this.getCost(ECellType.FIGHT_MONEY) * parseInt(s) / 10000);
        return PlayerVoFactory.str2stCellValue(`${itemId}-${v}`);
    }

    /**获取售卖英雄需要消耗多少局内金币 */
    getSellMoney(heroId: number) {
        let cfg = HeroListProxy.Ins.getCfgById(heroId);
        let id: EBattle_Config;
        switch (cfg.f_qua) {
            case EHeroQua.White:
                return this.getWhiteCost();
            case EHeroQua.Blue:
                id = EBattle_Config.BLUE_HERO_SELL;
                break;
            case EHeroQua.Purple:
                id = EBattle_Config.PURPLE_HERO_SELL;
                break;
            case EHeroQua.Orange:
                id = EBattle_Config.ORANGE_SELL;
                break;
        }
        let str: string = t_Battle_Config.Ins.getValueById(id);
        return PlayerVoFactory.str2stCellValue(str);
    }

    constructor(_mode:EFightMode){
        this.mode = _mode;
        let cfg:Configs.t_FightStyle_dat = E.tableMgr.getTable(t_FightStyle.NAME).GetDataById(_mode);
        this.cfg = cfg;
        this.monsterCfg = E.tableMgr.getTable(cfg.f_monsterCfg);
        this.waveCfg = E.tableMgr.getTable(cfg.f_waveCfg);
        this.battleTask = E.tableMgr.getTable(cfg.f_battleTask);

        // this.topOffsetY = -ComposeConfig.mapH * ComposeConfig.MapCellH * cfg.f_top;
        this.vs = cfg.f_vs;
        this.bg = cfg.f_bg;
        this.fightViewY = cfg.f_fightViewY;
        // this.offsetIsoY = cfg.f_offsetIsoY;

        // if(Laya.Utils.getQueryString("offsetIsoY")){
        //     this.offsetIsoY = parseInt(Laya.Utils.getQueryString("offsetIsoY"));
        // }
        //=============================================
        let f_checkCount = cfg.f_checkCount;
        if(f_checkCount >= 0){
            this.checkCount = parseInt(t_Battle_Config.Ins.getValueById(f_checkCount));
        }else{
            this.checkCount = f_checkCount;
        }
        //=============================================
        this._maxCardCount = cfg.f_maxCardCount;
        this.cardBG = cfg.f_cardbg;
        this.bChat = cfg.f_chat == 1;
        this.bPre = cfg.f_pre == 1;
    }
}