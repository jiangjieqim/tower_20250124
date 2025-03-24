// import { HttpUtil } from "../../../../frame/util/HttpUtil";
import { GameTex } from "../../../../frame/view/GameList";
// import { StringUtil } from "../../../../frame/util/StringUtil";
// import { ButtonCtl } from "../../../../frame/view/ButtonCtl";
// import { CheckBoxCtl } from "../../../../frame/view/CheckBoxCtl";
import { ViewBase } from "../../../../frame/view/ViewBase";
import { InitConfig, PlatformConfig } from "../../../../InitConfig";
import { ui } from "../../../../ui/layaMaxUI";
import { EMsgBoxType, EPageType, EViewType } from "../../../common/defines/EnumDefine";
// import { EventID } from "../../../event/EventID";
import { E } from "../../../G";
import { WebClientRegist_revc } from "../../../network/protocols/BaseProto";
import { NoContainerSimpleEffect } from "../avatar/NoContainerSimpleEffect";
import { SimpleEffect } from "../avatar/SimpleEffect";
import { AssetConfig } from "../avatar/spine/AssetConfig";
import { SpineEffectMgr } from "../avatar/SpineEffectMgr";
import { GameEvent } from "../main/model/GameEvent";
import { MainEvent } from "../main/model/MainEvent";
import { MainModel } from "../main/model/MainModel";
import { t_Platform } from "../main/proxy/t_Platform";
import { EClientType } from "../sdk/ClientType";
import { SheZhiModel } from "../shezhi/model/SheZhiModel";

interface IServerError{
    /**
     * 服务器的错误码ID
     */
    errorID:number;
}
/*
    "code": 0, #0标识成功 非0即失败
    "msg": "success", #消息提示
    "result": {
        "appid": "wx2fa8efa705e9c036", #appid与请求参数中的一致,登录游戏需传递过来
        "openid": "wx2fa8efa705e9c036aaaa", #openid与请求参数中的一致,登录游戏需传递过来
        "tcp": "wss://ws-server.game.wanhuir.com/12", #websocket的地址
        "token": "78dad5de7bc180ec8e3dd9d777740614" #token登录游戏时候需传过来
    }
*/
export interface ILoginResult{
    appid:string;
    openid:string;
    tcp:string;
    token:string;
    /**是否是提审版本 1是 0不是 */
    audit:number;
}

export interface IBaseCode{
    /**
     * #0标识成功 非0即失败
     */
    code:number;
    msg:string;
}
export interface ILoginCode extends IBaseCode{
    result:ILoginResult;
}
export interface INoticeCell{
    Title:string;
    Content:string;
}
/**
 * 公告
 */
export interface INoticeCode extends IBaseCode{
    result:INoticeCell[];
}

export class LoginViewNew extends ViewBase {
    public PageType: EPageType = EPageType.None;
    protected autoFree:boolean = true;
    protected checkGuide:boolean = false;
    protected readonly pwd:string = "0";
    protected _ui: ui.views.login.ui_login_newUI;
    private _enterCtl:ButtonCtl;
    private shilinBtnCtl:ButtonCtl;
    private ckCtl:CheckBoxCtl;
    private eff:SimpleEffect;
    private _loginEffect:NoContainerSimpleEffect;
    private logo:GameTex;
    private readonly mTitleSpine:boolean = false;//是否有特效
    // private isLoginEffLoaded:boolean = false;
    onEnter() {
        // E.ViewMgr.Close(EViewType.ScrollNotice);   
    }

    private delTitleEffect(){
        if(this.eff){
            this.eff.dispose();
            this.eff = null;
        }
    }

    private delLoginEffect(){
        if(this._loginEffect){
            this._loginEffect.dispose();
            this._loginEffect = null;
        }
    }

