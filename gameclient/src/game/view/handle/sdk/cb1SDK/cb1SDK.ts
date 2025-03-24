// import { HttpUtil } from "../../../../../frame/util/HttpUtil";
import { InitConfig } from "../../../../../InitConfig";
import { E } from "../../../../G";
import { MainModel } from "../../main/model/MainModel";
import { BaseSdk } from "../BaseSdk";
import { ESdkValChange } from "../ISdk";

let sdk = window['Y1YSDK']
interface IUserInfo{
    age:number;
    openid:string;
}
if(!sdk){
    //dump
    /*

//###############################################################################
    var initConfig = {
	clienttype:1,
	skin_type:1,
	platform: 5,
	discount_ratio:100,
	channel_id:"83ba86ff6e5f77214870e28e9890d77f",
	asset: "http://127.0.0.1:8001/Project1/Client/trunk/resource_war/",
	discount_all_bin: "http://127.0.0.1:8001/Project1/Client/war3/resource/all.bin",



	appid:"sgyxh5",
	// sy_url: "https://dev-server.game.wanhuir.com/war3"

	//=========================
	channel_id:"b25126dec4807e6d31af54a364e18361",
	sy_url:"https://dev-server.game.wanhuir.com/discount",

}
window["initConfig"] = initConfig;
//###############################################################################

"url":"http://127.0.0.1:8001/Project1/Client/trunk/gameclient/bin/index.html?config=zxdconfig&token=be0a7ab4cf0e6cb671fb36a1e4bce7fb&user=219246080&ver=dev",

//###############################################################################
    */
    sdk = {};
    sdk.config = function (p) { };
    sdk.userToken = Laya.Utils.getQueryString("token");
    let _openid = Laya.Utils.getQueryString("user");
    if(!_openid){
        // console.error(`Y1YSDK must be set user!`);
    }
    sdk.getUserInfo = function (p) { 
        return { status: 1001, userinfo: { openid: _openid } } 
    }
    sdk.syReportRoleInfo = function(p){
        return {};
    }
    sdk.PayInfo = function(p){
        return {data:""};
    }
}
/**戳爆0.1折心动 
 * 
 * war3 
*/
export class cb1SDK extends BaseSdk{
    curAppId:string = "sgyxh5";
    curChannelId:string = "b25126dec4807e6d31af54a364e18361";
    curDiscountRatio:number = 100;//比例系数
    //============================================================
    /**渠道ID */
    protected get channel_id():string {
        return this.curChannelId;
    }

    public getAppId():string{
        return this.curAppId;
    }
    // private appsecret:string = "PAOBBN5APNJE93PM6DB13PPBJFE1A9PQ";
    private openid:string;

    /**
    * 初始化SDK
    */
    public init() {
      
    }
    /**
    *  ⽤户登录
    */
    public login(that, callBack: Function) {
        let param = {
            channel_id:this.channel_id
        };
        HttpUtil.httpPost(`${InitConfig.getSyURL()}/h5sign/init`, param, new Laya.Handler(this, this.onInitHandler,[that,callBack]));
    }

    protected onInitHandler(that, callBack: Function,value: string){
        console.log("this.initvalue>>>>",value);
        let data = JSON.parse(value);
        if(data.code == 0){
            let param = {
                channel_id:this.channel_id,
                sign:data.result.sign
            };
            sdk.config(param);
            let param1 = {
                channel_id:this.channel_id,
                userToken:sdk.userToken
            };
            HttpUtil.httpPost(`${this.userInfo}`, param1, new Laya.Handler(this, this.onLoginHandler,[that,callBack]));
            console.log("this.cbsdk>>>>",sdk);
            console.log("this.cbsdk.userToken>>>>",sdk.userToken);
        }else{
            if(callBack){
                callBack.call(that);
            }
        }
    }

    private onLoginHandler(that, callBack: Function,value: string){
        console.log("this.Loginvalue>>>>",value);
        let data = JSON.parse(value);
        if(data.code == 0){
            let param = {
                sign:data.result.sign
            };
            let data1 = sdk.getUserInfo(param);

            if(data1.status == 1001){
                let _userInfo:IUserInfo = data1.userinfo;
                this.openid = _userInfo.openid;
                E.sdk.age = _userInfo.age;
                if(Laya.Utils.getQueryString("age")){
                    E.sdk.age = parseInt(Laya.Utils.getQueryString("age"));
                }
                if(initConfig.age){
                    E.sdk.age = initConfig.age;
                }
                console.log("this.openid>>>>"+this.openid+" age:"+E.sdk.age);
                callBack.call(that);
            }
        }else{
            callBack.call(that);
        }
    }

