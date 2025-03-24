import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { EViewType } from "../../../../common/defines/EnumDefine";
import { t_Treasure } from "../proxy/t_Treasure";

export class TowertMainLinbaoItem1 extends ui.views.linbao.ui_linbaoItem1UI{
    constructor() {
        super();
        this.on(Laya.Event.CLICK,this,this.onClick);
    }

    private onClick(){
        if(!this._data)return;
        E.ViewMgr.Open(EViewType.TowertMainLinbaoTip,null,[this._data,true]);
    }

    private _data:Configs.t_Treasure_dat;
    public setData(value:Configs.t_Treasure_dat){
        if(!value)return;
        this._data = value;
        this.lab.text = value.f_treasure_name;
        this.img.skin = t_Treasure.Ins.getQuaSkin(value.f_qua);
        this.icon.skin = t_Treasure.Ins.getIcon(value.f_icon);
        this.lab1.text = "LV:1";
    }
}