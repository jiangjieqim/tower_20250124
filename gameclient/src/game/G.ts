import Browser = Laya.Browser;

// import { DebugUtil } from "../frame/util/DebugUtil";
// import { HttpUtil } from "../frame/util/HttpUtil";
import { GameConfig } from "../GameConfig";
import { ESkinType, InitConfig, PlatformConfig } from "../InitConfig";
import { IGameAdapter } from "./adapter/IGameAdapter";
import { ThreeKingdomsAdapter } from "./adapter/ThreeKingdomsAdapter";
import { Frame } from "./audio/AudioMgr";
import { Common } from "./common/Common";
import { EMsgBoxType, EViewType } from "./common/defines/EnumDefine";
import { DrawCallConfig } from "./DrawCallConfig";
// import { EventManager } from "./event/EventManager";
import { LayerMgr } from "./layer/LayerMgr";
import { Scene2DManager as Scene2DManager } from "./managers/Scene2DManager";
import { LoadMainnfestParse } from "./ManifestParse";
import { MsgManager } from "./network/MsgManager";
// import { MailGetMailList_req } from "./network/protocols/MailProto";
import { Gm_req } from "./network/protocols/BaseProto";
// import { uint64 } from "./network/protocols/uint64";
import { SocketMgr } from "./network/SocketMgr";
import { ResItemGroup } from "./resouce/ResItemGroup";
import { ResourceManager } from "./resouce/ResourceManager";
import { Path } from "./resouce/ResPath";
import { StaticDataMgr } from "./static/StaticDataMgr";
import { LanguageManager } from "./systems/languages/LanguageManager";
import { Version } from "./Version";
import { ESystemRefreshTime } from "./view/handle/main/ctl/ESystemRefreshTime";
import { System_RefreshTimeProxy } from "./view/handle/main/ctl/System_RefreshTimeProxy";
import { GameCfgData } from "./view/handle/main/model/GameCfgData";
import { MainModel } from "./view/handle/main/model/MainModel";
import { BaseSdk } from "./view/handle/sdk/BaseSdk";
import { BaUSDK } from "./view/handle/sdk/baUSDK/BaUSDK";
import { cb1SDK } from "./view/handle/sdk/cb1SDK/cb1SDK";
import { EClientType } from "./view/handle/sdk/ClientType";
import { DouYinSDK } from "./view/handle/sdk/douyin/DouYinSDK";
import { ISdk } from "./view/handle/sdk/ISdk";
import { MeiTuanSDK } from "./view/handle/sdk/MeiTuanSDK";
import { QuickSySDK } from "./view/handle/sdk/QuickSySDK";
import { SDKFactory } from "./view/handle/sdk/SDKFactory";
import { WeiXinSDK } from "./view/handle/weixin/WeiXinSDK";
import { ViewManager } from "./view/ViewManager";
import { AtlasMgr } from "./view/handle/compose/views/AtlasMgr";
import { TableMgr } from "./static/json/data/TableMgr";
import { t_FightStyle } from "./view/handle/compose/adapter/FightTypeAdapter";
import { t_MonsterPvp, t_Monster_Coop } from "./view/handle/compose/t_Monster_Template";
import { t_Battle_Communication } from "./view/handle/compose/views/FaceChatView";
import { t_Function_Coop } from "./view/handle/compose/views/t_Function_Coop";
import { t_Battle_Task, t_Battle_Task_Coop } from "./view/handle/compose/vos/t_Battle_Task";
import { t_Enemy_Wave, t_Enemy_Wave_Coop } from "./view/handle/compose/vos/t_Enemy_Wave";
import { t_GuideChapter } from "./view/handle/guide/PveGuideData";
import { t_Wave } from "./view/handle/compose/views/t_Wave";
import { t_Skill_Skin } from "./view/handle/skill/proxy/SkillProxy";
import { t_Cover_Big_Goose_Task } from "./view/handle/taodae/model/t_Cover_Big_Goose_Task";
import { t_Cover_Big_Goose_Pack } from "./view/handle/taodae/model/t_Cover_Big_Goose_Pack";
import { t_Cover_Big_Goose_reward } from "./view/handle/taodae/model/t_Cover_Big_Goose_reward";
import { t_Cover_Big_Goose_config } from "./view/handle/taodae/model/t_Cover_Big_Goose_config";
import { GameEvent } from "./view/handle/main/model/GameEvent";
// import { ButtonCtl } from "../frame/view/ButtonCtl";
//重写laya.core.js中的方法
function layacoreOverride(){
    
     /*
        1) drawcall数量随着spine动画数量增加的问题:
        1.1) 目前我们将计算委托给了spine-core，所以一次画十个spine动画目前还无法进行针对性的优化，drawcall会随着spine动画的数量增加。
        1.2) 理论上增加动画缓存可以解决这个问题，我们已经安排在了时间表上，但目前我们人力比较紧张，短期内还无法启动该优化方案。
        2) 同一个spine动画drawcall数量的问题:
        2.1) 因为用了不同的叠加模式，必然会导致drawcall被打断。
        2.2) 针对这个spine动画，我检查了所有的drawElement和blendFunc，发现还是有优化空间的，你可以根据图片所示，将红框里的内容注释掉，drawcall会减少一些。但这个优化仅能针对项目，我们无法提交引擎。
        2.3) 这个优化我们曾经提交过引擎，但后来还原了，说明在特定条件下是有问题的，但我们目前也不清楚是什么样的特定条件了，如果您使用这个优化出现了问题，也请提交demo给我们，我们再检查一下。
    */
    
	//重写方法
	// set globalCompositeOperation(value) {
	// var n = BlendMode.TOINT[value];
	// n == null || (this._nBlendType === n) || (SaveBase.save(this, SaveBase.TYPE_GLOBALCOMPOSITEOPERATION, this, true), /*this._curSubmit = SubmitBase.RENDERBASE,*/ this._nBlendType = n);
	// }

	Laya.Context.prototype['__defineSetter__']("globalCompositeOperation",function(value){
		var n = Laya.BlendMode['TOINT'][value];
		var SaveBase = Laya.SaveBase
		n == null || (this._nBlendType === n) || (SaveBase.save(this, SaveBase.TYPE_GLOBALCOMPOSITEOPERATION, this, true), 
		/*this._curSubmit = SubmitBase.RENDERBASE,*/ 
		this._nBlendType = n);
	});

    // Laya.EventDispatcher.prototype['event'] = function(type, data = null){

    // });


    let EventDispatcher = Laya.EventDispatcher;
    EventDispatcher.prototype.event = function(type:string,data?:any){
        if (!this._events || !this._events[type])
            return false;
        var listeners = this._events[type];
        if (listeners.run) {
            if (listeners.once)
                delete this._events[type];
            data != null ? listeners.runWith(data) : listeners.run();
        }
        else {
            for (var i = 0, n = listeners.length; i < n; i++) {
                var listener = listeners[i];
                if (listener) {
                    (data != null) ? listener.runWith(data) : listener.run();
                }
                if (!listener || listener.once) {
                    listeners.splice(i, 1);
                    i--;
                    n--;
                }
            }
            if (listeners.length === 0 && this._events && this._events[type] && !this._events[type].run)
                delete this._events[type];
        }
        return true;
    }
    Laya.Image.prototype['measureWidth'] = function(){
        if(this._bitmap){
            return this._bitmap.width;
        }
        return 0;
    }
    Laya.Image.prototype['measureHeight'] = function(){
        if(this._bitmap){
            return this._bitmap.height;
        }
        return 0;
    }

    Laya.Sprite.prototype['_setPivotX'] = function(value){
        // console.log('....._setPivotX',value);
        var style = this.getStyle();
        if(style){
            style.pivotX = value;
        }
    }

    Laya.Sprite.prototype['_setPivotY'] = function(value){
        // console.log('....._setPivotY',value);
        var style = this.getStyle();
        if(style){
            style.pivotY = value;
        }
    }
}

