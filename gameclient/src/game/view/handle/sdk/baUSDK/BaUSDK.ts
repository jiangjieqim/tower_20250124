import { E } from "../../../../G";
import { MainModel } from "../../main/model/MainModel";
import { BaseSdk } from "../BaseSdk";
import { ESdkValChange } from "../ISdk";

export class BaUSDK extends BaseSdk{
    private uid:string;
    private appid:string;
    /**
    * 初始化SDK
    */
    public init() {
      
    }

    /**
    *  ⽤户登录
    */
    public login(that, callBack: Function) {
        this.uid = Laya.Utils.getQueryString("uid");
        this.appid = Laya.Utils.getQueryString("appid");
        console.log("this.uid>>>>",this.uid);
        console.log("this.appid>>>>",this.appid);
        callBack.call(that);
    }

    /**
    * 支付
    * @param orderId 订单号
    * @param cny 订单金额（元）
    */
    public recharge(orderId: string, cfg:Configs.t_Recharge_dat) {
        console.log("this.cfg>>>>>>>>>>>",cfg);
        let price:number = cfg.f_price;
        let paydata = {
            uid: this.uid, // 用户在平台的唯一ID
            appid: this.appid, // 平台分配的appid
            money: price.toString(), // 充值金额（单位：元）
            goodsName: cfg.f_name, // 商品名称
            payFlag: '1', // 充值界面选择，固定值1
            ext: '1', // 扩展参数，支付通知时原样返回
            time: TimeUtil.serverTime.toString(), // 时间戳（单位：秒）
            roleid: MainModel.Ins.mRoleData.AccountId.toString(), // 角色ID
            rolename: MainModel.Ins.mRoleData.NickName, // 角色名称
            rolelevel: MainModel.Ins.mRoleData.lv.toString(), // 角色等级
            serverid: MainModel.Ins.mRoleData.serverId.toString(), // 服务器ID
            servername: MainModel.Ins.mRoleData.serverName, // 服务器名称，若无，用服务器ID代替
            cpOrderId: orderId, // CP订单号，支付通知时原样返回
            goodsId: cfg.f_id.toString(), // 商品ID
            desc: '1', // 商品描述
            count: '1', // 购买商品个数
            quantifier: '个' // 商品单位，如“个”
        }
        game8u_pay(paydata);
    }

    /**
     * 玩家的数据变化/事件上报
     * @param type 类型
     * @param v 数值
     */
    public valChange(type:ESdkValChange,v:number){
        let report_type: string = "";
        switch (type) {
            case ESdkValChange.LevelUp:
                report_type = "4";
                break;
            case ESdkValChange.EnterGame:
                report_type = "3";
                break;
            case ESdkValChange.CreateRole:
                report_type = "2";
                break;
        }
        let roledata = {
            datatype: report_type, // 必填 2:创建角色3:登录游戏4:等级提升
            roleid: MainModel.Ins.mRoleData.AccountId.toString(), // 必填 角色ID
            rolename: MainModel.Ins.mRoleData.NickName, // 必填 角色名称
            rolelevel: MainModel.Ins.mRoleData.lv.toString(), // 必填 角色等级
            serverid: MainModel.Ins.mRoleData.serverId.toString(), // 必填 服务器ID
            servername: MainModel.Ins.mRoleData.serverName, // 必填 服务器名称，若无，用服务器ID代替
            fightvalue: MainModel.Ins.mRoleData.getBattleValue(), // 必填 战力
            moneynum: MainModel.Ins.mRoleData.gold.toString(), // 必填 游戏币数量
            vip: MainModel.Ins.mRoleData.lv.toString(), // 必填 VIP等级
            rolecreatetime: '', // 选填 角色创建时间，单位：秒
            rolelevelmtime: '', // 选填 角色升级时间，单位：秒
            partyid: '', // 选填 帮派ID
            partyname: '', // 选填 帮派名称
            partyroleid: '', // 选填 帮派称号ID
            partyrolename: '', // 选填 帮派称号名称
            gender: '', // 选填 角色性别：1:男 2:女
            professionid: '', // 选填 职业ID
            profession: '', // 选填 职业名称
            friendlist: '', // 选填 人物关系列表，格式[{"roleid":"关系角色id","intimacy":"亲密度","nexusid":"关系id,可填数字1:夫妻2:结拜3:情侣4:师徒5:仇人6:其它"},...]
            attach: '' // 选填 原始数据，如果可以提供，用json字符串
        }
        game8u_reportrole(roledata)
    }

    public lookVideo(callback: (type: 0 | 1 | 2) => void) {
        console.log("BaUSDKlookVideo>>>>>>>>>>>>>>>>>>>>>>");
        E.ViewMgr.ShowMidError("暂未开启");
    }

     /**
     * 获取openId
     * @returns 
     */
     public getOpenId(): string {
        return this.uid;
    }

    public getAppId():string{
        return this.appid;
    }
}