// import { HttpUtil } from "../../../../frame/util/HttpUtil";
import { E, ScreenAdapter } from "../../../G";
import { System_RefreshTimeProxy } from "../main/ctl/System_RefreshTimeProxy";
import { BaseSdk } from "../sdk/BaseSdk";
import { ESdkValChange } from "../sdk/ISdk";
import { FontLoad } from "./model/FontLoad";
import { Sygame, SySdk } from "./sy-sdk/index";
import { SdkPlayerData, SySubcribeData } from "./sy-sdk/interface";
import { IWeixin_ext } from "./vos/Iweixin_ext";
/**微信模块*/
export class WeiXinSDK extends BaseSdk{

    constructor(){
        super();
    }

    checkUpdate() {
        let val = parseInt(System_RefreshTimeProxy.Ins.getVal(102));
        console.log(`微信版本更新功能开关${val}`);
        if(val != 1){
            return;
        }  
        if (typeof wx.getUpdateManager != "function") {
            return;
        }
        const updateManager = wx.getUpdateManager()

        updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            let needUpdate = res.hasUpdate;
            console.log("微信更新状态:", needUpdate);
            if (needUpdate) {
                updateManager.onUpdateReady(function () {
                    wx.showModal({
                        title: '更新提示',
                        content: '新版本已经准备好，是否马上重启小程序？',
                        success: function (res) {
                            if (res.confirm) {
                                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                updateManager.applyUpdate()
                            }
                        }
                    })
                })
            }
            updateManager.onUpdateFailed(function () {
                console.log("新的版本下载失败");
            });
        });
    }

    // public type:ESdkType = ESdkType.WeiXin;
    public get wx_ext():IWeixin_ext{
        return window["wx_ext"]
    }

    public font:FontLoad = new FontLoad();

    public loadFont(data,_fontLoadEnd:Laya.Handler){
        this._fontLoadEnd = _fontLoadEnd;        
        this.font.wx_ext = this.wx_ext;
        if (this.disableLoadFond) {
            this.onLoadComplete();
        } else {
            this.font.load(data, "remote/font/BOLD.ttf");
            this.font.load(data, "remote/font/fz.ttf");
            this.font.once(Laya.Event.COMPLETE,this,this.onLoadComplete);
            this.font.start();
        }
    }

    public convertFont(fontName:string):string{
        let font = this.font.fontKey[fontName];
        // console.log("fontName:"+fontName + "," + font);
        if(font){
            font = font.replace(/\u0000/g,"");//抖音 HELIUMF0000 HELIUMF0001 去掉Unicode的空格
        }
        return font;
    }

    /**
     * 观看激励视频
     * @param callback 回调函数
     */
    public lookVideo(callback: (type: 0 | 1 | 2) => void){
        if(this.canFreeLook){
            callback.call(this,1);
        }else{
            this.sdkWatchCVideo(callback);
        }
    }

    protected sdkWatchCVideo(callback){
        SySdk.Ins.showRewordVideo(callback);
    }

    /**
     * 玩家的数据变化/事件上报
     * @param type 类型
     * @param v 数值
     */
    public valChange(type:ESdkValChange,v:number){
        switch(type){
            case ESdkValChange.LevelUp:
                LogSys.Log("等级变化到了"+v);
                SySdk.Ins.setPlayerLevel(v);
                SySdk.Ins.syReportRoleInfo('roleupgrade');
                break;
            case ESdkValChange.Plus:
                LogSys.Log("战斗力变化到了"+v);
                SySdk.Ins.setPlayerPlus(v);
                break;
            case ESdkValChange.EnterGame:
                SySdk.Ins.syReportRoleInfo('entergame');
                break;
            case ESdkValChange.CreateRole:
                SySdk.Ins.syReportRoleInfo('createrole');
                break;
        }
    }

    /**
     * 支付
     * @param orderId 订单号
     * @param cny 订单金额（元）
     */
    public recharge(orderId: string, cfg:Configs.t_Recharge_dat){
        let price:number = cfg.f_price / 100;
        SySdk.Ins.pay({ order_id: orderId, product_price: price });
    }
    
    /**
     * 设置sdk所需的玩家数据
     * @param playerData 
     */
    public setPlayerData(playerData: SdkPlayerData) {
        SySdk.Ins.setPlayerData(playerData);
    }

    /**
     * 初始化SDK
     */
    public init() {
        SySdk.Ins.syInit();
    }

    /**
     *  ⽤户登录
     */
    public login(that,callBack:Function) {
        SySdk.Ins.syLogin(()=>{

            let style1 = SySdk.Ins.cbsgTunnelOpenType;

            //console.log("主题:"+style1);
            if(style1!=undefined){
                //上报
                if (E.ta) {
                    E.ta.userSetOnce({ box_animation: style1 });
                }
            }
            this.cbsgTunnelId = SySdk.Ins.cbsgTunnelId || 0;

            if(StringUtil.IsNullOrEmpty(Sygame.adunitid) && !StringUtil.IsNullOrEmpty(initConfig.adunitid)){
                //设置激励视频id
                Sygame.adunitid = initConfig.adunitid;
            }
            callBack.call(that);
        });
    }

    /**
     * 获取openId
     * @returns 
     */
    public getOpenId(): string {
        if(initConfig.openid){
            return initConfig.openid;
        }
        return SySdk.Ins.openid;
    }
    
    public getAppId():string{
        if(initConfig.appid){
            return initConfig.appid;
        }
        return SySdk.Ins.getAppId();
    }
    /**
     * 拉起订阅消息
     * @param templates 模版ID 必填，最多⼀次请求三个模版ID
     */
    public getSubscribe(templates: string[]) {
        //todo 测试用
        let data = {
            template: templates, // 模版ID 必填
        } as SySubcribeData;
        SySdk.Ins.syGetSubscribe(data);
    }

    /**
     * 分享
     * @param data 
     */
    public goShareData(shareQueryParam: string) {
        //todo 测试用
        //let gj = Laya.loader.getRes(StaticDataMgr.Ins.gameJson);
        // console.log("gj.shareData.title",gj.shareData.title)
        // console.log("gj.shareData.imageUrlId",gj.shareData.imageUrlId)
        // console.log("gj.shareData.image",gj.shareData.image)
        // const shareData = data || {
        //     title: gj.shareData.title, //分享卡⽚标题
        //     imageUrlId: gj.shareData.imageUrlId, // 分享卡⽚MP图⽚编号
        //     image: gj.shareData.image, // 分享卡⽚图⽚地址
        // }
        SySdk.Ins.goShareData(shareQueryParam);
    }

    /**
     * 获取玩家的微信头像、昵称
     * @param successCallback 成功回调
     * @param failCallback 失败回调
     */
    public getWechatNickname(successCallback, failCallback) {
        SySdk.Ins.syGetWechatNickname(successCallback, failCallback);
    }

    /**游戏圈数据 */
    public getGameClubData(callback: Function): { join: boolean, like: number, publish: number } {
        let wx = window['wx'] as any;
        const session = window['Sygame']?.['session_key'];
        if (wx && window['Sygame']?.['session_key']) {
            if (typeof wx.getGameClubData == "undefined") {
                return;
            }
            wx.getGameClubData({
                dataTypeList: [{ type: 1 }, { type: 4 }, { type: 5 }],
                complete: (res) => {
                    if (res['encryptedData'] && res['iv'] && res['signature']) {
                        HttpUtil.httpPost(
                            `https://docater1.cn/index.php?g=Wap&m=MiniGame&a=decode_encrypted`,
                            { encryptedData: res['encryptedData'], iv: res['iv'], sessionKey: session },
                            new Laya.Handler(this, callback)
                        )
                    } else {
                        callback();
                        console.log('getGameClubData err: ', res);
                    }
                }
            });
        }
        return;
    }

    public onShow(query) {
        super.onShow(query);
        SySdk.Ins.onShow(query);
    }
    // protected deskSceneIDs:string[]=["1023", "1223"];
    
    /**状态栏高度 */
    get statusBarHeight(){
        let systemInfo = wx.getSystemInfoSync();
        return systemInfo.statusBarHeight * ScreenAdapter.RefWidth / systemInfo.windowWidth;
    }
    get bottomInset(){
        let systemInfo = wx.getSystemInfoSync();
        if(systemInfo['safeArea']){
            let bottomInset = (systemInfo['safeArea'].bottom - systemInfo.windowHeight) * (ScreenAdapter.RefWidth / systemInfo.windowWidth);
            let v = Math.abs(bottomInset);
            return Math.min(v,32);
        }
        return 0;
    }
}