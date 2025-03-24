// import { ButtonCtl } from "../../../../../../frame/view/ButtonCtl";
import { ui } from "../../../../../../ui/layaMaxUI";
import { E } from "../../../../../G";
import { ItemViewFactory } from "../../../main/model/ItemViewFactory";
import { SoltItemView } from "../../../main/views/icon/SoltItemView";
import { TowertMainShopModel } from "../../model/TowertMainShopModel";
import { t_Recharge } from "../../proxy/t_Recharge";

export class ShopItem1 extends ui.views.shop.ui_shopItem1UI{
    constructor(){
        super();

        this.list.itemRender = SoltItemView;
        this.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);

        ButtonCtl.Create(this.btn,new Laya.Handler(this,this.onBtnClick));
    }

    private onBtnClick(){
        if(!this._data)return;
        TowertMainShopModel.Ins.recharge(this._data.f_PurchaseID);
    }

    private onRenderHandler(item:SoltItemView){
        item.setData(item.dataSource);
    }

    private _data:Configs.t_Shop_dat;
    public setData(value:Configs.t_Shop_dat,index:number){
        if(!value)return;
        this._data = value;
        this.bg.skin = "static/shop_banner" + value.f_banner + ".png";
        let cfg = t_Recharge.Ins.getCfgById(value.f_PurchaseID);
        this.list.array = ItemViewFactory.convertItemList(cfg.f_reward);
        this.lab.text = E.getLang("shopLab").split("-")[value.f_limit_type - 1];
        let count = 0;
        let vo = TowertMainShopModel.Ins.shopList.find(ele=>ele.id == value.f_id);
        if(vo){
            count = vo.cnt;
        }
        this.lab1.text = `(${count}/${value.f_limit_times})`;
        this.lab2.text = StringUtil.moneyCv(cfg.f_price) + "元";
    }
}