    protected onExit() {
        // E.ViewMgr.Open(EViewType.ScrollNotice, null);
        // Laya.Loader.clearTextureRes(this._ui.bg1.skin);
        if(this.logo){
            this.logo.dispose();
            this.logo = null;
        }
        this.delTitleEffect();
        this.delLoginEffect();
        E.ViewMgr.Close(EViewType.NoticePop);
        this.shilinBtnCtl.dispose();
        // spineRes.GC();
        MainModel.Ins.off(MainEvent.UpdateServer,this,this.updataServer);
    }
    private initAgaBtn(){
        let cfg = t_Platform.Ins.curCfg;
        if(cfg){
            if(!StringUtil.IsNullOrEmpty(cfg.f_age)){
                //  o/yhxy/quick/age16.txt
                let arr = cfg.f_age.split("/");
                let a = arr[arr.length-1].split(".");
                let img = `remote/loginnew1/${a[0]}.png`;
                // remote/loginnew1/sltx.png
                this._ui.shilinbtn.skin = img;
            }
        }
    }
    /**设置软著 */
    private setSoftDesc(){
        let soft:string = E.getLang("logindesc");
        if(t_Platform.Ins.curCfg && !StringUtil.IsNullOrEmpty(t_Platform.Ins.curCfg.f_soft)){
            soft = t_Platform.Ins.curCfg.f_soft;
        }
        this._ui.lb2.text = soft;//需要将"-"替换成"一" IOS字体解析会报错
    }
    private onLoginEffComplete(){
        // this.isLoginEffLoaded = true;
        this.delTitleEffect();
    }
    protected onFirstInit() {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.login.ui_login_newUI();
            this._ui.bg1.skin = AssetConfig.bg;
            this._enterCtl = new ButtonCtl(this._ui.enterGame, new Laya.Handler(this,this.onEnterGame));
            this._ui.content.on(Laya.Event.CLICK,this,this.onContentTouch);
            this._ui.content.mouseEnabled = true;

            this._loginEffect = SpineEffectMgr.createLoopNoSimpleEffect(`o/spine/succeed/denglu/denglu`,this._ui.loginEffCon);
            this._loginEffect.once(Laya.Event.COMPLETE,this,this.onLoginEffComplete);
            // this._enterCtl.gray = true;
            // this._enterCtl.mouseEnable = false;

            // let ctlSkin:ICheckBoxSkin = {bg:this._ui.goubg,gou:this._ui.gou,content:this._ui.content} as ICheckBoxSkin;
            let ckCtl:CheckBoxCtl = new CheckBoxCtl(this._ui);
            ckCtl.selectHander = new Laya.Handler(this,this.onCkSelect);
            ckCtl.selected = true;
            this._ui.content.on(Laya.Event.CLICK,this,this.onContentTouch);
            this._ui.content.mouseEnabled = true;
            // this._ui.img0.y = -407;
            this.ckCtl = ckCtl;
            let ver = E.ver;// + (debug ? `----[${Version.curValue}]` : "");
            this._ui.versionTf.text = ver;
            this._ui.versionTf.color = ver == "v1_0_15" ? "#ff0000":"#00ff00";
            this._ui.versionTf.strokeColor = "#000000";
            this._ui.versionTf.stroke = 2;

            if (!Laya.Browser.onPC && initConfig.asset && initConfig.asset.indexOf("https://") == -1) {
                E.ViewMgr.ShowMsgBox(EMsgBoxType.OnlyOk, "请使用CDN资源");
            }
            this.shilinBtnCtl = ButtonCtl.CreateBtn(this._ui.shilinbtn, this, this.onAgeHandler);
            ButtonCtl.CreateBtn(this._ui.btn_gg, this, this.onBtnGGClick);
            this.initAgaBtn();

            // this._ui.addChild(new LoginSelServerItem());//增加选服按钮

            this.initUi();

            this.setSoftDesc();

            this._ui.img.on(Laya.Event.CLICK,this,this.onLabSelClick);
            this._ui.img.visible = false;
        }
    }

    private onLabSelClick(){
        E.ViewMgr.Open(EViewType.LoginQuFu);
    }

    private onContentTouch(){
        E.ViewMgr.Open(EViewType.YinSiView);
    }
    private getSpineTitle(){
        let title:string = t_Platform.Ins.curCfg.f_title;
        if(!StringUtil.IsNullOrEmpty(title)){
            return title;
        }
        return "title3_verify";
    }
    /**
     * @param _verify 是否是提审状态
     */
    private initByVeritf(_verify:boolean){
        if(Laya.Utils.getQueryString("verify")){
            // 1 提审中 2 已过审
            _verify = Laya.Utils.getQueryString("verify") == "1" ? true : false;
        }

/*
        if(Laya.Utils.getQueryString("showlogin")){
            this._enterCtl.visible = true;
        }else{
            if(_verify){
                this._enterCtl.visible = true;
            }else{
                //非提审状态直接进入游戏
                this._enterCtl.visible = false;
                Laya.timer.callLater(this,this.onEnterGame);
                return;
            }
        }
*/
        if(this.mTitleSpine){
            let effect: string;
            // let bg3URL:string = "";
            if (window["initConfig"]['littlegame']) {
                this._ui.descTf.text = window["initConfig"]["littledesc"];
                effect = "o/spine/title2/title";
            } else {
                this._ui.descTf.text = "";//E.getLang("login1");
                let title: string = "title";//戳爆三国
                if (initConfig.clienttype == EClientType.Discount && initConfig.platform != PlatformConfig.WEIXIN_DISCOUNT) {
                    title = this.getSpineTitle();//"title3_verify";//三国游侠
                }
                effect = `o/spine/${title}/title`;
            }

            this.eff = new SimpleEffect(this._ui.eff, effect);
            this.eff.autoPlay = true;
            this.eff.play(0, false);
            
        }else{
            this.initLogo();
        }
    }

    private initLogo(){
        if(!this.logo){
            let logo = new GameTex();
            logo.skin = `static/logo.png`;
            this._ui.addChildAt(logo,this._ui.getChildIndex(this._ui.bg1));
            logo.anchorX = logo.anchorY = 0.5;
            logo.pos(364,206);
            this.logo = logo;
        }
    }

    // private updateCheckBox(){
    //     if(MainModel.Ins.verify){
    //         this.ckCtl.selected = false;
    //     }else{
    //         this.ckCtl.selected = true;
    //     }
    // }

    // private playEnd(){
    //     this.eff.play(0,false);
    // }

	/**适龄提示*/
    private onAgeHandler(){
        let cfg = t_Platform.Ins.curCfg;
        if(cfg){
            if(!StringUtil.IsNullOrEmpty(cfg.f_age)){
                // E.ViewMgr.Open(EViewType.AgeView,null,cfg.f_age);
            }
        }
    }

    private onBtnGGClick(){
        if(this._noticeCell){
            SheZhiModel.Ins.openServerNotice(this._noticeCell.Title, this._noticeCell.Content);
        }
    }

    private onCkSelect(){
        // console.log(this.ckCtl.selected);
    }

    protected initUi(){
        
    }

    protected onEnterGame(){
        E.sdk.getAge(this,this.onGetAgeHandler);
    }

    private onGetAgeHandler(){
        if (this.ckCtl.selected) {
            MainModel.Ins.showLoading();
            this.Close();
        }else{
            E.ViewMgr.Open(EViewType.YinSiView);
        }
    }

    protected onAddLoadRes() {
    }
    protected onAddEventListener() {
        this.addEventCus(EventID.WebClientRegistRsp, this.onWebClientRegistRsp, this);
        this.addEventCus(EventID.WebClientLoginRsp, this.onWebClientLoginRsp, this);
    }

    private onWebClientLoginRsp(data: IServerError) {
        if (data.errorID == 0) {
            //登录成功
            E.ViewMgr.Close(this.ViewType);
            // if(E.ta){
            //     E.ta.login(MainModel.Ins.mRoleData.AccountId.toString());
            // }
            // MainModel.Ins.openMainView();
        } else {
            if (data.errorID == 2) {
                E.ViewMgr.ShowMsgBox(EMsgBoxType.OnlyOk, E.LangMgr.getLang("AccountStopUseing"));
            } else if (data.errorID == 3) {
                E.ViewMgr.ShowMsgBox(EMsgBoxType.OnlyOk, E.LangMgr.getLang("NoAccount"));
            } else if (data.errorID == 4) {
                E.ViewMgr.ShowMsgBox(EMsgBoxType.OnlyOk, E.LangMgr.getLang("PasswordError"));
            } else {
                E.ViewMgr.ShowMsgBox(EMsgBoxType.OnlyOk, E.LangMgr.getLang("LoginFailed"));
            }
        }
    }

    protected onWebClientRegistEnd(){
        
    }

    // public statrtWxLogin(){
    //     E.ViewMgr.closeWait();
    //     this.onUnlockEnter();
    // }
    
    public onUnlockEnter(){
        // this._enterCtl.gray = false;
        // this._enterCtl.mouseEnable = true;
    }

    // private startConnect(){
    //     SocketMgr.Ins.ConnectWebsocket(this,this.statrtWxLogin);
    // }

    protected onWebClientRegistRsp(data:WebClientRegist_revc){
        E.ViewMgr.closeWait();
        // LogSys.Log("WebClientRegist_revc:errorID = "+data.errorID);
        this.onUnlockEnter();
        switch(data.errorID){
            case 0:
                //注册成功
                break;
            case 1:
                //注册失败
                E.ViewMgr.ShowMidError("注册失败");
                E.ViewMgr.Close(this.ViewType);
                break;
            case 2:
                //账号已经存在
                break;
        }
        this.onWebClientRegistEnd();
    }

    private playTitleAnim(){
        
        // this._ui.img0.y = -407; 
        // Laya.Tween.to(this._ui.img0,{y:70},500,null,new Laya.Handler(this,this.endHandler));
    }
    // private _initY:number;
    private initVersion(){
        // if(this._ui.versionTf.parent){
        //     let pos = (this._ui.versionTf.parent as Laya.Sprite).localToGlobal(new Laya.Point(this._ui.versionTf.x,this._ui.versionTf.y));
        //     if(this._initY == undefined){
        //         // this._ui.versionTf.y =
        //         this._initY = pos.y;
        //         let oy:number = Laya.stage.height - this._initY;
        //         this._ui.versionTf.y = oy;
        //     }
        // }
        this._ui.versionTf.y = this._ui.lb2.y + this._ui.lb2.textField.height + this._ui.versionTf.fontSize;
    }

    protected onInit() {
        MainModel.Ins.on(MainEvent.UpdateServer,this,this.updataServer);
        //E.sdk.taptapInit();
        this.initVersion();
        E.taLoginTrack("showLoginView");
        // console.log("显示登入界面")
        this.playTitleAnim();
        // E.ViewMgr.openWait()
        // this.connectRegist();
        this._ui.btn_gg.visible = false;
        HttpUtil.httpGet(`${InitConfig.getSyURL()}/notice?appid=${E.sdk.getAppId()}`, new Laya.Handler(this, this.onNotice));

        // let openId: string = E.sdk.getOpenId();
        this.onCheckOpenId();

        // if(initConfig.enable_spine_gpu_test){
        //     E.ViewMgr.Open(EViewType.SpineGPU_Test);
        // }
    }

    private onCheckOpenId() {
        let _openId: string = E.sdk.getOpenId();
        LogSys.Log(`check openid:${_openId}`);
        if (_openId == undefined) {
            Laya.timer.once(1000, this, this.onCheckOpenId);
        } else {
            HttpUtil.httpGet(`${InitConfig.getSyURL()}/server/onopen?appid=${E.sdk.getAppId()}&openid=${_openId}&ver=${E.ver}&token=${E.sdk.getToken()}`,
                new Laya.Handler(this, this.onServerHandler));
            // this.updateCheckBox();

            this.getVeriry();

            if (initConfig.debug_pay_server_id) {
                E.ViewMgr.ShowMsgBox(EMsgBoxType.OnlyOk, `debug_pay_server_id: ${initConfig.debug_pay_server_id}`);
            }
            // let verify:boolean = MainModel.Ins.verify;
            // LogSys.Log(`verify:${verify}`);
        }
    }

    private _noticeCell:INoticeCell;
    private onNotice(data: string) {
        let obj: INoticeCode = JSON.parse(data);
        if (obj.result.length == 1) {
            this._ui.btn_gg.visible = true;
            this._noticeCell = obj.result[0];
            SheZhiModel.Ins.openServerNotice(this._noticeCell.Title, this._noticeCell.Content);
        }
    }

    private getVeriry(){
        this.loginComplete(E.login_obj);
    }

    private loginComplete(data: string) {
        // if (obj.code == 0 && obj.result) {
        //     this.ckCtl.selected = !(obj.result.audit == 1);
        // } else {
        //     this.ckCtl.selected = true;
        // }

        this.updateCheckBox(this.ckCtl, data,new Laya.Handler(this,this.onLoginCallBack,[data]));
    }

    private updateCheckBox(ckCtl:CheckBoxCtl,data:string,handler:Laya.Handler){
        let obj: ILoginCode = JSON.parse(data);
        if (obj.code == 0 && obj.result) {
            ckCtl.selected = !(obj.result.audit == 1);
        } else {
            ckCtl.selected = true;
        }
        // callBack.call(that);
        handler.run();
    }

    private onLoginCallBack(data:string){
        let obj: ILoginCode = JSON.parse(data);
        let _st: boolean = initConfig.debug_ts == true || Laya.Utils.getQueryString("ts") == "1" || (obj.result && obj.result.audit == 1);
        this.initByVeritf(_st);
    }
    private onCheckVConsole() {
        if (typeof window['VConsole'] != "undefined") {
            let vConsole = new window['VConsole']();
        }
        else{
            console.log(Math.random()+"....");
            Laya.timer.once(10,this,this.onCheckVConsole);
        }
    }
    private onServerHandler(data: string){
        let obj = JSON.parse(data);
        if (obj.code == 0) {
            if(obj.result.inWhiteList || Laya.Utils.getQueryString("inWhiteList")){
                //window['debug'] = true;
                E.sdk.isWhite = true;
                if(typeof wx != "undefined"){
                    //微信
                }else{
                    //启动vconsole
                    // if(typeof window['loadLib'] == "function"){
                    //     window['loadLib']('libs/vconsole.min.js');
                    //     this.onCheckVConsole();
                    // }
                }
            }

            MainModel.Ins.serverZu = parseInt(obj.result.serverZu);
            MainModel.Ins.serverState = parseInt(obj.result.serverDetail.serverState);
            MainModel.Ins.serverIsNew = parseInt(obj.result.serverDetail.isNew);
            MainModel.Ins.serverID = parseInt(obj.result.serverDetail.serverID);
            MainModel.Ins.serverName = obj.result.serverDetail.serverName;
            MainModel.Ins.serverplayerId = parseInt(obj.result.serverDetail.playerId);
            this.updataServer();
            // MainModel.Ins.event(MainEvent.UpdateServer);
        }else{
            // if(E.Debug){
            E.ViewMgr.ShowMsgBox(EMsgBoxType.OnlyOk,obj.msg||"");
            // }
        }
    }

    private updataServer(){
        if(!this.hasInit){
            return
        }
        this._ui.img.visible = true;
        this._ui.lab_f.text = MainModel.Ins.serverName;
        // switch(MainModel.Ins.serverState){//区服状态 1爆满 2畅通 3维护
        //     case 1:
        //         this._ui.img_t.skin = "remote/base/icon_hb_dl.png";
        //         break;
        //     case 2:
        //         this._ui.img_t.skin = "remote/base/icon_zc_dl.png";
        //         break;
        //     case 3:
        //         this._ui.img_t.skin = "remote/base/icon_wh_dl.png";
        //         break;
        // }
        this._ui.img_t.skin = "remote/base/icon_hb_dl.png";
        if(MainModel.Ins.serverIsNew){
            this._ui.img_t1.visible = true;
        }else{
            this._ui.img_t1.visible = false;
        }
    }
}