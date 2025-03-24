// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { System_RefreshTimeProxy } from "../../main/ctl/System_RefreshTimeProxy";

export class KFTapTapView extends ViewBase{
    private _ui:ui.views.shezhi.ui_taptapView1UI;
    protected mMask = true;
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    protected onAddLoadRes() {
        this.addAtlas('shezhi.atlas');
    }

    protected onFirstInit() {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.shezhi.ui_taptapView1UI();
            this.bindClose(this._ui.btn_close);

            this.btnList.push(
                ButtonCtl.Create(this._ui.btn, new Laya.Handler(this, this.onBtnClick))
            )
        }
    }

    private onBtnClick(){
        E.sdk.setCopy(this._ui.lab.text);
        E.ViewMgr.ShowMidOk("复制成功");
    }

    protected onInit(): void {
        this._ui.lab.text = System_RefreshTimeProxy.Ins.getVal(55);
    }

    protected onExit(): void {
        
    }
}