import { BaseModel } from "../../../../frame/util/ctl/BaseModel";
// import { StringUtil } from "../../../../frame/util/StringUtil";
import { IViewBaseUiVo } from "../../../../frame/view/ViewBase";
import { EMsgBoxType, EViewType } from "../../../common/defines/EnumDefine";
import { E } from "../../../G";
import { ELayerType } from "../../../layer/LayerMgr";
import { LoginClient } from "../../../network/clients/LoginClient";
import { BattleStatistic_revc, ComposeItem_req, ComposeMove_req, ComposeUpdate_revc, FCardInnerCD_revc, FCardInnerChange_revc, FCardInnerInit_revc, FightChat_req, FightChat_revc, FightReport_revc, FightResult_revc, FightSceneInfo_revc, FuncardDanMu_revc, FuncCardEffectUpdate_revc, FuncCardSpecialEffect_revc, GambleProb_revc, Gamble_revc, HeroActiveBtnCD_revc, HeroMove_revc, KillBoss_revc, MonsterAttack_revc, MonsterBirth_req, MonsterBirth_revc, MonsterBlood_revc, MonsterEffect_revc, MonsterNum_revc, MonsterRemove_revc, MonsterScale_revc, MonsterWalk_revc, MonsterWave_revc, PvPMatchResult_revc, PvPRoomInfo_revc, PvpTurnBasedBuffList_revc, PvpTurnBasedCountDown_revc, PvpTurnBasedHpList_revc, PvpTurnBasedHpUpdate_revc, PvpTurnBasedMonsterNum_revc, PvpTurnBasedStartFight_revc, RougeChoose_revc, RougeList_revc, SkillBar_revc, SommonBossShow_revc, SommonBoss_revc, SommonHeroCost_revc, SommonTimes_revc, stBattleBuff, stBattleStatistic, stCellValue, stElement, stFCardInner, stFuncCardEffect, stGambleProb, stHero, stMonsterBirth, stMonsterEffect, stMonsterWalk, stMove, stPlayerInRoom, stPvpTurnBasedHp, StrengthenList_revc, StrengthenUpdate_revc, stStrengthenItem, stTask, TaskList_revc, TaskUpdate_revc, WatchHero_revc, WaveCountDown_revc, WaveSettleReward_revc } from "../../../network/protocols/BaseProto";
import { SERVER_MSGID } from "../../../network/protocols/ProtoDef";
import { SocketMgr } from "../../../network/SocketMgr";
import { AssetConfig } from "../avatar/spine/AssetConfig";
import { SpineEffectMgr } from "../avatar/SpineEffectMgr";
import { FightHisView } from "../fighthis/view/FightHisView";
import { CardTipsGuide } from "../guide/CardTipsGuide";
import { FightGuide } from "../guide/FightGuide";
import { FightGuideUtils } from "../guide/FightGuideUtils";
import { FuncOpenView } from "../guide/FuncOpenView";
import { GuideHeroShow } from "../guide/GuideHeroShow";
import { GuideHitUView } from "../guide/GuideHitUView";
import { EGuideEvent, GuideModel } from "../guide/GuideModel";
import { GuideRewardView } from "../guide/GuideRewardView";
import { GuideUtils } from "../guide/GuideUtils";
import { EFunccardEffectId, EFuncCardSpecialEffect, ETemplateCardId } from "../guide/t_FightGuideConfig";
import { YinDaoView } from "../guide/YinDaoView";
import { ESystemRefreshTime } from "../main/ctl/ESystemRefreshTime";
import { System_RefreshTimeProxy } from "../main/ctl/System_RefreshTimeProxy";
import { GameEvent } from "../main/model/GameEvent";
import { MainModel } from "../main/model/MainModel";
import { ECellType } from "../main/vos/ECellType";
import { ItemVo } from "../main/vos/ItemVo";
import { TaoDaeItem } from "../taodae/view/TaoDaeItem";
import { TowerMainFightModel } from "../towertmain/model/TowerMainFightModel";
import { TowertMainCardModel } from "../towertmaincard/model/TowertMainCardModel";
import { t_Function_Card } from "../towertmaincard/proxy/t_Function_Card";
import { CardComponent, FightCardCell } from "../towertmaincard/view/item/CardComponent";
import { TowertMainHeroModel } from "../towertmainhero/model/TowertMainHeroModel";
import { HeroListProxy } from "../towertmainhero/proxy/HeroProxy";
import { FightAdapter } from "./adapter/FightAdapter";
import { FightAdapterGuide } from "./adapter/FightAdapterGuide";
import { FightPVEAdapterGuide } from "./adapter/FightPVEAdapterGuide";
import { IFightTypeAdapter } from "./adapter/FightTypeAdapter";
import { PVEFightAdapter } from "./adapter/PVEFightAdapter";
import { PVEFightHardAdapter } from "./adapter/PVEFightHardAdapter";
import { PVEFightNewYearAdapter } from "./adapter/PVEFightNewYearAdapter";
import { PvpFightAdapter } from "./adapter/PvpFightAdapter";
import { PvpRoundFightAdapter } from "./adapter/PvpRoundFightAdapter";
import { AddHeroMgr } from "./AddHeroMgr";
import { AttrAction } from "./attraction/AttrAction";
import { ComposeConfig, EComposeMoveOpt } from "./ComposeConfig";
import { ComposeEvent } from "./ComposeEvent";
import { EEffectPos } from "./decorator/EAttackPosType";
import { FightFactory } from "./FightFactory";
import { FightUtils } from "./FightUtils";
import { HeroBaseDecorator } from "./HeroBaseDecorator";
import { ComposeUpdateVo, HeroCreateMgr } from "./HeroCreateMgr";
import { IComposeModel } from "./ICompose";
import { LoopBaseDecorator } from "./LoopBaseDecorator";
import { LoopMonsterCreateMgr } from "./LoopMonsterCreateMgr";
import { PvpRoundCard, PvpRoundCardPop } from "./PvpRoundCard";
import { PvpRoundReady } from "./PvpRoundReady";
import { EBattle_Config, EHeroQua, t_Battle_Config } from "./t_Battle_Config";
import { EInnerSoundType, t_Inner_Sound } from "./t_Inner_Sound";
import { t_MonsterPvp } from "./t_Monster_Template";
// import { UpdateHeroMgr } from "./UpdateHeroMgr";
import { CardShow, ICardShow } from "./views/CardShow";
import { CardMsgView } from "./views/cells/CardMsgView";
import { PossessBuffTips } from "./views/cells/FightPossessAttrPlayerCtl";
import { FightPvpRoundCenter } from "./views/cells/FightPvpRoundHead";
import { IAvatarEffectData } from "./views/cells/GroundCellView";
import { KillBossBannerView } from "./views/cells/KillBossBannerView";
import { KillBossLimtTimeTips } from "./views/cells/KillBossLimtTimeTips";
import { TaskPopView } from "./views/cells/TaskPopView";
import { ComposeMain } from "./views/ComposeMain";
import { SpineGPU_Test } from "./views/debug/SpineGPU_Test";
import { EpicView } from "./views/EpicView";
import { ErrTips, IErrTipsVo } from "./views/ErrTips";
import { FaceChatView } from "./views/FaceChatView";
import { FightBossTips } from "./views/FightBossTips";
import { FightDebugView, wingm } from "./views/FightDebugView";
import { FightMsgHisShowView } from "./views/FightMsgHisShowView";
import { FightPossessView } from "./views/FightPossessView";
import { FightResonView } from "./views/FightResonView";
import { FightResultView } from "./views/FightResultView";
import { FightTaskView } from "./views/FightTaskView";
import { FightVsView } from "./views/FightVsView";
import { FrientFightResultView } from "./views/FrientFightResultView";
import { FuncCardShow } from "./views/FuncCardShow";
// import { FuncCardView } from "./views/FuncCardView";
import { FuncCardView2 } from "./views/FuncCardView2";
import { GambleView } from "./views/GambleView";
import { GiftView, GiftViewPop } from "./views/GiftView";
import { HeartComponent } from "./views/HeartComponent";
import { MythosView } from "./views/MythosView";
import { ProbabilityView } from "./views/ProbabilityView";
import { PveTaskGuide } from "./views/PveTaskGuide";
import { PvpRoundFightView } from "./views/PvpRoundFightView";
import { PvpRoundHeartComponent } from "./views/PvpRoundHeartComponent";
import { IPvproundResult, PvproundResult } from "./views/PvproundResult";
import { PvpRoundReward } from "./views/PvpRoundReward";
import { HeroRoundTipCell, PvpRoundTipsView } from "./views/PvpRoundTips";
import { PvpRoundView } from "./views/PvpRoundView";
import { RedTips } from "./views/RedTips";
import { RoguelikeComponent } from "./views/RoguelikeComponent";
import { TopHeroTips } from "./views/TopHeroTips";
import { WaveTipsView } from "./views/WaveTipsView";
import { CardMsgVo } from "./vos/CardMsgVo";
import { EComposeUpdateType } from "./vos/EComposeUpdateType";
import { CardUiEffectVo, ClientMonsterBirthVo, EAvatarLayar, EEffectButtonType, EEffectLoop, EEffectStatus, EEffectTarget, EFightLayer, EFightMode, EFightSceneStatus, IAddHero, IceCardStatusVo, IDelEffectCardUid, IDelHeroUpdate, IIceMapData, IPlayOnceAvatar, IUpdateHero } from "./vos/EFightEnum";
import { FightResultVo } from "./vos/FightResultVo";
import { FightTaskHeroCellVo } from "./vos/FightTaskHeroCellVo";
import { EFightMatch, EMonsterPos, FightValueConfig, SkillCdVo } from "./vos/FightValueConfig";
import { FuncCardSpecialEffectVo } from "./vos/FuncCardSpecialEffectVo";
import { CardMoveVo, EFuncCardUsed, FuncCardVo, IPlayPieResult } from "./vos/FuncCardVo";
import { GainVo } from "./vos/GainVo";
import { IGambleResult } from "./vos/GambleCfgVo";
import { HeroWeight } from "./vos/HeroWeight";
import { HistroyMsgVo } from "./vos/HistroyMsgVo";
import { IFightMainView } from "./vos/IFightMainView";
import { SupplicationVo } from "./vos/SupplicationVo";
import { t_Battle_Effect } from "./vos/t_Battle_Effect";
import { EBattleTaskStatus } from "./vos/t_Battle_Task";
import { t_HeroAddSubEffect } from "./vos/t_HeroAddSubEffect";
export enum ERoomStatus{
    /**没有房间 */
    Without = 0,
    /**有房间 */
    Has = 1
}

export interface IEffectAnimVo{
    layer:Laya.Sprite;
    curX:number;
    curY:number;
}

/**合成模块 */
export class ComposeModel extends BaseModel implements IComposeModel{
    private attrAction:AttrAction;
    //==========================================================================
    /** 当前的战斗类型适配器 Pvp模式,合作模式*/
    setFightTypeAdaper(value:IFightTypeAdapter){
        this._fightTypeAdaper = value;
        let val = -ComposeConfig.mapH * ComposeConfig.MapCellH * value.cfg.f_top;
        FightUtils.topOffsetY = val;
        FightValueConfig.fightViewY = value.fightViewY;
        value.refresh();
    }

