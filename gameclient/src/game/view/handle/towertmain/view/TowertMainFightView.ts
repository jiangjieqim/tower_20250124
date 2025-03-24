// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { ui } from "../../../../../ui/layaMaxUI";
import { EViewType } from "../../../../common/defines/EnumDefine";
import { E, ScreenAdapter } from "../../../../G";
import { MainTask_req, stChat } from "../../../../network/protocols/BaseProto";
import { SocketMgr } from "../../../../network/SocketMgr";
import { ActivityModel } from "../../activity/ActivityModel";
import { SimpleEffect } from "../../avatar/SimpleEffect";
// import { YinDaoModel } from "../../yindao/YinDaoModel";
import { ChatModel } from "../../chat/model/ChatModel";
import { ChengHaoModel } from "../../chenghao/model/ChengHaoModel";
import { DotManager } from "../../common/DotManager";
import { HeadCtl } from "../../common/HeadCtl";
import { ComposeModel } from "../../compose/ComposeModel";
import { DianYuModel } from "../../dianyu/model/DianYuModel";
import { FriendModel } from "../../friend/model/FriendModel";
import { FunctionModel } from "../../funs/FunctionModel";
import { MainIconProxy } from "../../funs/proxy/FunctionProxy";
import { System_RefreshTimeProxy } from "../../main/ctl/System_RefreshTimeProxy";
import { ValCtl } from "../../main/ctl/ValLisCtl";
import { EFuncDef } from "../../main/model/EFuncDef";
import { GameEvent } from "../../main/model/GameEvent";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { MainModel } from "../../main/model/MainModel";
import { ItemSlotCtl } from "../../main/views/icon/SoltItemView";
import { TopBtnList } from "../../main/views/new2/TopBtnList";
import { ECellType } from "../../main/vos/ECellType";
import { SheZhiModel } from "../../shezhi/model/SheZhiModel";
import { TowerMainEvent } from "../model/TowerMainEvent";
import { TowerMainFightModel } from "../model/TowerMainFightModel";
import { TowerMainModel } from "../model/TowerMainModel";
import { t_Main_Task } from "../proxy/t_Main_Task";
import { t_Medal } from "../proxy/t_Medal";
import { t_Player_Exp } from "../proxy/t_Player_Exp";
import { t_Pvp_Daily_Reward } from "../proxy/t_Pvp_Daily_Reward";
import { t_Trophy_Reward } from "../proxy/t_Trophy_Reward";
import { BoxItem } from "./item/BoxItem";
import { SetIconItem } from "./item/SetIconItem";

export class TowertMainFightView extends ui.views.main.ui_tower_main_fight_viewUI{

    private _leftbtnList:TopBtnList;//顶部按钮
    private _rightbtnList:TopBtnList;//顶部按钮

    private _wid:number;

    private _se:SimpleEffect;
    private _se1:SimpleEffect;
    private _se2:SimpleEffect;
    private _se3:SimpleEffect;
    private _seAct:SimpleEffect;

    // private _chenghaoCtl:ChengHaoCtl;
    private _headCtl:HeadCtl;
    
    private _yun1:SimpleEffect;
    // private _yun2:SimpleEffect;
    private _hz:SimpleEffect;
    private _hzTimer:Laya.Timer;

    private _viewi:ItemSlotCtl;
    private _proW:number;

    private _viewrw:ItemSlotCtl;
    private _simRE:SimpleEffect;

    private _isSetUI:boolean;
    
