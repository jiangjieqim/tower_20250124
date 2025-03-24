import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { EViewType } from "../../../../common/defines/EnumDefine";
import { ActivityModel } from "../../activity/ActivityModel";
import { SimpleEffect } from "../../avatar/SimpleEffect";
import { DotManager } from "../../common/DotManager";
import { ShengShouModel } from "../model/ShengShouModel";

export class ShengShouView extends ViewBase{
    private _ui:ui.views.shengshou.ui_shengShouViewUI;

    protected mMask = true; 
    protected mMaskClick: boolean = false;
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private _seUI:SimpleEffect;
    private _se1:SimpleEffect;
    private _se2:SimpleEffect;
    private _se3:SimpleEffect;
    private _se4:SimpleEffect;
    
    protected onAddLoadRes(): void {
        this.addAtlas('shengshou.atlas');
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.shengshou.ui_shengShouViewUI();
            this.bindClose(this._ui.btn_close);

            this._ui.sp_click1.on(Laya.Event.CLICK,this,this.onClick);
            this._ui.sp_click2.on(Laya.Event.CLICK,this,this.onClick1);
            this._ui.sp_click3.on(Laya.Event.CLICK,this,this.onClick2);
        }
    }

    private onClick(){
        E.ViewMgr.Open(EViewType.ShengShouView1);
    }

    private onClick1() {
        if (!ShengShouModel.Ins.isOpen(ShengShouModel.Ins.actID,true)) {
            return;
        }
        E.ViewMgr.Open(EViewType.ShengShouTaskView);
    }

    private onClick2(){
        E.ViewMgr.Open(EViewType.ShengShouShopView);
    }

    protected onInit(): void {
        ShengShouModel.Ins.on(ShengShouModel.UPDATE_TASK,this,this.onUpdateRedTip);
        ShengShouModel.Ins.on(ShengShouModel.UPDATE_VIEW,this,this.onUpdateRedTip);
        ActivityModel.Ins.on(ActivityModel.UPDATE_DATA,this,this.onUpdateRedTip);

        ShengShouModel.Ins.actID = parseInt(this.Data);
        this._ui.bg.skin = "static/bj_sh_" + ShengShouModel.Ins.actID + ".jpg";
        this._ui.sp.visible = true;
        this._ui.sp1.visible = false;
        if (!this._seUI) {
            let url = ShengShouModel.Ins.actID + "_kaiping";
            this._seUI = new SimpleEffect(this._ui.sp, `o/spine/succeed/${url}/${url}`);
        }
        E.AudioMgr.StopSound();
        E.AudioMgr.PlaySound1("ss_" + ShengShouModel.Ins.actID + ".mp3");
        this._seUI.play(0, false, this, this.onPlayUIEnd);

        if (!this._se1) {
            let url = ShengShouModel.Ins.actID + "_button";
            this._se1 = new SimpleEffect(this._ui.sp3, `o/spine/succeed/${url}/${url}`);
        }
        this._se1.play(1, true);

        if (!this._se2) {
            let url = ShengShouModel.Ins.actID + "_button";
            this._se2 = new SimpleEffect(this._ui.sp4, `o/spine/succeed/${url}/${url}`);
        }
        this._se2.play(0, true);

        if (!this._se3) {
            let url = ShengShouModel.Ins.actID + "_button";
            this._se3 = new SimpleEffect(this._ui.sp5, `o/spine/succeed/${url}/${url}`);
        }
        this._se3.play(2, true);

        if (!this._se4) {
            let url = ShengShouModel.Ins.actID + "_suolian";
            this._se4 = new SimpleEffect(this._ui.sp2, `o/spine/succeed/${url}/${url}`,0,120);
        }
        this._se4.play(0, true);

        this.updateRedTip();
    }

    protected onExit(): void {
        ShengShouModel.Ins.off(ShengShouModel.UPDATE_TASK,this,this.onUpdateRedTip);
        ShengShouModel.Ins.off(ShengShouModel.UPDATE_VIEW,this,this.onUpdateRedTip);
        ActivityModel.Ins.off(ActivityModel.UPDATE_DATA,this,this.onUpdateRedTip);

        this.disposeUi();
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

    private onUpdateRedTip(){
        Laya.timer.callLater(this,this.updateRedTip);
    }

    private updateRedTip(){
        if(ShengShouModel.Ins.isRewardRedTip(ShengShouModel.Ins.actID) 
        || ShengShouModel.Ins.isLBRedTip(ShengShouModel.Ins.actID)){
            DotManager.addDot(this._ui.sp3,70,-120);
        }else{
            DotManager.removeDot(this._ui.sp3);
        }
        if(ShengShouModel.Ins.isTaskRedTip(ShengShouModel.Ins.actID)){
            DotManager.addDot(this._ui.sp4,70,-120);
        }else{
            DotManager.removeDot(this._ui.sp4);
        }
    }

    private disposeUi(){
        if(this._seUI){
            this._seUI.dispose();
            this._seUI = null;
        }
    }

    private onPlayUIEnd(){
        this._ui.sp.visible = false;
        this._ui.sp1.visible = true;
        if(this._seUI){
            this._seUI.dispose();
            this._seUI = null;
        }
    }
}