export class ScreenAdapter{
    /**最小适配高度 */
    public static readonly DefaultHeight:number = 1334;
    public static RefWidth:number;
    /**UI的宽度 */
    public static readonly UIRefWidth:number = 750;
}

export interface IWeiXin{
    getSystemInfoSync();
}



// let app = {};


// class ResVer{
//     /**
//      * 版控文件夹名,单字母
//      */
//     public static G = 'g';
// }

// function _formatRelativePath(value) {
//     var parts = value.split("/");
//     for (var i = 0, len = parts.length; i < len; i++) {
//         if (parts[i] == '..') {
//             parts.splice(i - 1, 2);
//             i -= 2;
//         }
//     }
//     return parts.join('/');
// }
// /**
//  * override Laya.URL.formatURL
//  */
// Laya.URL.formatURL = function (url) {
//     console.log(`[${url}]`);
//     let URL = Laya.URL;
//     if (!url)
//         return "null path";
//     if (url.indexOf(":") > 0)
//         return url;
//     if (URL.exportSceneToJson)
//         url = URL.getAdptedFilePath(url);
//     if (URL.customFormat != null)
//         url = URL.customFormat(url);
//     var char1 = url.charAt(0);
//     if (char1 === ".") {
//         return _formatRelativePath(URL.basePath + url);
//     }
//     else if(char1 === ResVer.G){
//         //增量文件
//         let u = InitConfig.getAsset() + url;
//         return u;
//     }
//     else if (char1 === '~') {
//         return URL.rootPath + url.substring(1);
//     }
//     else if (char1 === "d") {
//         if (url.indexOf("data:image") === 0)
//             return url;
//     }
//     else if (char1 === "/") {
//         return url;
//     }
//     return URL.basePath + url;
// }


// interface IInitConfig{
//     ver:string;
//     /*提审*/
//     // ts:number;
    
//     ////////////////////////////////////
//     // openid:string;
//     /**是否使用Laya.Stat */
//     stat:string;
//     /**是否静音 */
//     // disableSound:boolean;
//     /**不播放宝箱动画 */
//     noBoxAnim:number;
//     /**跳过战斗 */
//     skip:number;
//     /**无战斗结算界面 */
//     withoutFightUI:boolean;
//     /** 前置小游戏*/
//     littlegame:number;
//     /**是否是同步模式 */
//     // sync:number;
//     // noanim:number;
//     // localgame:number;
//     /*
//         LOG = 1,
//         WARN = 2,
//         ERROR = 3,
//     */
//     loglevel:number;
//     nofightlog:number;
// }
interface IGetNewResult{
    /**
     * 老戳爆:0
     * 0.1折:1
     */
    is_new:number;
}
interface IGetIsNew{
    code:number;
    result:IGetNewResult;
}
interface ISetInfo{
    version_num:string;
    client_platform:number;
    clientsys:string;
}
// interface IIsNewVo{
//     code:number;
//     msg:string
//     result;
// }


