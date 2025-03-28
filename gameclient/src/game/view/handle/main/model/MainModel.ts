import { BaseModel } from "../../../../../frame/util/ctl/BaseModel";
// import { HttpUtil } from "../../../../../frame/util/HttpUtil";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { InitConfig, PlatformConfig } from "../../../../../InitConfig";
import { ui } from "../../../../../ui/layaMaxUI";
import { EMsgBoxType, EViewType } from "../../../../common/defines/EnumDefine";
import { DrawCallConfig } from "../../../../DrawCallConfig";
// import { EventID } from "../../../../event/EventID";
import { E, G } from "../../../../G";
import { LayerMgr } from "../../../../layer/LayerMgr";
import { LoginClient } from "../../../../network/clients/LoginClient";
import { CommonClaimRewardInit_revc, CommonClaimRewards_req, CommonClaimRewards_revc, ConfigHash_revc, CreateRoleInfo_revc, EnterFightAgain_req, Err_revc, FightSceneInfo_revc, FundRefresh_req, GetServerTimeMS_revc, Gm_req, Init_revc, ItemNotEnoughCode_revc, RedDotUpdate_revc, Reward_revc, ServerVersion_revc, stCellValue, stCommonTimes, WatchCommonRankDetail_revc } from "../../../../network/protocols/BaseProto";
import { SERVER_MSGID } from "../../../../network/protocols/ProtoDef";
import { SocketMgr } from "../../../../network/SocketMgr";
import { StaticDataMgr } from "../../../../static/StaticDataMgr";
import { SpineUtil } from "../../avatar/spine/SpineManager";
import { LoadingVo } from "../../common/LoadingView";
import { ComposeModel, ERoomStatus } from "../../compose/ComposeModel";
import { FightFactory } from "../../compose/FightFactory";
import { EFightSceneStatus } from "../../compose/vos/EFightEnum";
import { FunctionModel, IRedNameKey } from "../../funs/FunctionModel";
import { FuncProxy } from "../../funs/proxy/FunctionProxy";
import { FightGuide } from "../../guide/FightGuide";
import { EGuideEvent, GuideModel } from "../../guide/GuideModel";
import { MainGuide } from "../../guide/MainGuide";
import { PveGuide } from "../../guide/PveGuide";
import { IGuideAdapter } from "../../guide/PveGuideAdapter1";
import { PvpRoundCheckAdapter } from "../../guide/PvpRoundCheckAdapter";
// import { LoadingVo } from "../../common/LoadingView";
import { ILoginCode } from "../../login/LoginViewNew";
import { ESdkValChange } from "../../sdk/ISdk";
import { GooseConfig } from "../../taodae/model/GooseConfig";
import { TowerMainFightModel } from "../../towertmain/model/TowerMainFightModel";
import { TowertMainCardModel } from "../../towertmaincard/model/TowertMainCardModel";
import { ESystemRefreshTime } from "../ctl/ESystemRefreshTime";
import { System_RefreshTimeProxy } from "../ctl/System_RefreshTimeProxy";
import { ItemProxy } from "../proxy/ItemProxy";
import { BaseSettingBtn } from "../views/new2/LeftSmallFuncIcon";
import { ERewardType } from "../vos/ECellType";
import { ItemVo } from "../vos/ItemVo";
import { MainRoleVo } from "../vos/MainRoleVo";
import { EFuncDef } from "./EFuncDef";
import {  ERedEnum } from "./ERedEnum";
import { ErrCodeProxy } from "./ErrCodeProxy";
import { GameEvent } from "./GameEvent";
import { GmTest } from "./GmTest";
import { MainEvent } from "./MainEvent";
import { RedUpdateModel } from "./RedUpdateModel";

enum ELoginCode{
    Succeed = 0,
    /**请求参数错误 */
    PARAM_ERROR = 10003,
}

export enum ECommonClaimType{
    /**PVP新手引导奖励 */
    FIGHT_GUIDE_REWARD = 1,

    /** 1 PVE 启动新手引导 0不启动PVE新手引导*/
    USE_PVE_GUIDE = 4,

    /**新版新手引导奖励领取 times 0未领取 1、2、3已领取的关卡数 */
    PVE_GUIDE_STATUS = 5,

    /**PVP回合制 0非引导中 1引导中 */
    PVP_ROUND_GUIDE = 6,
}

export class MainModel extends BaseModel{



