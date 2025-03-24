import { ISygame, SdkPlayerData, SySdkPayData, SySubcribeData } from "./interface";


// 上报类型
const reportTypes = ['entergame', 'createrole', 'roleupgrade'];
export let Sygame = window['Sygame'] as ISygame;
export class SySdk {
    private static _ins: SySdk;
    private on: boolean = true; // 是否开启sdk
    public openid: string = ''; // ⽤户openid（⽤户唯⼀凭证）
    /**
     * sdk接口增加字段：cbsgTunnelOpenType，仅在是新用户时返回（老用户没有这个字段），1为磕头主题，0为默认宝箱主题
     * 2023 11 20 =============> 为2时客户端展示敲鼓，不为2时显示默认磕头。
     */
    public cbsgTunnelOpenType:number;
    public cbsgTunnelId:number;
    public userPlatformType;

    private playerData: SdkPlayerData;
    
    public static get Ins() {
        if (!this._ins) {
            this._ins = new SySdk();
        }
        return this._ins;
    }

    public setPlayerData(playerData: SdkPlayerData) {
        this.playerData = playerData;
    }

    /**
     * 更新玩家等级
     * @param playerLevel 玩家等级
     */
    public setPlayerLevel(playerLevel: number) {
        this.playerData.role_level = playerLevel;
        this.playerData.role_vip = playerLevel;
        
    }

    /**
     * 更新玩家战力
     * @param plus 玩家战力
     */
    public setPlayerPlus(plus: number) {
        this.playerData.role_power = plus;
    }

    /**
     * 初始化SDK（上报⽤户的⼊⼝参数。请务必在最开始就调⽤初始化init函数）
     */
    public syInit() {
        if (!this.on) return;
        let data = wx.getLaunchOptionsSync();
        Sygame.init(data);
    }

    /**
     *  ⽤户登录，换取⽤户openid
     */
    public syLogin(callBack) {
        if (!this.on) return;
        Sygame.syLogin().then((res) => {
            this.openid = res.openid;
            this.cbsgTunnelOpenType = res.cbsgTunnelOpenType;
            this.userPlatformType = res.userPlatformType;
            if(res.cbsgTunnelId!=undefined){
                this.cbsgTunnelId = res.cbsgTunnelId;
            }
            // if(LogSys.CanLog(ELogLevel.LOG)){
            console.log('===================>syLogin:', JSON.stringify(res));
            console.log("openid:"+this.openid);
            // }
            callBack();
            // res.code 状态码，
            // res.message 状态说明
            // res.openid ⽤户openid（⽤户唯⼀凭证）
            // res.uid ⽤户uid
            // res.package_original_game_key 导包转移中原始⽤户openid所属游戏game_key,⾮导包转移情况下为空(该参数只涉及CP⽆法通过openid获取账户⻆⾊信息时使⽤，其它任何场景均不可使⽤)
            // res.session_key ⽤户session_key
        }).catch(()=>{
            callBack();
        });
    }

    /**
     * 上报数据
     * @param type ⽤户在游戏内有创建⾓⾊，进⼊游戏，⽤户升级
     */
    public syReportRoleInfo(type: 'entergame' | 'createrole' | 'roleupgrade') {
        if (!this.on) return;
        if (reportTypes.indexOf(type) === -1) return;
        const data = this.playerData;
        data.report_type = type;
        LogSys.Log('syReportRoleInfo data'+ JSON.stringify(data));
        Sygame.syReportRoleInfo(data).then((res) => {
            LogSys.Log('syReportRoleInfo'+ JSON.stringify(res));
            // res.status 状态码
            // res.info 状态信息
            // res.can_pay 是否可以让⽤户看到⽀付⼊⼝，1为是，0为否。调取syReportRoleInfo的时候需要传⼊role_level
            // res.paylevel 可以让⽤户看到⽀付⼊⼝的等级，当⽤户使⽤的是ios客户端时可以看到，安卓看不到
        });
    }

    /**
     * 调起激励视屏⼴告
     * @param callback 
     */
    public showRewordVideo(callback) {
        // callback：回调函数（0：⽤户未看完取消；1、⽤户看完⼴告；2、拉取⼴告错误）
        Sygame.showRewordVideo(callback);
    }

    /**
     * 支付
     * @param payData 支付数据
     */
    public pay(payData: SySdkPayData) {
        let _playerData = this.playerData;
        // if(initConfig.debug_pay_server_id){
        //     let o:SdkPlayerData = {} as SdkPlayerData;
        //     o.report_type = _playerData.report_type;
        //     o.role_id = _playerData.role_id;
        //     o.role_level = _playerData.role_level;
        //     o.role_name = _playerData.role_name;
        //     o.role_power = _playerData.role_power;
        //     o.role_vip = _playerData.role_vip;
        //     o.server_id = initConfig.debug_pay_server_id;
        //     o.server_name = _playerData.server_name;
        //     _playerData = o;
        
        //     E.ViewMgr.ShowMsgBox(EMsgBoxType.OnlyOk,JSON.stringify(_playerData));
        // }
        const requestData = {
            ...payData,
            ..._playerData,
        };
        Sygame.syPay(requestData).then((res) => {
            if(LogSys.CanLog(ELogLevel.LOG)){
                console.log(res);
                console.log(res.info); // 提示信息
                console.log(res.payId); // 订单ID(不是orderid)
                console.log(res.status); // 接⼝状态信息
            }
        });
    }

    /**
     * 拉起订阅消息
     * @param data 
     */
    public syGetSubscribe(data: SySubcribeData) {
        data['role_id'] = this.playerData.role_id;
        Sygame.syGetSubscribe(data).then((res) => {
            LogSys.Log(res);
            LogSys.Log(res.status); // 状态码
            LogSys.Log(res.info); // 信息
        });
    }

    /**
     * 拉起分享
     * @param data 分享数据（分享标题等）
     * @param shareQueryParam 分享链接带上的参数
     */
    public goShareData(shareQueryParam: string) {
        let shareData = window['Sygame'].shareCardV3Params(); 
        let d = { 
            title: shareData.title, 
            imageUrlId: shareData.imageUrlId, 
            imageUrl: shareData.image, 
            query: (shareQueryParam ? shareQueryParam + '&' : '') + shareData.query
        };
        console.log('分享goShareData', d);
        wx.shareAppMessage(d);
    }

    /**
     * 获取玩家的微信头像、昵称
     * @param successCallback 成功回调
     * @param failCallback 失败回调
     */
    public syGetWechatNickname(successCallback, failCallback) {
        Sygame.syGetWechatNickname().then((res: { avatarUrl: string, nickName: string }) => {
            // LogSys.Log("用户信息"+JSON.stringify(res));
            successCallback(res);
        }).catch(e => failCallback(e));
    }

    public getAppId() {
        return Sygame.appid;
    }

    public onShow(query) {
        // if (query && query['query'] && query['query']['afkinviter']) {   
            // 从挂机的邀请分享入口进的
            // const req = new AfkInvite_req();
            // req.inviterId = Number(query['query']['afkinviter']);
            // SocketMgr.Ins.SendMessageBin(req);
        // }
    }
}