    /**当前的战斗界面样式类型适配器 */
    get fightTypeAdaper(){
        return this._fightTypeAdaper;
    }
    private _fightTypeAdaper:IFightTypeAdapter;
    private pvpTypeAdapter:IFightTypeAdapter;//PVP战斗类型
    private pveTypeAdapter:IFightTypeAdapter;//PVE合作战斗类型
    private pvpRoundTypeAdapter:IFightTypeAdapter;//PVP回合制模式
    private pvpHardTypeAdapter:IFightTypeAdapter;//PVE困难模式战斗类型
    private pvpNewYearAdapter:IFightTypeAdapter;//春节
    //==========================================================================
    epicHeroList:number[] = [];
    /**创建怪物计时器 */
    monsterCreateTimeMgr:LoopBaseDecorator;
    heroMgr:HeroBaseDecorator;
    fightResultVo:FightResultVo;//战斗结算数据
    // delFailUids:number[] = [];//删除失败的ID
    skillCds:SkillCdVo[] = [];
    pvpRoundBuffs:stBattleBuff[] = [];//pvp回合制的buff
    //======================================================================
    private fightAdapter:FightAdapter = new FightAdapter();//普通的战斗代理
    private fightAdapterGuide:FightAdapterGuide = new FightAdapterGuide();//PVP战斗引导代理
    private fightPveAdapterGuide:FightPVEAdapterGuide = new FightPVEAdapterGuide();//PVE战斗引导代理
    // private fightPVPAdapterGuide:FightPVPAdapterGuide = new FightPVPAdapterGuide();//PVP战斗引导代理
    curAdapter:FightAdapter;//当前的战斗适配器
    //======================================================================
    gambles:stGambleProb[];
    bossWaves:number[] = [];
    popTaskIds:number[] = [];//局内任务气泡缓存
    //======================================================================
    // curIndex:number;
    curTasks:stTask[] = [];//当前的局内任务列表
    /**战斗视图是否已经加载完备 */
    // isFightOpened:boolean = false;
    // subTime:number = 0;
    // monsterStartCache:MonsterBirth_revc;
    bossMonsterId:number = 0;
    /**英雄数据 */
    refreshList:stElement[] = [];
    /**解锁的格子maps */
    // unlockMap = {};
    // unlockList:UnlockVo[] = [];
    /**上方动物,下方动物,下方格子 */
    stList:stElement[] = [];
    fightView:IFightMainView;
    /**当前的波次 */
    wave:number = 0;
    /**下次波次的时间戳 */
    nextWaveTime:number = 0;
    // private _newEmptyGridList = [];
    composeView:ComposeMain;
    /**弹幕历史记录 */
    histroyMsgList:HistroyMsgVo[] = [];
    private cardCdTime:number = 0;
    private static _ins: ComposeModel;
    // private _composeTips:ComposeTips;
    private _costList:stCellValue[];//花费
    /**场景信息 */
    sceneInfo:FightSceneInfo_revc;//场景信息
    public strengthenList:stStrengthenItem[] = [];
    room:PvPRoomInfo_revc;
    ownerPlayer:stPlayerInRoom;//自己的数据
    enemyPlayer:stPlayerInRoom;//敌方的数据
    // ownerMonsterCount:number = 0;//己方怪物数量
    // private _gambleVoList:GambleCfgVo[];//赌博配置
    cardList:FuncCardVo[] = [];
    battleStaticList:stBattleStatistic[];//局内统计数据
    // isBattleEnd:boolean = false;
    cardMaxCount:number;
    /**召唤按钮特效 */
    summonEffectVo:CardUiEffectVo;
    /**祈愿特效按钮数据 */
    supplicationVo:SupplicationVo;
    /**卡牌增益效果 */
    gainVo:GainVo;
    /**是否屏蔽伤害字 */
    isFork:boolean = false;
    /**手牌是否锁定中 */
    // bCardIce:boolean = false;
    iceCardsVo:IceCardStatusVo = new IceCardStatusVo();
    killMsgList:KillBoss_revc[]=[];
    msgList:CardMsgVo[] = [];
    /**特效数据 */
    avatarEffectList:IAvatarEffectData[] = [];
    mapEffect: IIceMapData[] = [];//棋盘特效数据
    monsterNum:MonsterNum_revc;
    sommonTimes:number = 0;//召唤次数
    maxHpList:stPvpTurnBasedHp[]=[];
    hpList:stPvpTurnBasedHp[]=[];
    rougeList:RougeList_revc;

    public static get Ins() {
        if (!this._ins) {
            this._ins = new ComposeModel();
        }
        return this._ins;
    }

    /**关闭祈愿面板 */
    // closeGambleView(){
    // E.ViewMgr.Open(EViewType.FuncCard2);
    // }

    /**重置战斗代理器 */
    resetFightAdapter(){
        this.curAdapter = this.fightAdapter;
    }

    /**设置PVE引导战斗代理 */
    setPveFightAdapter(){
        this.curAdapter = this.fightPveAdapterGuide;
    }
    
    /**设置PVP引导战斗代理 */
    setPVPFightAdapter(){
    // this.curAdapter = this.fightPVPAdapterGuide;
    }

    /**设置老的PVP引导战斗代理 */
    setOldPvpFightAdapter(){
        this.curAdapter = this.fightAdapterGuide;
    }

    private initHeroMgr(){
        let _mgr:HeroBaseDecorator =  new HeroCreateMgr();
        _mgr = new AddHeroMgr(_mgr);
        // _mgr = new UpdateHeroMgr(_mgr);
        this.heroMgr = _mgr;
    }

    public initMsg(): void {
        this.attrAction = new AttrAction();
        E.EventMgr.on(EventID.GameStart,this,this.onGameStart);
        this.monsterCreateTimeMgr = new LoopMonsterCreateMgr();
        this.initHeroMgr();
        this.supplicationVo = new SupplicationVo();
        // this.heroEffectPlayDecorator = new HeroEffectPlayDecorator();
        this.gainVo = new GainVo();
        this.summonEffectVo = new CardUiEffectVo();
        //局内战斗注册界面=================================================
        this.composeView = this.Reg(new ComposeMain(EViewType.ComposeMain)) as any;
        this.Reg(new TaskPopView(EViewType.TaskPopView));
        this.Reg(new FightDebugView(EViewType.FightDebugView,ELayerType.noteLayer));
        this.Reg(new SpineGPU_Test(EViewType.SpineGPU_Test,ELayerType.noteLayer));

        // this.Reg(new StrengthenView(EViewType.StrengthenView));
        // this.Reg(new KaPaiView(EViewType.KaPaiView));
        this.Reg(new ProbabilityView(EViewType.ProbabilityView,ELayerType.subFrameLayer));
        this.Reg(new TopHeroTips(EViewType.TopHeroTips,ELayerType.subFrameLayer));
        this.Reg(new FightBossTips(EViewType.FightBossTips, ELayerType.subFrameLayer));
        this.Reg(new MythosView(EViewType.Mythos, ELayerType.subFrameLayer));
        this.Reg(new GambleView(EViewType.Gamble, ELayerType.subFrameLayer));
        this.Reg(new WaveTipsView(EViewType.WaveTips, ELayerType.subFrameLayer));
        this.Reg(new FuncCardShow(EViewType.FuncCardShow, ELayerType.subFrameLayer));
        this.Reg(new FuncCardView2(EViewType.FuncCard2,ELayerType.subFrameLayer));
        this.Reg(new PvpRoundView(EViewType.PvpRoundView,ELayerType.subFrameLayer));
        this.Reg(new PvpRoundFightView(EViewType.PvpRoundFightView,ELayerType.subFrameLayer));
        this.Reg(new PvpRoundReady(EViewType.PvpRoundReady,ELayerType.subFrameLayer));
        this.Reg(new FuncOpenView(EViewType.FuncOpenView,ELayerType.subFrameLayer));
        this.Reg(new PvpRoundCard(EViewType.PvpRoundCard,ELayerType.subFrameLayer));
        this.Reg(new PvproundResult(EViewType.PvproundResult,ELayerType.subFrameLayer));
        this.Reg(new PvpRoundTipsView(EViewType.PvpRoundTipsView,ELayerType.subFrameLayer));
        this.Reg(new PvpRoundReward(EViewType.PvpRoundReward,ELayerType.subFrameLayer));

        this.Reg(new FightTaskView(EViewType.FightTask,ELayerType.subFrameLayer));
        this.Reg(new FightPossessView(EViewType.FightPossess,ELayerType.subFrameLayer));
        // this.Reg(new FuncCardView(EViewType.FuncCard,ELayerType.subFrameLayer));
        this.Reg(new KillBossBannerView(EViewType.KillBossBanner,ELayerType.subFrameLayer));
        // this.Reg(new QuickGuide(EViewType.QuickGuide,ELayerType.subFrameLayer));
        this.Reg(new PossessBuffTips(EViewType.PossessBuffTips,ELayerType.subFrameLayer));
        this.Reg(new FightMsgHisShowView(EViewType.FightMsgHisShowView,ELayerType.subFrameLayer));
        this.Reg(new FaceChatView(EViewType.FaceChatView,ELayerType.subFrameLayer));
        this.Reg(new GiftView(EViewType.GiftView,ELayerType.subFrameLayer));
        this.Reg(new GiftViewPop(EViewType.GiftViewPop,ELayerType.subFrameLayer));
        this.Reg(new PvpRoundCardPop(EViewType.PvpRoundCardPop,ELayerType.subFrameLayer));

        this.Reg(new FightVsView(EViewType.FightVsView,ELayerType.alertLayer));//VS界面
        this.Reg(new CardMsgView(EViewType.CardMsgView, ELayerType.alertLayer));//弹幕
        this.Reg(new YinDaoView(EViewType.YinDaoView, ELayerType.alertLayer));//引导
        this.Reg(new GuideHitUView(EViewType.GuideHitUView,ELayerType.alertLayer));//引导点击层
        this.Reg(new FightResonView(EViewType.FightResonView,ELayerType.alertLayer));//战斗原因
        this.Reg(new FightResultView(EViewType.FightResult,ELayerType.alertLayer));//战斗结算
        this.Reg(new FrientFightResultView(EViewType.FrientFightResultView,ELayerType.subFrameLayer));//战斗合作结算
        // this.Reg(new FriendFightResult(EViewType.FriendFightResult,ELayerType.subFrameLayer));

        this.Reg(new CardShow(EViewType.CardShow,ELayerType.screenEffectLayer));
        this.Reg(new EpicView(EViewType.Epic,ELayerType.screenEffectLayer));
        this.Reg(new ErrTips(EViewType.ErrTips,ELayerType.screenEffectLayer));
        this.Reg(new RedTips(EViewType.RedTips,ELayerType.screenEffectLayer));
        this.Reg(new KillBossLimtTimeTips(EViewType.KillBossLimtTimeTips,ELayerType.screenEffectLayer));
        this.Reg(new RedTips(EViewType.KillBossRedTips,ELayerType.screenEffectLayer));
        this.Reg(new GuideHeroShow(EViewType.GuideHeroShow,ELayerType.subFrameLayer));
        this.Reg(new GuideRewardView(EViewType.GuideRewardView,ELayerType.subFrameLayer));
        this.Reg(new CardTipsGuide(EViewType.CardTipsGuide,ELayerType.subFrameLayer));

        this.Reg(new PveTaskGuide(EViewType.PveTaskGuide));
        this.Reg(new FightHisView(EViewType.FightHisView));

        //===========================================================================
        E.MsgMgr.AddMsg(SERVER_MSGID.ComposeUpdate, this.onComposeUpdate, this);
        E.MsgMgr.AddMsg(SERVER_MSGID.MonsterBirth, this.onMonsterBirth, this);
        E.MsgMgr.AddMsg(SERVER_MSGID.MonsterWalk, this.onMonsterWalk, this);
        E.MsgMgr.AddMsg(SERVER_MSGID.MonsterRemove, this.onMonsterRemove, this);
        E.MsgMgr.AddMsg(SERVER_MSGID.MonsterAttack, this.onMonsterAttack, this);
        E.MsgMgr.AddMsg(SERVER_MSGID.MonsterBlood, this.onMonsterBlood, this);
        E.MsgMgr.AddMsg(SERVER_MSGID.WaveCountDown, this.onWaveCountDown, this);
        E.MsgMgr.AddMsg(SERVER_MSGID.MonsterWave, this.onMonsterWave, this);
        E.MsgMgr.AddMsg(SERVER_MSGID.PvPRoomInfo, this.onPvPRoomInfo, this);
        E.MsgMgr.AddMsg(SERVER_MSGID.PvPMatchResult, this.onPvPMatchResult, this);
        E.MsgMgr.AddMsg(SERVER_MSGID.FightResult, this.onFightResult, this);
        E.MsgMgr.AddMsg(SERVER_MSGID.StrengthenList, this.onStrengthenList, this);
        E.MsgMgr.AddMsg(SERVER_MSGID.StrengthenUpdate, this.onStrengthenUpdate, this);
        E.MsgMgr.AddMsg(SERVER_MSGID.SommonBossShow, this.onSommonBossShow, this);
        E.MsgMgr.AddMsg(SERVER_MSGID.SommonBoss, this.onHideSommonBoss, this);
        E.MsgMgr.AddMsg(SERVER_MSGID.SommonHeroCost, this.onSommonHeroCost, this);
        E.MsgMgr.AddMsg(SERVER_MSGID.WatchHero,this.onWatchHero,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.TaskList,this.onTaskList,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.TaskUpdate,this.onTaskUpdate,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.SkillBar,this.onSkillBar,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.FCardInnerInit,this.onFCardInnerInit,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.BattleStatistic,this.onBattleStatistic,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.FCardInnerChange,this.onFCardInnerChange,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.Gamble,this.onGamble,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.FightSceneInfo,this.onFightSceneInfo,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.HeroMove,this.onHeroMove,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.FCardInnerCD,this.onFCardInnerCD,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.GambleProb,this.onGambleProb,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.HeroActiveBtnCD,this.onHeroActiveBtnCD,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.FuncCardEffectUpdate,this.onFuncCardEffectUpdate,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.FuncardDanMu,this.onFuncardDanMu,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.KillBoss,this.onKillBoss,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.FuncCardSpecialEffect,this.onFuncCardSpecialEffect,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.FightChat,this.onFightChat,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.FightReport,this.onFightReport,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.RougeList,this.onRougeList,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.RougeChoose,this.onRougeChoose,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.MonsterNum,this.onMonsterNum,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.SommonTimes,this.onSommonTimes,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.FightError,this.onSceneErr,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.PvpTurnBasedHpList,this.onPvpTurnBasedHpList,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.PvpTurnBasedHpUpdate,this.onPvpTurnBasedHpUpdate,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.PvpTurnBasedCountDown,this.onPvpTurnBasedCountDown,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.PvpTurnBasedStartFight,this.onPvpTurnBasedStartFight,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.PvpTurnBasedBuffList,this.onPvpTurnBasedBuffList,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.WaveSettleReward,this.onWaveSettleReward,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.PvpTurnBasedMonsterNum,this.onPvpTurnBasedMonsterNum,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.MonsterScale,this.onMonsterScale,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.MonsterEffect,this.onMonsterEffect,this);
        //=====================================================================
        GuideModel.Ins.on(EGuideEvent.ParseCardCell,this,this.parseCell);
        GuideUtils.addMoney = new Laya.Handler(this,this.onSetMoneyHandler);
        this.on(ComposeEvent.PvpFightResultExit,this,this.onPvpFightResultExit);
        this.on(ComposeEvent.EnterMainScene,this,this.enterMainScene);

        Laya.ClassUtils.regClass("CardComponent", CardComponent);
        Laya.ClassUtils.regClass("FightCardCell", FightCardCell);
        Laya.ClassUtils.regClass("HeartComponent", HeartComponent);
        Laya.ClassUtils.regClass("HeroRoundTipCell", HeroRoundTipCell);
        Laya.ClassUtils.regClass("RoguelikeComponent", RoguelikeComponent);
        Laya.ClassUtils.regClass("FightPvpRoundCenter", FightPvpRoundCenter);
        Laya.ClassUtils.regClass("PvpRoundHeartComponent", PvpRoundHeartComponent);
        Laya.ClassUtils.regClass("TaoDaeItem",TaoDaeItem);

        E.EventMgr.on(GameEvent.DebugToolsCreate,this,this.onDebugTools);
    }