let tinkURL:string = "https://thinkdata-tank.wanhuir.com";
function initThinkingdata() {
    console.log("initThinkingdata...");
    let ttappid = initConfig.ttappid;
    let thinkingdata = window['thinkingdata'];
    var config = {
        appId: ttappid,//"2e6e81d56eb54e15b8d16ea21b12049a", // 项目 APP ID
        serverUrl: tinkURL, // 上报地址
        autoTrack: {
            appShow: true, // 自动采集 ta_mg_show
            appHide: true, // 自动采集 ta_mg_hide
        },
        enableLog: false,//取消日志
        //  mode:"debug",//调试模式
    };
    window["ta"] = thinkingdata;
    window["ta"].init(config);
    if(E.ta){
        E.ta.userSetOnce({ channel_key: window["initConfig"].channel_key });
    }
}

/**全局环境*/
export class E {
    //#region 静态

    public static AppRoot: Common.AppRoot;
    public static TestVersion: boolean = false; //测试版本 true=去测试路径加载资源
    private static _hasInited: boolean = false;   //是否已初始化
    public static randomKey = Date.now();//本次运行唯一戳

    // private static _isDebug:boolean;
    // public static get Debug():boolean{
        // if(this._isDebug === undefined){
        //     this._isDebug = HrefUtils.getVal("debug") == 1;
        // }
        // if(initConfig && initConfig.debug){
        //     return true;
        // }
        // return this._isDebug;
        // return debug;
    // }
    public static login_obj:string;

    public static sdk:ISdk;
    /**游戏适配器 */
    static gameAdapter:IGameAdapter;
    // public static initConfig:IInitConfig;
    public static get wx():IWeiXin{
        return window["wx"];
    }

    public static get ta():IThinkData{
        if(Laya.Utils.getQueryString("no_ta")){
            return null;
        }
        if(window["ta"]){
            return window["ta"];
        }
        return null;
    }

    //发送启动到登入事件
    public static taLoginTrack(eventName:string){
        E.sdk.taptapTrack(eventName);
        
        if(this.disableUploadThinkData(eventName)){
            return;
        }

        if(E.ta){
            E.ta.track(eventName)//事件属性;
            LogSys.Log("["+initConfig.ttappid+"]sendTrack>>>>>>>>>>>>>>>>>"+eventName);
        }else{
            if(!initConfig.disableTALog){
                console.warn(`${new Date().toString()} ta is not init ${eventName}`);
            }
        }
    }

    /**是否不上报该事件 */
    private static disableUploadThinkData(eventName:string){
        if(StaticDataMgr.Ins.isLoaded){
            let str = System_RefreshTimeProxy.Ins.getVal(ESystemRefreshTime.DisableTTEventUpLoad);
            // console.log(str);
            if(str.indexOf(eventName) != -1){
                return true;
            }
        }
        return false;
    }

    public static sendTrack(eventName:string,value:any = null){
        E.sdk.taptapTrack(eventName,value);
        if(this.disableUploadThinkData(eventName)){
            return;
        }

        let v:string =  `${value == null ? "" : JSON.stringify(value)}`;
        if(E.ta){
            LogSys.Log("["+initConfig.ttappid+"]sendTrack>>>>>>>>>>>>>>>>>"+eventName + " " + v);
            if(value){
                E.ta.track(eventName,value)//事件属性;
            }else{
                E.ta.track(eventName)//事件属性;
            }
        }else{
            if(!initConfig.disableTALog){
                console.warn(`${new Date().toString()} ta is not init ${eventName} ${v}`);
            }
        }
    }

    // private static _logTf:Laya.Label;
    private static logstr:string = "";
    // public static pushLog(str: string) {
        // if (this.logstr.length > 0) {
        //     this.logstr += str + "\n";
        // }
    // }
    public static testUI(){
        let label = new Laya.Label();
        label.wordWrap = true;
        label.width = Laya.stage.width;
        // label.height = Laya.stage.height;
		label.text = Laya.stage.width+" " + Laya.stage.height;
        label.fontSize = 32;
		label.color = "#ff0000";
        // label.x = Laya.stage.width/2;
        // label.y = Laya.stage.height/2;
		// Laya.stage.addChild(label);

        // let spr = new Laya.Sprite();
        // spr.graphics.drawRect(0,0,100,100,"#ff0000");
        // Laya.stage.addChild(spr);

        // let img:Laya.Image = new Laya.Image();
        // img.skin = "http://101.132.177.145:8001/project1/Client/trunk/resource/o/item/5_4.png";
        // spr.addChild(img);

        // console.log("WX init!!!");

        this.logstr+="Wx init!\n"//Laya.stage.width+" " + Laya.stage.height + "--" + Math.random();
        Laya.timer.frameLoop(1,this,()=>{
            label.text = this.logstr;
            Laya.stage.addChild(label);
            label.y = Laya.stage.height - label.textField.height;
        });
    }

