import { ScrollPanelControl } from "../../../../../frame/view/ScrollPanelControl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { FightReport_req, stFightReport } from "../../../../network/protocols/BaseProto";
import { SocketMgr } from "../../../../network/SocketMgr";
import { ComposeEvent } from "../../compose/ComposeEvent";
import { ComposeModel } from "../../compose/ComposeModel";
import { FightReportVo } from "../vos/FightReportVo";
import { FightHisCellViewNode } from "./FightHisCellView";
/**历史战绩 */
export class FightHisView extends ViewBase{
    protected autoFree:boolean = true;
    protected mMask:boolean = true;
    private _ui:ui.views.fighthis.ui_fight_his_viewUI;
    private _panel:ScrollPanelControl;
    private get model(){
        return ComposeModel.Ins;
    }
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
        this.addAtlas("fight_his.atlas");
    }
    protected onExit(): void {
        // throw new Error("Method not implemented.");
        if(this._panel){
            this._panel.clear();
        }
    }
    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if(!this.UI){
            this.UI = this._ui = new ui.views.fighthis.ui_fight_his_viewUI();
            this.bindClose(this._ui.closeBtn);
            this._panel = new ScrollPanelControl();
            this._panel.init(this._ui.panel1);
        }
    }

    protected onInit(): void {
        // throw new Error("Method not implemented.");
        this._panel.clear();
        this.model.once(ComposeEvent.FightReport,this,this.onReportHandler);
        let req = new FightReport_req();
        SocketMgr.Ins.SendMessageBin(req);
    }

    private onReportHandler(_dataList:stFightReport[]){
        for(let i = 0;i < _dataList.length;i++){
            let vo:FightReportVo = new FightReportVo( _dataList[i]);
            this._panel.split([vo],FightHisCellViewNode,vo.cellHeight);
        }
        this._panel.end();
    }
}