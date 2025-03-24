import {ViewBase} from "./ViewBase";

//简单界面定义
export abstract class ViewBaseSimple extends ViewBase{
    protected onChangeLanguage() {
    }
    protected onEnter() {

    }
    protected onAddEventListener() {

    }
    protected abstract onAddLoadRes(): void;
    protected abstract onExit(): void;
    protected abstract onFirstInit(): void;
    protected abstract onInit(): void;
}
/*
export class YourViewClass extends ViewBaseSimple {
    private _ui:ui.views.selfInfo.ui_fabuyulanUI;
    protected onAddLoadRes() {

    }
    protected onInit() {
    }
    protected onFirstInit() {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.selfInfo.ui_fabuyulanUI();
        }
    }
    protected onExit() {
    }
}
*/