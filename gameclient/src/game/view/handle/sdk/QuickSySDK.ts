import { CreateRoleInfo_revc } from "../../../network/protocols/BaseProto";
// import { t_Purchase_PriceProxy } from "../huodong/model/ActivityProxy";
// import { VipModel } from "../huodong/model/VipModel";
import { MainModel } from "../main/model/MainModel";
import { ECellType } from "../main/vos/ECellType";
import { SdkPlayerData } from "../weixin/sy-sdk/interface";
import { BaseSdk } from "./BaseSdk";
import { DummyQuick } from "./DummyQuick";

// {“status”:true,”data”:{“uid”:”123”,”username”:”quicksdk”,”token”:””,”isLogin”:true},”message”:””}
export interface IQuickLoginData {
    uid: string;         // 渠道uid
    username: string;    // 渠道username
    token: string;	    // token 游戏服务器需通过v2/checkUserInfo接口(参见服务器接口文档)验证token和UID的正确性
    isLogin: boolean;	// 是否游客,登录后此值为true
    channelId: string;	// 渠道ID
    message: string;	    // status为false时,此字段为Failed表示登录失败,为cancel表示玩家取消登录
}
export interface IQuickLoginResult {
    status: boolean;
    data: IQuickLoginData;
    message: string;
}
interface IQuickOrder {
    productCode: string;// = “05425578266356246482673853629430”;
    uid: string; //= 'uid';
    username: string;// = 'username';
    userRoleId: string;// = 'roleId1';
    userRoleName: string;// = '小朋友';
    serverId: number;//= 1;
    userServer: string;// = '内测1区';
    userLevel: number;// = 1;
    cpOrderNo: string //= 'cpOrderNo000001';
    amount: string;// = '0.01';
    subject: string;// = '大袋钻石';
    desc: string;// = '一大袋钻石60个';
    callbackUrl: string;
    // orderInfo.callbackUrl = '';
    extrasParams: string;// = '';
    goodsId: string;// = 'goods';
    count: number;// = 60;
    quantifier;// = '个';
}

interface IQuickRoleInfo {
    isCreateRole: boolean;   // = true;
    roleCreateTime: number;  // = 1490598150;
    uid: string;             // = 12;
    username: string;        // = 'username';
    serverId: number;        // = 1;
    serverName: string;      // = '内测1区';
    userRoleName: string;    // = '小朋友';
    userRoleId: string;      // = 'roleId1';
    userRoleBalance: number; // = 1000;
    vipLevel: number;        // = 1;
    userRoleLevel: number;   // = 1;
    partyId: number;         // = 1;
    partyName: string;       // = '行会名称';
    gameRoleGender: string;  // = '男';
    gameRolePower: number;   // = 100;
    partyRoleId: number;     // = 1;
    partyRoleName: string;   // = '会长';
    professionId: string;    //= '1';
    profession: string;      // = '武士';
    friendlist: string;      // = '';
}
class QuickChannelCfg {
    ProductCode: string;
    ProductKey: string;
    Callback_Key: string;
    Md5_Key: string;
    constructor() {
       
    }
    // /**解析参数 */
    // parse(s: string){
    //     let arr = s.split("\r\n");
    //     for (let i = 0; i < arr.length; i++) {
    //         let s1 = arr[i].split(":");
    //         this[s1[0]] = s1[1];
    //     }
    // }
}

export interface IQuickSDK {
    init(productCode: string, productKey: string, productkey: boolean, callFunc: Function);
    login(callbackData: Function);
    pay(orderInfoJson, payFunc: Function);
    /**
     * 上传角色信息接口
     */
    uploadGameRoleInfo(roleInfoJson:string,callBack:Function);
    /**
     * 注销
     */
    logout(callback:Function);
    /**
     * 注销回调
     */
    setLogoutNotification(callback:Function);

