// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { stActivity } from "../../../../network/protocols/BaseProto";
import { DotManager } from "../../common/DotManager";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { ItemSlotCtl } from "../../main/views/icon/SoltItemView";
import { TowertMainShopModel } from "../../towertmainshop/model/TowertMainShopModel";
import { t_Recharge } from "../../towertmainshop/proxy/t_Recharge";
import { EActivityID, EActivityStatus } from "../ActivityEnum";
import { ActivityModel } from "../ActivityModel";
import { TeQuanKaModel } from "./TeQuanKaModel";
import { t_Month_Card } from "./t_Month_Card";

export class TeQuanKaView extends ViewBase{
    private _ui:ui.views.tequanka.ui_tequankaViewUI;
    // public PageType: EPageType = EPageType.None;
    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private _ctl1:ItemSlotCtl;
    private _ctl2:ItemSlotCtl;
    private _ctl3:ItemSlotCtl;
    private _ctl4:ItemSlotCtl;
    private _ctl5:ItemSlotCtl;
    private _ctl6:ItemSlotCtl;
    private _ctl7:ItemSlotCtl;
    private _ctl8:ItemSlotCtl;
    private _ctl9:ItemSlotCtl;
    private _ctl10:ItemSlotCtl;

    private _timeCtl:TimeCtl;

    protected onAddLoadRes() {
        this.addAtlas('tequanka.atlas');
    }