    /**pve引导章节id 
    */
    pveChapterId:number;
    commonTimes:stCommonTimes[];
    hash:ConfigHash_revc;
    // bFromFriend:boolean = false;//是否来自好友邀请
    // goldName:string;
    /**创角信息 */
    createRoleInfo:CreateRoleInfo_revc;
    autoSell:boolean = false;
    // private _mainUpdate:IMainUpdate = new MainUpdate();

    private static _ins: MainModel;
    public static get Ins() {
        if (!this._ins) {
            this._ins = new MainModel();
        }
        return this._ins;
    }
    red:RedUpdateModel = new RedUpdateModel();
    public loginTime:number = 0;

    /**3010是否已经初始化 */
    public isInitAlready:boolean = false;
    public serverZu:number;
    public serverState:number;
    public serverID:number;
    public serverIsNew:number;
    public serverName:string;
    public serverplayerId:number;
    public ser_ver:string = "";
    public redNameKeyList:IRedNameKey[] = [];
    public season:number;
    public todayFirstLogin:number;
    public todaySpirit:number;
    /**主线引导 */
    mainGuide:MainGuide;
    /**PVE引导 */
    pveGuide:PveGuide;
    guideAdapter:IGuideAdapter;
    /**Pvp引导 */
    // pvpGuide:PVP_Guide;
    private onCreateHeroAvatar(heroId:number,parent:Laya.Sprite){
        return FightFactory.createBigHeroAvatar(heroId,parent);
    }
    /**重置 */
    public onInitCallBack():void{
        // this.bFromFriend = false;
        // this.guideFinishList = [];
        this.guideAdapter && this.guideAdapter.init();
        this.pveChapterId = 1;
        this.commonTimes = [];
        ViewBase.createBigHeroAvatar = new Laya.Handler(this,this.onCreateHeroAvatar);
        FunctionModel.Ins.redList = [];
        this.serverVer = 0;
        this.isInitAlready = false;
        this.red.clear();
        // this.localNoticeList = [];
        this.peakOpenTime = 0;
        window['onShowData'] = null;
        this.isNewRole = false;
        E.AudioMgr.SetMusicMute(false);
        E.AudioMgr.SetSoundMute(false);
        this.ser_ver = "";
        
        // let mainView:TowertMainView = E.ViewMgr.Get(EViewType.Main) as TowertMainView;
        // if(mainView){
        // mainView.resetUpdate();
        // }
    }

    /**跨天需要的时间秒 */
    private _crossDayTicket:number;
    private _initTime:number = 0;
    /**是否是新角色 */
    public isNewRole:boolean = false;
    /**
     * 动画需要播放的时间(毫秒)
     */
    public animUseMs:number = 0;

    /**游戏圈是否有红点 */
    // public yxqRed:boolean = false;

    /**游戏内部公告 */
    // public localNoticeList:stNotice[] = [];
    public paomaGobalPos:Laya.Point;
    // public boxAuto:BoxAuto_revc = new BoxAuto_revc();
    public peakOpenTime:number = 0;
    public fightCMD:string;
    /**服务器版本 */
    public serverVer:number = 0;
    /**0磕头 1宝箱 默认动画选择的索引 */
    public animIndex:number = 0;
    // public monthTest:boolean;


    public showLoading(){
        let vo = new LoadingVo();
        vo.start = 0;
        vo.end = 0.75;
        vo.duration = 200;
        vo.callBack = new Laya.Handler(this, this.loadEnd);
        E.ViewMgr.loading(vo);
    }

    private loadEnd(){
        this.enterGame();
        let vo = new LoadingVo();
        vo.start = 0.75;
        vo.end = 1;
        vo.duration = 20000;
        // vo.callBack = new Laya.Handler(this, this.enterGame);
        E.ViewMgr.loading(vo);
    }

    private enterGame(){
        this.connectRegist();
        E.taLoginTrack("clickStartGame");
        MainModel.Ins.loginTime = Laya.timer.currTimer;
    }

    /**是否是提审状态 */
    public get verify(): boolean {
        return this.realVerify;
    }

    /* 提审状态) */
    get realVerify(){
        if(Laya.Utils.getQueryString("ts") == "1" || typeof initConfig.debug_ts != "undefined"){
            return true;
        }
        if(InitConfig.wxLoginResult){
            let result = InitConfig.wxLoginResult.result;
            if (result.audit == 1 ) {
                return true;
            }
        }
        return false;
    }

    /**
     * 主角数据
     */
    public mRoleData: MainRoleVo = new MainRoleVo();
    gmt:GmTest;
    constructor() {
        super();
        window['main'] = this;
        this.gmt = new GmTest();
    }

