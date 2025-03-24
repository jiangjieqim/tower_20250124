import { InitConfig, PlatformConfig } from "../../../../InitConfig";
import { EMsgBoxType } from "../../../common/defines/EnumDefine";
import { E } from "../../../G";
import { LoginClient } from "../../../network/clients/LoginClient";
import { ResItemGroup } from "../../../resouce/ResItemGroup";
import { ZipJson } from "../../../static/ZipJson";
import { TeQuanKaModel } from "../activity/tequanka/TeQuanKaModel";
import { MainModel } from "../main/model/MainModel";
import { t_Platform } from "../main/proxy/t_Platform";
import { SySdk } from "../weixin/sy-sdk/index";
import { SdkPlayerData } from "../weixin/sy-sdk/interface";
import { gameTT } from "./douyin/IDouyinTTsdk";
import { ESdkValChange, IAppScene, ISdk } from "./ISdk";

export class BaseSdk implements ISdk {
    isWhite:boolean;
    taptapTrack(eventName:string,param?){
        let s:string = param ? JSON.stringify(param) : "";
        LogSys.Log(`taptapTrack:${eventName} ${s}`);
    }
    taptapInit() {
        if (debug) {
            let sdk = window['Y1YSDK'];
            if (sdk) {
                LogSys.Log("BaseSdk syTapTapAndroidAction... gameInit");
                if (typeof sdk.syTapTapAndroidAction == "function") {
                    sdk.syTapTapAndroidAction("gameInit").then((data) => {
                    });
                }
            }
        }
    }
    checkUpdate(){
        
    }
    age:number = 0;
    get statusBarHeight():number{
        return 0;
    }
    get bottomInset(){
        if(Laya.Utils.getQueryString("bottomInset")){
            return parseInt(Laya.Utils.getQueryString("bottomInset"))
        }
        return 0;
    }
    getAge(that:any,callBack:Function){
        callBack.call(that);
    }
    // private _randomName:string;
    
    constructor(){
        // let _name = Laya.Utils.getQueryString("randomname");
        // if (_name) {
        //     this._randomName = Math.floor(Math.random() * 100000).toString();
        // }
    }
    protected _defaultToken:string = "token";
    hasShortcut:boolean;
    gotoTapTap(url:string,that?,callBack?:Function){   
    }
    addShortcut() {
        E.ViewMgr.ShowMsgBox(EMsgBoxType.OnlyOk,`添加快捷方式到桌面`);
    }
    /**取消自定义字体 */
    protected get disableLoadFond(){
        return Laya.Utils.getQueryString("debug_loadFont_disable") || initConfig.debug_loadFont_disable;
    }

    // public type:ESdkType = ESdkType.Null;
    protected get deskSceneIDs():string[]{
        let cfg:Configs.t_Platform_dat = t_Platform.Ins.curCfg;
        if(cfg){
            let arr:string[] = cfg.f_desk_scene.split("|");
            return arr;
        }
        return [];
    }
    protected _fontLoadEnd:Laya.Handler;
    // public cbsgTunnelOpenType;
    public cbsgTunnelId:number = 0;
    private getNewUrl(jsonData,url:string){
        if(jsonData[url]){
            return `e/${jsonData[url]}/${url}`;
        }
        return url;
    }
    get isFromSidebarCard(){
        if(Laya.Utils.getQueryString("sider") || initConfig.sider){
            return true;
        }
        return false;
    }
    get clienttype(){
        let _clientType = Laya.Utils.getQueryString("clienttype");
        if(_clientType){
            return  parseInt(_clientType);
        }
        return initConfig.clienttype;
    }
    public loadFont(jsonData, _fontLoadEnd: Laya.Handler) {
        this._fontLoadEnd = _fontLoadEnd;
        let asset = InitConfig.getAsset();
        if (this.disableLoadFond) {
            this.onLoadComplete();
        } else {
/*
            let resList = [];
            resList = [
                { url: asset + this.getNewUrl(jsonData, "remote/font/BOLD.ttf"), type: Laya.Loader.TTF },//汉字
                { url: asset + this.getNewUrl(jsonData, "remote/font/fz.ttf"), type: Laya.Loader.TTF },//数字]
            ];
            Laya.loader.load(resList,new Laya.Handler(this, this.onLoadComplete));
*/        
            
            let _defaultRes = new ResItemGroup();
            
            _defaultRes.Add(asset + this.getNewUrl(jsonData, "remote/font/BOLD.ttf"),Laya.Loader.TTF);
            _defaultRes.Add(asset + this.getNewUrl(jsonData, "remote/font/fz.ttf"),Laya.Loader.TTF);
            E.ViewMgr.Loading(_defaultRes,new Laya.Handler(this,this.onLoadComplete));
        }
    }

    protected onLoadComplete(){
        LogSys.Log("字体加载完成!!!"+ (E.sdk.convertFont(ZipJson.BOLD) || "undefined")+ "," + (E.sdk.convertFont("fz") || "undefined"));
        this._fontLoadEnd.run();
    }
    public convertFont(fontName: string): string {
        return fontName;
    }

    public lookVideo(callback: (type: 0 | 1 | 2) => void) {
        if(this.canFreeLook){
            E.ViewMgr.ShowMidError("免广告");
            callback.call(this,1);
        }else{
            E.ViewMgr.ShowMidError("看了一段广告");
            Laya.timer.once(1000,this,()=>{
                 callback.call(this,1);
            })
        }
    }
    /**登录回调结束 */
    loginCallBack(){

    }

    get canFreeLook(){
        if(TeQuanKaModel.Ins.isOpenYueKa() || TeQuanKaModel.Ins.isOpenZSK()){
            return true;
        }
        return false;
    }