    /**怪物属性更新 */
    onMonsterEffect(revc:MonsterEffect_revc){
        let l = revc.datalist;
        for(let i = 0;i < l.length;i++){
            let cell:stMonsterEffect = l[i];
            this.attrAction.parseCell(this,cell);
        }
    }
    private onDebugTools(){
        if(!debug){
            return
        }
        let watchImg = Laya.Utils.getQueryString("watchImg");
        if(watchImg){
            // Laya.timer.callLater(this, () => { 
                E.ViewMgr.CloseAll(); 
                wingm(`openui 56 3-${parseInt(watchImg)}`);
            // });
        }
    }
    ownerMonster:PvpTurnBasedMonsterNum_revc;
    enemyMonster:PvpTurnBasedMonsterNum_revc;
    private onPvpTurnBasedMonsterNum(revc:PvpTurnBasedMonsterNum_revc){
        if(revc.playerId == MainModel.Ins.mRoleData.AccountId){
            this.ownerMonster = revc;
        }else{
            this.enemyMonster = revc;
        }
        this.event(ComposeEvent.PvpTurnBasedMonsterNum,revc);
    }
    /**怪物缩放比例行为 */
    private onMonsterScale(revc:MonsterScale_revc){
        E.EventMgr.emit(GameEvent.MonsterScale,revc);
    }

    /**波次奖励 */
    private onWaveSettleReward(revc:WaveSettleReward_revc){
        // console.log("==============>"+JSON.stringify(revc));
        this.event(ComposeEvent.WaveSettleReward,revc);
    }

    /**buff更新 */
    private onPvpTurnBasedBuffList(revc:PvpTurnBasedBuffList_revc){
        this.pvpRoundBuffs = revc.datalist;
        this.event(ComposeEvent.PvpTurnBasedBuffList);
    }

    /**PVP 回合制战斗准备状态 */
    onPvpTurnBasedStartFight(revc:PvpTurnBasedStartFight_revc){
        this.fightTypeAdaper.pvpRoundStatus = revc.state;
        this.event(ComposeEvent.PvpRoundStatusChange);
    }
    private onPvpTurnBasedCountDown(revc:PvpTurnBasedCountDown_revc){
        let sub:number = revc.unix - TimeUtil.serverTime;
        LogSys.Log(`${TimeUtil.serverTimeMS} ${TimeUtil.serverTime}|剩余 ${sub}s 进行战斗装备`);
        this.wave = revc.wave;
        this.nextWaveTime = revc.unix;//revc.nextWaveTime;
        this.event(ComposeEvent.WaveUpdate);
    }
    onPvpTurnBasedHpList(revc:PvpTurnBasedHpList_revc){
        this.maxHpList = revc.datalist;
        // this.hpList = revc.datalist;

        this.hpList = [];
        for(let i = 0;i < this.maxHpList.length;i++){
            let cell = this.maxHpList[i];
            let vo = new stPvpTurnBasedHp();
            vo.playerId = cell.playerId;
            vo.hp = cell.hp;
            this.hpList.push(vo);
        }

        this.event(ComposeEvent.PvpRoundHpUpdate);
    }
    /**血量更新 */
    onPvpTurnBasedHpUpdate(revc:PvpTurnBasedHpUpdate_revc){
        if(this.hpList){
            for(let i = 0;i < revc.datalist.length;i++){
                let cell = revc.datalist[i];
                let curIndex = this.hpList.findIndex(o=>o.playerId == cell.playerId);

                if(curIndex!=-1){
                    //==========================================================================
                    if(this.ownerPlayer && this.ownerPlayer.playerId == cell.playerId){
                        //己方血量更新
                        let maxHp =  this.maxHpList.find(o=>o.playerId == cell.playerId);
                        if(maxHp){
                            let cur:IPvproundResult = {} as IPvproundResult;
                            cur.oldVal = this.hpList[curIndex].hp;
                            cur.newVal = cell.hp;
                            cur.max = maxHp.hp;
                            this.event(ComposeEvent.PvproundResult,cur);
                        }else{
                            LogSys.Error(`没有初始化血量信息`);
                        }
                    }
                    //==========================================================================
                    this.hpList[curIndex] = cell;
                }else{
                    this.hpList.push(cell);
                }
            }
        }
        this.event(ComposeEvent.PvpRoundHpUpdate);
    }
    private onSceneErr(){
        LogSys.Error('局内战斗异常（关闭战斗界面）');
        this.enterMainScene();
    }
    private onPvpFightResultExit(){
        if (this.fightResultVo) {
            if(this.curAdapter.isGuide){
                //引导不处理
            }else{
                this.enterMainScene();
            }
        }
    }
    private onSetMoneyHandler(s:string){
        FightGuideUtils.updateMoney(s,true);
    }
    private onSommonTimes(revc:SommonTimes_revc){
        this.sommonTimes = revc.num;
        this.event(ComposeEvent.SommonTimes);
    }
    private onMonsterNum(revc:MonsterNum_revc){
        this.monsterNum = revc;
        this.event(ComposeEvent.MonsterNum);
    }
    onRougeChoose(revc:RougeChoose_revc){
        E.ViewMgr.Close(EViewType.GiftView);
        if(revc.fid){
            LogSys.Log(`弹出onRougeChoose fid:${revc.fid}`);
            this.event(ComposeEvent.RougeSelect,revc)
        }else{
            LogSys.Warn(`onRougeChoose fid:${revc.fid}`);
        }
    }
    onRougeList(revc:RougeList_revc){
        // LogSys.Log(`onRougeList:${JSON.stringify(revc)}`);
        let sub = revc.unix - TimeUtil.serverTime;
        if(revc.unix == 0 || sub > 0){
            this.rougeList = revc;
            this.event(ComposeEvent.RougeOpen);
        }else{
            LogSys.Warn(`onRougeList=========================${sub}`);
        }
    }
    getPlayerName(playerId:number){
        if(this.ownerPlayer && this.ownerPlayer.playerId == playerId){
            return this.ownerPlayer.nickName;
        }else if(this.enemyPlayer && this.enemyPlayer.playerId == playerId){
            return this.enemyPlayer.nickName;
        }
        return playerId.toString();
    }
    /**局外战报 */
    private onFightReport(revc:FightReport_revc){
        this.event(ComposeEvent.FightReport,[revc.datalist]);
    }

    private onFightChat(revc:FightChat_revc){
        this.event(ComposeEvent.CreateFace,revc);
    }
    private _chatTime:number = 0;
    sendChat(f_id:number){
        let limitTime:number = parseInt(t_Battle_Config.Ins.getValueById(EBattle_Config.ChatLimitTime).split("|")[1]);

        if(Laya.timer.currTimer - this._chatTime <= limitTime){ 
            E.ViewMgr.ShowMidError(E.getLang("coldnow"));
            return;
        }

        this._chatTime = Laya.timer.currTimer;

        let req = new FightChat_req();
        req.fid = f_id;
        SocketMgr.Ins.SendMessageBin(req);
        E.ViewMgr.Close(EViewType.FaceChatView);
    }

    /**特殊弹幕 */
    private onFuncCardSpecialEffect(revc:FuncCardSpecialEffect_revc){
        let type:number = revc.type;
        if(type == EFuncCardSpecialEffect.DisableCard){
            let vo = new FuncCardSpecialEffectVo();
            vo.playerId = revc.playerId;
            vo.cardId = revc.cardId;
            this.msgList.push(vo);
            E.ViewMgr.Open(EViewType.CardMsgView);
        }
    }

    /**妖王击杀横幅提醒 */
    onKillBoss(revc:KillBoss_revc){
        if(this.fightTypeAdaper.cfg.f_disable_kill_boss_tips){
            return;
        }
        let type = EViewType.KillBossBanner;
        if(E.ViewMgr.isOpenReg(type)){
            this.killMsgList.push(revc);
        }else{
            E.ViewMgr.Open(type,null,revc);
        }
    }

    /**弹幕列表 */
    private onFuncardDanMu(revc:FuncardDanMu_revc,client:boolean){

        let cfg = t_Function_Card.Ins.getCfgById(revc.cardId);
        if(cfg && StringUtil.IsNullOrEmpty(cfg.f_card_des)){
            LogSys.Log(`==============================================================>${cfg.f_cardid}:非展示弹幕!`)
            return;
        }

        let hideTime:number;
        if(this.curAdapter.isGuide){
            hideTime = this.curAdapter.clockTimeMs + FightValueConfig.MsgHideTimeOffsetMs;
        }
        let vo = this.createMsg(revc,hideTime);
        vo.client = client;
        this.histroyMsgList.push(new HistroyMsgVo(vo));
        this.msgList.push(vo);
        E.ViewMgr.Open(EViewType.CardMsgView);
    }