    constructor(){
        super();
        this.onInit();
    }
    private onInit(){
        // super.createChildren();
        this.on(Laya.Event.DISPLAY,this,this.onDisplay);
        this.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
        this._isSetUI = false;

        ValCtl.Create(this.money1.lab,this.money1.icon,ECellType.JINBI,this.money1.sp);
        ValCtl.Create(this.money2.lab,this.money2.icon,ECellType.SHUIJING,this.money2.sp);
        ValCtl.Create(this.money3.lab,this.money3.icon,ECellType.TILI,this.money3.sp);

        ButtonCtl.Create(this.btn_fight,new Laya.Handler(this,this.onBtnFightClick));
        ButtonCtl.Create(this.btn_hz,new Laya.Handler(this,this.onBtnHZClick));
        ButtonCtl.Create(this.btn1,new Laya.Handler(this,this.onBtn1Click));
        ButtonCtl.Create(this.img_tr,new Laya.Handler(this,this.onBtnTRClick));
        ButtonCtl.Create(this.btn_set,new Laya.Handler(this,this.onBtnSetClick));
        ButtonCtl.Create(this.btn_qd,new Laya.Handler(this,this.onBtnQDClick));
        ButtonCtl.Create(this.btn_a,new Laya.Handler(this,this.onBtnAClick));
        ButtonCtl.Create(this.btn_f,new Laya.Handler(this,this.onBtnFClick));
        ButtonCtl.Create(this.btn_p,new Laya.Handler(this,this.onBtnPClick));

        this.sp_t.on(Laya.Event.CLICK,this,this.onTrClick);
        this.sp_t1.on(Laya.Event.CLICK,this,this.onTrClick);
        this.img_c.on(Laya.Event.CLICK,this,this.onBtnChatClick);
        this._viewi = new ItemSlotCtl(this.viewi);
        this._proW = this.pro_t.width;

        this._viewrw = new ItemSlotCtl(this.view_rw);

        // this._chenghaoCtl = new ChengHaoCtl(this.chenghao);
        // this.chenghao.on(Laya.Event.CLICK,this,this.onChengHaoClick);

        this._headCtl = new HeadCtl(this.headView);
        this.headView.on(Laya.Event.CLICK,this,this.onImgClick);

        this.img_rw.on(Laya.Event.CLICK,this,this.onRWClick);

        this._wid = this.pro.width;

        this._leftbtnList = new TopBtnList();
        this._leftbtnList.type = 1;
        this._leftbtnList.minRow = 5;
        this._leftbtnList.con = this.leftList;
        this._leftbtnList.init();
        this._leftbtnList.bindBtn(this.leftBtn);

        this._rightbtnList = new TopBtnList();
        this._rightbtnList.type = 2;
        this._rightbtnList.minRow = 5;
        this._rightbtnList.con = this.rightList;
        this._rightbtnList.init();
        this._rightbtnList.bindBtn(this.rightBtn);

        // this.boxList.itemRender = BoxItem;
        // this.boxList.renderHandler = new Laya.Handler(this,this.onBoxRenderHandler);

        this._isSetInit = false;
        this.list_set.itemRender = SetIconItem;
        this.list_set.renderHandler = new Laya.Handler(this,this.onSetRenderHandler);
        // this.onDisplay();
    }


    private onSetRenderHandler(item:SetIconItem){
        item.setData(item.dataSource);
    }

    private onChengHaoClick(){
        E.ViewMgr.Open(EViewType.ChengHaoView);
    }

    private onImgClick(){
        E.EventMgr.emit(GameEvent.WatchSelf);
    }

    private onRWClick(){
        if(TowerMainFightModel.Ins.mainTask.status == 1){
            let req = new MainTask_req;
            req.id = TowerMainFightModel.Ins.mainTask.id;
            SocketMgr.Ins.SendMessageBin(req);
        }
    }

    private onBoxRenderHandler(item:BoxItem){
        item.setData(item.dataSource);
    }

    private onBtnFightClick(){
        ComposeModel.Ins.startMatchPvpRound();
    }

    private onBtnQDClick(){
        // E.ViewMgr.ShowMidError(E.getLang("NotYetOpen"));
        if(FunctionModel.Ins.isOpenByFuncId(EFuncDef.DFS)){
            ComposeModel.Ins.startMatch();
        }
    }

    private onBtnHZClick(){
        if(FunctionModel.Ins.isOpenByFuncId(EFuncDef.TuWeiZhan)){
            E.ViewMgr.Open(EViewType.TWZView);
        }
        // ComposeModel.Ins.startMatchPve();
    }

    private onBtn1Click(){
        E.ViewMgr.Open(EViewType.DianYuView);
    }

    private onBtnTRClick(){
        E.ViewMgr.Open(EViewType.TrophyNewView);
    }

