import { ui } from "../../../../../../ui/layaMaxUI";
import { ItemViewFactory } from "../../../main/model/ItemViewFactory";
import { TowertMainShopModel } from "../../model/TowertMainShopModel";
import { ShopCtl } from "./ShopCtl";

export class ShopItem5 extends ui.views.shop.ui_shopItem5UI{
    private _ctl:ShopCtl;

    constructor(){
        super();
        this._ctl = new ShopCtl(this.ctl);
    }

    public setData(value:Configs.t_Shop_dat,index:number){
        if(!value)return;
        if(index == 0){
            this.bg.visible = true;
        }else{
            this.bg.visible = false;
        }
        this._ctl.setData(value);
        this.img.skin = `remote/shop/${value.f_currency_icon}.png`;
        if(TowertMainShopModel.Ins.doubleList.indexOf(value.f_PurchaseID) == -1){
            this.img1.visible = true;
            let vo = ItemViewFactory.convertItem(value.f_extra_item);
            this.icon.skin = vo.getIcon();
            this.lab4.text = vo.count + "";
        }else{
            this.img1.visible = false;
        }
        this.lab.text = value.f_name;
    }
}