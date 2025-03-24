import { ui } from "../../../../../../ui/layaMaxUI";
import { TowertMainCardModel } from "../../model/TowertMainCardModel";
import { t_Function_Card } from "../../proxy/t_Function_Card";

export class TowertMainCardItem3 extends ui.views.card.ui_cardItem3UI{
    constructor() {
        super();
        this.on(Laya.Event.CLICK,this,this.onClick);
    }

    private onClick(){
        if(!this._data)return;
        let index = TowertMainCardModel.Ins.selectList.findIndex(ele=>ele.uid == this._data.uid);
        if(index != -1){
            TowertMainCardModel.Ins.selectList.splice(index,1);
        }else{
            TowertMainCardModel.Ins.selectList.push(this._data);
        }
        TowertMainCardModel.Ins.event(TowertMainCardModel.UPDATE_SELECT);
    }

    private _data:any;
    public setData(value:any){
        if(!value)return;
        this._data = value;
        let cfg = t_Function_Card.Ins.getCfgById(value.id);
        this.lab.text = cfg.f_card_name;
        // this.icon.skin = t_Function_Card.Ins.getIconById(cfg.f_card_imageid);
        // this.qua.skin = t_Function_Card.Ins.getQuaSkin(cfg.f_qua);
        this.icon.cfg = cfg;
        this.lab2.text = value.num + "";

        if(cfg.f_label == 1){
            this.img.skin = "";
        }else{
            this.img.skin = t_Function_Card.Ins.getLabSkin(cfg.f_label);
        }

        let index = TowertMainCardModel.Ins.selectList.findIndex(ele=>ele.uid == value.uid);
        if(index != -1){
            this.img1.visible = true;
        }else{
            this.img1.visible = false;
        }
    }
}