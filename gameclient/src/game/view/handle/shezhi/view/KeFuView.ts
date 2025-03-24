import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";

export class KeFuView extends ViewBase{
    private _ui: ui.views.shezhi.ui_kefuViewUI;
    protected mMask = true;
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    protected onAddLoadRes() {
        this.addAtlas('shezhi.atlas');
    }

    protected onFirstInit() {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.shezhi.ui_kefuViewUI();
            this.bindClose(this._ui.btn_close);
        }
    }

    protected onInit(): void {
        
    }

    protected onExit(): void {
        
    }
}