import { ui } from "../../../../../ui/layaMaxUI";
import { SocketMgr } from "../../../../network/SocketMgr";
import { SpringFestivalDailyRecharge_req } from "../../../../network/protocols/BaseProto";
import { DotManager } from "../../common/DotManager";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { NewYearModel } from "../model/NewYearModel";

export class NewYearItem2 extends ui.views.newyear.ui_newyearItem3UI{
    private _w:number;
    constructor(){
        super();
        this._w = this.pro.width;
        ButtonCtl.Create(this.btn,new Laya.Handler(this,this.onBtnClick));
    }

    private onBtnClick(){
        if(!this._data)return;
        let req = new SpringFestivalDailyRecharge_req;
        req.flag = 0;
        req.id = this._data.f_id;
        SocketMgr.Ins.SendMessageBin(req);
    }

    private _data: Configs.t_Spring_Festival_2025_Daily_Recharge_dat;
    public setData(value: Configs.t_Spring_Festival_2025_Daily_Recharge_dat) {
        if (!value) return;
        this._data = value;
        this.lab.text = `累计${value.f_day}天充值${value.f_gear_price/100}元`;
        ItemViewFactory.renderItemSlots(this.sp,value.f_reward,true,10,0.95,"left");
        let data = NewYearModel.Ins.dailyRechargeList.find(ele => ele.id == value.f_id);
        this.lab1.text = data.val + "/" + value.f_day;
        let num = data.val / value.f_day;
        if(num > 1){
            num = 1;
        }
        this.pro.width = num * this._w;
        DotManager.removeDot(this.btn);
        this.sp1.visible = this.sp2.visible = this.btn.visible = false;
        if(data.status == 0){
            this.sp2.visible = true;
        }else if(data.status == 1){
            DotManager.addDot(this.btn);
            this.btn.visible = true;
        }else if(data.status == 2){
            this.sp1.visible = true;
        }
    }
}