    protected onFirstInit() {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.tequanka.ui_tequankaViewUI();
            this.bindClose(this._ui.btn_close);
            this.btnList.push(
                ButtonCtl.Create(this._ui.btn,new Laya.Handler(this,this.onBtnClick)),
                ButtonCtl.Create(this._ui.btn1,new Laya.Handler(this,this.onBtn1Click)),
                ButtonCtl.Create(this._ui.btn2,new Laya.Handler(this,this.onBtn2Click)),
                ButtonCtl.Create(this._ui.btn3,new Laya.Handler(this,this.onBtn3Click))
            )

            this._ctl1 = new ItemSlotCtl(this._ui.view1);
            this._ctl2 = new ItemSlotCtl(this._ui.view2);
            this._ctl3 = new ItemSlotCtl(this._ui.view3);
            this._ctl4 = new ItemSlotCtl(this._ui.view4);

            this._ctl5 = new ItemSlotCtl(this._ui.view_1);
            this._ctl6 = new ItemSlotCtl(this._ui.view_2);
            this._ctl7 = new ItemSlotCtl(this._ui.view_3);
            this._ctl8 = new ItemSlotCtl(this._ui.view_4);

            this._ctl9 = new ItemSlotCtl(this._ui.view11);
            this._ctl10 = new ItemSlotCtl(this._ui.view22);

            this._timeCtl = new TimeCtl(this._ui.lab_time);
        }
    }

    private onBtnClick(){
        let cfg:Configs.t_Month_Card_dat = t_Month_Card.Ins.GetDataById(1);
        TowertMainShopModel.Ins.recharge(cfg.f_PurchaseID);
    }

    private onBtn1Click(){
        if (TeQuanKaModel.Ins.isOpenYueKa()) {
            ActivityModel.Ins.sendCmd(EActivityID.TeQuanKa,1);
        }else{
            let cfg:Configs.t_Month_Card_dat = t_Month_Card.Ins.GetDataById(1);
            TowertMainShopModel.Ins.recharge(cfg.f_PurchaseID);
        }
    }

    private onBtn2Click(){
        if (TeQuanKaModel.Ins.isOpenZSK()) {
            ActivityModel.Ins.sendCmd(EActivityID.TeQuanKa,2);
        }else{
            let cfg:Configs.t_Month_Card_dat = t_Month_Card.Ins.GetDataById(2);
            TowertMainShopModel.Ins.recharge(cfg.f_PurchaseID);
        }
    }

    private onBtn3Click(){
        ActivityModel.Ins.sendCmd(EActivityID.TeQuanKa,3);
    }

    protected onInit(): void {
        ActivityModel.Ins.on(ActivityModel.UPDATE_DATA,this,this.onUpdateView);
        TeQuanKaModel.Ins.on(TeQuanKaModel.UPDATE_DATA,this,this.onUpdateView);
        this.updateView();
    }

    protected onExit(): void {
        ActivityModel.Ins.off(ActivityModel.UPDATE_DATA,this,this.onUpdateView);
        TeQuanKaModel.Ins.off(TeQuanKaModel.UPDATE_DATA,this,this.onUpdateView);
        if(this._timeCtl){
            this._timeCtl.dispose();
            this._timeCtl = null;
        }
    }

    private onUpdateView(){
        this.updateView();
    }

    private _data:stActivity;
    private updateView(){
        this.setYeKa();
        this.setZSK();
        this.setTwo();
    }

    private setTwo(){
        this._data = ActivityModel.Ins.getActivityData(EActivityID.TeQuanKa);
        if(!this._data)return;
        let cfg:Configs.t_Month_Card_dat = t_Month_Card.Ins.GetDataById(3);
        let arr = ItemViewFactory.convertItemList(cfg.f_Daily);
        this._ctl9.setData(arr[0]);
        this._ctl10.setData(arr[1]);

        DotManager.removeDot(this._ui.btn3);
        let status = TeQuanKaModel.Ins.statusList.find(ele => ele.flag == 3).times;
        if(status == EActivityStatus.unclaimable){
            this._ui.m11.visible = this._ui.m22.visible = false;
            this._ui.btn3.disabled = true;
            this._ui.lab3.text = "领取";
        }else if(status == EActivityStatus.Claimable){
            this._ui.m11.visible = this._ui.m22.visible = false;
            this._ui.btn3.disabled = false;
            this._ui.lab3.text = "领取";
            DotManager.addDot(this._ui.btn3);
        }else{
            this._ui.m11.visible = this._ui.m22.visible = true;
            this._ui.btn3.disabled = true;
            this._ui.lab3.text = "已领取";
        }
    }

    private setZSK(){
        this._data = ActivityModel.Ins.getActivityData(EActivityID.TeQuanKa);
        if(!this._data)return;
        let cfg:Configs.t_Month_Card_dat = t_Month_Card.Ins.GetDataById(2);
        let arr = ItemViewFactory.convertItemList(cfg.f_Daily);
        this._ctl5.setData(arr[0]);
        this._ctl6.setData(arr[1]);
        arr = ItemViewFactory.convertItemList(cfg.f_item);
        this._ctl7.setData(arr[0]);
        this._ctl8.setData(arr[1]);

        DotManager.removeDot(this._ui.btn2);
        if (TeQuanKaModel.Ins.isOpenZSK()) {
            this._ui.m_3.visible = this._ui.m_4.visible = true;
            let status = TeQuanKaModel.Ins.statusList.find(ele => ele.flag == 2).times;
            if (status == EActivityStatus.Claimable) {
                this._ui.m_1.visible = this._ui.m_2.visible = false;
                this._ui.btn2.disabled = false;
                this._ui.lab1.text = "领取";
                DotManager.addDot(this._ui.btn2);
            } else {
                this._ui.m_1.visible = this._ui.m_2.visible = true;
                this._ui.btn2.disabled = true;
                this._ui.lab1.text = "已领取";
            }
        } else {
            this._ui.m_1.visible = this._ui.m_2.visible = false;
            this._ui.m_3.visible = this._ui.m_4.visible = false;
            let rCfg = t_Recharge.Ins.getCfgById(cfg.f_PurchaseID);
            this._ui.lab1.text = StringUtil.moneyCv(rCfg.f_price) + "元";
            this._ui.btn2.disabled = false;
        }
    }

    private setYeKa(){
        this._data = ActivityModel.Ins.getActivityData(EActivityID.TeQuanKa);
        if(!this._data)return;
        let cfg:Configs.t_Month_Card_dat = t_Month_Card.Ins.GetDataById(1);
        let arr = ItemViewFactory.convertItemList(cfg.f_Daily);
        this._ctl1.setData(arr[0]);
        this._ctl2.setData(arr[1]);
        arr = ItemViewFactory.convertItemList(cfg.f_item);
        this._ctl3.setData(arr[0]);
        this._ctl4.setData(arr[1]);

        this._timeCtl.stop();
        DotManager.removeDot(this._ui.btn1);
        if (TeQuanKaModel.Ins.isOpenYueKa()) {
            this._ui.m3.visible = this._ui.m4.visible = true;
            let status = TeQuanKaModel.Ins.statusList.find(ele => ele.flag == 1).times;
            if (status == EActivityStatus.Claimable) {
                this._ui.m1.visible = this._ui.m2.visible = false;
                this._ui.btn1.disabled = false;
                this._ui.lab2.text = "领取";
                DotManager.addDot(this._ui.btn1);
            } else {
                this._ui.m1.visible = this._ui.m2.visible = true;
                this._ui.btn1.disabled = true;
                this._ui.lab2.text = "已领取";
            }
            this._ui.sp_ye.visible = false;
            this._ui.lab_time.visible = this._ui.btn.visible = true;
            let time = TeQuanKaModel.Ins.monthCardEndUnix - TimeUtil.serverTime;
            if (time > 0) {
                this._timeCtl.start(time, new Laya.Handler(this, this.onUpdateTime), new Laya.Handler(this, this.endTime));
            } else {
                this.endTime();
            }
        } else {
            this._ui.m1.visible = this._ui.m2.visible = false;
            this._ui.m3.visible = this._ui.m4.visible = false;
            let rCfg = t_Recharge.Ins.getCfgById(cfg.f_PurchaseID);
            this._ui.lab2.text = StringUtil.moneyCv(rCfg.f_price) + "元";
            this._ui.btn1.disabled = false;
            this._ui.sp_ye.visible = true;
            this._ui.lab_time.visible = this._ui.btn.visible = false;
        }
    }

    private onUpdateTime() {
        let time_str = TimeUtil.subTimeCC(this._timeCtl.tickVal);
        this._timeCtl.setText(time_str);
    }

    private endTime() {
        this._timeCtl.setText("00:00:00");
    }
}