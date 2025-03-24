import { ui } from "../../../../../../ui/layaMaxUI";
import { stShop } from "../../../../../network/protocols/BaseProto";
import { ItemViewFactory } from "../../../main/model/ItemViewFactory";
import { ItemSlotCtl } from "../../../main/views/icon/SoltItemView";
import { TowertMainShopModel } from "../../model/TowertMainShopModel";
import { ShopCtl } from "./ShopCtl";

export class ShopItem10 extends ui.views.shop.ui_shopItem10UI {
    private _itemCtl:ItemSlotCtl;
    private _ctl:ShopCtl;
    
    constructor() {
        super();
        this._itemCtl = new ItemSlotCtl(this.view);
        this._ctl = new ShopCtl(this.ctl);
    }

    public setData(value:Configs.t_Shop_dat,index:number) {
        if (!value) return;
        if(index == 0){
            this.bg.visible = true;
        }else{
            this.bg.visible = false;
        }
        let data:stShop = TowertMainShopModel.Ins.shopList.find(ele => ele.id == value.f_id);
        data = TowertMainShopModel.Ins.shopList.find(ele => ele.id == value.f_id);
        this._itemCtl.setData(ItemViewFactory.convertItem(value.f_reward));
        this._ctl.setData(value);
    }
}