    public static getLang(key: string,...args: any[]){
        return E.LangMgr.getLang(key,args);
    }
    /**用于客户端指定绝对的SDK类型,h5调试的时候用 */
    public static get_SDK_platform(){
        let _platform = initConfig.platform;
        if(Laya.Utils.getQueryString("sdk_platform"))
        {
            _platform = parseInt(Laya.Utils.getQueryString("sdk_platform"));
        }

        if(initConfig.sdk_platform!=undefined){
            return initConfig.sdk_platform;
        }

        return _platform;
    }
    public static debugMsgBox(msg:string){
        if(debug && Laya.Browser.onPC){
            LogSys.Error(msg);
            E.ViewMgr.ShowMsgBox(EMsgBoxType.OnlyOk,msg);
        }
    }
    
    private static uploadUser() {
        if (E.ta) {
            let obj: ISetInfo = {} as ISetInfo;
            obj.version_num = this.ver;//Version.curValue;
            obj.client_platform = initConfig.platform;
            if (typeof wx != "undefined" && typeof wx.getSystemInfoSync == "function") {
                let sys = wx.getSystemInfoSync();
                if (sys.system) {
                    obj.clientsys = (sys.system as string).split(" ")[0];
                }
            }
            console.log("userSetOnce..." + JSON.stringify(obj));
            E.ta.userSetOnce(obj);
        }
    }

    /**是否是魔兽3的皮肤 */
    static get isWar3Skin() {
        // _platform == PlatformConfig.War3 || 
        return initConfig.skin_type == ESkinType.War3 ||
            Laya.Utils.getQueryString("skin_type") == "1" ||
            Laya.Utils.getQueryString("platform") == "5" //PlatformConfig.War3.toString();
    }

    /**初始化*/
    public static Init() {
        HttpUtil.E = this;
        //================================================
        let curTimeScale = initConfig.timeScale;
        if(curTimeScale!=undefined){
            (function() {
                let timeScale = curTimeScale || 1;
                let originalNow = Date.now;
            
                Date.now = function() {
                    return originalNow() * timeScale;
                };
            
                console.log(Date.now()); 
            })();
        }
        //================================================

        if(Laya.Utils.getQueryString("clienttype")){
            initConfig.clienttype = parseInt(Laya.Utils.getQueryString("clienttype"));
        }
        // this.initConfig = window["initConfig"] || {};
        // IInitConfig.reset();
        window["debug"] = (Laya.Utils.getQueryString("debug") == "1") || initConfig.debug;
        window["LogSys"] = LogSys;
        window["DebugUtil"] = DebugUtil;
        ButtonCtl.E = E;
        let loglevel:number = initConfig.loglevel || parseInt(Laya.Utils.getQueryString("loglevel"));
        if(loglevel){
            LogSys.Level = loglevel;
        }
        layacoreOverride();
        // E.taLoginTrack("GameInit");
        
        // console.log("游戏init>>>>>>>>>>>")

        DrawCallConfig.init();
        let _platform = this.get_SDK_platform();
        console.log(`${this.ver}#${Laya.version}`);

        if( _platform == PlatformConfig.WeiXin || 
            _platform == PlatformConfig.WEIXIN_DISCOUNT){
            if(!this.wx){
                console.error("please set platform = 0");
                return;
            }
            this.sdk = new WeiXinSDK();
        }
        else if(_platform == PlatformConfig.CB1){
            this.sdk = new cb1SDK();
        }
        else if(_platform == PlatformConfig.DOU_YIN){
            this.sdk = new DouYinSDK();
        }
        else if(_platform == PlatformConfig.BaU){
            this.sdk = new BaUSDK();
        }
        else if(_platform == PlatformConfig.MEITUAN){
            this.sdk = new MeiTuanSDK();
        }
        else if(_platform == PlatformConfig.QUICK){
            this.sdk = new QuickSySDK();
        }
        else if(_platform == PlatformConfig.War3){
            // initConfig.appid,initConfig.channel_id,initConfig.discount_ratio
            this.sdk = SDKFactory.createY1YSDK();
        }
        else if(_platform == PlatformConfig.TAPTAP){
            this.sdk = SDKFactory.createTapTapY1ySDK();
        }
        else{
            this.sdk = new BaseSdk();
        }
        // E.sdk.taptapInit();
        //=========================================================
        this.gameAdapter = new ThreeKingdomsAdapter();
        this.gameAdapter.init();
        //=========================================================
        E.sdk.preInit(this,this.onInit);
    }

    private static onInit(){
        E.taLoginTrack("G_onInit");
        E.sdk.init();
        E.sdk.login(this,this.f_get_new);
        // E.sdk.isFromDesk({scene:100000});
    }

    static all_bin:string;
    /**0.1折配置 */
    // private static get discount_all_bin(){
    //     // if(Laya.Utils.getQueryString("asset")){
    //     //     return `${Laya.Utils.getQueryString("asset")}all2.bin`;
    //     // }
    //     if(initConfig.discount_all_bin){
    //         return initConfig.discount_all_bin;
    //     }
    //     return `${initConfig.asset}all.bin`;
    // }
    /**是否需要检测提审状态 */
    // static needCheckVerifty:boolean = true;

