import { EMsgBoxType } from "../../../common/defines/EnumDefine";
import { E } from "../../../G";
import { IMsgBoxParms } from "../common/MsgBoxView2";
import { MainModel } from "../main/model/MainModel";
import { IQuickLoginData, IQuickLoginResult, IQuickSDK } from "./QuickSySDK";
/**quick虚拟接口 */
export class DummyQuick implements IQuickSDK{
    private _loginCallBack:Function;
    logout(callback: Function) {
        if(this._loginCallBack){
            this._loginCallBack();
        }
    }
    setLogoutNotification(callback: Function) {
        this._loginCallBack = callback;
    }
    setSwitchAccountNotification(callback:Function){
        this._loginCallBack = callback;
    }
    uploadGameRoleInfo(roleInfoJson: string, callBack: Function) {
        let obj = JSON.parse(roleInfoJson);
        console.log("uploadGameRoleInfo:",obj);
        callBack();
        // LogSys.Log("uploadGameRoleInfo====>"+roleInfoJson);
    }
    init(productCode: string, productKey: string, productkey: boolean, callFunc: Function) {
        callFunc();
    }
    login(func: Function) {
        let o:IQuickLoginResult = {} as IQuickLoginResult;
        o.status = true;
        o.data = {} as IQuickLoginData;
        o.data.uid = Laya.Utils.getQueryString("user")||"user1";
        o.data.username = o.data.uid;
        // o.data.token = "";
        func(o);
    }
    pay(orderInfoJson: string, payFunc: Function) {
        let obj = JSON.parse(orderInfoJson)
        E.ViewMgr.ShowMsgBox(EMsgBoxType.OkOrCancel,`${obj.cpOrderNo}`,new Laya.Handler(this,this.onPay,[obj.cpOrderNo]),null,null,{title:"模拟quick支付"} as IMsgBoxParms)
    }
    private onPay(order:string){
        MainModel.Ins.gm(`recharge ${order}`);
    }
}