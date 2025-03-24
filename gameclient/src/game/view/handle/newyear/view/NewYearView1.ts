import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { ComposeModel } from "../../compose/ComposeModel";
import { TowerMainFightModel } from "../../towertmain/model/TowerMainFightModel";

export class NewYearView1 extends ViewBase{
    private _ui: ui.views.newyear.ui_newyearView1UI;
    protected mMask = true;
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    protected onAddLoadRes() {
       
    }

    protected onFirstInit() {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.newyear.ui_newyearView1UI();
            this.bindClose(this._ui.btn_close);
            this.btnList.push(
                ButtonCtl.Create(this._ui.btn,new Laya.Handler(this,this.onBtnClick)),
                ButtonCtl.Create(this._ui.btn1,new Laya.Handler(this,this.onBtnClick1))
            )
        }
    }

    protected onInit(): void {
        
    }

    protected onExit(): void {
        
    }

    private onBtnClick(){
        ComposeModel.Ins.startNewYear();
    }

    private onBtnClick1(){
        TowerMainFightModel.Ins.sendRoom(1,4);
    }
}