    private static isnewCallBack(e:IGetIsNew){
        let type:number = 0;
        if(e.code == 0 && e.result && e.result.is_new !=undefined){
            type = e.result.is_new;
        }
        // if(initConfig.debug_type!=undefined){
        // type = initConfig.debug_type;
        // }
        let _tempPlatform = initConfig.platform;
        if(Laya.Utils.getQueryString("platform")){
            _tempPlatform = parseInt(Laya.Utils.getQueryString("platform"));
            initConfig.platform = _tempPlatform;
        }
        let bDiscount:boolean;
        if(_tempPlatform == PlatformConfig.WeiXin){
            if(type == 1){
                //微信平台中获取到是新账户 切换为微信0.1折平台
                initConfig.ttappid = initConfig.discount_ttappid;
                initConfig.sy_url = initConfig.discount_sy_url;
                initConfig.clienttype = EClientType.Discount;
                initConfig.channel_key=initConfig.discount_channel_key;
                initConfig.platform = PlatformConfig.WEIXIN_DISCOUNT;
                // url = this.discount_all_bin;//initConfig.discount_all_bin;
                bDiscount = true;
            }
        }else{
            // if(initConfig.discount_all_bin){
            // url = this.discount_all_bin;//initConfig.discount_all_bin;
            // }
            bDiscount = true;
        }
        // if(Laya.Utils.getQueryString("platform")){
        //     initConfig.platform = parseInt(Laya.Utils.getQueryString("platform"));
        // }
        E.all_bin = this.convertAllBinURL(bDiscount);

        // console.log(JSON.stringify(e),`type=${type}`);
        
        //抖音数数ID    	ttappid:"76251604390e45f0a26ffe3b6a6dbbb9",
        //初始化数数
        this.initTa();
        // if(initConfig.platform == PlatformConfig.War3){
        // if(E.isWar3Skin){
        //     //魔兽的相关参数配置初始化
        //     AvatarConfig.effectOffsetY = 40;
        // }
        this.uploadUser();
        // this.onLoginCallBack();
        this.getVeriry();
    }

    private static f_get_new(){
        // if(!initConfig.sy_url){
        // alert(`you must be set sy_url!`);s
        // return;
        // }

        if(Laya.Utils.getQueryString("sy_url")){
            initConfig.sy_url = Laya.Utils.getQueryString("sy_url");
        }
        /*
        HttpUtil.httpGet(`${initConfig.sy_url}/prefix/is_new?appid=${E.sdk.getAppId()}&openid=${E.sdk.getOpenId()}&platform=${initConfig.platform}&userPlatformType=${SySdk.Ins.userPlatformType}`,new Laya.Handler(this,(s:string)=>{
            let e:IGetIsNew = JSON.parse(s);
            // console.log("is_new:",e);   
            this.isnewCallBack(e);
        })
        );
        */

        let e:IGetIsNew = {} as IGetIsNew;
        e.code = 10002;
        e.result = {} as IGetNewResult;
        this.isnewCallBack(e);
    }
    private static convertAllBinURL(bDiscount:boolean){
        let url: string;
        let _tempPlatform = initConfig.platform;

        // if(_tempPlatform == PlatformConfig.War3 || !bDiscount){
        // }
        url = `${initConfig.asset}all.bin`;
        if(initConfig.discount_all_bin){
            url = initConfig.discount_all_bin;
        }
        // if (bDiscount) {
        //     url = this.discount_all_bin;
        // } else {
        //     url = `${initConfig.asset}all.bin`;
        // }
        if(Laya.Utils.getQueryString("all_bin")){
            url = Laya.Utils.getQueryString("all_bin");
        }
        return url;
    }
    /**获取提审的版本状态 */
    private static getVeriry(){
        E.taLoginTrack("start_login_req");
        if(initConfig.sy_url_login_data){
            this.loginComplete(initConfig.sy_url_login_data);
        }else{
            HttpUtil.httpGet(this.curURL,new Laya.Handler(this,this.loginComplete),new Laya.Handler(this,this.err));
        }
    }

    private static err(str:string){
        setTimeout(() => {
            // alert(`网络异常${str}`);
            this.onReload();
        }, 5000);
    }

    private static onReload(){
        E.sdk.reload();
    }

    public static get curURL(){
        let openId:string = E.sdk.getOpenId();
        // let user = Laya.Utils.getQueryString("user");
        // if(user){
        //     openId = user;
        // }else{
        //     openId = E.sdk.getOpenId();
        // }
        let _url:string = `${InitConfig.getSyURL()}/login?appid=${E.sdk.getAppId()}&openid=${openId}&platform=${initConfig.debug_api_platform || initConfig.platform}&ver=${this.ver}&token=${E.sdk.getToken()}`;  
        return _url;
    }
    public static get ver():string{
        let ver = "v1_0_2024_1015";//Version.curValue
        if(Laya.Utils.getQueryString("ver")){
            ver = Laya.Utils.getQueryString("ver");        
            // if(ver == "dev"){
            //     return "v1.0.12";
            // }
            return ver;
        }
        if(initConfig.ver){
            ver = initConfig.ver;
            return ver;
        }
        if(initConfig.littlegame){
            ver += Version.SIGN;
        }
        return ver;
    }
    private static loginComplete(data:string){
        E.taLoginTrack("end_login_req");
        // let obj:ILoginCode = JSON.parse(data);
        this.login_obj = data;
        this.onLoginCallBack();
    }