    public initMsg(){
        this.mainGuide = new MainGuide();
        this.pveGuide = new PveGuide();
        this.guideAdapter = new PvpRoundCheckAdapter();//new PveGuideAdapter1();
        E.EventMgr.on(EventID.ConnectRegist, this, this.onConnectRegist);

        E.MsgMgr.AddMsg(SERVER_MSGID.Init,this.onInitRevc,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.Err,this.onErrCodeRevc,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.Reward,this.onRewardRevc,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.ConfigHash,this.onConfigHashRevc,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.ServerVersion,this.onServerVersionRevc,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.RedDotUpdate,this.onRedDotUpdateOtpRevc,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.GetServerTimeMS,this.onGetServerTimeMS,this);
        // E.MsgMgr.AddMsg(MSGID.ShareReward,this.onShareReward,this);
        // E.MsgMgr.AddMsg(MSGID.ClubReward,this.onClubReward,this);
        // E.MsgMgr.AddMsg(MSGID.WxAuthInfo,this.onWxAuthInfo,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.ItemNotEnoughCode,this.onItemNotEnoughCode,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.CommonClaimRewards,this.onCommonClaimRewards,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.CommonClaimRewardInit,this.onCommonClaimRewardInit,this);

        GuideModel.Ins.on(EGuideEvent.GuidePVEChapter,this,this.onGuidePVEChapter);
        GuideModel.Ins.on(EGuideEvent.Finish,this,this.onGuideFinish);
        E.EventMgr.on(GameEvent.WatchSelf,this,this.onWatchSelf);
    }
    /**PVE章节切换 */
    private onGuidePVEChapter(id:number){
        this.pveChapterId = id;
        this.clearSceneData();
        E.ViewMgr.CloseAll();
        this.startGame();
    }
    private clearSceneData(_source?:EFightSceneStatus){
        GuideModel.Ins.onInitCallBack();
        ComposeModel.Ins.clearScene(_source);
    }
    private onGuideFinish(id:number){
        this.guideAdapter && this.guideAdapter.push(id);
        this.clearSceneData();
        E.ViewMgr.CloseAll();
        this.startGame();
    }
    private onConnectRegist(){
        this.connectRegist();
    }
    private onCommonClaimRewardInit(revc:CommonClaimRewardInit_revc){
        this.commonTimes = revc.datalist;
    }
    private onCommonClaimRewards(revc: CommonClaimRewards_revc) {
        // console.log(revc);
        let l = revc.datalist;
        for (let i = 0; i < l.length; i++) {
            let cell = l[i];
            let fObj = this.commonTimes.find(o => o.flag == cell.flag);
            if (fObj) {
                fObj.times = cell.times;
            } else {
                this.commonTimes.push(cell);
            }
        }
        
    }
    private onItemNotEnoughCode(revc:ItemNotEnoughCode_revc){
        let name:string = ItemProxy.Ins.getCfg(revc.id).f_name;
        E.ViewMgr.ShowMidError(E.getLang("itemnotenough",name));
    }

    /**初始化策略 */
    initStrategy() {
    }

    /**微信头像授权 */
    // private onWxAuthInfo(revc: WxAuthInfo_revc) {
    //     // this.authBtnShow = revc.show;
    //     // this.event(MainEvent.AuthBtnChange);
    // }
    // private onClubReward(revc: ClubReward_revc) {
    //     // this.clubReward = revc;
    //     // this.event(MainEvent.ClubReward);
    //     // this.yxqRed = revc.dataList.find(o => o.state === 2) ? true : false;
    //     // this.updateYXQ_red();
    // }

    /**每日分享、添加到桌面礼包领取情况 */
    // private onShareReward(revc:ShareReward_revc) {
    //     // this.shareReward = revc;
    //     // this.event(MainEvent.ShareReward);
    // }

    private onGetServerTimeMS(revc:GetServerTimeMS_revc){
        TimeUtil.serverTimeV = revc.serverTime;
    }

    /**前端自定义存在后端的状态列表数据 */
    private onRedDotUpdateOtpRevc(revc: RedDotUpdate_revc) {
        this.red.redList = revc.datalist;

        let bg = this.red.getValByID(ERedEnum.MUISC_BG);
        if (bg != undefined) {
            E.AudioMgr.SetMusicMute(bg == 0);
        }

        let muisc = this.red.getValByID(ERedEnum.MUISC_EFFECT)
        if (muisc != undefined) {
            E.AudioMgr.SetSoundMute(muisc == 0);
        }
    }