    private onFuncCardEffectUpdate(revc:FuncCardEffectUpdate_revc){
        let _l = revc.datalist;
        for(let i = 0;i < _l.length;i++){
            let cell = _l[i];
            this.parseCell(cell);
        }
    }
    
    /**构建消息 */
    createMsg(revc:FuncardDanMu_revc,hideTime:number = 0){
        let vo = new CardMsgVo();
        vo.init(revc);
        vo.hideTime = hideTime;
        // vo.bClickHide = bClickHide;
        vo.play();
        return vo;
    }

    private playTarget(playerId:number,effcetCfg: Configs.t_Battle_Effect_dat,cardId:number){
        let url:string = this.getEffectURL(effcetCfg);

        let animIndex: number = effcetCfg.f_effect_anim;
        let o = this.getTargetLayerXY(effcetCfg.f_target, playerId);
        if(o){
            let layer = o.layer;
            let curX: number = o.curX;
            let curY: number = o.curY;
            if(effcetCfg.f_effect_id == EFunccardEffectId.MoneyShow){
                FightFactory.createGetMoney(cardId,effcetCfg.f_effect_id,layer,curX,curY);
            }else{
                SpineEffectMgr.playOnce(url, layer,curX, curY, animIndex);
            }
        }
    }

    getTargetLayerXY(_targetPos:number,playerId:number):IEffectAnimVo{
        if(this.ownerPlayer){
            // let _targetPos: number = effcetCfg.f_target;
            let ox: number = 4;
            let oy: number = 2.5;
            switch (_targetPos) {
                case EEffectPos.GridCenter:
                    //具体方棋盘中心
                    if (playerId == this.ownerPlayer.playerId) {
                        //己方
                    } else {
                        //敌方
                        // oy -= 5;
                        oy -= this.fightTypeAdaper.cfg.f_top;
                    }
                    break;
                case EEffectPos.MapCenter:
                    //战场中心
                    // oy -= 2.5;
                    oy -= this.fightTypeAdaper.cfg.f_top/2;
                    break;
            }
            if (this.fightView) {
                let layer = this.fightView.getLayer(EFightLayer.HitMonsterLayer);
                let curX: number = ox * ComposeConfig.cellW;
                let curY: number = oy * ComposeConfig.cellH;
                return { layer: layer, curX: curX, curY: curY } as IEffectAnimVo;
            }
        }
    }

    private getEffectURL(effcetCfg:Configs.t_Battle_Effect_dat){
        let url:string;
        let u1 = effcetCfg.f_effect_name;
        // if(url.indexOf('.skel') != -1){
        if(!StringUtil.IsNullOrEmpty(effcetCfg.f_spine_path)){
            url = `${effcetCfg.f_spine_path}/${u1}/${u1}`;
        }else{
            url = `o/spine/scene/${u1}/${u1}`;
        }
        return url;
    }

    /**
     * 卡牌播放动画
     * @param uid 英雄流水号
     * @param cardId 卡牌ID
     * @param type 作用的目标类型
     * @param playerId 玩家流水号
     * @param cardSerialNum 卡牌流水号
     */
    playCardOnce(uid: number, cardId: number, type: EEffectTarget, playerId: number, cardSerialNum: number, effectID?: number) {
        let cfg = t_Function_Card.Ins.getCfgById(cardId);
        if (!cfg) {
            return;
        }
        let effcetCfg: Configs.t_Battle_Effect_dat;
        if (effectID == undefined) {
            if (!cfg.f_effect_id) {
                return;
            }
            effcetCfg = t_Battle_Effect.Ins.getByEffectId(cfg.f_effect_id);
        }else {
            effcetCfg = t_Battle_Effect.Ins.getByEffectId(effectID);
        }
        if (!effcetCfg) {
            return;
        }
      

        let _offsetY:number = effcetCfg.f_offsetY;

        if(effcetCfg.f_mode == EEffectLoop.Once){
            let layer:EAvatarLayar = this.getAvatarLayer(effcetCfg);
            let url:string = this.getEffectURL(effcetCfg);
            let _targetPos:number = effcetCfg.f_target;
            if (_targetPos) {
                this.playTarget(playerId,effcetCfg,cardId);
                return;
            }
            // switch (type) {
            //     case EEffectTarget.Hero:
            //         let eo1: IPlayOnceAvatar = { url: url, layer: layer, type: EEffectTarget.Hero, uid: uid,offsetY:_offsetY } as IPlayOnceAvatar;
            //         this.event(ComposeEvent.PlayOnceEffect, eo1);
            //         break;
            //     case EEffectTarget.Monster:
            //         let eo: IPlayOnceAvatar = { url: url, layer: layer, type: EEffectTarget.Monster, uid: uid ,offsetY:_offsetY} as IPlayOnceAvatar;
            //         this.event(ComposeEvent.PlayOnceEffect, eo);
            //         break;
            //     case EEffectTarget.Grid:
            //         FightFactory.playEffectOnGrid(uid,url);
            //         break;
            // }
            this.playEffectAvatar(type,url,layer,uid,_offsetY);
        }
        else if(effcetCfg.f_mode == EEffectLoop.Loop){
            this.createLoopEffect(effcetCfg.f_effect_id,type,playerId,uid,cardSerialNum);
        }
    }

    playEffectAvatar(type:EEffectTarget,url:string,layer:EAvatarLayar,uid:number,_offsetY:number = 0){
        switch (type) {
            case EEffectTarget.Hero:
                let eo1: IPlayOnceAvatar = { url: url, layer: layer, type: EEffectTarget.Hero, uid: uid,offsetY:_offsetY } as IPlayOnceAvatar;
                this.event(ComposeEvent.PlayOnceEffect, eo1);
                break;
            case EEffectTarget.Monster:
                let eo: IPlayOnceAvatar = { url: url, layer: layer, type: EEffectTarget.Monster, uid: uid ,offsetY:_offsetY} as IPlayOnceAvatar;
                this.event(ComposeEvent.PlayOnceEffect, eo);
                break;
            case EEffectTarget.Grid:
                FightFactory.playEffectOnGrid(uid,url);
                break;
        }
    }

    private getAvatarLayer(effcetCfg: Configs.t_Battle_Effect_dat){
        let layer:EAvatarLayar;
        if (effcetCfg.f_layer) {
            //底层
            layer = EAvatarLayar.Bottom;
        } else {
            //上层
            layer =  EAvatarLayar.Top;
        }
        return layer;
    }

    /**
     * 创建挂载循环特效
     * @param effectID 特效id
     * @param type 目标类型
     * @param playerId 玩家流水号
     * @param uid 英雄流水号
     * @param cardSerialNum 卡牌流水号
     */
    createLoopEffect(effectID:number, type: EEffectTarget,playerId:number,uid:number,cardSerialNum:number){
        let effcetCfg = t_Battle_Effect.Ins.getByEffectId(effectID);
        let u1 = effcetCfg.f_effect_name;
        let url:string;
        let isImg:boolean = false;
        let layer:EAvatarLayar = this.getAvatarLayer(effcetCfg);

        if(u1.indexOf('.png')!=-1){
            url =`o/skill/${u1}`;
            isImg = true;
        }else{
            url = `o/spine/scene/${u1}/${u1}`;
        }
        switch (type) {
            case EEffectTarget.Hero:
            case EEffectTarget.Monster:
                if (layer == EAvatarLayar.Top) {
                    //对英雄或者是怪物添加循环特效
                    let obj: IAvatarEffectData = {} as IAvatarEffectData;
                    obj.type = type;
                    obj.cardUid = cardSerialNum;
                    obj.playerId = playerId;
                    obj.uid = uid;
                    obj.url = url;
                    obj.offsetX = 0;
                    obj.offsetY = effcetCfg.f_offsetY;
                    this.addCacheEffect(obj)
                    this.event(ComposeEvent.AddFrontEffect, obj);
                }
                break;
            case EEffectTarget.Grid:
                let grid = this.fightView.gridItemList.find(o=>o.uid == uid);
                if(grid){
                    let _data = grid.data;                        
                    this.fightView.updateEffectGround(cardSerialNum,_data.x, _data.y, _data.playerId, url, layer == EAvatarLayar.Bottom ? EFightLayer.Ground : EFightLayer.HitMonsterLayer);
                }
                break;
        }
    }

    /**
     * @param deadMonsterUID 怪物死亡时 销毁此特效
     */
    addLoopEffectLoop(type:EEffectTarget,deadMonsterUID:number,uid:number,url:string){
        let obj: IAvatarEffectData = {} as IAvatarEffectData;
        obj.type = type;
        obj.deadMonsterUID = deadMonsterUID;
        // obj.cardUid = cardSerialNum;
        // obj.playerId = playerId;
        obj.uid = uid;
        obj.url = url;
        obj.offsetX = 0;
        // obj.offsetY = effcetCfg.f_offsetY;
        
        // if(this.fightView){
        //     let _hero = this.fightView.gridItemList.find(o=>o.uid == uid);
        //     if(!_hero){
        //         LogSys.Error(`显示的Avatar 类型${type}未初始化`);
        //     }
        // }

        this.addCacheEffect(obj);
        this.event(ComposeEvent.AddFrontEffect, obj);
    }

    private delCardEffect(_vo:IDelEffectCardUid,uids:number[]){
        LogSys.Log("delCardEffect:"+_vo.cardSerialNum + "-" + JSON.stringify(uids));
        for(let i = 0;i < this.avatarEffectList.length;i++){
            let cell = this.avatarEffectList[i];
            if(cell.cardUid == _vo.cardSerialNum && cell.playerId == _vo.playerId){
                this.avatarEffectList.splice(i,1);
                i--;
            }
        }
    }

    private addCacheEffect(_vo:IAvatarEffectData){
        // this.effectTempList.push(_vo);
        // LogSys.Log(`addCardEffect cardId:${cardId}...cardUID: ${_vo.cardUid} uid:${_vo.uid}`);
        this.avatarEffectList.push(_vo);
    }

    delLoopEffect(playerId:number,serialNum:number,uids:number[]){
        let _delvo = {playerId:playerId,cardSerialNum:serialNum} as IDelEffectCardUid;
        this.delCardEffect(_delvo,uids);
        this.event(ComposeEvent.DelEffectCardUid,_delvo);
    }