    private static initTa() {
        if (initConfig.ttappid) {
            if (typeof wx != "undefined") {
                //微信
                var config = {
                    appId: initConfig.ttappid,//"2e6e81d56eb54e15b8d16ea21b12049a", // 项目 APP ID
                    serverUrl: tinkURL,//"https://thinkdata-tank.wanhuir.com", // 上报地址
                    autoTrack: {
                        appShow: true, // 自动采集 ta_mg_show
                        appHide: true, // 自动采集 ta_mg_hide
                    },
                    enableLog: false,//取消日志
                    //  mode:"debug",//调试模式
                };
                // 创建 TA 实例
                var ta = new window['ThinkingAnalyticsAPI'](config);
                ta.init();
                // console.log("sendTrack>>>>>>>>>>>>>>>>>joinwx ===>deviceId:"+ta.getDeviceId());
                // ta.track("joinwx");
                wx['onError']((error) => {
                    ta.track("onError", { error: error.message });
                })
                window["ta"] = ta;
                E.taLoginTrack("GameInit");

                this.sendTrack("joinwx");
                ta.userSetOnce({ channel_key: initConfig.channel_key });
                ta.userSet({ "device": window['Sygame'].userBrandModel });
            } else {
                //H5
                let _platform = this.get_SDK_platform();

                switch (_platform) {
                    case PlatformConfig.Dev:
                    case PlatformConfig.CB1:
                    case PlatformConfig.War3:
                    case PlatformConfig.BaU:
                    case PlatformConfig.TAPTAP:
                        initThinkingdata();
                        break;
                }
            }
        }
    }

    /**上报错误 */
    static uploadErr(err:string){
        if(this.ta){
            this.ta.track("onError", { error: err });
        }else{
            LogSys.Error(err);
        }
    }
    private static onLoginCallBack(){
        E.sdk.loginCallBack();
        E.taLoginTrack("wxLoginComolete");
        if (E.ta) {
            if(window["Sygame"]){
                E.ta.userSetOnce({ openid: window["Sygame"].openid });
            }else if(window["Y1YSDK"]){
                E.ta.userSetOnce({ openid: E.sdk.getOpenId() });
            }
        }
        // console.log("微信登录成功>>>>>>>>>>>")
        // DebugData.init();
        // this.Debug = HrefUtils.getHref("debug") == "1";
        if (this._hasInited) return;
        this._hasInited = true;
        //初始化配置
        // AppCfg.Init();

        //初始化Laya配置
        this.layaInit();

        // if(this.wx && window["wxlog"]){
        // this.testUI();
        // }
    }


    /**清除*/
    public static Clear() {
        this.ClearFrameMgr();
        this._hasInited = false;
    }
    public static atlasMgr:AtlasMgr = new AtlasMgr();
    public static get SceneMgr() { return this._sceneMgr; }
    public static get ViewMgr() { return this._viewMgr; }
    public static get ResMgr() { return this._resMgr; }
    public static get EventMgr() { return this._eventMgr; }
    public static get MsgMgr() { return this._msgMgr; }
    public static get AudioMgr() { return this._audioMgr; }
    public static get LangMgr() { return this._langMgr; }
    private static _sceneMgr: Scene2DManager;       //场景管理器
    private static _viewMgr: ViewManager;           //页面管理器
    private static _resMgr: ResourceManager;        //资源管理器
    private static _eventMgr: EventManager;         //事件管理器
    private static _msgMgr: MsgManager;             //消息管理器
    private static _audioMgr: Frame.AudioManager;   //音效管理器
    private static _langMgr: LanguageManager;       //语言管理器
    private static wxBg:Laya.Image;
    static tableMgr:TableMgr;
    /**初始化框架管理器*/

    private static onPreInitFramework() {

        this._sceneMgr = new Scene2DManager();
        this._viewMgr = new ViewManager();
        this._resMgr = new ResourceManager();
        this._eventMgr = new EventManager();
        this._msgMgr = new MsgManager();
        this._audioMgr = new Frame.AudioManager();
        this._langMgr = new LanguageManager();
        this.tableMgr = new TableMgr();
        if (!this.onAfterInitFramework()) {
            LogSys.Error("InitFramework failed!");
        }
    }

    private static onAfterInitFramework(): boolean {
        if (!this._sceneMgr.Init()) return false;
        if (!this._viewMgr.Init()) return false;
        if (!this._resMgr.Init()) return false;
        if (!this._eventMgr.Init()) return false;
        if (!this._msgMgr.Init()) return false;
        if (!this._audioMgr.Init()) return false;
        if (!this._langMgr.Init()) return false;
        // if (!this._yinDaoMgr.Init()) return false;

        return true;
    }