    /**
     * 切换账号回调
     */
    setSwitchAccountNotification(callback:Function);
}
/**
 * Quick 
 * https://www.quicksdk.com/doc-762.html
*/
export class QuickSySDK extends BaseSdk {
    private _dummyQuick:IQuickSDK = new DummyQuick();
    /**渠道ID */
    // private _channelID: number = 1;
    /**渠道配置 */
    private _quickChannelCfg: QuickChannelCfg;
    private _loginQuickData: IQuickLoginData;
    get quick(): IQuickSDK {
        if(Laya.Utils.getQueryString("dummyquick")){
            return this._dummyQuick;
        }
        return window["QuickSDK"];
    }
    public getOpenId(): string {
        return this._loginQuickData.uid;
    }
    /**
        ProductCode：06752045926776549123369774154754
        ProductKey：33064413
        Callback_Key	：78044693717187851916670011656893
        Md5_Key：c1o3dksnsevgvlh6hqjybp2lzivdwrz8
     * 
     */
    public init(): void {
        // var productCode = '06752045926776549123369774154754';        //QuickSDK后台自动分配 
        // var productKey = '33064413';        //QuickSDK后台自动分配 
        this.quick.init(this._quickChannelCfg.ProductCode, this._quickChannelCfg.ProductKey, false, () => {
            console.log("quick init success");
        });
        let that = this;
        if (typeof this.quick.setLogoutNotification == "function") {
            this.quick.setLogoutNotification(() => {
                that.reload();
            });
        }
        if (typeof this.quick.setSwitchAccountNotification == "function") {
            this.quick.setSwitchAccountNotification((callbackData) => {
                that.reload();
            });
        }
    }
    public login(that, callBack: Function): void {
        let that1 = this;
        this.quick.login(function (callbackData: IQuickLoginResult) {
            if (callbackData.status) {
                // that1.productCode = that1.quick.productCode;
                // that1.productKey = that1.quick.channelCode; //.productKey;
                // that1.quickData = callbackData.data;
                that1._loginQuickData = callbackData.data;
                LogSys.Log('GameDemo:QuickSDK登录成功: uid=>' + JSON.stringify(callbackData));
                LogSys.Log("==============>>" + JSON.stringify(that1.quick));
                // console.log(":::::"+that1.quick.quickData.product_code + "::::" + that1.quick.quickData.product_key);
                // "\n\nproductCode:"+that1.productCode+" productKey:"+that1.productKey
                callBack.call(that);
            } else {
                console.log('GameDemo:QuickSDK登录失败:' + callbackData.message);
                if(callbackData.message == "cancel"){
                    that1.login(that,callBack);//注意:若游戏收到失败回调,判断message为cancel时,应再次调用登录接口.           
                }
            }
        })
    }
    /**猎人王用户名 */
    protected get username(){
        return this._loginQuickData.username;
    }
    getAppId() {
        return `${this._quickChannelCfg.ProductKey}`;
    }
    preInit(that, func: Function) {
        let _cfg = new QuickChannelCfg();
        _cfg.ProductKey = Laya.Utils.getQueryString("ProductKey") || "78527444";
        _cfg.ProductCode = Laya.Utils.getQueryString("ProductCode") || "21235891789817030328541177859562";
        this._quickChannelCfg = _cfg;
        LogSys.Log("preInit:"+JSON.stringify(_cfg));
        func.call(that);
        /*
        this._channelID = parseInt((Laya.Utils.getQueryString("quickchannel") || "4"));
        let quickchanel: string = "quick/" + this._channelID + ".txt";
        let that1 = this;
        HttpUtil.httpGet(`${InitConfig.getAsset() + quickchanel}`, new Laya.Handler(this, (str) => {
            that1._quickChannelCfg = new QuickChannelCfg();
            that1._quickChannelCfg.parse(str);
            func.call(that);
        }));
        */
    }
    public recharge(orderId: string, cfg:any) {
        // Configs.t_Purchase_Price_dat
        
        let realMoney:number = StringUtil.moneyCv(cfg.f_price);

        // let l:Configs.t_Purchase_Price_dat[] = t_Purchase_PriceProxy.Ins.List;
        // let cell = l.find(o=>o.f_id == cfg.f_linkid);
        // if(cell){
        // realMoney = MainModel.Ins.getEasyPayMoneyVal(cell);
        // realMoney = StringUtil.clearCnyDecimal(realMoney * MainModel.Ins.discountDisplayMoneyRatio);
        // }else{
        // realMoney = StringUtil.moneyCv(cfg.f_price);
        // }
        
        let orderInfo = {} as IQuickOrder;
        orderInfo.productCode = this._quickChannelCfg.ProductCode;//this.quick.quickData.product_code;
        orderInfo.uid = this.getOpenId();//this._loginQuickData.uid;
        orderInfo.username = this.username;
        orderInfo.userRoleId = MainModel.Ins.mRoleData.AccountId.toString();
        orderInfo.userRoleName = MainModel.Ins.mRoleData.NickName;
        orderInfo.serverId = MainModel.Ins.mRoleData.serverId;
        orderInfo.userServer = MainModel.Ins.mRoleData.serverName;
        orderInfo.userLevel = MainModel.Ins.mRoleData.lv;
        orderInfo.cpOrderNo = orderId;
        orderInfo.amount = realMoney + "";
        orderInfo.subject = cfg.f_read;
        orderInfo.desc = cfg.f_read;
        orderInfo.callbackUrl = (initConfig.pay || "")+`?appid=${this.getAppId()}`;
        orderInfo.extrasParams = '';
        orderInfo.goodsId = cfg.f_id + "";
        orderInfo.count = 1;
        orderInfo.quantifier = '个';
        let orderInfoJson = JSON.stringify(orderInfo);
        LogSys.Log("PAY===>" + orderInfoJson);
        this.quick.pay(orderInfoJson, function (payStatusObject) {
            console.log('GameDemo:下单通知' + JSON.stringify(payStatusObject)); //H5渠道基本没有此回调返回，游戏发货要以服务器通知为准
        });
    }