    /**
     * 解析卡牌效果
     */
    parseCell(cell:stFuncCardEffect){
        let cfg = t_Function_Card.Ins.getCfgById(cell.cardId);
        if(cell.state == EEffectStatus.Close){
            //释放效果
            if (this.summonEffectVo.cardSerialNum == cell.serialNum) {
                this.summonEffectVo.status = EEffectStatus.Close;
            }

            if(this.iceCardsVo.cardSerialNum == cell.serialNum){
                this.iceCardsVo.bCardIce = false;
            }
            
            // LogSys.Log(`del cardSerialNum...${cell.serialNum}`);
            
            //销毁卡牌特效
            this.delLoopEffect(cell.playerId,cell.serialNum,cell.uids);

            if(cfg){
                if(cfg.f_card__templateid == ETemplateCardId.DoublePriceCard){
                    // let u = this.cardPriceDoubles.findIndex(o=>o.cardSerialNum == cell.serialNum);
                    // if(u != -1){
                    //     this.cardPriceDoubles.splice(u,1);
                    // }
                    this.event(ComposeEvent.CardPriceDoubles);
                }
            }
            return;
        }
        if(!cfg){
            return;
        }
        if (cfg.f_card__templateid == ETemplateCardId.ICE_MAP || cfg.f_card__templateid == ETemplateCardId.ICE_MAP_PVP_ROUND) {            
            let vo = { status: cell.state == EEffectStatus.Open, playerId: cell.playerId ,cardUid:cell.serialNum} as IIceMapData;
            this.mapEffect.push(vo);
            this.event(ComposeEvent.IceMap,vo);
            return;
        }
        else if(cfg.f_card__templateid == ETemplateCardId.ICE_CARDS){
            this.iceCardsVo.bCardIce = true;
            this.iceCardsVo.cardSerialNum = cell.serialNum;
            this.iceCardsVo.playerId = cell.playerId;
            this.event(ComposeEvent.IceCards);
            return;
        }

        if(cfg.f_card__templateid == ETemplateCardId.DoublePriceCard){


            //卡牌增益减益按钮特效更新
            this.gainVo.update(cell);

            return;
        }

        if(!cfg.f_effect_id){
            return;
        }
        let effcetCfg:Configs.t_Battle_Effect_dat = t_Battle_Effect.Ins.getByEffectId(cfg.f_effect_id);
        if(!effcetCfg){
            return;
        }

        if(effcetCfg.f_ui && effcetCfg.f_btnmode){
            
            switch(effcetCfg.f_btnmode){
                case EEffectButtonType.Sommon:
                    //召唤按钮
                    this.summonEffectVo.update(cell); 
                    break;
                case EEffectButtonType.Supplication:
                    //祈愿按钮
                    this.supplicationVo.update(cell);
                    break;
            }
            return;
        }
        if(cell.uids.length>0){
            for (let i = 0; i < cell.uids.length; i++) {
                let uid = cell.uids[i];
                this.playCardOnce(uid,cell.cardId,cell.type,cell.playerId,cell.serialNum);
            }
        }else{
            this.playCardOnce(0,cell.cardId,cell.type,cell.playerId,0);
        }
    }
    /**激活技能cd */
    private onHeroActiveBtnCD(revc:HeroActiveBtnCD_revc){
        let vo = this.skillCds.find(o=>o.uid == revc.uid);
        if(vo){
            vo.status = revc.cd;
        }else{
            let cell = new SkillCdVo();
            cell.status = revc.cd;
            cell.uid = revc.uid;
            this.skillCds.push(cell);
        }
        this.event(ComposeEvent.SkillCdUpdate);
    }

    private onGambleProb(revc:GambleProb_revc){
        let l = revc.datalist;
        for(let i = 0;i < l.length;i++){
            let cell  = l[i];
            let fIndex = this.gambles.findIndex(o=>o.flag == cell.flag);
            if(fIndex == -1){
                this.gambles.push(cell);
            }else{
                this.gambles[fIndex] = cell;
            }
        }
        this.event(ComposeEvent.UpdateGambleProb);
    }

    private onFCardInnerCD(revc:FCardInnerCD_revc){
        // LogSys.Log(revc);
        this.cardCdTime = revc.unix * 1000; 
        for(let i = 0;i < this.cardList.length;i++){
            let o = this.cardList[i];
            o.cdTime = this.cardCdTime;
        }
    }

    private onHeroMove(revc:HeroMove_revc){
        let _dataList = revc.datalist;
        if(_dataList.length == 1){
            let hero = _dataList[0];
            //移动到目标

        }else{
            LogSys.Error(`onHeroMove's length is ${_dataList.length}`);
        }
    }

    /**场景信息 */
    private onFightSceneInfo(revc:FightSceneInfo_revc){
        this.sceneInfo = revc;
        if(this.sceneInfo.status == ERoomStatus.Has){
            this.refreshList = this.sceneInfo.heros;
        }

        LogSys.Log(`FightSceneInfo_revc 怪物数量:${revc.monsters.length}`);

        if(LoginClient.Ins.code == 0){
            MainModel.Ins.openMainView();
        }
    }

    /**祈愿赌博结果 */
    onGamble(revc:Gamble_revc){
        let obj:IGambleResult = {} as IGambleResult;
        obj.succeed = revc.success == 1;
        obj.type = revc.flag;
        obj.heroId = revc.heroId;
        this.event(ComposeEvent.GambleComplete,obj);
    }
    private onBattleStatistic(revc:BattleStatistic_revc){
        this.battleStaticList = revc.datalist;
        this.event(ComposeEvent.BattleStatistic);
    }

    /** 局内功能卡初始化列表*/
    onFCardInnerInit(revc:FCardInnerInit_revc){
        let l = revc.cards;
        this.cardMaxCount = l.length;
        this.cardList = [];
        for(let i = 0;i < l.length;i++){
            let cell = l[i];
            if(cell.used == EFuncCardUsed.NotUsed){
                let _vo = new FuncCardVo();
                _vo.cdTime = this.cardCdTime;
                _vo.data = cell;
                this.cardList.push(_vo);
            }
        }
        // if(Laya.Utils.getQueryString("clearcards")){
        //     this.cardList = [];
        // }
    }

    onFCardInnerChange(revc: FCardInnerChange_revc) {

        if(!this.room){
            LogSys.Log(`未拿到场景信息`);
            return;
        }

        let l = revc.cards;
        let _serialNum: number;
        let f_cardid: number;
        let cur: stFCardInner 
        let _resultList:CardMoveVo[] = [];
        let discard:boolean = false;//丢弃操作

        //==========================================
        //PVE更新未使用的牌
        for(let i = 0;i < l.length;i++){
            let o: stFCardInner = l[i];
            switch(o.used){
                case EFuncCardUsed.NotUsed:
                    let _vo = new FuncCardVo();
                    _vo.cdTime = this.cardCdTime;//TimeUtil.serverTimeMS;//this.cardCdTime;
                    _vo.data = o;
                    this.cardList.push(_vo);
                    this.event(ComposeEvent.AddCard,_vo);
                    break;
                case EFuncCardUsed.PVE_Destory:
                    FightFactory.createPveDestoryCard(o.fCardId);
                    break;
            
            }
        }
        //==========================================

        for (let i = 0; i < l.length; i++) {
            let o: stFCardInner = l[i];

            // if(o.used == EFuncCardUsed.NotUsed){
            // FightFactory.createPveShowCard(o.fCardId);
            // }

            if (o.used == EFuncCardUsed.Used || o.used == EFuncCardUsed.UsedDisable) {
                _serialNum = o.serialNum;
                f_cardid = o.fCardId;
                cur = o;
            }else if(o.used == EFuncCardUsed.Discard){
                discard = true;
            }
            if (revc.playerId == this.ownerPlayer.playerId) {
                if (o.used == EFuncCardUsed.Used || o.used == EFuncCardUsed.UsedDisable) {
                    
                    let moveVo: CardMoveVo = new CardMoveVo();
                    // moveVo.del = true;
                    moveVo.uid = o.serialNum;
                    // moveVo.cardId = o.fCardId;
                    _resultList.push(moveVo);
                }
                let vo = this.cardList.find(cell => cell.data.serialNum == o.serialNum);
                if (vo) {
                    vo.data = o;//赋值
                }
            }
        }
        if (revc.playerId == this.ownerPlayer.playerId) {
            let _result:FuncCardVo[] = [];
            for(let i = 0;i < this.cardList.length;i++){
                let o = this.cardList[i];
                if(o.data.used == EFuncCardUsed.NotUsed){

                    //设置未解锁时间戳
                    // o.cdTime = TimeUtil.serverTimeMS + t_Function_Card.Ins.getCfgById(o.data.fCardId).f_card_Cooldown;
                    
                    _result.push(o);
                }
            }
            this.cardList = _result;
            // LogSys.Log(`可用卡牌数量为${this.cardList.length}`);
        }

        //移动牌
        while(_resultList.length > 0){
            let o = _resultList.shift();
            this.event(ComposeEvent.MoveCard, o);
        }
        //=====================================

        if(discard){
            //丢牌操作的时候整个刷新手牌
            this.event(ComposeEvent.UpdateCards);

            // if(Laya.Utils.getQueryString("discard")){
            //     window['gm']('cardany');
            //     Laya.timer.once(1000,this,()=>{
            //         this.event(ComposeEvent.UpdateCards);
            //     });
            // }else{
            //     this.event(ComposeEvent.UpdateCards);
            // }
        }

        if(_serialNum!=undefined){
            let target:stPlayerInRoom;
            if(revc.playerId == this.ownerPlayer.playerId){
                target = this.ownerPlayer;
            }else{
                target = this.enemyPlayer;
            }
            //播放卡牌CD
            this.playPieEffect(target,f_cardid,_serialNum);

            //客户端推送弹幕========================================
            if (cur && cur.used == EFuncCardUsed.UsedDisable) {
                //无效卡效果....
                FightFactory.createDiscardEffect(f_cardid);
            } else {
                let cfg = t_Function_Card.Ins.getCfgById(f_cardid);
                if (cfg && cfg.f_direct_broadcast) {
                    // let msg: FuncardDanMu_revc = new FuncardDanMu_revc();
                    // msg.playerId = target.playerId;
                    // msg.cardId = f_cardid;
                    // msg.datalist = [];
                    // this.onFuncardDanMu(msg,true);
                    this.clientBroadcast(target.playerId,f_cardid);
                }
            }
            //========================================
        }
    }

    /**客户端弹幕 */
    clientBroadcast(playerId:number,f_cardid:number){
        let msg: FuncardDanMu_revc = new FuncardDanMu_revc();
        msg.playerId = playerId;
        msg.cardId = f_cardid;
        msg.datalist = [];
        this.onFuncardDanMu(msg,true);
    }

    private playPieEffect(target:stPlayerInRoom,f_cardid,_serialNum:number){
        let _result:IPlayPieResult = {} as IPlayPieResult;
        // _result.cd = cfg.f_card_Cooldown;
        
        _result.serialNum = _serialNum;
        if(target.playerId == this.ownerPlayer.playerId){
            LogSys.Log(`播放卡牌动画:${f_cardid}`);
            this.event(ComposeEvent.PlayPie,_result);
        }

        //展示卡牌显示特效
        let cfg = t_Function_Card.Ins.getCfgById(f_cardid);
        if(cfg && cfg.f_card_visualeffect > 0){
            Laya.timer.once(FightValueConfig.cardShowTime,this,this.playCard,[f_cardid,target]);
        }
    }

    private playCard(f_cardid,target:stPlayerInRoom){
        let card:ICardShow = {} as ICardShow;
        card.cardId = f_cardid;
        card.playerName = target.nickName;
        E.ViewMgr.Open(EViewType.CardShow,null,card);
    }

    /**英雄技能条 */
    onSkillBar(revc:SkillBar_revc){
        // this.event(ComposeEvent.SkillBar,[revc.datalist]);
        this.fightView && this.fightView.onSkillBar(revc.datalist);
    }

    /**祈愿有一项材料满足条件可以触发祈愿 */
    get bGambleHaveOneEnough(){
        let l = this.fightTypeAdaper.gambleVoList;
        for(let i = 0;i < l.length;i++){
            let o = l[i];
            if(o.bCostEnough){
                return true;
            }
        }
    }

    
    /**召唤材料满足条件 */
    get bSommonEnough(){
        let id: number = ECellType.FIGHT_MONEY;
        let needCount:number =  this.getCost(id);
        let have = MainModel.Ins.mRoleData.getVal(id);
        return have >= needCount;
    }

    /**有材料可以使用 */
    get haveItemCanUse(){
        // if(this.curAdapter.isGuide){
        //     return false;
        // }
        // return this.bSommonEnough || this.bGambleHaveOneEnough;
        return this.curAdapter.haveItemCanUse;
    }

    /**使用卡牌 */
    useCard(uid:number,needItem:ItemVo){
        this.curAdapter.useCard(uid,needItem);
    }

    /**局内任务全量 */
    private onTaskList(revc:TaskList_revc){
        this.curTasks = revc.datalist;
    }
    
    /**局内任务增量 */
    private onTaskUpdate(revc:TaskUpdate_revc){
        let _serverList = revc.datalist;
        for(let i = 0;i < _serverList.length;i++){
            let cell = _serverList[i];
            let index:number = this.curTasks.findIndex(o=>o.taskId == cell.taskId);
            if(index!=-1){
                if(this.curTasks[index].state == EBattleTaskStatus.NotComplete && cell.state == EBattleTaskStatus.Complete){
                    this.taskStatusChange(cell.taskId);
                }
                this.curTasks[index] = cell;
            }else{
                this.curTasks.push(cell);
            }
        }
    }