    /**清除框架管理器*/
    private static ClearFrameMgr() {

        this._sceneMgr.Clear();
        this._viewMgr.Clear();
        this._resMgr.Clear();
        this._eventMgr.Clear();
        this._msgMgr.Clear();
        this._audioMgr.Clear();
        this._langMgr.Clear();
        // this._yinDaoMgr.Clear();
    }
    private static isPc = true;

    private static isMobile() {
        let userAgentInfo = navigator.userAgent.toLowerCase();
        let Agents = new Array('android', 'iphone', 'symbianos', 'windows phone', 'ipad', 'ipod');
        let flag = false;
        for (let v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) !== -1) {
                flag = true;
                break;
            }
        }
        return flag;
    }
    
    private static beginGame(){
        let _isMobile = this.isMobile();
        this.isPc = !_isMobile;
        if (this.isPc) {
            var w = ScreenAdapter.RefWidth = 900;
            var h = ScreenAdapter.DefaultHeight;
            this.initStage(w, h);
        }
        else {
            var w = ScreenAdapter.RefWidth = ScreenAdapter.UIRefWidth;
            var h = ScreenAdapter.DefaultHeight;
            if (window.innerHeight / window.innerWidth > h / w) {
                h = window.innerHeight / window.innerWidth * w;
            }
            else {
                if (window.innerWidth / window.innerHeight <= 1) {
                    w = h / window.innerHeight * window.innerWidth;
                }
                else {
                    w = Math.min(1000, h / window.innerHeight * window.innerWidth);
                }
            }
            this.initStage(w, h);
        }
        LogSys.Log("isMobile :" + _isMobile+",innerWidth innerHeight "+window.innerWidth , window.innerHeight,"wh",Laya.stage.width,Laya.stage.height,"devicePixelRatio:"+window.devicePixelRatio);
        
        E.sendTrack(`gameScreenSize`,{width:w,height:h,innerWidth:window.innerWidth,innerHeight:window.innerHeight});
    }

    private static initStage(w,h){
        Config.isAlpha = true;
        Laya.init(w, h, Laya.WebGL);
        Laya.stage.frameRate = InitConfig.frameRate;//"fast";//"fast" "slow","sleep"
        ByteCfg.indexKEY = "f_id";
        ByteCfg.uint64 = uint64;
        // this.testUI();
        // Laya.timer.frameLoop
    }

    /**laya引擎内容初始化 */
    private static layaInit() {
        E.taLoginTrack("layaInit");
        // console.log("laya引擎内容初始化>>>>>>>>>>>")
        Config.useRetinalCanvas = true;
        // 设置可透明
        // Config.isAlpha = true;

        //根据IDE设置初始化引擎		
        
        this.beginGame();

        if(Laya.MiniAdpter){
            if(initConfig.littlegame){
               
            }else{
                Laya.MiniAdpter.nativefiles = ["bg1.jpg"];
                let img:Laya.Image = new Laya.Image();
                img.skin="bg1.jpg";
                this.wxBg = img;
            }
        }
        else{
            LogSys.Log("Laya.MiniAdpter is null!");
        }

        Laya.URL.basePath = InitConfig.getUI2();

        // Laya.Log.maxCount = 100;
        // Laya.Log.enable();
        // Laya.Log.print("laya.log enable");
        //背景色
        // if(E.Debug){
            // Laya.stage.bgColor = "#ffffff";//"white";
        // }else{
        Laya.stage.bgColor = "#000000";//"gray";//"black";
        // }



        //缩放模式
        Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_HEIGHT;
        //屏幕大小
        Laya.stage.setScreenSize(Browser.clientWidth, Browser.clientHeight);
        //屏幕横竖屏
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;// SCREEN_HORIZONTAL;
        //水平对齐方式
        Laya.stage.alignH = Laya.Stage.ALIGN_CENTER;
        //垂直对齐方式
        Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE;
        //开启物理引擎
        // if (AppCfg.PhysicEnable)
        // Laya["Physics"] && Laya["Physics"].enable();
        
        //是否开启调试
        Laya["DebugPanel"] && Laya["DebugPanel"].enable();

        //打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
        // if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") {
        //     Laya.enableDebugPanel();
        // }
        //物理调试
        if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) {
            Laya["PhysicsDebugDraw"].enable();
        }
        if(debug){
            //开始全局错误弹窗
            Laya.alertGlobalError(true);
        }
        //多点触控开关
        Laya.MouseManager.multiTouchEnabled = true;

        //兼容微信不支持加载scene后缀场景
        Laya.URL.exportSceneToJson = true;
        if(this.wxBg){
            Laya.stage.addChild(this.wxBg);
        }
        /*      
               //激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
               Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, function () {
                   if (callback) callback.Invoke();
                   //激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
                   // Laya.AtlasInfoManager.enable("fileconfig.json");
               }), Laya.ResourceVersion.FILENAME_VERSION);
        */
  
        this.onloadAtlasComplete();

    }
    // private static loadMas:LoadMainnfestParse;
    private static onloadAtlasComplete(){
        
		if(window && window.document){
			let t = window.document.getElementById("outLoadingLayer");
			if(t){
				t.style.display = "none";
			}
		}
        
        // console.log("字体加载完成")
        //应用根节点
        this.AppRoot = new Common.AppRoot();
        this.AppRoot.onInit();

        //初始化管理器
        this.onPreInitFramework();
        LayerMgr.Ins.Init();//层级管理器初始化
        //================================================
        // if(initConfig.enable_spine_gpu_test){
        //     E.ViewMgr.Open(EViewType.SpineGPU_Test);
        //     return;
        // }
        //================================================
        // E.ViewMgr.ShowLoading();
        // let _mani:ManifestParse = new ManifestParse(new Laya.Handler(this, this.layaInitComplete));
        new LoadMainnfestParse(new Laya.Handler(this, (out:LoadMainnfestParse) => {
            E.sdk.loadFont(out.data, new Laya.Handler(this, () => {
                E.taLoginTrack("fontLoadComolete");
                this.layaInitComplete();
            }));
        }));

    }

    public static addVersionPrefix(url: string) {
        let key = Laya.ResourceVersion.manifest;
        let arr = url.split("?");
        if (arr.length > 1) {
            url = arr[0];
        }
        if (url && key[url]) {
            let u;
            if (arr.length > 1) {
                u = key[url] + "?" + arr[1];
            } else {
                u = key[url];
            }
            // return `${ResVer.G}/${u}`;
            return 'g/' + u;
        }
        return url;
    }


    /**laya初始化完成*/
    private static layaInitComplete(): void {
        E.taLoginTrack("layaLoadComolete");
        // console.log("laya初始化完成")
        // E.yinDaoMgr.Init();
        // E.localGuideMgr.Init();
        //初始化需要加载的资源
        G.Init();
    
    }
    //#endregion
}

