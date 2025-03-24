// import { ButtonCtl } from "../../../../../../frame/view/ButtonCtl";
import { ViewBase } from "../../../../../../frame/view/ViewBase";
import { ui } from "../../../../../../ui/layaMaxUI";
import { EViewType } from "../../../../../common/defines/EnumDefine";
import { E } from "../../../../../G";
import { SimpleEffect } from "../../../avatar/SimpleEffect";
import { System_RefreshTimeProxy } from "../../../main/ctl/System_RefreshTimeProxy";
import { IconUtils } from "../../../main/model/IconUtils";
import { MainModel } from "../../../main/model/MainModel";
import { TowerMainEvent } from "../../../towertmain/model/TowerMainEvent";
import { TowerMainModel } from "../../../towertmain/model/TowerMainModel";
import { TowertMainLinbaoModel } from "../../model/TowertMainLinbaoModel";
import { t_Treasure } from "../../proxy/t_Treasure";
import { t_Treasure_Extract_Rate } from "../../proxy/t_Treasure_Extract_Rate";


export class LinBaoCQView extends ViewBase{
    private _ui:ui.views.linbaocq.ui_linbaoCQViewUI;

    protected mMask = true;
    protected mMaskClick: boolean = false;
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private _se:SimpleEffect;

    protected onAddLoadRes(): void {
        this.addAtlas('linbaocq.atlas');
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.linbaocq.ui_linbaoCQViewUI();
            this.btnList.push(
                ButtonCtl.Create(this._ui.btn_tip, new Laya.Handler(this, this.onBtnTipClick)),
                ButtonCtl.Create(this._ui.btn, new Laya.Handler(this, this.onBtnClick)),
                ButtonCtl.Create(this._ui.btn1, new Laya.Handler(this, this.onBtn1Click))
            )

            this._ui.sp_click.on(Laya.Event.CLICK,this,this.onClick);
            this._ui.sp_click1.on(Laya.Event.CLICK,this,this.onClick);
        }
    }

    private onBtnTipClick(){
        this._ui.img_tip.visible = !this._ui.img_tip.visible;
    }

    private onBtnClick(){
        TowertMainLinbaoModel.Ins.sendCmd(0);
    }

    private onBtn1Click(){
        TowertMainLinbaoModel.Ins.sendCmd(1);
    }

    private onClick(){
        this.Close();
    }

    protected onInit(): void {
        TowerMainModel.Ins.on(TowerMainEvent.ValChange,this,this.setLab);
        TowertMainLinbaoModel.Ins.on(TowertMainLinbaoModel.UPDATE_LINBAO_CQ,this,this.updateCQ);
        this._ui.img_tip.visible = false;
        if (!this._se) {
            this._se = new SimpleEffect(this._ui.sp, `o/spine/succeed/wenwu/wenwu`);
        }
        this._se.play(4);

        let arr = t_Treasure_Extract_Rate.Ins.List;
        for (let i: number = 0; i < arr.length; i++) {
            let val = parseInt(arr[i].f_rate);
            this._ui["lab_g" + i].text = val / 100 + "%";
        }
        this.setLab();
        this.setLab1();
    }

    protected onExit(): void {
        TowerMainModel.Ins.off(TowerMainEvent.ValChange,this,this.setLab);
        TowertMainLinbaoModel.Ins.off(TowertMainLinbaoModel.UPDATE_LINBAO_CQ,this,this.updateCQ);
        if(this._se){
            this._se.dispose();
            this._se = null;
        }
    }

    private setLab(){
        let val = System_RefreshTimeProxy.Ins.getVal(31);
        let arr = val.split("|");
        let array = arr[0].split("-");
        let id = parseInt(array[0]);
        let num = parseInt(array[1]);
        array = arr[1].split("-");
        let num1 = parseInt(array[1]);
        this._ui.icon.skin = this._ui.icon1.skin = IconUtils.getIconByCfgId(id);
        let count = MainModel.Ins.mRoleData.getVal(id);
        this._ui.lab.text = this._ui.lab2.text = count + "";
        this._ui.lab1.text = "/" + num;
        this._ui.lab3.text = "/" + num1;
        if(count >= num){
            this._ui.lab.color = "#92ff71";
        }else{
            this._ui.lab.color = "#ff5757";
        }
        if(count >= num1){
            this._ui.lab2.color = "#92ff71";
        }else{
            this._ui.lab2.color = "#ff5757";
        }
    }

    private setLab1(){
        this._ui.lab4.text = E.getLang("linbaocq_lab",TowertMainLinbaoModel.Ins.guarante);
    }

    private updateCQ(value:any[]){
        E.AudioMgr.StopSound();
        E.AudioMgr.PlaySound1("1005.mp3");
        this._ui.mouseEnabled = false;
        this._ui.img_tip.visible = this._ui.btn_tip.visible = this._ui.btn_lab.visible = false;
        let qua = 0;
        for(let i:number=0;i<value.length;i++){
            let cfg = t_Treasure.Ins.getCfgById(value[i].data.id);
            qua = Math.max(qua,cfg.f_qua);
        }
        this._se.play((qua - 1), false, this, this.onPlayEnd,[value]);
    }

    private onPlayEnd(value:any[]){
        this._ui.mouseEnabled = true;
        this._ui.btn_tip.visible = this._ui.btn_lab.visible = true;
        this.setLab1();
        this._se.play(4);
        
        if(value.length == 1){
            E.ViewMgr.Open(EViewType.LinBaoCQView1,null,value);
        }else{
            E.ViewMgr.Open(EViewType.LinBaoCQView2,null,value);
        }
    }
}