    onWatchHero(revc:WatchHero_revc){
        this.event(ComposeEvent.WatchHero,revc);
    }

    getHeroVo(uid:number){
        let vo =  this.refreshList.find(o=>o.uid == uid);
        if(vo){
            return vo;
        }
        let cell = new stElement();
        cell.fid = 1;
        cell.num = 1;
        cell.uid = uid;
        cell.playerId = 1;
        cell.skinId = 23;
        cell.x = 0;
        cell.y = 0;
        LogSys.Warn(`not find uid:${uid} hero`);
        return cell;
    }

    /**召唤的价格 */
    onSommonHeroCost(revc:SommonHeroCost_revc){
        this._costList = revc.moneyInfo;
        this.event(ComposeEvent.CostUpdate);
    }
    /**英雄总数 */
    get heroCount(){
        let count:number = 0;
        for(let i = 0;i < this.refreshList.length;i++){
            let hero = this.refreshList[i];
            if(hero.playerId == MainModel.Ins.mRoleData.AccountId){
                count += hero.num;
            }
        }
        return count;
    }

    /**需要消耗 */
    getCost(id:number){
        let cell = this._costList.find(o=>o.id == id);
        return cell ? cell.count : 0;
    }

    /**显示Boss按钮 */
    private onSommonBossShow(revc:SommonBossShow_revc){
        this.bossMonsterId = revc.monterId;
        this.event(ComposeEvent.ShowHideBossBtn);
    }

    /**隐藏Boss按钮 */
    private onHideSommonBoss(revc:SommonBoss_revc){
        this.bossMonsterId = 0;
        this.event(ComposeEvent.ShowHideBossBtn);
    }

    /**强化返回 */
    onStrengthenUpdate(value:StrengthenUpdate_revc){
        let index = this.strengthenList.findIndex(ele=>ele.pos == value.data.pos);
        if(index != -1){
            this.strengthenList[index] = value.data;
            this.event(ComposeEvent.StrengthenUpdate,value.data.pos);
        }
    }

    onStrengthenList(value:StrengthenList_revc){
        this.strengthenList = value.datalist;
    }

    onFightResult(revc:FightResult_revc){
        if (!E.ViewMgr.isOpenReg(EViewType.ComposeMain)) {
            LogSys.Warn(`在战斗场景外面!!!`);
            return;
        }
        // this.isBattleEnd = true;
        this.fightResultVo = new FightResultVo(revc);
        if(this.composeView){
            this.composeView.onFightEnd();
        }
        this.refreshList = [];
        //===========================================

        // E.ViewMgr.Open(EViewType.FightResult);

        let _slowTime:number = 0;
        let slowtime = System_RefreshTimeProxy.Ins.getVal(ESystemRefreshTime.SLOWTIME);
        if(slowtime){
            if(this.fightView){
                this.fightView.speedScale = 0.1
            }
            _slowTime = parseInt(slowtime);
        }
        Laya.timer.once(_slowTime,this,this.onOpenFightReson,[revc.mode]);
    }

    private onOpenFightReson(mode:EFightMode){
        switch(mode){
            case EFightMode.PVP:
            case EFightMode.PVP_Round:
                E.ViewMgr.Open(EViewType.FightResonView);
                break;
            case EFightMode.PVE:
            case EFightMode.HARDPVE:
            case EFightMode.NewYear:
                E.ViewMgr.Open(EViewType.FrientFightResultView);
                break;
        }
    }

    /**PVP开始匹配 */
    startMatch(){
        // if(this.isLocalWs){
        //     this.enterBattle();
        //     return;
        // }

        if(TowertMainCardModel.Ins.isCardEnough()){
            this.startMatchOpen(EFightMode.PVP);//1
        }else{
            TowertMainCardModel.Ins.showCardBox(1);
        }
    }
    /**PVE匹配 */
    startMatchPve(){
        if(TowerMainFightModel.Ins.isTiLiEnough()){
            this.startMatchOpen(EFightMode.PVE);//2
        }
    }

    startMatchHardPve(){
        if(TowerMainFightModel.Ins.isTiLiEnough()){
            this.startMatchOpen(EFightMode.HARDPVE);//2
        }
    }

    /**PVP回合制 */
    startMatchPvpRound(){
        this.startMatchOpen(EFightMode.PVP_Round);//2
    }

    startNewYear(){
        this.startMatchOpen(EFightMode.NewYear);//2
    }

    private startMatchOpen(mode:number){
        // if(!(Laya.Utils.getQueryString("dontMatch") == "1")){
        let req = new MonsterBirth_req();
        req.mode = mode;
        SocketMgr.Ins.SendMessageBin(req);
        // }
        E.ViewMgr.Open(EViewType.JjcView,null,mode);
    }

    /**当前的房间id */
    get rootId(){
        if(this.room){
            return this.room.roomId;
        }
        return 0;
    }

    private onPvPMatchResult(revc:PvPMatchResult_revc){
        if(revc.flag == EFightMatch.Succeed){
            Laya.timer.once(1000,this,()=>{
                E.ViewMgr.Close(EViewType.JjcView);
                this.enterBattle();
            })
        }else{
            E.ViewMgr.Close(EViewType.JjcView);
            Laya.timer.once(1000,this,this.onDelayHandler);
        }
    }

    private onDelayHandler(){
        if(!E.ViewMgr.isOpenReg(EViewType.ComposeMain)){
            E.ViewMgr.ShowMsgBox(EMsgBoxType.OnlyOk,`匹配超时`);
        }
    }

    /**进入战斗 */
    private enterBattle(){
        E.ViewMgr.CloseAll();
        // GuideModel.Ins.removeYD();
        LogSys.Log(`enterBattle进入战斗...`);
        this.clearScene(EFightSceneStatus.EnterBattle);
        FightGuide.Ins.clearData();
        // PveGuide.Ins.clearData();
        GuideModel.Ins.removeYD();
        GuideModel.Ins.event(EGuideEvent.ClearData);
        E.ViewMgr.Close(EViewType.Main);
        E.ViewMgr.Open(EViewType.ComposeMain);
    }

    /**是否是玩家自己 */
    getOwnerType(playerId:number){
        // if(this.room){
        //  this.room.datalist.find(o=>o.playerId == playerId);
        // }
        return MainModel.Ins.mRoleData.AccountId == playerId ? EMonsterPos.Owner : EMonsterPos.OtherPlayer;
    }

    onPvPRoomInfo(revc:PvPRoomInfo_revc){        

        let cur:IFightTypeAdapter;
        if(initConfig.fight_mode){
            revc.mode = initConfig.fight_mode;
        }
        switch(revc.mode){
            case EFightMode.PVE:
                cur = this.pveTypeAdapter;
                break;
            case EFightMode.PVP:
                cur = this.pvpTypeAdapter;
                break;
            case EFightMode.PVP_Round:
                cur = this.pvpRoundTypeAdapter;
                break;
            case EFightMode.HARDPVE:
                cur = this.pvpHardTypeAdapter;
                break;
            case EFightMode.NewYear:
                cur = this.pvpNewYearAdapter;
                break;
        }
        this.setFightTypeAdaper(cur);

        this.room = revc;
        let playerIndex = this.room.datalist.findIndex(o=>o.playerId == MainModel.Ins.mRoleData.AccountId);
        this.ownerPlayer = this.room.datalist[playerIndex];
        let rightIndex:number = playerIndex == 0 ? 1:0;
        this.enemyPlayer = this.room.datalist[rightIndex];
        this.event(ComposeEvent.RoomInfoUpdate);
    }
    /**波次更新 */
    onMonsterWave(revc:MonsterWave_revc){
        let _wave:number = revc.wave;
        this.wave = _wave;
       
        if(revc.nextWaveTime > 0){
            this.nextWaveTime = revc.nextWaveTime;
        }
        LogSys.Log(`${TimeUtil.serverTimeMS},${TimeUtil.serverTime}|更新波次${_wave} 波次剩余时间:${this.nextWaveTime - TimeUtil.serverTime}s`);
        if(E.ViewMgr.isOpenReg(EViewType.ComposeMain)){
            if(_wave > 1){ 
                let cfgList:Configs.t_Enemy_Wave_dat[] = this.fightTypeAdaper.waveCfg.List;
                let cfg = cfgList.find(o=>o.f_waves == _wave);
                if(cfg.f_boss_wave == 0){
                    E.ViewMgr.Open(EViewType.WaveTips,null,_wave);
                }
                if(cfg){
                    let index = cfgList.indexOf(cfg);
                    let pre:Configs.t_Enemy_Wave_dat = cfgList[index-1];
                    if(pre && pre.f_boss_wave){
                        this.event(ComposeEvent.GailvUp);
                    }
                }
            }
        }
        this.event(ComposeEvent.WaveUpdate);
    }

    /**掉血行为 */
    onMonsterBlood(revc:MonsterBlood_revc){
        // this.event(ComposeEvent.SubBlood,[revc.datalist]);
        this.fightView && this.fightView.onSubBlood(revc.datalist);
    }

    /**攻击行为 */
    onMonsterAttack(revc: MonsterAttack_revc) {
        // this.event(ComposeEvent.Atk, [revc.datalist]);
        this.fightView && this.fightView.onAtk(revc.datalist);
    }

    removeUIDs: number[] = [];//移除的流水号id

    /**移除怪物 */
    onMonsterRemove(revc: MonsterRemove_revc) {
        // console.log("移除怪物:"+revc.targetUid);

        if (this.removeUIDs.indexOf(revc.targetUid) == -1) {
            this.removeUIDs.push(revc.targetUid);
            // LogSys.Log(`击杀怪物uid:${revc.targetUid}`);
        }

        this.clearCacheDeadUID(revc.targetUid);

        this.event(ComposeEvent.MonsterRemove, revc.targetUid);
    }

    private clearCacheDeadUID(uid:number){
        let findex = this.avatarEffectList.findIndex(o => o.deadMonsterUID == uid);

        while(findex!=-1){
            this.avatarEffectList.splice(findex, 1);
            findex = this.avatarEffectList.findIndex(o => o.deadMonsterUID == uid);
        }

    }

    /**怪物出生 */
    onMonsterBirth(revc: MonsterBirth_revc) {
        let l = revc.datalist;
        l.sort(this.onSortList);
        if(debug){
            LogSys.Log(`怪物出生长度信息:${JSON.stringify(revc)}`);
        }
        this.monsterCreateTimeMgr.createMonsters(l);
    }

    private onSortList(a:stMonsterBirth,b:stMonsterBirth){
        if(a.time > b.time){
            return 1;
        }
        else if(a.time < b.time){
            return -1;
        }
        return 0;
    }

    /**行走同步 */
    onMonsterWalk(revc:MonsterWalk_revc){
        let l = revc.datalist;
        // LogSys.Log(`onMonsterWalk:${JSON.stringify(l)}`);
        // console.log(Laya.timer.currTimer + " onMonsterWalk",l);
        for(let i = 0;i < l.length;i++){
            let vo = l[i];
            this.event(ComposeEvent.MonsterMove,vo);
        }
    }

    clearFight() {
        // this.effectTempList = [];
        this.ownerMonster = null;
        this.enemyMonster = null;
        this.rougeList = null;
        this.pvpRoundBuffs = [];
        this.sommonTimes = 0;
        this.avatarEffectList = [];
        this.mapEffect = [];
        this.monsterCreateTimeMgr.stop();
        this.heroMgr.stop();
        this.event(ComposeEvent.FightResClear);
        this.bossWaves = [];
        this.gambles = [];
        this.killMsgList = [];
        this.iceCardsVo.reset();
        this.summonEffectVo.reset();
        this.supplicationVo.reset();
        this.gainVo.reset();
        // this.cardPriceDoubles = [];
        this.msgList = [];
        this.histroyMsgList = [];
        this.removeUIDs = [];

        // this.fightView = null;
        // spineRes.GC();
        // ResMgr.Ins.free();
        E.EventMgr.emit(EventID.FreeRes);
    }

    /**清空战斗场景数据 */
    private clearData(){
        //清空英雄数据
        this.refreshList = [];
        //清空场景数据
        this.sceneInfo = null;
    }

