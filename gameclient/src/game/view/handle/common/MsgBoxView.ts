// import { ButtonCtl } from "../../../../frame/view/ButtonCtl";
import { ViewBase } from "../../../../frame/view/ViewBase";
import { ui } from "../../../../ui/layaMaxUI";
import { MainModel } from "../main/model/MainModel";
import { ItemSlotCtl } from "../main/views/icon/SoltItemView";
import { ItemVo } from "../main/vos/ItemVo";

export class MsgBoxView extends ViewBase{
    private _ui:ui.views.common.ui_msgBoxViewUI;
    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;
    private _ctl:ItemSlotCtl;

    private _sureCall: Laya.Handler;
    private _cancelCall: Laya.Handler;
    private _params;

    protected onAddLoadRes() {
    }

    protected onFirstInit() {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.common.ui_msgBoxViewUI();
            this.bindClose(this._ui.btn_close);
            this._ctl = new ItemSlotCtl(this._ui.view);
            this.btnList.push(
                ButtonCtl.Create(this._ui.cancelBtn,new Laya.Handler(this,this.onBtnClick)),
                ButtonCtl.Create(this._ui.okBtn,new Laya.Handler(this,this.onBtnClick1))
            )
        }
    }

    private onBtnClick(){
        this.Close();
    }

    private onBtnClick1(){
        if(this._sureCall){
            this._sureCall.runWith([this._params]);
        }
        this.Close();
    }

    protected onInit(): void {

    }

    protected onExit(): void {
        
    }

    public showView(vo:ItemVo,vo1:ItemVo,sureCall: Laya.Handler, cancelCall: Laya.Handler,params?){
        this._sureCall = sureCall;
        this._cancelCall = cancelCall;
        this._params = params;

        this._ui.lab.text = vo.getName();
        this._ctl.setData(vo);

        this._ui.icon.skin = vo1.getIcon();
        let haveCount = MainModel.Ins.mRoleData.getVal(vo1.cfgId);
        let needC: number = vo1.count;
        this._ui.lab_m.text = `${needC}/${haveCount}`;
    
        if (haveCount >= needC) {
            this._ui.lab_m.color = "#67ff64";
        } else {
            this._ui.lab_m.color = "#f91309";
        }
        this._ui.lab_m.width = this._ui.lab_m.textField.textWidth;
        this._ui.sp.width = this._ui.lab_m.width + 50;
        this._ui.sp.x = 350 + (200 - this._ui.sp.width) * 0.5;
    }
}