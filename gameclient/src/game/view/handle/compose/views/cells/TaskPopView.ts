import { ViewBase } from "../../../../../../frame/view/ViewBase";
import { ui } from "../../../../../../ui/layaMaxUI";
import { EViewType } from "../../../../../common/defines/EnumDefine";
import { E, ScreenAdapter } from "../../../../../G";
import { ESystemRefreshTime } from "../../../main/ctl/ESystemRefreshTime";
import { System_RefreshTimeProxy } from "../../../main/ctl/System_RefreshTimeProxy";
import { ItemViewFactory } from "../../../main/model/ItemViewFactory";
import { ComposeModel } from "../../ComposeModel";
import { FightValueConfig } from "../../vos/FightValueConfig";
/**任务气泡弹出框 */
export class TaskPopView extends ViewBase{
    private _ui:ui.views.compose.fightcell.ui_task_popUI;
    private model:ComposeModel;
    private timer = new Laya.Timer();
    protected maskAlpha = 0.0;
    // public PageType: EPageType = EPageType.None;
    private get delayUseTime(){
        return parseInt(System_RefreshTimeProxy.Ins.getVal(ESystemRefreshTime.TASK_POP_DELAY_MS));
    }
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
    }
    protected onExit(): void {
        this.timer.clear(this,this.onExitLater);
        this.timer.callLater(this,this.onExitLater);
    }
    private onExitLater(){
        if(this.model.popTaskIds.length > 0){
            let id = this.model.popTaskIds.shift();
            E.ViewMgr.Open(EViewType.TaskPopView,null,id);
        }
    }
    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if(!this.UI){
            this.model = ComposeModel.Ins;
            this.UI = this._ui = new ui.views.compose.fightcell.ui_task_popUI();
        }
    }
    protected onInit(): void {
        // throw new Error("Method not implemented.");
        let taskId:number = this.Data;
        let battleTask = this.model.fightTypeAdaper.battleTask;
        if(battleTask){
            let cfg = battleTask.getByTaskId(taskId)
            this._ui.descTf.text = cfg.f_complete_text;

            let itemVo = ItemViewFactory.convertItem(cfg.f_task_reward);
            this._ui.itemIcon.skin = itemVo.getIcon();
            // DebugUtil.drawRect(this._ui.itemIcon);
            this._ui.itemCntTf.text = `×${itemVo.count}`;
            this._ui.itemCntTf.x = this._ui.itemIcon.x + this._ui.itemIcon.width * this._ui.itemIcon.scaleX / 2;
            this._ui.t0.visible = false;
        }
        Laya.timer.once(this.delayUseTime,this,this.Close);
    }

    // private checkClose(){
    //     if(this.model.popTaskIds.length > 0){
    //         let id = this.model.popTaskIds.shift();
    //         this.Data = id;
    //         this.onInit();
    //     }
    //     else{
    //         this.Close();
    //     }
    // }

    protected SetCenter(){
        super.SetCenter();
        let ox = 74;
        let oy = 37;
        this.UI.x = (this.ViewParent.width >> 1) - ScreenAdapter.UIRefWidth/2 + ox;
        this.UI.y = E.sdk.statusBarHeight + FightValueConfig.TopOffsetY + oy;
    }
}