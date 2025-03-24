import { BaseModel } from "../../../../frame/util/ctl/BaseModel";
import { E } from "../../../G";
import { RechargeBill_revc, RechargeDoubledInit_revc, RechargeDoubled_revc, ShopExchange_revc, ShopHideToDisplay_revc, ShopHotExchange_revc, ShopHotFresh_revc, ShopInit_revc } from "../../../network/protocols/BaseProto";
import { SERVER_MSGID } from "../../../network/protocols/ProtoDef";
import { GuideUtils } from "../guide/GuideUtils";
import { TowertMainShopModel } from "./model/TowertMainShopModel";
import { t_Recharge } from "./proxy/t_Recharge";

export class TowertMainShopModule extends BaseModel{
    private static _ins:TowertMainShopModule;
    public static get Ins(){
        if(!this._ins){
            this._ins = new TowertMainShopModule();
        }
        return this._ins;
    }

    public onInitCallBack():void{
        TowertMainShopModel.Ins.initData();
    }

    public initMsg(){
        E.MsgMgr.AddMsg(SERVER_MSGID.RechargeBill, this.RechargeBill,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.RechargeDoubledInit, this.RechargeDoubledInit,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.RechargeDoubled, this.RechargeDoubled,this);

        E.MsgMgr.AddMsg(SERVER_MSGID.ShopInit, this.ShopInit,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.ShopExchange, this.ShopExchange,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.ShopHideToDisplay, this.ShopHideToDisplay,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.ShopHotFresh, this.ShopHotFresh,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.ShopHotExchange, this.ShopHotExchange,this);
        GuideUtils.shopEnoughHandler = new Laya.Handler(TowertMainShopModel.Ins, TowertMainShopModel.Ins.isYDEn);
    }

    private RechargeBill(value:RechargeBill_revc){
        let cfg: Configs.t_Recharge_dat = t_Recharge.Ins.GetDataById(value.id);
        E.sdk.recharge(value.val,cfg);
    }

    private RechargeDoubledInit(value:RechargeDoubledInit_revc){
        TowertMainShopModel.Ins.doubleList = value.datalist;
    }

    private RechargeDoubled(value:RechargeDoubled_revc){
        TowertMainShopModel.Ins.doubleList = TowertMainShopModel.Ins.doubleList.concat(value.datalist);
        TowertMainShopModel.Ins.event(TowertMainShopModel.UPDATE_DOUBLE);
    }

    private ShopInit(value:ShopInit_revc){
        TowertMainShopModel.Ins.hideIdList = value.hideIds;
        TowertMainShopModel.Ins.shopList = value.datalist;
        TowertMainShopModel.Ins.hotList = value.hotList;
        TowertMainShopModel.Ins.hotFreshList = value.hotFreshList;
        TowertMainShopModel.Ins.todayEndUnix = value.todayEndUnix;
    }

    private ShopExchange(value:ShopExchange_revc){
        for(let i:number=0;i<value.datalist.length;i++){
            let index = TowertMainShopModel.Ins.shopList.findIndex(ele => ele.id === value.datalist[i].id);
            if(index != -1){
                TowertMainShopModel.Ins.shopList[index] = value.datalist[i];
            }
        }
        TowertMainShopModel.Ins.event(TowertMainShopModel.UPDATE_SHOP);
    }

    private ShopHideToDisplay(value:ShopHideToDisplay_revc){
        TowertMainShopModel.Ins.hideIdList = value.datalist;
        TowertMainShopModel.Ins.event(TowertMainShopModel.UPDATE_SHOP);
    }

    private ShopHotFresh(value:ShopHotFresh_revc){
        for(let i:number=0;i<value.datalist.length;i++){
            let index = TowertMainShopModel.Ins.hotFreshList.findIndex(ele => ele.type === value.datalist[i].type);
            if(index != -1){
                TowertMainShopModel.Ins.hotFreshList[index] = value.datalist[i];
            }
        }
        TowertMainShopModel.Ins.event(TowertMainShopModel.UPDATE_SHOP);
    }

    private ShopHotExchange(value:ShopHotExchange_revc){
        if(value.flag == 0){
            for(let i:number=0;i<value.datalist.length;i++){
                let index = TowertMainShopModel.Ins.hotList.findIndex(ele => ele.id === value.datalist[i].id);
                if(index != -1){
                    TowertMainShopModel.Ins.hotList[index] = value.datalist[i];
                }
            }
        }else{
            TowertMainShopModel.Ins.hotList = value.datalist;
            TowertMainShopModel.Ins.todayEndUnix = value.todayEndUnix;
        }
        TowertMainShopModel.Ins.event(TowertMainShopModel.UPDATE_SHOP);
    }
}