    /**
     * 设置sdk所需的玩家数据
     * @param playerData
     */
    public setPlayerData(playerData: SdkPlayerData) {
        let _createInfo: CreateRoleInfo_revc = MainModel.Ins.createRoleInfo;
        var roleInfo = {} as IQuickRoleInfo;
        if (_createInfo) {
            roleInfo.isCreateRole = _createInfo.isNew == 1;
            roleInfo.roleCreateTime = _createInfo.createUnix;
        } else {
            roleInfo.isCreateRole = false;
            roleInfo.roleCreateTime = 0;
        }
        roleInfo.uid = this.getOpenId();
        roleInfo.username = this.username;
        roleInfo.serverId = MainModel.Ins.mRoleData.serverId;
        roleInfo.serverName = MainModel.Ins.mRoleData.serverName;
        roleInfo.userRoleName = MainModel.Ins.mRoleData.NickName;
        roleInfo.userRoleId = MainModel.Ins.mRoleData.AccountId.toString();
        roleInfo.userRoleBalance = MainModel.Ins.mRoleData.getVal(ECellType.SHUIJING);
        roleInfo.vipLevel = MainModel.Ins.mRoleData.viplv;//VipModel.Ins.vipLevel;
        roleInfo.userRoleLevel = MainModel.Ins.mRoleData.lv;//playerData.role_level;
        roleInfo.partyId = 0;
        roleInfo.partyName = '';
        //选传
        roleInfo.gameRoleGender = '';
        roleInfo.gameRolePower = 1;
        roleInfo.partyRoleId = 1;
        roleInfo.partyRoleName = '';
        roleInfo.professionId = '';
        roleInfo.profession = '';
        roleInfo.friendlist = '';
        let roleInfoJson = JSON.stringify(roleInfo);
        this.quick.uploadGameRoleInfo(roleInfoJson, function (response) {
        });
    }

    getToken(){
        let d = this._defaultToken;
        return this._loginQuickData ? (this._loginQuickData.token || d) : d;
    }
}