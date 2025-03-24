import { ViewBase } from "../../../../frame/view/ViewBase";
import { ui } from "../../../../ui/layaMaxUI";
import { EPageType } from "../../../common/defines/EnumDefine";
import { ComposeModel } from "./ComposeModel";

/**PVP_round的状态 */
export enum EPvpRoundReady{
    /**双方准备阶段中... */
    AllReady = 1,

    /**等待对方准备中... */
    WaitEmeny = 2,
}
/**PVP回合制准备状态 */
export class PvpRoundReady extends ViewBase{
    private _ui:ui.views.compose.ui_pvpround_statusUI;
    protected autoFree:boolean = true;
    protected mShowUpdate:boolean = true;
    // protected bFightCenter:boolean = true;
    PageType:EPageType = EPageType.None;
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
    }
    protected onExit(): void {
        // throw new Error("Method not implemented.");
    }
    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if(!this.UI){
            // this.centerPtr = ComposeModel.Ins.fightView;
            this.UI = this._ui = new ui.views.compose.ui_pvpround_statusUI();
        }
    }
    protected onInit(): void {
        // throw new Error("Method not implemented.");
        let type:EPvpRoundReady = this.Data;
        this._ui.lb1.visible = false;
        this._ui.lb2.visible = false;
        let lb:Laya.Label = this._ui[`lb${type}`];
        lb.visible = true;
    }

    protected SetCenter(){
        super.SetCenter(ComposeModel.Ins.fightView,0,-this.UI.height);
    }
}