    private onServerVersionRevc(revc:ServerVersion_revc){
        console.log("server version:" + revc.val);
        this.ser_ver = revc.val+"-"+this.serverVer;
    }
    configIsSame:boolean = true;
    private onConfigHashRevc(revc: ConfigHash_revc) {
        let val = revc.val;
        this.hash = revc;
        let diff:boolean = false;
        if (StaticDataMgr.Ins.hasVal != val) {
            // E.ViewMgr.ShowMsgBox(EMsgBoxType.OnlyOk,`配置不统一:${StaticDataMgr.Ins.hasVal},${val}`);
            console.warn(`==============================>配置不一致:客户端${StaticDataMgr.Ins.hasVal},服务器:${val}`);
            diff = true;
            this.configIsSame = false;
        } else {
            console.log(`配置一致:客户端${StaticDataMgr.Ins.hasVal},服务器${val}`);
        }
        if (!Laya.Browser.onPC && typeof wx == "object" && wx) {
            let o = wx.getSystemInfoSync();
            if (o && o.platform == "devtools") {
                E.ViewMgr.ShowMsgBox(EMsgBoxType.OnlyOk, (diff ? "warning 配置不同!!!!":"配置相同") + "\nclient:\n" + StaticDataMgr.Ins.hasVal + "\nserver:\n" + val);
                console.log("============================>"+JSON.stringify(o));
            }
        }
    }

    public gm(str:string){
        // if(debug || Laya.Browser.onPC){
            LogSys.Log(`GM-----[${str}]`);
            let gm = new Gm_req();
            gm.datas = str;
            SocketMgr.Ins.SendMessageBin(gm);
        // }else{
            // E.ViewMgr.ShowMsgBox(EMsgBoxType.OnlyOk,);
            // E.debugMsgBox(`please set URL debug=1`);
        // }
    }
    
    public onErrCodeRevc(data:Err_revc) {
        // if(E.Debug){
        let cfg:Configs.t_Err_dat = ErrCodeProxy.Ins.GetDataById(data.reason);
        console.log('%cErrID:' + data.reason.toString() + " " + (cfg ? cfg.f_err : ""), 'color:#ff0000');
        this.showErr(data.reason);
    }

    onRewardRevc(data:Reward_revc){
        if(data.type == ERewardType.GUIDE || data.type == ERewardType.GUIDE_PVP_ROUND){
            return;
        }

        // if(E.ViewMgr.isOpenReg(EViewType.TaoDaeView)){
        // return;
        // }

        TowerMainFightModel.Ins.boxTempList = TowerMainFightModel.Ins.boxTempList.concat(data.boxes);
        TowerMainFightModel.Ins.rewardList = TowerMainFightModel.Ins.rewardList.concat(data.rewardList);
        TowerMainFightModel.Ins.heroList = TowerMainFightModel.Ins.heroList.concat(data.convertedList);
        if(TowerMainFightModel.Ins.heroList.length){
            E.ViewMgr.Open(EViewType.GetHeroView);
            return;
        }
        if(TowerMainFightModel.Ins.boxTempList.length){
            E.ViewMgr.Open(EViewType.BoxView2);
            return;
        }
        if(TowerMainFightModel.Ins.rewardList.length){
            // E.ViewMgr.Open(EViewType.RewardView,null,TowerMainFightModel.Ins.rewardList);
            let time:number = 0;
            if(data.type == ERewardType.Goose){
                time = GooseConfig.RewardDelay;
            }
            Laya.timer.once(time,this,this.openReward);
        }
    }

    private openReward(){
        E.ViewMgr.Open(EViewType.RewardView,null,TowerMainFightModel.Ins.rewardList);
    }

    private showErr(id:number) {
        let cfg:Configs.t_Err_dat = ErrCodeProxy.Ins.GetDataById(id);
        let _content:string;
        if(cfg){
            _content = cfg.f_err;
        }else{
            _content = id.toString();
        }
        E.ViewMgr.ShowMidError(_content);
    }

    /**
     * 跨天逻辑
     */
    crossDayFunc(){
        // let req = new SignStatus_req();
        // SocketMgr.Ins.SendMessageBin(req);
    
        let _fundRefresh = new FundRefresh_req();
        SocketMgr.Ins.SendMessageBin(_fundRefresh);
        // this.event(MainEvent.EventMainUpdateView);
    }

    /**
     * 跨天
     */
    private onTimeCross() {
        if (this._crossDayTicket < 0) {
            this._crossDayTicket = TimeUtil.curZeroTime + 24 * 3600 - TimeUtil.serverTime;
            this.event(MainEvent.CrossDayUpadte);//跨天触发
            //to do...
            this.crossDayFunc();
        } else {
            // LogSys.Log("剩余:"+TimeUtil.timeFormatStr(this._crossDayTicket,true));
        }
        this._crossDayTicket--;
    }