export class G {

    public static gameData:GameCfgData;

    private static preResLoad(){
        MainModel.Ins.initStrategy();
        this.onBaseAtlasComplete();
    }
    
    private static onBaseAtlasComplete(){
        let _defaultRes = new ResItemGroup();
        _defaultRes.Add(Path.GetAtlas("base.atlas"),Laya.Loader.ATLAS);
        E.ViewMgr.Loading(_defaultRes,new Laya.Handler(this,this.onPreComplete));
    }

    private static onPreComplete(){
        
        if(parseInt(Laya.Utils.getQueryString("skipgame"))!=1 && window["subSheGame"]){
            window["subSheGame"].startGame(this.onInitGame);
        }else{
            this.onInitGame();
        }
    }

    private static onInitGame(){
        G.gameStart();
        E.ViewMgr.Close(EViewType.Loading);
    }

    /**注册配置表 */
    private static regTableCls(){
        E.tableMgr.regClsList(
            [
                t_FightStyle,
                t_MonsterPvp,
                t_Battle_Task,
                t_Enemy_Wave,
                t_Monster_Coop,
                t_Battle_Task_Coop,
                t_Enemy_Wave_Coop,
                t_Function_Coop,
                t_Battle_Communication,
                t_GuideChapter,
                t_Wave,
                t_Skill_Skin,
                t_Cover_Big_Goose_Task,
                t_Cover_Big_Goose_Pack,
                t_Cover_Big_Goose_reward,
                t_Cover_Big_Goose_config
            ]
        );
    }

    private static loadAtlasComplete() {
        this.regTableCls();
        if(initConfig.enable_spine_gpu_test2){
            E.ViewMgr.Open(EViewType.SpineGPU_Test);
            return;
        }
        E.sdk.checkUpdate();
        let val = System_RefreshTimeProxy.Ins.getVal(ESystemRefreshTime.DisableSpineCache);
        if(val == "1" || Laya.Utils.getQueryString("noSpineCache")/* || initConfig.disableSpineCache*/){
            GameConfig.spineCache = false;
        }
        
        E.taLoginTrack("excelLoadComolete");
        this.gameData = new GameCfgData();
        this.preResLoad();
    }
    public static Init() {
          //加载配置文件
          E.taLoginTrack("excelLoading");
          // console.log("加载配置")
          let _dataMgr = StaticDataMgr.Ins;
          _dataMgr.once(Laya.Event.COMPLETE, this, this.loadAtlasComplete);
          _dataMgr.Init();
    }

    /**开始游戏 */
    private static gameStart(): void {
        LogSys.Log("gameStart...");
        // ComposeModel.Ins.onGameStart();
        E.EventMgr.emit(EventID.GameStart);
        E.ViewMgr.Open(EViewType.LoginNew);//打开登陆页面
        E.EventMgr.emit(GameEvent.DebugToolsCreate);
    }

    public static sendGM(str: string) {
        let req: Gm_req = new Gm_req();
        req.datas = str;
        SocketMgr.Ins.SendMessageBin(req);
    }

    //#endregion

    public static OnUpdate(): void {
        // if (this.WorldMgr) this.WorldMgr.Update();
        // if (this.Scene3DMgr) this.Scene3DMgr.Update();
    }

    public static OnLateUpdate(): void {
        // if (this.WorldMgr) this.WorldMgr.LateUpdate();
        // if (this.Scene3DMgr) this.Scene3DMgr.LateUpdate();

    }

    public static OnFixedUpdate(): void {
        // if (this.WorldMgr) this.WorldMgr.FixedUpdate();
        // if (this.Scene3DMgr) this.Scene3DMgr.FixedUpdate();
    }

}

