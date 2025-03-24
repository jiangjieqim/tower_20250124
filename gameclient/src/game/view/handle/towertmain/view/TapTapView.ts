// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { System_RefreshTimeProxy } from "../../main/ctl/System_RefreshTimeProxy";

export class TapTapView extends ViewBase{
    private _ui:ui.views.main.ui_taptapViewUI;

    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    protected onAddLoadRes(): void {
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.main.ui_taptapViewUI();
            this.bindClose(this._ui.btn_close);

            this.btnList.push(
                ButtonCtl.Create(this._ui.btn,new Laya.Handler(this,this.onBtnClick))
            )
        }
    }

    private onBtnClick(){
        E.sdk.gotoTapTap(System_RefreshTimeProxy.Ins.getVal(72));
    }

    protected onInit(): void {
        
    }

    protected onExit(): void {
        
    }
}