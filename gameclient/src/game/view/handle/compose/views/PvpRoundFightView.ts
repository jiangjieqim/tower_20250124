import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { EPageType } from "../../../../common/defines/EnumDefine";
import { PvpRoundUICtl } from "./PvpRoundUICtl";
/**pvp回合制下边栏 */
export class PvpRoundFightView extends ViewBase{
    public PageType: EPageType = EPageType.None;
    public _ui:ui.views.compose.ui_pvpround_fightUI;
    protected autoFree:boolean;
    private uiCtl:PvpRoundUICtl;
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
    }
    protected onExit(): void {
        // throw new Error("Method not implemented.");
        if(this.uiCtl){
            this.uiCtl.dispose();
            this.uiCtl = null;
        }
    }
    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if(!this.UI){
            this.UI = this._ui = new ui.views.compose.ui_pvpround_fightUI();
            this._ui.mouseThrough = true;
        }
    }
    protected onInit(): void {
        // throw new Error("Method not implemented.");
        this.initUIctl();
    }
    private initUIctl(){
        this.uiCtl = new PvpRoundUICtl();
        this.uiCtl.buffCon = this._ui.buffCon;
        this.uiCtl.pre = this._ui.pre;
        this.uiCtl.chatbtn = this._ui.chatbtn;
        this.uiCtl.onInit();
    }
    
    protected SetCenter() {
        this.bottomLayout();
    }
}