    protected onDisplay(): void {
        this.setUI();
        TowerMainModel.Ins.on(TowerMainEvent.UpdateRoleData,this,this.updateRole);
        TowerMainModel.Ins.on(TowerMainEvent.FunctionChange,this,this.updateFunChange);
        ActivityModel.Ins.on(ActivityModel.UPDATE_STATUS_DATA,this,this.onUpdateActList);
        // TowerMainFightModel.Ins.on(TowerMainFightModel.UPDATE_BOX,this,this.updateBox);
        // TeQuanKaModel.Ins.on(TeQuanKaModel.UPDATE_DATA,this,this.updateBox);
        TowerMainFightModel.Ins.on(TowerMainFightModel.UPDATE_FRIEND_REWARD,this,this.onUpdateRedTip);
        TowerMainFightModel.Ins.on(TowerMainFightModel.TROPHY_REWARD,this,this.onUpdateRedTip);
        FunctionModel.Ins.on(TowerMainEvent.FuncSmallIconUpdate,this,this.onUpdateRedTip);
        ChengHaoModel.Ins.on(ChengHaoModel.UPDATE_DATA,this,this.onUpdateRedTip);
        TowerMainFightModel.Ins.on(TowerMainFightModel.UPDATE_PVP,this,this.onUpdateRedTip);
        TowerMainFightModel.Ins.on(TowerMainFightModel.UPDATE_INVITE,this,this.onUpdateRedTip);
        FriendModel.Ins.on(FriendModel.UPDATE_VIEW,this,this.onUpdateRedTip);
        TowerMainFightModel.Ins.on(TowerMainFightModel.UPDATE_CHAT,this,this.onUpdateRedTip);
        ActivityModel.Ins.on(ActivityModel.UPDATE_DATA,this,this.onUpdateRedTip);
        TowerMainModel.Ins.on(TowerMainEvent.ValChange,this,this.onUpdateRedTip);
        // ChengHaoModel.Ins.on(ChengHaoModel.UPDATE_TITLE,this,this.updateCH);
        TowerMainFightModel.Ins.on(TowerMainFightModel.FUN_POP_DATE,this,this.updateTLView);
        // YinDaoModel.Ins.on(YinDaoModel.UPDATE_VIEW,this,this.setYinDao);
        // MainModel.Ins.on(TowerMainEvent.MainViewLayerChange,this,this.setYinDao);
        ChatModel.Ins.on(ChatModel.UPDATE_MAIN,this,this.onUpdateChat);
        TowerMainFightModel.Ins.on(TowerMainFightModel.todaySpirit,this,this.updatePvpNum);
        // TowerMainFightModel.Ins.on(TowerMainFightModel.PVP_LOCK,this,this.updatePWS);
        TowerMainFightModel.Ins.on(TowerMainFightModel.TROPHY_REWARD,this,this.updateTR);
        TowerMainFightModel.Ins.on(TowerMainFightModel.UPDATE_TASK,this,this.updateTask);
        this.updateView();
        this.playSE();
        this.updateRedTip();
        this.updateTLView();
        this.updatePWS();
        this.updateSetView();
        this.setBtn();
        SheZhiModel.Ins.noticeSel.autoOpen();
        // this.setYinDao();
        if(TowerMainFightModel.Ins.friendRoomId != ""){
            E.ViewMgr.Open(EViewType.FriendFightView1);
        }
        if(TowerMainFightModel.Ins.isShowDWTS){
            TowerMainFightModel.Ins.isShowDWTS = false;
            E.ViewMgr.Open(EViewType.DWTSView);
        }
    }