    /**通用奖励是否已经领取 */
    isCommonLingQu(flag:ECommonClaimType){
        let cell = this.commonTimes.find(o=>o.flag == flag);
        return cell && cell.times > 0;
    }
    private debugDelCommtime(){
        if(Laya.Utils.getQueryString("commonTimesGuide1Clear")){
            // this.commonTimes = [];
            for(let i = 0;i < this.commonTimes.length;i++){
                let vo = this.commonTimes[i];
                if(vo.flag == ECommonClaimType.FIGHT_GUIDE_REWARD){
                    this.commonTimes.splice(i,1);
                    i--;
                }
            }
        }
    }
    /**
     * 3010初始化推送
     */
    private onInitRevc(data:Init_revc){
        this.debugDelCommtime();
        E.LangMgr.rebuild();
        //初始化完成
        E.taLoginTrack("3010initComplete");
        // console.log("3010初始化推送")
        // this.openMainView();
        // this.event(MainEvent.DataInit);
        // JjcFactory.initTest();

        // 初始化SDK需要的玩家数据
        const playerLevel = this.mRoleData.lv;
        E.sdk.setPlayerData({
            role_id: this.mRoleData.AccountId.toString(),
            role_name: this.mRoleData.NickName,
            role_level: playerLevel,
            server_id: this.mRoleData.serverId.toString(),
            server_name: this.mRoleData.serverName,
            role_vip: playerLevel,
            role_power: this.mRoleData.plus,
        });
        // sdk事件上报——进入游戏
        E.sdk.valChange(ESdkValChange.EnterGame, 0);

        // 判读是否从挂机邀请入口进
        LogSys.Log(">>>>>>>>>>>>onInitRevc")
        if (window['wx']) {
            window['wxOnShow'] = (result) => {
                console.log('wxOnShow: ', result);
                // 缓存onShow数据（防止ws断开，协议发送失败）
                window['onShowData'] = result;
                try {
                    E.sdk.onShow(result);
                    MainModel.Ins.event(MainEvent.WxOnShow, result);
                    console.log(">>>>>>>>>>>>onWxOnShow")
                } catch(e) {};
            }
            const data = wx.getLaunchOptionsSync();
            console.log('launch: ', data);
            E.sdk.onShow(data);
            if(E.ta){
                E.ta.userSetOnce({user_source:data['scene']});
            }
            if (window['onShowData']) {
                // 如果有缓存的onShow数据，再执行一遍onShow（断线重连）
                E.sdk.onShow(data);
            }
        
            wx.onHide = function(){
                E.sdk.onHide();
            }
        }
        //////////////////////////////////////////////////////////////////////////////////
        this._crossDayTicket = TimeUtil.curZeroTime + 24 * 3600 - TimeUtil.serverTime;
        Laya.timer.loop(1000,this,this.onTimeCross);

        //////////////////////////////////////////////////////////////////////////////////
        this.isInitAlready = true;
        this._initTime = Laya.timer.currTimer;

        let bo = TowertMainCardModel.Ins.isCardEnough();
        if (bo && !StringUtil.IsNullOrEmpty(TowerMainFightModel.Ins.wxFriendRoomId)) {
            //好友邀请进来的
            TowerMainFightModel.Ins.sendFriendCmd(2, TowerMainFightModel.Ins.wxFriendRoomId);
            this.finishGuideReward();
        } else {
            let req: EnterFightAgain_req = new EnterFightAgain_req();
            SocketMgr.Ins.SendMessageBin(req);
        }
        this.guideAdapter.onInitRevc();
        GuideModel.Ins.taskId = -1;
    }
    /*


+---------+     +------+       +-------+
|pvp回合制|---->|巅峰赛|-----> | 突围战 |
+---------+     +------+       +-------+



需求2:
5级后强制进入“巅峰竞技场”，原来的进不去；10级开放突围战

1.pvp回合制战斗 在5级之后 切换成巅峰竞技场(开放巅峰竞技场时走一下巅峰竞技场新手引导) 
2.接着10级后开放突围战


    */
    /**是否是PVP战斗引导状态 */
    get isPvpFightGuide() {
        if(this.red.getValByID(ERedEnum.FIGHT_GUIDE)){
            return false;
        }
        if(parseInt(System_RefreshTimeProxy.Ins.getVal(ESystemRefreshTime.FIGHT_GUIDE_DISABLE)) == 1){
            return false;
        }
        //pve引导开启的时候关闭pvp引导
/*      if(FunctionModel.Ins.isOpenByFuncId(EFuncDef.PVEGuide,false)){
            return false;
        }       */

        if(this.isCommonLingQu(ECommonClaimType.FIGHT_GUIDE_REWARD)){
            return false;
        }
        if(!FunctionModel.Ins.isOpenByFuncId(EFuncDef.DFS,false)){
            return false;
        }
        if(this.mRoleData && this.mRoleData && this.mRoleData.mPlayer.level >= FuncProxy.Ins.getCfgByFuncId(EFuncDef.DFS).f_level ){
            return false;
        }

        return true;
    }

