// import { ButtonCtl } from "../../../../../../frame/view/ButtonCtl";
import { ui } from "../../../../../../ui/layaMaxUI";
import { SocketMgr } from "../../../../../network/SocketMgr";
import { FCardBuyPackage_req } from "../../../../../network/protocols/BaseProto";
import { EBuyType, IShopBuyItem } from "../../../common/ShopBuyView";
import { IconUtils } from "../../../main/model/IconUtils";
import { ItemViewFactory } from "../../../main/model/ItemViewFactory";
import { MainModel } from "../../../main/model/MainModel";
import { TowerMainModel } from "../../../towertmain/model/TowerMainModel";
import { TowertMainCardModel } from "../../model/TowertMainCardModel";
import { t_Function_Card_Match } from "../../proxy/t_Function_Card_Match";

export class CardCQItem extends ui.views.cardcq.ui_cardCQItem3UI{
    constructor() {
        super();
        ButtonCtl.Create(this.img1, new Laya.Handler(this, this.onBtnClick),false);
        ButtonCtl.Create(this.img2, new Laya.Handler(this, this.onBtnClick1),false);
    }

    private onBtnClick(){
        if(!this._data)return;
        this._type = 0;
        let vo = ItemViewFactory.convertItem(this._data.f_price);
        let vo1 = ItemViewFactory.convertItem(this._data.f_consume_item);
        TowerMainModel.Ins.buyItem(vo, vo1, new Laya.Handler(this, this.onBuyClick), EBuyType.Item);
    }

    private onBtnClick1(){
        if(!this._data)return;
        this._type = 1;
        let vo = ItemViewFactory.convertItem(this._data.f_piece_price);
        let vo1 = ItemViewFactory.convertItem(this._data.f_consume_item);
        TowerMainModel.Ins.buyItem(vo, vo1, new Laya.Handler(this, this.onBuyClick), EBuyType.Item);
    }

    private onBuyClick(value:IShopBuyItem,selCount:number){
        if(!this._data)return;
        let req = new FCardBuyPackage_req;
        req.packageid = this._data.f_packageid;
        req.num = selCount;
        req.flag = this._type;
        SocketMgr.Ins.SendMessageBin(req);
    }

    private _type:number;
    private _data:Configs.t_Function_Card_Match_dat;
    public setData(value:Configs.t_Function_Card_Match_dat){
        if(!value)return;
        this._data = value;
        if(TowertMainCardModel.Ins.selectKBId == value.f_packageid){
            this.img.skin = t_Function_Card_Match.Ins.getIcon1(value.f_packageid);
        }else{
            this.img.skin = t_Function_Card_Match.Ins.getIcon(value.f_packageid);
        }
        let id = parseInt(value.f_consume_item.split("-")[0]);
        let count = MainModel.Ins.mRoleData.getVal(id);
        this.lab.text = count + "";
        if(value.f_packageid == TowertMainCardModel.Ins.selectKBId){
            this.sp.visible = true;
        }else{
            this.sp.visible = false;
        }
        if(value.f_price != ""){
            this.img1.visible = true;
            let arr = value.f_price.split("-");
            let id = parseInt(arr[0]);
            let val = parseInt(arr[1]);
            this.icon.skin = IconUtils.getIconByCfgId(id);
            this.lab1.text = val + "购买";
        }else{
            this.img1.visible = false;
        }
        if(value.f_piece_price != ""){
            this.img2.visible = true;
            let arr = value.f_piece_price.split("-");
            let id = parseInt(arr[0]);
            let val = parseInt(arr[1]);
            this.icon1.skin = IconUtils.getIconByCfgId(id);
            this.lab2.text = val + "购买";
        }else{
            this.img2.visible = false;
        }
    }
}