import { ViewBase } from "../../../../../../frame/view/ViewBase";
import { EPageType } from "../../../../../common/defines/EnumDefine";
/**引导脚手架 用于启动引导帧循环*/
export class QuickGuide extends ViewBase{
    protected autoFree:boolean;
    PageType:EPageType = EPageType.None;
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
    }
    private _ui:Laya.View;
    protected onExit(): void {
        // throw new Error("Method not implemented.");
    }
    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if(!this.UI){
            this.UI = this._ui = new Laya.View();
            this._ui.graphics.drawRect(0,0,100,100,"#00ff00");
        }
    }
    protected onInit(): void {
        // throw new Error("Method not implemented.");
    }
    
}