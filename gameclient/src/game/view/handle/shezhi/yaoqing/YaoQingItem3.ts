import { ui } from "../../../../../ui/layaMaxUI";
import { ItemSlotCtl } from "../../main/views/icon/SoltItemView";
import { ItemVo } from "../../main/vos/ItemVo";
import { SheZhiModel } from "../model/SheZhiModel";

export class YaoQingItem3 extends ui.views.shezhi.ui_yaoqingItemUI{
    private _ctl:ItemSlotCtl;

    constructor(){
        super();
        this._ctl = new ItemSlotCtl(this.view);
    }

    public setData(value:ItemVo){
        if(!value)return;
        this._ctl.setData(value);
        if(SheZhiModel.Ins.binded){
            this.m2.visible = true;
        }else{
            this.m2.visible = false;
        }
    }
}