    get isPveGuide(){
        return this.guideAdapter && this.guideAdapter.isRunning;
    }
    /**是否是局内引导 */
    get isInsideGuide(){
        return this.isPveGuide || this.isPvpFightGuide;
    }

    /**是否是提审模式 */
    public isVerify(cfg:Configs.t_func_dat){
        if(this.verify ){
            if(initConfig.platform == PlatformConfig.TAPTAP){
                if( cfg.f_ts_tap == 1){
                    return true;
                }
                return false;
            }
            else if(cfg.f_ts){
                return true;
            }
        }
        return false;
    }
    private readonly mUseEffect:boolean = false;
    public openMainView(){
        if(this.mUseEffect){
            E.taLoginTrack("SpineUtilInit");
            SpineUtil.init(new Laya.Handler(this,this.onLoadHandler));
        }else{
            this.onLoadHandler();
        }
    }

    private onLoadHandler(){
        E.taLoginTrack("loginComplete");
        if(this.loginTime != 0){
            let time = Laya.timer.currTimer - this.loginTime;
            E.sendTrack("loginTime",{loginTime:time});
            this.loginTime = 0;
        }
        // console.log("登录完成");
        this.gmt.onStartGame();

        this.startGame();
    }

    startGame(){
        /*
        //PVP 引导流程
        let _sceneInfo:FightSceneInfo_revc = ComposeModel.Ins.sceneInfo;
        let toBattle:boolean = false;
        let isGuide:boolean = false;
        if (_sceneInfo.status == ERoomStatus.Without) {
            //没有房间
            if (this.isPvpFightGuide) {
                FightGuide.Ins.initData();
                isGuide = true;
                toBattle = true;
            }

        } else if (_sceneInfo.status == ERoomStatus.Has) {
            // GuideModel.Ins.taskId = -1;//关闭战斗新手引导
            toBattle = true;
        }
        if(Laya.Utils.getQueryString("clientfight")){
            toBattle = true;
        }
        //=========================================
        E.ViewMgr.CloseAll();//这里会清理所有的数据
        if (toBattle) {
            let fs = new FightSource();

            if(isGuide){
                fs.source = EFightSceneStatus.Guide;
            }else{
                fs.source = EFightSceneStatus.ReConnect;
            }
            LogSys.Log("============>startGame:"+fs.source);//微信切后台之后 会走 重连 这里需要处理
            //进入战斗主视图
            E.ViewMgr.Open(EViewType.ComposeMain,null,fs);
        } else {
            //进入主界面
            E.ViewMgr.Open(EViewType.Main);
        }
        */

        //================================================================================
        let _sceneInfo: FightSceneInfo_revc = ComposeModel.Ins.sceneInfo;
        let toBattle: boolean = false;
        // let isGuide: boolean = false;

        let _source:EFightSceneStatus = EFightSceneStatus.ReConnect;
        if(_sceneInfo){
            if (_sceneInfo.status == ERoomStatus.Without) {
                //没有房间
            }else if (_sceneInfo.status == ERoomStatus.Has) {
                toBattle = true;
            }
        }
        if (Laya.Utils.getQueryString("disable_guide")) {

        } else {
            if (this.isPveGuide) {
                //PVE引导
                _source = EFightSceneStatus.PVE_Guide;
                toBattle = true;
            } else if (this.isPvpFightGuide) {
                //PVP引导
                _source = EFightSceneStatus.PVP_Fight_Guide;
                toBattle = true;
            }
        }
        //================================================================================
        this.clearSceneData(_source);
        E.ViewMgr.CloseAll();//这里会清理所有的数据
        Laya.timer.callLater(this,this.onStartHandler,[toBattle,_source]);
    }

