import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { EViewType } from "../../../../common/defines/EnumDefine";

export class RankView2 extends ViewBase{
    private _ui:ui.views.rank.ui_rankView2UI;

    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    protected onAddLoadRes(): void {
        this.addAtlas('rank.atlas');
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.rank.ui_rankView2UI();
            this.bindClose(this._ui.btn_close);

            this.btnList.push(
                ButtonCtl.Create(this._ui.btn,new Laya.Handler(this,this.onHandler)),
                ButtonCtl.Create(this._ui.btn1,new Laya.Handler(this,this.onHandler1))
            )
        }
    }

    private onHandler(){
        E.ViewMgr.Open(EViewType.RankView,null,1);
    }

    private onHandler1(){
        E.ViewMgr.Open(EViewType.RankView,null,0);
    }

    protected onInit(): void {
        
    }

    protected onExit(): void {

    }
}