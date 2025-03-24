import { ui } from "../../../../../../ui/layaMaxUI";
import { SocketMgr } from "../../../../../network/SocketMgr";
import { HolyBeastExchange_req } from "../../../../../network/protocols/BaseProto";
import { EBuyType, IShopBuyItem } from "../../../common/ShopBuyView";
import { IconUtils } from "../../../main/model/IconUtils";
import { ItemViewFactory } from "../../../main/model/ItemViewFactory";
import { ItemSlotCtl } from "../../../main/views/icon/SoltItemView";
import { TowerMainModel } from "../../../towertmain/model/TowerMainModel";
import { ShengShouModel } from "../../model/ShengShouModel";

export class ShengShouShopItem extends ui.views.shengshou.ui_shopItemUI{

    private _ctl:ItemSlotCtl;

    constructor(){
        super();
        this.on(Laya.Event.CLICK,this,this.onClick);
        this._ctl = new ItemSlotCtl(this.view);
    }

    private onClick(){
        if(!this._data)return;
        if(this._bo)return;
        let vo = ItemViewFactory.convertItem(this._data.f_price);
        let vo1 = ItemViewFactory.convertItem(this._data.f_reward);
        TowerMainModel.Ins.buyItem(vo, vo1, new Laya.Handler(this, this.onBuyClick), EBuyType.Item,
            false, null, new Laya.Handler(this, this.getMaxNum));
    }

    private onBuyClick(value:IShopBuyItem,selCount:number){
        if(!this._data)return;
        let req = new HolyBeastExchange_req;
        req.activityId = ShengShouModel.Ins.actID;
        req.id = this._data.f_id;
        req.cnt = selCount;
        SocketMgr.Ins.SendMessageBin(req);
    }

    private getMaxNum() {
        if (this._data.f_limit_type) {
            let data = ShengShouModel.Ins.getExchangeData(ShengShouModel.Ins.actID);
            if (!data) return;
            let vo = data.datalist.find(ele => ele.id == this._data.f_id);
            return this._data.f_limit_times - vo.cnt;
        } else {
            return 99;
        }
    }

    private _data:Configs.t_HolyBeast_Shop_dat;
    private _bo;
    public setData(value:Configs.t_HolyBeast_Shop_dat){
        if(!value)return;
        this._data = value;
        this._ctl.setData(ItemViewFactory.convertItem(value.f_reward));
        let vo = ItemViewFactory.convertItem(value.f_price);
        this.icon.skin = IconUtils.getIconByCfgId(vo.cfgId);
        this.lab1.text = vo.count + "";
        let data = ShengShouModel.Ins.getExchangeData(ShengShouModel.Ins.actID);
        if(!data)return;
        let val = data.datalist.find(ele=>ele.id == value.f_id);
        this.lab.text = "限购:" + val.cnt + "/" + value.f_limit_times;
        if(val.cnt >= value.f_limit_times){
            this.sp.visible = true;
            this._bo = true;
        }else{
            this.sp.visible = false;
            this._bo = false;
        }
    }
}