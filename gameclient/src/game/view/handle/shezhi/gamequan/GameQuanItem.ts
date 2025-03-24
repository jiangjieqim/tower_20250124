import { ui } from "../../../../../ui/layaMaxUI";
import { ItemSlotCtl } from "../../main/views/icon/SoltItemView";
import { ItemVo } from "../../main/vos/ItemVo";

export class GameQuanItem extends ui.views.shezhi.ui_yaoqingItemUI{
    private _ctl:ItemSlotCtl;

    constructor(){
        super();
        this._ctl = new ItemSlotCtl(this.view);
    }

    public setData(value:ItemVo,flag:boolean){
        if(!value)return;
        this._ctl.setData(value);
        this.m2.visible = flag;
    }
}