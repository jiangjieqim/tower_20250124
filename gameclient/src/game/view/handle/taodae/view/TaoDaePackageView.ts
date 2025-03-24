import { ScrollPanelControl } from "../../../../../frame/view/ScrollPanelControl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { EPageType } from "../../../../common/defines/EnumDefine";
import { ActivityModel } from "../../activity/ActivityModel";
import { ActivityTime } from "../../common/ActivityTime";
import { TaodaeEvent } from "../model/TaodaeEvent";
import { ETaoDaeType, TaodaeFactory } from "../model/TaodaeFactory";
import { TaoDaeModel } from "../model/TaoDaeModel";

/**套大鹅任务 礼包 */
export class TaoDaePackageView extends ViewBase{
    PageType:EPageType = EPageType.None;
    protected autoFree:boolean = true;
    private _ui:ui.views.taodae.ui_taodae_packageUI;
    private type:ETaoDaeType;
    private panel:ScrollPanelControl;
    private _timeCtl:ActivityTime;
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
    }
    protected onExit(): void {
        // throw new Error("Method not implemented.");
        this.model.off(TaodaeEvent.TaskChange,this,this.refreshList);
        ActivityModel.Ins.off(ActivityModel.UPDATE_DATA,this,this.refreshList);
        if(this._timeCtl){
            this._timeCtl.dispose();
            this._timeCtl = null;
        }
    }
    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if(!this.UI){
            this.UI = this._ui = new ui.views.taodae.ui_taodae_packageUI();
            this.panel = new ScrollPanelControl();
            this.panel.init(this._ui.panel);
            this._timeCtl = new ActivityTime(this._ui.timeLb);
        }
    }
    private get model(){
        return TaoDaeModel.Ins;
    }
    protected onInit(): void {
        // throw new Error("Method not implemented.");
        this.type = this.Data;
        this._timeCtl.refresh(this.model.activityId);
        this.model.on(TaodaeEvent.TaskChange,this,this.refreshList);
        ActivityModel.Ins.on(ActivityModel.UPDATE_DATA,this,this.refreshList);

        this.refreshList();
    }

    private refreshList(){
        TaodaeFactory.renderList(this.panel, this.type, this._ui.titleLb);
    }
}