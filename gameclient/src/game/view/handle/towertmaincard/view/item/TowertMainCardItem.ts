// import { ButtonCtl } from "../../../../../../frame/view/ButtonCtl";
import { ui } from "../../../../../../ui/layaMaxUI";
import { E } from "../../../../../G";
import { EViewType } from "../../../../../common/defines/EnumDefine";
import { stFCard } from "../../../../../network/protocols/BaseProto";
import { MainModel } from "../../../main/model/MainModel";
import { TowertMainCardModel } from "../../model/TowertMainCardModel";
import { t_Arena } from "../../proxy/t_Arena";
import { t_Function_Card } from "../../proxy/t_Function_Card";

export class TowertMainCardItem extends ui.views.card.ui_cardItemUI{
    constructor() {
        super();
        this.icon.on(Laya.Event.CLICK,this,this.onClick);
        ButtonCtl.Create(this.btn1,new Laya.Handler(this,this.onBtn1Click));
        ButtonCtl.Create(this.btn2,new Laya.Handler(this,this.onBtn2Click));
    }

    private onBtn1Click(){
        if(!this._data)return;
        TowertMainCardModel.Ins.sendCmd(1,this._data.id);
    }

    private onBtn2Click(){
        if(!this._data)return;
        TowertMainCardModel.Ins.sendCmd(0,this._data.id);
    }

    private onClick(){
        if(!this._data)return;
        E.ViewMgr.Open(EViewType.TowertMainCardTip,null,this._data);
        let ind = TowertMainCardModel.Ins.newList.findIndex(ele => ele.id === this._data.id);
        if (ind != -1 && TowertMainCardModel.Ins.newList[ind].isSelect == false) {
            TowertMainCardModel.Ins.newList[ind].isSelect = true;
            TowertMainCardModel.Ins.event(TowertMainCardModel.UPDATE_CARD);
        }
    }

    private _data:stFCard;
    public setData(value:stFCard){
        if(!value)return;
        this._data = value;
        let cfg = t_Function_Card.Ins.getCfgById(value.id);
        // this.icon.skin = t_Function_Card.Ins.getIconById(cfg.f_card_imageid);
        // this.qua.skin = t_Function_Card.Ins.getQuaSkin(cfg.f_qua);
        this.icon.cfg = cfg;
        this.lab1.text = cfg.f_card_name;

        if(cfg.f_label == 1){
            this.img.skin = "";
        }else{
            this.img.skin = t_Function_Card.Ins.getLabSkin(cfg.f_label);
        }

        let index = TowertMainCardModel.Ins.newList.findIndex(ele=>ele.id == value.id);
        if(index != -1 && TowertMainCardModel.Ins.newList[index].isSelect == false){
            this.sp.visible = true;
            this.sp1.visible = false;
        }else{
            this.sp.visible = false;
            this.sp1.visible = true;
            let num = value.num;
            if(num > 99){
                num = 99;
            }
            this.lab2.text = num + "";
        }

        let arr = TowertMainCardModel.Ins.getNowCardPlanData();
        let vo = arr.find(ele=>ele.id == value.id);
        let count = 0;
        if(vo){
            count = vo.num;
        }
        this.lab.text = "已携带" + count + "张";

        this.btn1.disabled = this.btn2.disabled = false;
        if(count == 0){
            this.btn2.disabled = true;
        }
        if(count >= cfg.f_max_amount || count >= value.num){
            this.btn1.disabled = true;
        }

        let num = TowertMainCardModel.Ins.getPlanCount();
        let self = t_Arena.Ins.getCfgByTrophy(MainModel.Ins.mRoleData.trophy);
        if(num >= self.f_card_max_amount){
            this.btn1.disabled = true;
        }

        if(TowertMainCardModel.Ins.isPeiZhi){
            this.btn1.visible = this.btn2.visible = true;
            this.sp2.y = 130;
            this.sp2.height = 86;
        }else{
            this.btn1.visible = this.btn2.visible = false;
            this.sp2.y = 181;
            this.sp2.height = 35;
        }
    }
}