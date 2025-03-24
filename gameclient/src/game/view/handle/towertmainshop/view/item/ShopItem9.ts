import { ui } from "../../../../../../ui/layaMaxUI";
import { t_Function_Card_Match } from "../../../towertmaincard/proxy/t_Function_Card_Match";
import { ShopCtl } from "./ShopCtl";

export class ShopItem9 extends ui.views.shop.ui_shopItem9UI{
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
        this.img.skin = t_Function_Card_Match.Ins.getIcon(value.f_banner);
        this.img1.skin = `remote/shop/kb${value.f_currency_icon}.png`;
    }
}