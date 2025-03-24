import { ui } from "../../../../../../ui/layaMaxUI";
import { ItemViewFactory } from "../../../main/model/ItemViewFactory";
import { ItemSlotCtl } from "../../../main/views/icon/SoltItemView";
import { ItemVo } from "../../../main/vos/ItemVo";
import { ShopCtl } from "./ShopCtl";

export class ShopItem3 extends ui.views.shop.ui_shopItem3UI{
    private _itemCtl:ItemSlotCtl;
    private _ctl:ShopCtl;

    constructor(){
        super();
        this._itemCtl = new ItemSlotCtl(this.view);
        this._ctl = new ShopCtl(this.ctl);
    }

    public setData(value:Configs.t_Shop_dat,index:number){
        if(!value)return;
        if(index == 0){
            this.bg.visible = true;
        }else{
            this.bg.visible = false;
        }
        this.img.skin = `remote/shop/img_jl_${value.f_item_pic}.png`;
        this.lab.text = value.f_discount / 100 + "%";
        this._itemCtl.setData(ItemViewFactory.convertItem(value.f_reward));
        this._ctl.setData(value);
    }
}