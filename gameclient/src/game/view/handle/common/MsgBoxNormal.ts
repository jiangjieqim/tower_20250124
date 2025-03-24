import { ViewBase } from "../../../../frame/view/ViewBase";
import { E } from "../../../G";

export class MsgBoxNormal extends ViewBase{
    private _ui:Laya.View;
    private lb:Laya.Label;
    protected mMask:boolean = true;
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
    }
    protected onExit(): void {
        // throw new Error("Method not implemented.");
        E.sdk.reload();
    }
    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if(!this.UI){
            this.UI = this._ui = new Laya.View();
            // let bg = new Laya.Sprite();
            this._ui.width = 640;
            this._ui.height = 393;
            this._ui.hitArea = new Laya.Rectangle(0,0,this._ui.width,this._ui.height);
            this.UI.addChild(this._ui);
            this._ui.graphics.drawRect(0,0,this._ui.width,this._ui.height,"#ffffff");
            this.lb = new Laya.Label();
            this.lb.fontSize = 26;
            this.lb.color = "#000000";
            this.lb.align = "center";
            this._ui.addChild(this.lb);
            this.lb.y = this._ui.height/2;
            this.lb.width = this._ui.width;
            this.UI.on(Laya.Event.CLICK,this,this.onClickHandler);
        }
    }
    private onClickHandler(){
        this.Close();
    }
    protected onInit(): void {
        // throw new Error("Method not implemented.");
        this.lb.text = this.Data||"";
    }
}