import { ui } from "../../../../../../ui/layaMaxUI";
import { stShop } from "../../../../../network/protocols/BaseProto";
import { ItemViewFactory } from "../../../main/model/ItemViewFactory";
import { ItemSlotCtl } from "../../../main/views/icon/SoltItemView";
import { TowertMainShopModel } from "../../model/TowertMainShopModel";
import { t_Shop_Hotsell } from "../../proxy/t_Shop_Hotsell";
import { ShopCtl } from "./ShopCtl";

export class ShopItem4 extends ui.views.shop.ui_shopItem4UI {
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
        let data:stShop;
        let hotData:stShop;
        if(value.f_banner){
            this.img.visible = true;
            hotData = TowertMainShopModel.Ins.hotList[value.f_banner - 1];
            let cfg = t_Shop_Hotsell.Ins.getCfgById(hotData.id);
            this.lab.text = `折${cfg.f_discount/100}%`;
            this._itemCtl.setData(ItemViewFactory.convertItem(cfg.f_reward));
            this._ctl.setData(value,hotData);
        }else{
            data = TowertMainShopModel.Ins.shopList.find(ele => ele.id == value.f_id);
            this.img.visible = false;
            this._itemCtl.setData(ItemViewFactory.convertItem(value.f_reward));
            this._ctl.setData(value);
        }

        if(hotData){
            if(hotData.cnt){
                this.img_m.visible = true;
            }else{
                this.img_m.visible = false;
            }
        }

        if(data){
            if(data.cnt < value.f_free){
                this.img_m.visible = false;
            }else if(data.cnt - value.f_free < value.f_ad){
                this.img_m.visible = false;
            }else{
                this.img_m.visible = true;
            }
        }
    }
}