import { ui } from "../../../../../ui/layaMaxUI";
import { SocketMgr } from "../../../../network/SocketMgr";
import { SpringFestivalShop_req } from "../../../../network/protocols/BaseProto";
import { EBuyType, IShopBuyItem } from "../../common/ShopBuyView";
import { IconUtils } from "../../main/model/IconUtils";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { ItemSlotCtl } from "../../main/views/icon/SoltItemView";
import { TowerMainModel } from "../../towertmain/model/TowerMainModel";
import { NewYearModel } from "../model/NewYearModel";


export class NewYearItem3 extends ui.views.newyear.ui_newyearItem4UI{

    private _ctl:ItemSlotCtl;

    constructor(){
        super();
        this.on(Laya.Event.CLICK,this,this.onClick);
        this._ctl = new ItemSlotCtl(this.view);
    }

    private onClick(){
        if(!this._data)return;
        if(this._bo)return;
        let vo = ItemViewFactory.convertItem(this._data.f_price);
        let vo1 = ItemViewFactory.convertItem(this._data.f_reward);
        TowerMainModel.Ins.buyItem(vo, vo1, new Laya.Handler(this, this.onBuyClick), EBuyType.Item,
            false, null, new Laya.Handler(this, this.getMaxNum));
    }

    private onBuyClick(value:IShopBuyItem,selCount:number){
        if(!this._data)return;
        let req = new SpringFestivalShop_req;
        req.fid = this._data.f_id;
        req.count = selCount;
        SocketMgr.Ins.SendMessageBin(req);
    }

    private getMaxNum() {
        if (this._data.f_limit_time) {
            let vo = NewYearModel.Ins.shoplist.find(ele => ele.fid == this._data.f_id);
            return this._data.f_limit_time - vo.times;
        } else {
            return 99;
        }
    }

    private _data:Configs.t_Spring_Festival_2025_Shop_dat;
    private _bo;
    public setData(value:Configs.t_Spring_Festival_2025_Shop_dat){
        if(!value)return;
        this._data = value;
        this._ctl.setData(ItemViewFactory.convertItem(value.f_reward));
        let vo = ItemViewFactory.convertItem(value.f_price);
        this.icon.skin = IconUtils.getIconByCfgId(vo.cfgId);
        this.lab1.text = vo.count + "";
        let data = NewYearModel.Ins.shoplist.find(ele=>ele.fid == value.f_id);
        this.lab.text = "限购:" + data.times + "/" + value.f_limit_time;
        if(data.times >= value.f_limit_time){
            this.img.visible = true;
            this._bo = true;
        }else{
            this.img.visible = false;
            this._bo = false;
        }
    }
}