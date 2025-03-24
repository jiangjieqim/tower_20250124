import { ui } from "../../../../../../ui/layaMaxUI";
import { E } from "../../../../../G";
import { EViewType } from "../../../../../common/defines/EnumDefine";
import { t_Function_Card } from "../../proxy/t_Function_Card";

export class CardCQItem1 extends ui.views.cardcq.ui_cardCQItem2UI{
    constructor() {
        super();
        this.on(Laya.Event.CLICK,this,this.onClick);
    }

    private onClick(){
        E.ViewMgr.Open(EViewType.TowertMainCardTip1,null,this._data);
    }

    private _data:Configs.t_Function_Card_dat;
    public setData(value:number){
        if(!value)return;
        this._data = t_Function_Card.Ins.getCfgById(value);
        this.icon.skin = t_Function_Card.Ins.getIconById(this._data.f_card_imageid);
        this.qua.skin = t_Function_Card.Ins.getQuaSkin(this._data.f_qua);
        this.lab1.text = this._data.f_card_name;
        if(this._data.f_label == 1){
            this.img.skin = "";
        }else{
            this.img.skin = t_Function_Card.Ins.getLabSkin(this._data.f_label);
        }
    }
}