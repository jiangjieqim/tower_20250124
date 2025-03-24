// import { ButtonCtl } from "../../../../../../frame/view/ButtonCtl";
import { ui } from "../../../../../../ui/layaMaxUI";
import { FunctionModel } from "../../../funs/FunctionModel";
import { MainModel } from "../../../main/model/MainModel";
import { t_Box_Match } from "../../../towertmain/proxy/t_Box_Match";
import { t_Trophy_Reward } from "../../../towertmain/proxy/t_Trophy_Reward";
import { ShopCtl } from "./ShopCtl";

export class ShopItem2 extends ui.views.shop.ui_shopItem2UI{
    private _ctl:ShopCtl;

    constructor(){
        super();
        this._ctl = new ShopCtl(this.ctl);

        ButtonCtl.Create(this.img,new Laya.Handler(this,this.onBtnClick),false);
    }

    private onBtnClick(){
        if(!this._data)return;
        let cfg = t_Trophy_Reward.Ins.getCfgByTrophy(MainModel.Ins.mRoleData.trophy);
        let arr = t_Box_Match.Ins.getListByArena(cfg.f_arena);
        let vo = arr.find(ele => ele.f_box_qua == this._data.f_item_pic);
        FunctionModel.Ins.showBoxTip(vo.f_box_id,this.img,-this.img.width*0.5,-(this.img.height*0.5+10));
    }

    private _data:Configs.t_Shop_dat;
    public setData(value:Configs.t_Shop_dat,index:number){
        if(!value)return;
        this._data = value;
        if(index == 0){
            this.bg.visible = true;
        }else{
            this.bg.visible = false;
        }
        this.img.skin = `static/icon_bx${value.f_item_pic}.png`;
        this._ctl.setData(value);
    }
}