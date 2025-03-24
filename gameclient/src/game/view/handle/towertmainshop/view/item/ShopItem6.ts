import { ui } from "../../../../../../ui/layaMaxUI";
import { ShopCtl } from "./ShopCtl";

export class ShopItem6 extends ui.views.shop.ui_shopItem6UI{
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
        this.lab.text = value.f_name;
    }
}