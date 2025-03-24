import { ui } from "../../../../../../ui/layaMaxUI";
import { E } from "../../../../../G";
import { EViewType } from "../../../../../common/defines/EnumDefine";
import { stFCard } from "../../../../../network/protocols/BaseProto";
import { t_Function_Card } from "../../proxy/t_Function_Card";

export class TowertMainCardItem1 extends ui.views.card.ui_cardItem1UI{
    constructor() {
        super();
        this.on(Laya.Event.CLICK,this,this.onClick);
    }

    private onClick(){
        E.ViewMgr.Open(EViewType.TowertMainCardTip,null,this._data);
    }

    private _data:stFCard;
    public setData(value:stFCard){
        if(!value)return;
        this._data = value;
        let cfg = t_Function_Card.Ins.getCfgById(value.id);
        this.lab.text = cfg.f_card_name;
        this.lab1.text = value.num + "";
    }
}