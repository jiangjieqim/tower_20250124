import { ViewBase } from "../../../../frame/view/ViewBase";
import { EPageType } from "../../../common/defines/EnumDefine";
import { E } from "../../../G";

export class GuideHitUView extends ViewBase{
    PageType:EPageType = EPageType.None;
    protected mHitFull:boolean = true;
    // protected mDebug:boolean = true;
    private _ui:Laya.Sprite;
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
    }
    protected onExit(): void {
        // throw new Error("Method not implemented.");
    }
    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if(!this.UI){
            this.UI = this._ui = new Laya.Sprite() as any;
            this._ui.on(Laya.Event.CLICK, this, this.onClick);
        }
    }
    private onClick(){
        LogSys.Log(`your Hit viewType:${this.ViewType}`);
        if(this.mDebug){
            E.ViewMgr.ShowMidError(`-----------> your Hit viewType:${this.ViewType}`);
        }
    }
    protected onInit(): void {
        // throw new Error("Method not implemented.");
    }

}