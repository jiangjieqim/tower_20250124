import { E } from "../../../../G";
import { SocketMgr } from "../../../../network/SocketMgr";
import { RechargeBill_req, stShop, stShopHotFresh } from "../../../../network/protocols/BaseProto";
import { FunctionModel } from "../../funs/FunctionModel";
import { EFuncDef } from "../../main/model/EFuncDef";
import { TowerMainModel } from "../../towertmain/model/TowerMainModel";
import { t_Shop } from "../proxy/t_Shop";

export class TowertMainShopModel extends Laya.EventDispatcher{
    private static _ins: TowertMainShopModel;
    
    public static get Ins() {
        if (!this._ins) {
            this._ins = new TowertMainShopModel();
        }
        return this._ins;
    } 

    public doubleList:number[];
    public hideIdList:number[];
    public shopList:stShop[];
    public hotList:stShop[];
    public hotFreshList:stShopHotFresh[];
    public todayEndUnix:number;

    public selectId:number;

    public static UPDATE_SHOP:string = "UPDATE_SHOP";
    public static UPDATE_DOUBLE:string = "UPDATE_DOUBLE";
    

    constructor(){
        super();
    }

    public initData(){
        this.doubleList = [];
        this.hideIdList = [];
        this.shopList = [];
        this.hotList = [];
        this.hotFreshList = [];
    }

    public isRedTip(type:number=0){
        if(!FunctionModel.Ins.isOpenByFuncId(EFuncDef.Shop,false)){
            return false;
        }
        for(let i:number=0;i<this.shopList.length;i++){
            let cfg:Configs.t_Shop_dat = t_Shop.Ins.GetDataById(this.shopList[i].id);
            if(cfg){
                if(type == 0 || type == cfg.f_Page){
                    if(this.shopList[i].cnt < cfg.f_free){
                        return true;
                    }
                }
            }else{
                E.uploadErr(`stShop: id:${this.shopList[i].id} not exist!`)
            }
        }
        return false;
    }

    /**充值 */
    public recharge(id:number){
        E.sendTrack("shop_buy",{type:id});
        this.reqBill(id);
    }
    
    /**请求订单 */
    private reqBill(id:number){
        let req:RechargeBill_req = new RechargeBill_req();
        req.id = id;
        SocketMgr.Ins.SendMessageBin(req);
    }

    public isYDEn(id:number){
        let vo = this.shopList.find(ele => ele.id == id);
        if(!vo)return false;
        let count = vo.cnt;
        let cfg:Configs.t_Shop_dat = t_Shop.Ins.GetDataById(id);
        if(cfg.f_limit_type == 0 || count < cfg.f_limit_times){
            if(TowerMainModel.Ins.isItemEnoughSt(cfg.f_Price)){
                return true;
            }
        }
        return false;
    }
}