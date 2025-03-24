import { ui } from "../../../../../../ui/layaMaxUI";

export class ShopItem7 extends ui.views.shop.ui_shopItem7UI {
    constructor() {
        super();
    }

    public setData(value:Configs.t_Shop_dat) {
        if (!value) return;
        this.img.skin = "remote/shop/tx_" + value.f_type + ".png";
    }
}