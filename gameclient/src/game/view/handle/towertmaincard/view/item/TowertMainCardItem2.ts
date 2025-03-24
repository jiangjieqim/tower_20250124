import { ui } from "../../../../../../ui/layaMaxUI";
import { E } from "../../../../../G";
import { EViewType } from "../../../../../common/defines/EnumDefine";
import { TowertMainCardModel } from "../../model/TowertMainCardModel";
import { t_Function_Card } from "../../proxy/t_Function_Card";

export class TowertMainCardItem2 extends ui.views.card.ui_cardItem2UI{
    constructor() {
        super();
        this.on(Laya.Event.CLICK,this,this.onClick);
    }

    private onClick(){
        E.ViewMgr.Open(EViewType.TowertMainCardTip1,null,this._data);
    }

    private _data:Configs.t_Function_Card_dat;
    public setData(value:Configs.t_Function_Card_dat){
        if(!value)return;
        this._data = value;
        // this.icon.skin = t_Function_Card.Ins.getIconById(value.f_card_imageid);
        // this.qua.skin = t_Function_Card.Ins.getQuaSkin(value.f_qua);
        this.icon.cfg = value;
        this.lab.text = value.f_card_name;
        let index = TowertMainCardModel.Ins.cardList.findIndex(ele => ele.id == value.f_cardid);
        if(index != -1){
            this.sp.visible = false;
            this.lab.color = "#ffffff";
        }else{
            this.sp.visible = true;
            this.lab.color = "#bfbebe";
        }
        if(value.f_label == 1){
            this.img.skin = "";
        }else{
            this.img.skin = t_Function_Card.Ins.getLabSkin(value.f_label);
        }
    }
}