    protected onUnDisplay(): void {
        TowerMainModel.Ins.off(TowerMainEvent.UpdateRoleData,this,this.updateRole);
        TowerMainModel.Ins.off(TowerMainEvent.FunctionChange,this,this.updateFunChange);
        ActivityModel.Ins.off(ActivityModel.UPDATE_STATUS_DATA,this,this.onUpdateActList);
        // TowerMainFightModel.Ins.off(TowerMainFightModel.UPDATE_BOX,this,this.updateBox);
        // TeQuanKaModel.Ins.off(TeQuanKaModel.UPDATE_DATA,this,this.updateBox);
        TowerMainFightModel.Ins.off(TowerMainFightModel.UPDATE_FRIEND_REWARD,this,this.onUpdateRedTip);
        TowerMainFightModel.Ins.off(TowerMainFightModel.TROPHY_REWARD,this,this.onUpdateRedTip);
        FunctionModel.Ins.off(TowerMainEvent.FuncSmallIconUpdate,this,this.onUpdateRedTip);
        ChengHaoModel.Ins.off(ChengHaoModel.UPDATE_DATA,this,this.onUpdateRedTip);
        TowerMainFightModel.Ins.off(TowerMainFightModel.UPDATE_PVP,this,this.onUpdateRedTip);
        TowerMainFightModel.Ins.off(TowerMainFightModel.UPDATE_INVITE,this,this.onUpdateRedTip);
        FriendModel.Ins.off(FriendModel.UPDATE_VIEW,this,this.onUpdateRedTip);
        TowerMainFightModel.Ins.off(TowerMainFightModel.UPDATE_CHAT,this,this.onUpdateRedTip);
        ActivityModel.Ins.off(ActivityModel.UPDATE_DATA,this,this.onUpdateRedTip);
        TowerMainModel.Ins.off(TowerMainEvent.ValChange,this,this.onUpdateRedTip);
        // ChengHaoModel.Ins.off(ChengHaoModel.UPDATE_TITLE,this,this.updateCH);
        TowerMainFightModel.Ins.off(TowerMainFightModel.FUN_POP_DATE,this,this.updateTLView);
        // YinDaoModel.Ins.off(YinDaoModel.UPDATE_VIEW,this,this.setYinDao);
        // MainModel.Ins.off(TowerMainEvent.MainViewLayerChange,this,this.setYinDao);
        ChatModel.Ins.off(ChatModel.UPDATE_MAIN,this,this.onUpdateChat);
        TowerMainFightModel.Ins.off(TowerMainFightModel.todaySpirit,this,this.updatePvpNum);
        // TowerMainFightModel.Ins.off(TowerMainFightModel.PVP_LOCK,this,this.updatePWS);
        TowerMainFightModel.Ins.off(TowerMainFightModel.TROPHY_REWARD,this,this.updateTR);
        TowerMainFightModel.Ins.off(TowerMainFightModel.UPDATE_TASK,this,this.updateTask);
        this.disposeSE();
        if(this._hzTimer){
            this._hzTimer.clear(this,this.playHZ);
            this._hzTimer = null;
        }
        // YinDaoModel.Ins.removeYD();
    }

    private setBtn(){
        if(FunctionModel.Ins.isOpenByFuncId(EFuncDef.Friend,false)){
            this.btn_f.visible = true;
        }else{
            this.btn_f.visible = false;
        }
        if(FunctionModel.Ins.isOpenByFuncId(EFuncDef.PHB,false)){
            this.btn_p.visible = true;
        }else{
            this.btn_p.visible = false;
        }
    }

    // private setYinDao(){
    //     Laya.timer.frameOnce(2,this,()=>{
    //         YinDaoModel.Ins.addYD(2000);
    //     })
    // }