    public valChange(type:ESdkValChange,v:number){
        
    }
    public recharge(oderId:string,cfg:Configs.t_Recharge_dat) {
        MainModel.Ins.gm(`recharge ${oderId}`);
    }

    public init(): void {}
    
    // protected convertAnim(_cbsgTunnelOpenType: number) {
    //     let index = _cbsgTunnelOpenType;
    //     switch (_cbsgTunnelOpenType) {
    //         case 0:
    //             index = 1;
    //             break;
    //         case 1:
    //             index = 0;
    //             break;
    //     }
    //     return index;
    // }
    public login(that,callBack:Function): void {

        // if(HrefUtils.getVal("cbsgTunnelOpenType")!=undefined){
        //     SySdk.Ins.cbsgTunnelOpenType = HrefUtils.getVal("cbsgTunnelOpenType");
        // }
        // this.cbsgTunnelOpenType = this.convertAnim(SySdk.Ins.cbsgTunnelOpenType);

        let cbsgTunnelOpenType = Laya.Utils.getQueryString("cbsgTunnelOpenType");
        if(cbsgTunnelOpenType!=null){
            SySdk.Ins.cbsgTunnelOpenType = parseInt(cbsgTunnelOpenType);
        }
        callBack.call(that);
    }
    public setPlayerData(playerData: SdkPlayerData): void {}
    public getOpenId(): string {
        // if(this._randomName){
        //     return this._randomName;
        // }
        let user = Laya.Utils.getQueryString("user");
        if(user){
            return user;
        }
        return initConfig.openid || "01234567890123456789";
    }
    public pay(payData: any): void {};
    public getSubscribe(templates: string[]): void {
        console.log(templates);
    };
    public goShareData(shareQueryParam: string,that?,callBack?:Function): void {
        LogSys.Log("goShareData:" + shareQueryParam);
    };
    public getWechatNickname(successCallback, failCallback): void {};
    public getAppId():string{
        let appid:string = Laya.Utils.getQueryString("appid");
        if(appid){
            return appid;
        }
        if(initConfig.appid){
            return initConfig.appid;
        }
        return "tower_kaifazhong";
    }
    public onShow(query: any): void{
		//微信熄屏恢复背景音乐
        LoginClient.Ins.startPlayAudio();
    }

    public onHide(){

    }

    /**游戏圈数据 */
    public getGameClubData(callback: Function): { join: boolean, like: number, publish: number } {
        return;
    }

    public getAuth(callback: Function) {
        let wx = window['wx'] as any;
        if(!wx || typeof wx.openSetting == "undefined"){
            return;
        }
        wx.openSetting({
            success(res) {
                callback(res);
            }
        });
        
    }

    setCopy(str:string){
        switch(initConfig.platform){
            case PlatformConfig.WeiXin:
            case PlatformConfig.WEIXIN_DISCOUNT:
                window["wx_ext"].syGetClipboardData(str);
                break;
            case PlatformConfig.DOU_YIN:
                {
                    if(gameTT){
                        gameTT.setClipboardData({
                            data: str,
                            success(res) {
                            console.log('syCopy', res) 
                            }
                        });
                    }
                }
                break;
            default:
                // SheZhiModel.Ins.setCopy(str);
                this.defaultSetCopy(str);
                break;
        }
    }

    private defaultSetCopy(value:string){
        let input = Laya.Browser.document.createElement("input");
        input.value = value;
        Laya.Browser.document.body.appendChild(input);
        input.select();
        input.setSelectionRange(0, input.value.length);
        Laya.Browser.document.execCommand('Copy');
        Laya.Browser.document.body.removeChild(input);
        // navigator.clipboard.writeText(value);
    }


    /**是否来自来自桌面 */
    isFromDesk(res: IAppScene) {
        if (res && res.scene && (this.deskSceneIDs.indexOf(res.scene+"") !== -1)) {
            return true;
        }
        return false;
    }

    get scene(){
        if(initConfig.debug_scene){
            return initConfig.debug_scene;
        }
        let _scene:string = "";
        if (typeof wx != "undefined") {
            const data = wx.getLaunchOptionsSync();
            _scene = data.scene;
        }
        return _scene;
    }
    private compareVersion(version1, version2) {
        const v1 = version1.split(".");
        const v2 = version2.split(".");

        for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
            const num1 = parseInt(v1[i] || 0);
            const num2 = parseInt(v2[i] || 0);

            if (num1 > num2) {
                return 1;
            } else if (num1 < num2) {
                return -1;
            }
        }

        return 0;
    }

    protected isBigVersion(sdkVersion: string, target: string) {
        // let system:string = ;
        // let arr = sdkVersion.split(" ");
        // let tarArr = target.split(" ");
        // if(arr[0] == tarArr[0]){
            // let s = arr[1];
            // let tar = tarArr[1];
            if(this.compareVersion(sdkVersion,target)==1){
                return true;
            }else{
                return false;
            }
        // }
        // return true;
    }
    protected get isIOS(){
        if(Laya.Browser.onIOS || Laya.Browser.onIPad || Laya.Browser.onIPhone || Laya.Utils.getQueryString("onIOS") || initConfig.debug_onIOS){
            return true;
        }
        return false;
    }

    preInit(that,func:Function){
        func.call(that);
    }
    reload(){
        if(typeof Laya.Browser.window.location.reload == "function"){
            Laya.Browser.window.location.reload();
        }
    }
    getToken(){
        return this._defaultToken;
    }
    getChanenlId(){
        return initConfig.channel_id;
    }
}