import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { stActivity } from "../../../../network/protocols/BaseProto";
import { SimpleEffect } from "../../avatar/SimpleEffect";
import { DotManager } from "../../common/DotManager";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { TowertMainShopModel } from "../../towertmainshop/model/TowertMainShopModel";
import { t_Recharge } from "../../towertmainshop/proxy/t_Recharge";
import { EActivityID, EActivityStatus } from "../ActivityEnum";
import { ActivityModel } from "../ActivityModel";
import { t_Daily_Recharge } from "./t_Daily_Recharge";

export class MeiRiChongZhiView extends ViewBase{
    private _ui:ui.views.meirichongzhi.ui_meirichongzhiUI;
    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private _se1:SimpleEffect;
    private _se2:SimpleEffect;
    private _se3:SimpleEffect;
    private _se4:SimpleEffect;

    protected onAddLoadRes() {
        this.addAtlas('meirizhongzhi.atlas');
    }

    protected onFirstInit() {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.meirichongzhi.ui_meirichongzhiUI();
            this.btnList.push(
                ButtonCtl.Create(this._ui.btn,new Laya.Handler(this,this.onBtnClick))
            )

            this._ui.list.itemRender = ui.views.meirichongzhi.ui_tabUI;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);
            this._ui.list.selectEnable = true;
        }
    }

    private onRenderHandler(item:ui.views.meirichongzhi.ui_tabUI,index:number){
        let cfg:Configs.t_Daily_Recharge_dat = item.dataSource;
        if(cfg.f_recharge_id){
            let rcfg = t_Recharge.Ins.getCfgById(cfg.f_recharge_id);
            item.lab.text =  StringUtil.moneyCv(rcfg.f_price) + "元";
        }else{
            item.lab.text = "任意充值";
        }
        if(index == this._ui.list.selectedIndex){
            item.img.skin = "remote/meirizhongzhi/btn_s_mrsc.png";
            item.lab.strokeColor = "#ad2100";
            this.updateView();
        }else{
            item.img.skin = "remote/meirizhongzhi/btn_n_mrsc.png";
            item.lab.strokeColor = "#880000";
        }
        let status = this._data.datalist.find(ele=>ele.id == cfg.f_id).param1;
        if(status == EActivityStatus.Claimable){
            DotManager.addDot(item.img,0,-10);
        }else{
            DotManager.removeDot(item.img);
        }
    }

    private onBtnClick(){
        let cfg:Configs.t_Daily_Recharge_dat = this._ui.list.selectedItem;
        if(cfg.f_recharge_id){
            TowertMainShopModel.Ins.recharge(cfg.f_recharge_id);
        }else{
            if(this._type == 1){
                this._ui.list.selectedIndex = 1;
            }else if(this._type == 2){
                ActivityModel.Ins.sendCmd(EActivityID.MRChongZhi,cfg.f_id);
            }
        }
    }

    protected onInit(): void {
        ActivityModel.Ins.on(ActivityModel.UPDATE_DATA,this,this.onUpdateView);
        this.playSe();

        this._data = ActivityModel.Ins.getActivityData(EActivityID.MRChongZhi);
        if(!this._data)return;
        this._ui.list.array = t_Daily_Recharge.Ins.List;
        this._ui.list.selectedIndex = 0;
    }

    protected onExit(): void {
        ActivityModel.Ins.off(ActivityModel.UPDATE_DATA,this,this.onUpdateView);
        if(this._se1){
            this._se1.dispose();
            this._se1 = null;
        }
        if(this._se2){
            this._se2.dispose();
            this._se2 = null;
        }
        if(this._se3){
            this._se3.dispose();
            this._se3 = null;
        }
        if(this._se4){
            this._se4.dispose();
            this._se4 = null;
        }
    }

    private playSe(){
        if (!this._se1) {
            this._se1 = new SimpleEffect(this._ui.sp, `o/spine/succeed/MRSC_TXT/MRSC_TXT`,50);
        }
        this._se1.play(0,true);

        if (!this._se2) {
            this._se2 = new SimpleEffect(this._ui.sp1, `o/spine/succeed/MRSC_PD/MRSC_PD`,0,37);
        }
        this._se2.play(0,true);

        if (!this._se3) {
            this._se3 = new SimpleEffect(this._ui.sp2, `o/spine/succeed/MRSC_BGTX/MRSC_BGTX`,0,-100);
        }
        this._se3.play(0,true);

        if (!this._se4) {
            this._se4 = new SimpleEffect(this._ui.sp4, `o/spine/succeed/MRSC_TG/MRSC_TG`,0,-120);
        }
        this._se4.play(0,true);
    }

    private onUpdateView(){
        this.updateView();
        this._ui.list.refresh();
    }

    private _type:number;
    private _data:stActivity;
    private updateView(){
        let cfg:Configs.t_Daily_Recharge_dat = this._ui.list.selectedItem;
        ItemViewFactory.renderItemSlots(this._ui.sp3,cfg.f_reward,true,12,1,"left");
        let status = this._data.datalist.find(ele=>ele.id == cfg.f_id).param1;
        DotManager.removeDot(this._ui.btn);
        if(status == EActivityStatus.unclaimable){
            this._ui.btn.disabled = false;
            if(cfg.f_recharge_id){
                let rcfg = t_Recharge.Ins.getCfgById(cfg.f_recharge_id);
                this._ui.lab.text =  StringUtil.moneyCv(rcfg.f_price) + "元";
            }else{
                this._ui.lab.text = "充点小钱";
                this._type = 1;
            }
        }else if(status == EActivityStatus.Claimed){
            this._ui.lab.text = "已领取";
            this._ui.btn.disabled = true;
        }else{
            this._ui.lab.text = "领取";
            this._ui.btn.disabled = false;
            DotManager.addDot(this._ui.btn,0,10);
            this._type = 2;
        }
    }
}