    /**进入主场景 */
    private enterMainScene(){
        this.clearData();
        E.ViewMgr.CloseAll();
        E.ViewMgr.Open(EViewType.Main);
    }

    /**清空场景 */
    clearScene(_source?:EFightSceneStatus){
        if(this.sceneInfo){
            if(_source == EFightSceneStatus.ReConnect){
                //重连
            }else{
                //非重连就清空数据
                this.sceneInfo.monsters = [];
                this.sceneInfo.heros = [];
                this.refreshList = [];
            }
        }
        if(_source==EFightSceneStatus.EnterBattle){

        }else{
            this.cardList = [];
        }
        this.cardCdTime = 0;
        this.fightResultVo = null;
    }

    private onGameStart(){
        this.pvpTypeAdapter = new PvpFightAdapter();//pvp战斗类型
        this.pveTypeAdapter = new PVEFightAdapter(EFightMode.PVE);//合作战斗类型
        this.pvpRoundTypeAdapter = new PvpRoundFightAdapter();//pvp回合制战斗类型
        this.pvpHardTypeAdapter = new PVEFightHardAdapter(EFightMode.HARDPVE);//困难模式
        this.pvpNewYearAdapter = new PVEFightNewYearAdapter(EFightMode.NewYear);//新春
        this.setFightTypeAdaper(this.pvpTypeAdapter);
    }

    public onInitCallBack(): void {
        // if(debug){
        //     console.log("引导配置===1",YinDaoTaskProxy.Ins.List);
        //     console.log("局内战斗引导配置====2", t_FightGuideConfig.Ins.List);
        //     console.log("系统配置",System_RefreshTimeProxy.Ins.List);
        // }
        this.isFork = false;
        GuideModel.Ins.model = this;
        // this.ownerMonsterCount = 0;
        this.popTaskIds = [];
        this.gambles = [];
        // this.curIndex = 0;
        // this.delFailUids = [];
        this.cardCdTime = 0;
        this.cardMaxCount = 0;
        this.oldenemyCount = undefined;
        this.epicHeroList = [];
        // ButtonCtl.useDelay = false;
        this.curAdapter = this.fightAdapter;

        // this.sceneInfo = null;
        this.cardList = [];
        this.battleStaticList = [];
        this.curTasks = [];
        this.bossMonsterId = 0;
        this.nextWaveTime = 0;
        this.room = null;
        this.stList = [];
        this._costList = [];
        this.clearFight();
        this.refreshList = [];
        let scale:number = 1;
        // let _defaultSize:number = ComposeConfig.defaultSize;
        // ComposeConfig.cellW = scale * _defaultSize;
        // ComposeConfig.cellH = scale * _defaultSize;
        let size = System_RefreshTimeProxy.Ins.getVal(ESystemRefreshTime.ComposeSize).split("-");
        ComposeConfig.mapW = parseInt(size[0]) * scale;
        ComposeConfig.mapH = parseInt(size[1]) * scale;
        //=================================
        // this.setFightTypeAdaper(this.pvpTypeAdapter);
        // if(Laya.Utils.getQueryString("debugfighttype") == '2'){
        //     this.setFightTypeAdaper(this.friendTypeAdapter);
        // }
        
        this.wave = 0;
        // let offsetY: number = -ComposeConfig.mapH * ComposeConfig.MapCellH * 5;
        // FightUtils.topOffsetY = offsetY;
        FightUtils.init();


        //卡牌测试数据
        // for(let i = 0;i < 20;i++){
        //     let _vo = new FuncCardVo();
        //     _vo.cardId = i + 1;
        //     _vo.uid = i + 1;
        //     this.cardList.push(_vo);
        // }
    }

    getIndexByIso(isoX:number,isoY:number){
        if(isoX > ComposeConfig.mapW - 1 || isoY > ComposeConfig.mapH - 1){
            return -1;
        }
        return isoX + isoY * ComposeConfig.mapW;
    }

    private playDelEffectInHero(obj: IDelHeroUpdate,target:stElement){
        let cfg = t_Function_Card.Ins.getCfgById(obj.cardId);
        let _resultSubCfg:Configs.t_HeroAddSubEffect_dat;
        let effectID: number;
        if (!cfg.f_effect_id) {
            let _subCfg = t_HeroAddSubEffect.Ins.getByCardId(obj.cardId);
            if (_subCfg) {
                effectID = _subCfg.f_subid;
               

                _resultSubCfg = _subCfg;
            }
        }
        if(effectID > 0){
            LogSys.Log(`播放英雄删除特效 cardId:${obj.cardId} uid:${target.uid} effectID:${effectID}`);
            this.playCardOnce(obj.uid, obj.cardId, EEffectTarget.Grid, target.playerId, 0, effectID);
        }
        return _resultSubCfg;
    }

    refreshHeros(revc: ComposeUpdate_revc){

        //删除操作
        let delList = revc.dellist;
        let f_surplus_heros:number;
        let playerId:number;
        let _tempDelList:IDelHeroUpdate[] = [];
        for (let i = 0; i < delList.length; i++) {
            let delUID = delList[i];
            let index = this.refreshList.findIndex(o => o.uid == delUID);
            if (index != -1) {
                let target = this.refreshList[index];
                this.refreshList.splice(index, 1);
                let obj: IDelHeroUpdate = {} as IDelHeroUpdate;
                obj.x = target.x;
                obj.y = target.y;
                obj.uid = delUID;
                obj.type = revc.type;
                obj.cardId = revc.cardId;
                obj.delayTime = 0;
                _tempDelList.push(obj);
                if (obj.type == EComposeUpdateType.FuncCard) {
                    //==============================================================
                    //英雄删除特效
                    let _resultSubCfg = this.playDelEffectInHero(obj,target);
                    if(_resultSubCfg){
                        f_surplus_heros = _resultSubCfg.f_surplus_heros;
                        playerId = target.playerId;
                    }
                    //==============================================================
                }
                this.event(ComposeEvent.HeroDelByUID, obj);
            }
        }
        if(f_surplus_heros){
            this.event(ComposeEvent.UpdateSurplusHeros,[revc.cardId,f_surplus_heros,playerId]);
        }
        //=======================================
        let l = revc.datalist;
        let _addList:stElement[] = [];
        let _banderList:stElement[] = [];
        for(let i = 0;i < l.length;i++){
            let _item = l[i];
            let itemIndex = this.refreshList.findIndex(o=>o.uid == _item.uid);
            if(itemIndex == -1){
                this.refreshList.push(_item);
                LogSys.Log(`添加英雄uid:${_item.uid}到列表refreshList`);
                _addList.push(_item);
            }else{

                if(_item.num > this.refreshList[itemIndex].num){
                    _banderList.push(_item);
                }
                this.refreshList[itemIndex] = _item;
                // LogSys.Log(`更新操作:${JSON.stringify(_item)}`);
                
                //================================================
                //更新操作
                let _uVo:IUpdateHero = {} as IUpdateHero;
                _uVo.delList = _tempDelList;
                _uVo.cardSerialNum = revc.serialNum;
                _uVo.cardId = revc.cardId;
                _uVo.type = revc.type;
                _uVo.vo = _item;
                
                this.event(ComposeEvent.HeroUpdate,[_uVo]);

                this.fightView && this.fightView.onHeroUpdate(_uVo);
                //================================================
            }
        }
        if(_addList.length > 0){
            _banderList = _banderList.concat(_addList);
        }

        //播放横幅================================================
        if (_banderList.length > 0) {
            let _l = _banderList;
            for (let i = 0; i < _l.length; i++) {
                let cur = _l[i];
                if (cur.fid && cur.playerId == MainModel.Ins.mRoleData.AccountId) {
                    let cfg = HeroListProxy.Ins.getCfgById(cur.fid);
                    let type = revc.type;
                    if (type == EComposeUpdateType.Compose) {
                        if (!cfg.f_if_transform && cfg.f_qua == EHeroQua.Red) {
                            FightFactory.createAdmission(cur);//神话英雄创建
                        } else {

                        }
                    }else if(type == EComposeUpdateType.Summon){
                        // if(cfg.f_qua == EHeroQua.Purple || cfg.f_qua == EHeroQua.Orange){
                        this.showEpic(cfg.f_heroid);// 召唤卡横幅
                        // }
                    }
                }
            }
            //================================================
        }

        //增加操作
        if(_addList.length > 0){

            let o:IAddHero = {} as IAddHero;
            o.delList = _tempDelList;
            o.cardSerialNum = revc.serialNum;
            o.heroList = _addList;
            o.type = revc.type;
            o.cardId = revc.cardId;
            this.event(ComposeEvent.HeroAdd, o);
            this.fightView && this.fightView.onHeroAdd(o);
        }
        // Laya.timer.once(1000,this,this.updateGrideZSort);
    }

    /**
     * 10005
     * 更新格子信息
     * 变化量
     */
    onComposeUpdate(revc: ComposeUpdate_revc,sync?:boolean) {
        // console.log("onComposeUpdate ===========>",revc);

        let vo = new ComposeUpdateVo();
        let offsetTime:number = 0;
        if(revc.type == EComposeUpdateType.Supplicatior){
            let val = parseInt(t_Battle_Config.Ins.getValueById(EBattle_Config.SupplicationDelay));
            offsetTime = val;
        }
        vo.time = this.curAdapter.clockTimeMs + offsetTime;
        vo.offset = offsetTime;
        vo.data = revc;
        this.heroMgr.createHero(vo,sync);
    }

    /*英雄召唤横幅 */
    showEpic(heroId: number) {
        let cfg = HeroListProxy.Ins.getCfgById(heroId);
        if(cfg){
            if (cfg.f_qua == EHeroQua.Purple || cfg.f_qua == EHeroQua.Orange) {
                if (E.ViewMgr.isOpenReg(EViewType.Epic)) {
                    this.epicHeroList.push(heroId);
                } else {
                    E.ViewMgr.Open(EViewType.Epic, null, heroId);
                }
            }
        }
    }

    reqCompose(suid:number,tuid:number){
        let sCell = this.refreshList.find(o=>o.uid == suid);
        if(sCell){
            this.fComposeItem_req(tuid,sCell.x,sCell.y,EComposeMoveOpt.Move);//Compose
        }else{
            LogSys.Error(`requestCompose not find uid:${suid}`);
        }
    }

    private fComposeItem_req(tuid: number, x: number, y: number,type:EComposeMoveOpt) {
        let req = new ComposeItem_req();
        req.uid = tuid;
        req.x = x;
        req.y = y;
        // req.type = type;
        SocketMgr.Ins.SendMessageBin(req);
        // if(this.isLocalWs){
        //     MainModel.Ins.gmt.updateComp(x,y,tuid);
        // }
    }

    /**移动格子 */
    moveItem(datalist: stMove[]) {
        //批量
        let req: ComposeMove_req = new ComposeMove_req();
        req.datalist = datalist;
        LogSys.Log(`请求移动到${JSON.stringify(datalist)}`);
        SocketMgr.Ins.SendMessageBin(req);
    }

    /**英雄移动 */
    moveItemToMap(uid:number, x: number, y: number) {
        //grid: ComposeDragGrid
        this.fComposeItem_req(uid,x,y,EComposeMoveOpt.Move);//Compose
    }

    /**移动到下方 */
    reqMoveSel(uid: number, oldX: number, oldY: number) {
        /*
        let cell = new stMove();
        cell.uid = uid;
        cell.x = minVal;// - oldX;
        cell.y = ComposeConfig.mapSelStartY;// - oldY;
        this.moveItem([cell]);
        */

        let minVal: number = Number.MAX_VALUE;
        for (let i = 0; i < this.refreshList.length; i++) {
            let o = this.refreshList[i];
            if (o.y == ComposeConfig.mapSelStartY && o.x < minVal) {
                minVal = o.x;
            }
        }

        if (minVal == Number.MAX_VALUE) {
            minVal = 0;
        }
        this.fComposeItem_req(uid, minVal, ComposeConfig.mapSelStartY, EComposeMoveOpt.Move);
    }

