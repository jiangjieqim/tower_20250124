// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { ui } from "../../../../../ui/layaMaxUI";
import { stActivityCell } from "../../../../network/protocols/BaseProto";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { ItemSlotCtl } from "../../main/views/icon/SoltItemView";
import { TowertMainShopModel } from "../../towertmainshop/model/TowertMainShopModel";
import { t_Recharge } from "../../towertmainshop/proxy/t_Recharge";
import { XianShiLiBaoModel } from "./XianShiLiBaoModel";
import { t_Limited_Time_Pack } from "./t_Limited_Time_Pack";

export class XianShiLiBaoItem extends ui.views.xianshilibao.ui_xianshilibaoItemUI{
    private _ctl:ItemSlotCtl;
    private _ctl1:ItemSlotCtl;
    private _timeCtl:TimeCtl;

    constructor(){
        super();
        this.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
        this._ctl = new ItemSlotCtl(this.view);
        this._ctl1 = new ItemSlotCtl(this.view1);
        this._timeCtl = new TimeCtl(this.lab_time);
        ButtonCtl.Create(this.btn2,new Laya.Handler(this,this.onBtnClick));
    }

    private onUnDisplay(){
        if(this._timeCtl){
            this._timeCtl.dispose();
            this._timeCtl = null;
        }
    }

    private onBtnClick(){
        if(!this._cfg)return;
        TowertMainShopModel.Ins.recharge(this._cfg.f_recharge);
    }

    private _cfg:Configs.t_Limited_Time_Pack_dat;
    public setData(value:stActivityCell){
        if(!value)return;
        this._cfg = t_Limited_Time_Pack.Ins.GetDataById(value.id);
        this.img.skin = `remote/xianshilibao/tx_lxxs_${this._cfg.f_pack_title}.png`;
        this.img1.skin = `remote/xianshilibao/tx_lb_${this._cfg.f_headline}.png`;
        this.img2.skin = `remote/xianshilibao/img_lb_${this._cfg.f_pack_icon}.png`;
        let arr = ItemViewFactory.convertItemList(this._cfg.f_reward);
        this._ctl.setData(arr[0]);
        this._ctl1.setData(arr[1]);
        this.lab.text = this._cfg.f_discount / 100 + "%";
        this.lab2.text = StringUtil.moneyCv(this._cfg.f_original_price) + "";
        this.lab3.text = "(" + value.param1 + "/" + this._cfg.f_limited_times + ")";
        let rCfg = t_Recharge.Ins.getCfgById(this._cfg.f_recharge);
        this.lab1.text = StringUtil.moneyCv(rCfg.f_price) + "元";

        let endtime = 0;
        let data = XianShiLiBaoModel.Ins.limitPackTimeList.find(ele => ele.id == this._cfg.f_id);
        if(data){
            endtime = data.endtime;
        }
        let time = endtime - TimeUtil.serverTime;
        if (time > 0) {
            this._timeCtl.start(time, new Laya.Handler(this, this.onUpdateTime), new Laya.Handler(this, this.endTime));
        } else {
            this._timeCtl.stop();
        }
    }

    private onUpdateTime() {
        let time_str = TimeUtil.subTime(this._timeCtl.tickVal);
        this._timeCtl.setText(time_str);
    }

    private endTime() {
        this._timeCtl.setText("00:00:00");
    }
}