    private get userInfo(){
        return `${InitConfig.getSyURL()}/h5sign/userInfo`;
    }
    getAge(that:any,callBack:Function){
        let param1 = {
            channel_id:this.channel_id,
            userToken:sdk.userToken
        };
        HttpUtil.httpPost(this.userInfo, param1, new Laya.Handler(this, this.onAgeAngin,[that,callBack]));
    }

    private onAgeAngin(that, callBack: Function,value: string){
        let data = JSON.parse(value);
        if(data.code == 0){
            let param = {
                sign:data.result.sign
            };
            let data1 = sdk.getUserInfo(param);

            if(data1.status == 1001){
                let _userInfo:IUserInfo = data1.userinfo;
                E.sdk.age = _userInfo.age;
                console.log(`onAgeAngin: age:${E.sdk.age}`);
            }
        }
        callBack.call(that);
    }

    /**
    * 支付
    * @param orderId 订单号
    * @param cny 订单金额（元）
    */
    public recharge(orderId: string, cfg:Configs.t_Recharge_dat) {
        console.log("this.cfg>>>>>>>>>>>>>",cfg);
        let price:number = cfg.f_price / this.curDiscountRatio;
        let param = {
            channel_id:this.channel_id,
            userToken:sdk.userToken,
            orderid:orderId,
            price:price.toString(),
            item_id:"1",
            other:""
        };

        LogSys.Log(`price is [${JSON.stringify(param)}]`);
        HttpUtil.httpPost(`${InitConfig.getSyURL()}/h5sign/charge`, param, new Laya.Handler(this, this.onRechargeHandler,[orderId,price]));
    }

    private onRechargeHandler(orderId: string, cny: number,value: string){
        console.log("this.Rechargevalue>>>>",value);
        let data1 = JSON.parse(value);
        if(data1.code == 0){
            let param = {
                orderid: orderId,
                price: cny.toString(),
                item_id: '1',
                other: '',
                role_id: MainModel.Ins.mRoleData.AccountId.toString(),
                role_name: MainModel.Ins.mRoleData.NickName,
                role_level: MainModel.Ins.mRoleData.lv,
                server_id: MainModel.Ins.mRoleData.serverId.toString(),
                sign: data1.result.sign
            }
            let data = sdk.PayInfo(param);
            // 调⽤ 此⽅法后⽤postMessage ⽅法通知⽗⻚⾯调起⽀付
            parent.postMessage(data.data, sdk.PUBLIC_URL);
        }
    }

    /**
     * 玩家的数据变化/事件上报
     * @param type 类型
     * @param v 数值
     */
    public valChange(type:ESdkValChange,v:number){
        let report_type:string = "";
        switch(type){
            case ESdkValChange.LevelUp:
                report_type = "roleupgrade";
                break;
            case ESdkValChange.EnterGame:
                report_type = "entergame";
                break;
            case ESdkValChange.CreateRole:
                report_type = "createrole";
                break;
        }
        let param = {
            role_id: MainModel.Ins.mRoleData.AccountId.toString(),
            role_name: MainModel.Ins.mRoleData.NickName,
            role_level: MainModel.Ins.mRoleData.lv,
            server_id: MainModel.Ins.mRoleData.serverId.toString(),
            server_name: MainModel.Ins.mRoleData.serverName,
            role_vip: MainModel.Ins.mRoleData.lv,
            role_power: MainModel.Ins.mRoleData.plus.toString(),
            report_type: report_type, 
        }
        let data = sdk.syReportRoleInfo(param);
        let sendMessage = data.data ? data.data : param;
        // ⽤postMessage ⽅法通知⽗⻚⾯获取⻆⾊信息
        parent.postMessage(sendMessage, sdk.PUBLIC_URL);
    }

    public lookVideo(callback: (type: 0 | 1 | 2) => void) {
        E.ViewMgr.ShowMidError("暂未开启");
    }

    /**
     * 获取openId
     * @returns 
     */
    public getOpenId(): string {
        return this.openid;
    }
}