    private _isSet:boolean;
    private _isSetInit:boolean;
    private updateSetView(){
        this._isSet = false;
        this.img_set.visible = false;

        if (!this._isSetInit) {
            this._isSetInit = true;
            let array = [];
            let arr = MainIconProxy.Ins.List;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].f_pos == 3 && FunctionModel.Ins.isOpenByFuncId(arr[i].f_funid)) {
                    array.push(arr[i]);
                }
            }
            array.sort(this.onSort);
            this.list_set.array = array;
            this.list_set.height = (67 + this.list_set.spaceY) * array.length - this.list_set.spaceY;
            this.img_set.height = this.list_set.height + 60;
        }
    }

    private onSort(a:Configs.t_MainIcon_dat,b:Configs.t_MainIcon_dat){
        return a.f_sort - b.f_sort;
    }

    private onBtnSetClick(){
        this._isSet = !this._isSet;
        if(this._isSet){
            this.img_set.visible = true;
        }else{
            this.img_set.visible = false;
        }
    }

    private onBtnAClick(){
        E.ViewMgr.Open(EViewType.MainActivityView);
    }

    private onBtnFClick(){
        E.ViewMgr.Open(EViewType.FriendView);
    }

    private onBtnPClick(){
        E.ViewMgr.OpenByFuncid(EFuncDef.PHB);
    }

    private onTrClick(){
        E.ViewMgr.Open(EViewType.TrophyNewView);
    }

    private onBtnChatClick(){
        E.ViewMgr.OpenByFuncid(EFuncDef.Chat);
    }

    private updateTLView(){
        TowerMainFightModel.Ins.popView();
    }

    private onUpdateRedTip(){
        Laya.timer.callLater(this,this.updateRedTip);
    }

    private updateRedTip(){
        // if(TowerMainFightModel.Ins.isFriendRewardRedTip()){
        //     DotManager.addDot(this.btn1);
        // }else{
        //     DotManager.removeDot(this.btn1);
        // }
        if(TowerMainFightModel.Ins.isTrophyRedTip()){
            DotManager.addDot(this.img_tr,-10,-10);
        }else{
            DotManager.removeDot(this.img_tr);
        }
        // if(ChengHaoModel.Ins.isRedTip()){
        //     this.rt_ch.visible = true;
        // }else{
        //     this.rt_ch.visible = false;
        // }
        if(TowerMainFightModel.Ins.isSetRedTip()){
            DotManager.addDot(this.btn_set,10);
        }else{
            DotManager.removeDot(this.btn_set);
        }
        if(TowerMainFightModel.Ins.isPvpRedTip()){
            DotManager.addDot(this.btn_fight,-20,-10);
        }else{
            DotManager.removeDot(this.btn_fight);
        }
        if(TowerMainFightModel.Ins.isRedTipPve()){
            DotManager.addDot(this.btn_hz);
        }else{
            DotManager.removeDot(this.btn_hz);
        }
        if(FriendModel.Ins.isRedTip()){
            DotManager.addDot(this.btn_f);
        }else{
            DotManager.removeDot(this.btn_f);
        }
        if(TowerMainFightModel.Ins.isChatRedTip()){
            this.red_c.visible = true;
        }else{
            this.red_c.visible = false;
        }
        if(DianYuModel.Ins.isRedTip()){
            DotManager.addDot(this.btn1);
        }else{
            DotManager.removeDot(this.btn1);
        }
        if(TowerMainFightModel.Ins.isZSBZRedTip()){
            DotManager.addDot(this.btn_a);
        }else{
            DotManager.removeDot(this.btn_a);
        }
    }

    private playSE(){
        this._se = new SimpleEffect(this.sp_f, `o/spine/succeed/PWS_TXT/PWS_TXT`,this.sp_f.width*0.5,this.sp_f.height*0.5);
        this._se.play(0,true);
        this._se1 = new SimpleEffect(this.sp_r, `o/spine/succeed/TWZ_TXT/TWZ_TXT`,this.sp_r.width*0.5,this.sp_r.height*0.5);
        this._se1.play(0,true);
        this._se3 = new SimpleEffect(this.sp_d, `o/spine/succeed/dianfeng/dianfeng`,this.sp_d.width*0.5,this.sp_d.height*0.5);
        this._se3.play(0,true);
        this._se2 = new SimpleEffect(this.sp_hy, `o/spine/succeed/FKYQ/FKYQ`,this.sp_hy.width*0.5,-this.btn1.height*0.5);
        this._se2.play(0,true);
        this._yun1 = new SimpleEffect(this.yun1, `o/spine/scene/UI_zhu/UI_zhu`,this.yun1.width*0.5,this.yun1.height*0.5);
        this._yun1.play(0,true);
        this._seAct = new SimpleEffect(this.sp_act, `o/spine/succeed/icon_laohuji/icon_laohuji`,this.sp_act.width*0.5,-this.btn_a.height*0.5);
        this._seAct.play(0,true);
        // this._yun2 = new SimpleEffect(this.yun2, `o/spine/succeed/yun1/yun1`,this.yun2.width*0.5,this.yun2.height*0.5);
        // this._yun2.play(0,true);

        if(!this._hzTimer){
            this._hzTimer = new Laya.Timer;
        }
        this._hz = new SimpleEffect(this.hz, `o/spine/succeed/yunhouzi/houzi`,this.hz.width*0.5,this.hz.height*0.5);
        this.playHZEnd();
    }

    private playHZ(){
        this._hz.play(1, false, this, this.playHZEnd);
    }

    private playHZEnd(){
        this._hz.play(0,true);
        let n = parseInt(System_RefreshTimeProxy.Ins.getVal(39));
        this._hzTimer.once(n,this,this.playHZ);
    }

    private disposeSE(){
        if(this._se){
            this._se.dispose();
            this._se = null;
        }
        if(this._se1){
            this._se1.dispose();
            this._se1 = null;
        }
        if(this._se3){
            this._se3.dispose();
            this._se3 = null;
        }
        if(this._se2){
            this._se2.dispose();
            this._se2 = null;
        }
        if(this._yun1){
            this._yun1.dispose();
            this._yun1 = null;
        }
        if(this._seAct){
            this._seAct.dispose();
            this._seAct = null;
        }
        if(this._hz){
            this._hz.dispose();
            this._hz = null;
        }
        if(this._hzEff){
            this._hzEff.dispose();
            this._hzEff = null;
        }
        if(this._simRE){
            this._simRE.dispose();
            this._simRE = null;
        }
    }

    private updateView(){
        this.updateRole();
        this.updateActList();
        // this.updateBox();
        // this.updateCH();
        this.updateChat(0);
        this.updatePvpNum();
        this.updateTR();
        this.updateTask();
    }

    private updateTask(){
        if(!TowerMainFightModel.Ins.mainTask || TowerMainFightModel.Ins.mainTask.status == 2){
            this.img_rw.visible = false;
        }else{
            this.img_rw.visible = true;
            let cfg = t_Main_Task.Ins.GetDataById(TowerMainFightModel.Ins.mainTask.id);
            this.lab_rw1.text = cfg.f_des;
            this.lab_rw2.text = "(" + TowerMainFightModel.Ins.mainTask.val + "/" + cfg.f_task_amount + ")";
            this._viewrw.setData(ItemViewFactory.convertItem(cfg.f_reward));
            if(this._simRE){
                this._simRE.dispose();
                this._simRE = null;
            }
            if(TowerMainFightModel.Ins.mainTask.status == 1){
                this._simRE = new SimpleEffect(this.img_rw, `o/spine/succeed/renwu_kuang/renwu_kuang`,this.img_rw.width*0.5,this.img_rw.height*0.5);
                this._simRE.play(0,true);
            }
        }
    }

    private updateTR(){
        let cfg = t_Trophy_Reward.Ins.getBigRewardCfg();
        if(cfg){
            this.sp_t.visible = true;
            this.lab_t.text = cfg.f_trophy + "";
            this._viewi.setData(ItemViewFactory.convertItem(cfg.f_reward));
        }else{
            this.sp_t.visible = false;
        }

        let cfgTr = t_Medal.Ins.getCfgByTr(MainModel.Ins.mRoleData.trophy);
        let cfgNextTr = t_Medal.Ins.getNextCfgByTr(MainModel.Ins.mRoleData.trophy);
        this.img_t1.skin = "remote/towerMain/" + cfgTr.f_img;
        if(cfgNextTr){
            this.pro_t.width = MainModel.Ins.mRoleData.trophy / cfgNextTr.f_min_score * this._proW;
            this.img_t2.visible = true;
            this.img_t2.skin = "remote/towerMain/" + cfgNextTr.f_img;
            this.lab_prot.text = MainModel.Ins.mRoleData.trophy + "/" + cfgNextTr.f_min_score;
        }else{
            this.pro_t.width = this._proW;
            this.img_t2.visible = false;
            this.lab_prot.text = MainModel.Ins.mRoleData.trophy + "";
        }
    }

    private updatePvpNum(){
        let cfg = t_Pvp_Daily_Reward.Ins.getCfgById(ECellType.HERO_SP);
        if(cfg){
            this.lab_num.text = (cfg.f_limit_max - MainModel.Ins.todaySpirit) + "/" + cfg.f_limit_max;
        }else{
            this.lab_num.text = "";
        }
    }

    // private updateCH(){
    //     this._chenghaoCtl.setData(ChengHaoModel.Ins.titleId);
    // }

    private _hzEff:SimpleEffect;
    private updateRole(){
        let data = MainModel.Ins.mRoleData;
        this._headCtl.setData(data.headUrl,data.HeadFrame);
        this.lab_name.text = data.getName();
        this.lab_lv.text = "" + data.lv;
        let cfg = t_Player_Exp.Ins.getCfgByLv(data.lv);
        cfg && (this.pro.width = data.exp / cfg.f_ExpValue * this._wid);
        this.lab_tr.text = data.trophy + "";
        cfg && (this.lab_pro.text = Math.floor(data.exp / cfg.f_ExpValue * 100) + "%");

        if(this._hzEff){
            this._hzEff.dispose();
            this._hzEff = null;
        }
        let cfgTr = t_Medal.Ins.getCfgByTr(MainModel.Ins.mRoleData.trophy);
        this.sp_hz.scaleX = this.sp_hz.scaleY = cfgTr.f_size_zoom / 100;
        this._hzEff = new SimpleEffect(this.sp_hz, `o/spine/succeed/${cfgTr.f_medal_id}/${cfgTr.f_medal_id}`,cfgTr.f_pos_x,cfgTr.f_pos_y);
        this._hzEff.play(0,true);

        if(Laya.Utils.getQueryString("poplv")){
            E.ViewMgr.Open(EViewType.LevelView);
        }

        if(TowerMainFightModel.Ins.lvList.length){
            let a = TowerMainFightModel.Ins.lvList[0];
            let b = TowerMainFightModel.Ins.lvList[1];
            E.ViewMgr.Open(EViewType.LevelView,null,[a,b]);
            TowerMainFightModel.Ins.lvList = [];
        }
    }

    private onUpdateChat(type:number){
        Laya.timer.callLater(this,this.updateChat,[type]);
    }
    
    private updateChat(type:number){
        let msg:stChat;
        let data;
        if(type == 0){
            this.lab_sj.text = "[世界]";
            this.lab_sj.color = "#ffcb4d";
            let obj= ChatModel.Ins.getChatList(ChatModel.Ins.channelId);
            if (obj) {
                data = obj.datalist;
                if (data && data.length > 0) {
                    msg = data[data.length - 1];
                }
            }
        }else{
            this.lab_sj.text = "[私聊]";
            this.lab_sj.color = "#ee79ff";
            msg = ChatModel.Ins.slDataList[ChatModel.Ins.slDataList.length - 1];
        }

        if(msg){
            if(msg.emojiId){
                this.lab_c.text = msg.nickName + ":[动画表情]";
            }else{
                this.lab_c.text = StringUtil.convertName(`${msg.nickName}:${msg.chat}`,46);
            }
        }else{
            this.lab_c.text = "";
        }
    }

    private updateFunChange(){
        this.onUpdateActList();
        this.updateTLView();
        this.updatePWS();
        this.setBtn();
    }

    private updatePWS(){
        if(!FunctionModel.Ins.isOpenByFuncId(EFuncDef.PaiWeiSai,false)){
            this.m.visible = true;
        }else{
            this.m.visible = false;
        }
        if(!FunctionModel.Ins.isOpenByFuncId(EFuncDef.TuWeiZhan,false)){
            this.m1.visible = true;
        }else{
            this.m1.visible = false;
        }
        if(!FunctionModel.Ins.isOpenByFuncId(EFuncDef.DFS,false)){
            this.m_d.visible = true;
        }else{
            this.m_d.visible = false;
        }

        if(!FunctionModel.Ins.isOpenByFuncId(EFuncDef.DianYu,false)){
            this.btn1.visible = false;
        }else{
            this.btn1.visible = true;
        }

        // if(!TowerMainFightModel.Ins.isPvp){
        //     this.m.visible = true;
        // }else{
        //     this.m.visible = false;
        // }
    }

    private onUpdateActList(){
        Laya.timer.callLater(this,this.updateActList);
    }

    private updateActList(){
        this._leftbtnList.refresh();
        this._rightbtnList.refresh();
    }

    // private updateBox(){
    //     this.boxList.array = [1,2,3,4];
    // }

    private setUI(){
        if(!this._isSetUI){
            this._isSetUI = true;
            let yy = (Laya.stage.height - ScreenAdapter.DefaultHeight) / 2;
            if(yy > 0){
                this.height += yy;
                this.img_c.y += yy;
                this.sppp.y += yy * 0.5;
            }
        }
    }
}