    /**开始战斗 */
    private onStartHandler(toBattle:boolean,_source:EFightSceneStatus){
        this.guideInit();
        if (toBattle) {
            LogSys.Log("============>startGame:" + _source);//微信切后台之后 会走 重连 这里需要处理
            //进入战斗主视图
            E.ViewMgr.Open(EViewType.ComposeMain, null, _source);
        } else {
            //进入主界面
            E.ViewMgr.Open(EViewType.Main);
        }
    }

    guideInit(){
        if(Laya.Utils.getQueryString("disable_guide")){
            return;
        }

        if (this.isPveGuide) {
            //PVE引导
            this.pveGuide.initData();
        }
        else if(this.isPvpFightGuide)
        {
            //老 PVP引导
            FightGuide.Ins.initData();
        }
        else if(this.mainGuide.isRunning){
            //主界面新手引导
            this.mainGuide.initData();
        }
    }

    finishGuideReward(){
        this.red.save(ERedEnum.FIGHT_GUIDE,1);//存储新手引导状态
        let req = new CommonClaimRewards_req();
        req.flag = ECommonClaimType.FIGHT_GUIDE_REWARD;
        SocketMgr.Ins.SendMessageBin(req);
    }

    /**下一个刷新时间戳 每日的3:00:00 */
    public get nextTime() {
        let zero = TimeUtil.getZeroSecond(TimeUtil.serverTime);

        zero += G.gameData.refreshSec;
        let sub: number = 0;
        if (zero > TimeUtil.serverTime) {
            sub = zero;
        } else {
            sub = zero + 86400;
        }
        return sub;
    }


    public convertHead(url:string){
        let u = E.gameAdapter.convertHead(url);
        if(u){
            return u;
        }
        return url == "" ? `o/basehead/1.png` : url;
    }

    private disposeHtmlCanvas() {
        if(this._htmlHTMLCanvas){
            this._htmlHTMLCanvas.release();
            this._htmlHTMLCanvas.clear();
            this._htmlHTMLCanvas.destroy();
        }
        this._snapSpr.graphics.clear();
    }
    public set mainMask(v:boolean){
        if(!DrawCallConfig.snapshotMask){
            return;
        }
    }

    private _snapSpr:Laya.Image = new Laya.Image();
    private _htmlHTMLCanvas;
    private drawLater(){
        if(!DrawCallConfig.snapshotMask){
            return;
        }

        if(this._htmlHTMLCanvas){
            return;//只截取一次
        }

        this.disposeHtmlCanvas();
        let w: number = Laya.Render['_mainCanvas'].width;
        let h: number = Laya.Render['_mainCanvas'].height;
        let htmlHTMLCanvas:any  = Laya.stage.drawToCanvas(w,h,0,0);//截屏

        this._htmlHTMLCanvas = htmlHTMLCanvas;
        //////////////////////////////////////////////////
        let spr: Laya.Image = this._snapSpr;
        if(debug){
            let offset:number = 2;
            spr.graphics.drawRect(offset,offset,w,h,null,"#ff0000",offset*2);
        }
        let tex = htmlHTMLCanvas.getTexture();
        // if(!spr.filters){    
        //      IOS  的 bug 不可用 
        // laya.core.js 12990                 console.warn("cache bitmap size larger than 2048,cache ignored");

        //     let blurFilter: Laya.BlurFilter = new Laya.BlurFilter();
        //     blurFilter.strength = 15;
        //     spr.filters = [blurFilter];
        // }
        spr.graphics.drawTexture(tex,0,0,w,h);
        
        // spr.gray = true;//灰度

        // Laya.timer.frameOnce(1,this,()=>{
        spr.scaleX = 1/(w /Laya.stage.width);
        spr.scaleY = 1/(h /Laya.stage.height);
        // });

        // E.ViewMgr.ShowMidError("snapshot!!!");
    }
    /*
    * 点击屏幕截取stage上的0,0,w,h的像素并存储到一个Laya.Component对象中
    */
    public snapshot() {
        Laya.timer.frameOnce(60,this,this.drawLater);
        // this.drawLater();
    }