    /**本地测试服 */
    get isLocalWs(){
        let tcp = Laya.Utils.getQueryString("tcp");
        return (tcp && tcp.indexOf(":8004") != -1);
        // return Laya.Utils.getQueryString("tcp")=="ws://127.0.0.1:8004";
        // return Laya.Utils.getQueryString("localws") == "1";
    }
    closeComposeTips(){
        E.ViewMgr.Close(EViewType.CompSell);

        this.closeHeroTips();
    }
    /**关闭英雄tips */
    closeHeroTips(){
        // let _heroTips: HeroTipsView = this.composeView.heroTipsView;
        // if(_heroTips){
        //     _heroTips.closeUI();
        // }
        E.ViewMgr.Close(EViewType.TopHeroTips);
    }

    /**倒计时 */
    private onWaveCountDown(revc:WaveCountDown_revc){
        // if(!this.fightView){
        // return;
        // }
        // if(!this._cutdowntime){
        //     this._cutdowntime = new CutdownView();
        // }
        // this._cutdowntime.x = 39;
        // this._cutdowntime.y = 852;
        // (this.fightView.parent as Laya.Sprite).addChild(this._cutdowntime);
        // this._cutdowntime.time = revc.num;
        this.fightView && this.fightView.setCutdown(revc.num);
    }

    /**神话神话列表 */
    get mythos(){
        return this.curAdapter.mythos;
    }

    /**可以召唤的神话英雄 */
    canGetMythos(){
        let l:stHero[] = [];
        let mythos = this.mythos;
        for(let i = 0;i < mythos.length;i++){
            let _heroVo:stHero = mythos[i];
            let _heroCfg: Configs.t_Hero_dat = HeroListProxy.Ins.getCfgById(_heroVo.id);
            let per:number = HeroWeight.calPercent(_heroCfg.f_heroid);
            if(per >= 100){
                l.push(_heroVo);
            }
        }
        return l;
    }

    //#region 警告提示
    private oldenemyCount:number;
    private _curErrTime:number = 0;
    get bFightResustShow(){
        if(E.ViewMgr.isOpenReg(EViewType.FightResult) || E.ViewMgr.isOpenReg(EViewType.FightResonView) || E.ViewMgr.isOpenReg(EViewType.FrientFightResultView)){
            return true 
        }
    }
    showErrTips(cur:number,leftMax:number){
        if(this.bFightResustShow){
            return;
        }
        let checkCount:number = this.fightTypeAdaper.checkCount;
        //===================================================
        if(checkCount == -1){
            return;
        }

        let redType:EViewType = EViewType.RedTips;
        if(cur >= checkCount){
            if(!E.ViewMgr.isOpenReg(redType)){
                E.ViewMgr.Open(redType);
            }
        }else{
            E.ViewMgr.Close(redType);
        }
        //===================================================
        if(this.oldenemyCount!=undefined){
            if(this.oldenemyCount < checkCount && cur >= checkCount){
              
                if(E.ViewMgr.isOpenReg(EViewType.ErrTips)){
                    // LogSys.Log(`ErrTips isOpen`);
                }else{
                    let limtMS:number = parseInt(t_Battle_Config.Ins.getValueById(42)) * 1000;
                    let sub = Laya.timer.currTimer - this._curErrTime;
                    if(sub <= limtMS){
                        // LogSys.Log(`在CD时间内...sub ${sub}`);
                        return;
                    }
                    this._curErrTime = Laya.timer.currTimer;

                    let vo:IErrTipsVo = {} as IErrTipsVo;
                    vo.cur = cur;
                    vo.max = leftMax;
                    E.ViewMgr.Open(EViewType.ErrTips,null,vo);
                    t_Inner_Sound.Ins.play(EInnerSoundType.MonsterMuchMoreTips);
                }
            }
        }
        this.oldenemyCount = cur;
    }
    //#endregion
    /**获取局内的己方英雄的数量 */
    private getOwnerHeroCount(id:number){
        let l = this.refreshList;
        let count:number = 0;
        if(this.ownerPlayer){
            for(let i = 0;i < l.length;i++){
                let vo = l[i];
                if(vo.playerId == this.ownerPlayer.playerId && vo.fid == id){
                    count+= vo.num;
                }
            }
        }
        return count;
    }

    /**转化任务列表*/
    convertTaskHeros(arr:string[]):FightTaskHeroCellVo[]{
        let _l = [];
        let _heroMap = {};
        for(let i = 0;i < arr.length;i++){
            let heroId:number = parseInt(arr[i]);
            if(!_heroMap[heroId]){
                _heroMap[heroId] = this.getOwnerHeroCount(heroId);
            }
        }
        for(let i = 0;i < arr.length;i++){
            let heroId:number = parseInt(arr[i]);
            let _vo = new FightTaskHeroCellVo();
            _vo.heroId = heroId;
            if(_heroMap[heroId]>0){
                _heroMap[heroId]--;
                _vo.count = 1
            }
            else{
                _vo.count = 0;
            }
            _l.push(_vo);
        }
        return _l;
    }

    /**初始化一次CD动画 */
    private onCardCdPieInit() {
        if (this.curAdapter.initUseCd) {
            let _result: IPlayPieResult = {} as IPlayPieResult;
            // _result.cd = parseInt(t_Battle_Config.Ins.getValueById(EBattle_Config.FuncCardSec)) * 1000;

            // for(let i = 0;i < this.cardList.length;i++){
            //     let o = this.cardList[i];
            //     o.cdTime = TimeUtil.serverTimeMS + t_Function_Card.Ins.getCfgById(o.data.fCardId).f_card_Cooldown;
            // }

            _result.serialNum = -1;
            this.event(ComposeEvent.PlayPie, _result);
        }
    }

    composeViewOnShow(){
        let vo = {} as IViewBaseUiVo;
        vo.onShowHandler = new Laya.Handler(this,this.onCardCdPieInit);
        E.ViewMgr.Open(EViewType.FuncCard2,null,vo);
    }

    /**任务气泡提示 */
    private taskStatusChange(taskId:number){
        if(!E.ViewMgr.isOpenReg(EViewType.ComposeMain)){
            LogSys.Warn(`未在战斗场景...`)
            return;
        }

        LogSys.Log(`任务气泡提示${taskId}...`);
        let type = EViewType.TaskPopView;
        if(E.ViewMgr.isOpenReg(type)){
            this.popTaskIds.push(taskId);
        }else{
            E.ViewMgr.Open(type,null,taskId);
        }
    }

    getHeroIds(uid:number){
        let _heroIds: number[] = [];
        let vo = this.getHeroVo(uid);
        if (vo && vo.playerId == MainModel.Ins.mRoleData.AccountId) {
            //可合成英雄
            let _heroCfg:Configs.t_Hero_dat = HeroListProxy.Ins.getCfgById(vo.fid);

            // heroList.itemRender = HeroViewCell;
            // heroList.renderHandler = new Laya.Handler(this, this.onHeroViewCell);
            let _arr: string[] = StringUtil.IsNullOrEmpty(_heroCfg.f_composed) ? [] : (_heroCfg.f_composed || "").split("|");

            for (let i = 0; i < _arr.length; i++) {
                let _heroId = parseInt(_arr[i]);
                let vo = TowertMainHeroModel.Ins.getHeroById(_heroId);
                if (vo) {
                    _heroIds.push(_heroId);
                }
            }
        }
        if(initConfig.enable_spine_gpu_test2){
            _heroIds.push(1,2);
        }
        return _heroIds;
    }

    /**妖王倒计时更新 */
    cutdownCheck(sec: number) {
        if (this.fightView) {
            // let closeRed:boolean = false;
            
            let curIndex: number = this.fightTypeAdaper.waveCfg.waves.indexOf(this.wave);
            let boss;
            if (curIndex != -1) {
                boss = this.fightView.getSelfBogyBoss();
                //妖王 boss关卡
                if (boss) {
                    let time: number = parseInt(System_RefreshTimeProxy.Ins.getVal(ESystemRefreshTime.BossTipsTime));
                    if (sec <= time) {
                        if (this.bossWaves.indexOf(this.wave) == -1) {
                            this.bossWaves.push(this.wave);
                            E.ViewMgr.Open(EViewType.KillBossLimtTimeTips);
                        }
                    }
                }
            }
            if (boss && this.bossWaves.indexOf(this.wave) != -1) {
                E.ViewMgr.Open(EViewType.KillBossRedTips);
            } else {
                E.ViewMgr.Close(EViewType.KillBossRedTips);
            }
        }
    }

    walkUpdate(curMs:number,_brithInfoList:ClientMonsterBirthVo[],power:number = 1){
        let ml = FightUtils.curMoveList;
        let fullVal:number = (ml.length - 1) * FightValueConfig.DEV_COUNT;//一圈的值

        let monsters:stMonsterBirth[] = this.sceneInfo.monsters;//怪物信息
        let _walkList:stMonsterWalk[] = [];

        for(let i = 0;i < monsters.length;i++){
            let _monsterBrith:stMonsterBirth = monsters[i];

            let fvo = _brithInfoList.find(o=>o.uid == _monsterBrith.uid);

            let _curTime:number = curMs;//TimeUtil.serverTimeMS;

            if(fvo){
                if(fvo.birthTime > _curTime){
                    // LogSys.Log(`${JSON.stringify(fvo)}--->${fvo.birthTime - _curTime}毫秒后出生`);
                } else {
                    let walkVo = new stMonsterWalk();

                    // let _monsterCfg = t_Monster.Ins.getCfgMonsterid(_monsterBrith.fid);
                    // let _monsterTempCfg = t_Monster_Template.Ins.getMonsterTemplate(_monsterCfg.f_monster_template_id);
                    // let _speed:number = parseInt(_monsterTempCfg.f_10003.split(":")[1]);

                    let _speed:number = this.fightTypeAdaper.monsterCfg.getTempSpeed(_monsterBrith.fid);

                    //偏移
                    let offset: number = Math.ceil(((_curTime - fvo.birthTime) / _speed) * FightValueConfig.DEV_COUNT);//多少毫秒移动1个最小单位格
                    
                    let v:number = offset % fullVal;
                    let index = _monsterBrith.index + v;
                    // if (index >= fullVal) {
                    //     if(debug && _monsterBrith.uid == 1){
                    //         LogSys.Log(`重置坐标 uid:${_monsterBrith.uid}`);
                    //     }
                    //     index = 0;
                    //     _monsterBrith.index = 0;
                    // }
                    // _monsterBrith.index = index;

                    walkVo.index = index;
                    walkVo.uid = _monsterBrith.uid;

                    walkVo.time = _speed / power;
                    _walkList.push(walkVo);
                }
            }else{
                LogSys.Error(`walkUpdate not found :${_monsterBrith.uid}`);
            }
        }
        if(_walkList.length > 0){
            let walkRevc = new MonsterWalk_revc();
            walkRevc.datalist = _walkList;
            this.onMonsterWalk(walkRevc);
        }
    }

    private _tMonsterPvp:t_MonsterPvp;

    getMonsterCfg(_monsterId:number){
        let cfg: Configs.t_Monster_dat;

        if (this.fightTypeAdaper) {
            cfg = this.fightTypeAdaper.monsterCfg.getCfgMonsterid(_monsterId);
        } else {
            LogSys.Warn(`fightTypeAdaper is null 数据异常...`);
            if(!this._tMonsterPvp){
                this._tMonsterPvp = new t_MonsterPvp();
            }       
            cfg = this._tMonsterPvp.getCfgMonsterid(_monsterId);
        }
        return cfg;
    }
    clearMainAtlas(){
        let l = AssetConfig.mainList;
        for(let i = 0;i <  l.length;i++){
            let url:string = l[i];
            Laya.Loader.clearTextureRes(url);
        }
        let arr = ["towerMain.atlas","hero.atlas","shop.atlas","card.atlas","linbao.atlas","xianshilibao.atlas","tuweizhan.atlas","cardcq.atlas"];
        for(let i = 0;i < arr.length;i++){
            let url = `res/atlas/remote/${arr[i]}`;
            AssetConfig.clearTextureRes(url);
        }
    }
}