    public showSnap(v){
        if (v) {
            if (this._snapSpr) {
                Laya.stage.addChild(this._snapSpr);
            }
        }else{
            if (this._snapSpr) {
                this._snapSpr.removeSelf();
                this._snapSpr.graphics.clear();
            }
        }
    }
    // protected readonly pwd:string = "0";
    // private curVer:string = "";
    public connectRegist(){   
        E.taLoginTrack("serverInfoReq");      
        E.ViewMgr.openWait(true);
        // this.curVer = E.ver;
        HttpUtil.httpGet(E.curURL,new Laya.Handler(this,this.loginComplete));
    }
    private onSureHandler(){
        LayerMgr.Ins.pageToLogin();
    }
    private loginComplete(data:string){
        E.ViewMgr.closeWait();
        // console.log("loginComplete",data);
        LogSys.Log(data);
        let obj:ILoginCode = JSON.parse(data);
        InitConfig.wxLoginResult = obj;
        let serid = Laya.Utils.getQueryString("serid");
        if(obj.code!=0){
            //登录失败
            E.sendTrack("onWebSocketError", { code: obj.code, val: obj.msg });
            E.ViewMgr.closeLoading();

            E.ViewMgr.ShowMsgBox(EMsgBoxType.OnlyOk,obj.msg||"",undefined,undefined,new Laya.Handler(this,this.onSureHandler));
            return;
        }
        // if(window["initConfig"]["tcp"]){
        //     InitConfig.wxLoginResult.result.tcp = window["initConfig"]["tcp"];
        // }
        if(serid){
            InitConfig.wxLoginResult.result.tcp = `wss://dev-ws-server.game.wanhuir.com/${serid}`;
            // #client time# 2023-04-11 13:49:12[Log] {"code":0,"msg":"success","result":{"appid":"wx8070b90126a0b503","openid":"c2","tcp":"wss://dev-ws-server.game.wanhuir.com/14","token":"0082febb1af0fe3d51a60d07bbe3724e"}}
        }
        let tcp = InitConfig.tcp;
        if(tcp){
            InitConfig.wxLoginResult.result.tcp = tcp;
        }
        
        if(Laya.Utils.getQueryString("tcp")){
            InitConfig.wxLoginResult.result.tcp = Laya.Utils.getQueryString("tcp");
        }

        E.taLoginTrack("linkSocket");
        // console.log("链接socket")
        SocketMgr.Ins.ConnectWebsocket(this, () => {
            // console.log("loginComplete.",data);

            // if(InitConfig.getPlatform() == PlatformConfig.WeiXin){
                    if(obj.code == ELoginCode.Succeed){
                            //     `
                            //  {"code":0,"msg":"success","result":{"appid":"wx8070b90126a0b503","openid":"01234567890123456789","tcp":"wss://ws-server.game.wanhuir.com/12","token":"09e0757e41a9f696f9372d67a5243a0b"}}
                            //     `
                        LoginClient.Ins.wxNormalLogin();
                    }else{
                        //请求异常
                    }
            // }else{
            // }
        });
    }

    setTTHead(headImg: Laya.Image, t: string) {
        if ("http" == t.slice(0, 4) && Laya.Browser.onTTMiniGame) {
            const i = new Image();
            i.src = t, i.onload = (() => {
                const t = i.width / headImg.width, s = new Laya.Texture2D(i.width / t, i.height / t, Laya.TextureFormat.R8G8B8A8);
                headImg.graphics.drawImage(new Laya.Texture(s), 0, (headImg.height - i.height / t) / 2),
                    s.loadImageSource(i);
            });
        } else {
            headImg.skin = t;
        }
    }
 
    // /**是否是本地websocket服务器 */
    // public get isLoalWebSocket(){
    //     if(Laya.Utils.getQueryString("tcp")=="ws://127.0.0.1:8004"){
    //         return;
    //     }
    // }

    
    /**外部皮肤样式 */
    createBtnByFuncid(funcId: number) {
        let skin = new ui.views.main.ui_little_iconUI();
        return new BaseSettingBtn(skin,funcId,null,funcId.toString());
    }
    public createItemList(l:stCellValue[]):ItemVo[]{
        let _rl = [];
        for(let i = 0; i < l.length;i++){
            let cell:stCellValue = l[i];
            let item:ItemVo = new ItemVo();
            item.cfgId = cell.id;
            item.count = cell.count;
            _rl.push(item);
        }
        return _rl;
    }

    get isNewPvpGuideComplete() {
        return false;
    }

    /**是否是新版本的个人信息 */
    get isDetailVer2() {
        // return Laya.Utils.getQueryString("detail") != undefined;
        return true;
    }

    /**查看个人信息 */
    private onWatchSelf(){
        if(this.isDetailVer2){
            let revc:WatchCommonRankDetail_revc = new WatchCommonRankDetail_revc();
            revc.playerData = this.mRoleData.mPlayer;
            E.ViewMgr.Open(EViewType.PlayerInfoView,null,revc);
        }else{
            E.ViewMgr.Open(EViewType.RoleInfoView);
        }
    }
}




