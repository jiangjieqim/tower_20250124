import { ScrollPanelControl } from "../../../../../frame/view/ScrollPanelControl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { EViewType } from "../../../../common/defines/EnumDefine";
import { E } from "../../../../G";
import { BattleStatisticPull_req } from "../../../../network/protocols/BaseProto";
import { SocketMgr } from "../../../../network/SocketMgr";
import { ComposeEvent } from "../ComposeEvent";
import { ComposeModel } from "../ComposeModel";
import { FightUIFactory } from "../FightUIFactory";
import { t_Battle_Statistics_TypeProxy } from "../vos/t_Battle_Statistics";
import { FightPossessAttrPlayerCtl } from "./cells/FightPossessAttrPlayerCtl";
import { FightPossessCellTitleView, FightPossessCellView } from "./cells/FightPossessCellView";
/**局内统计 */
export class FightPossessView extends ViewBase{
    private _ui:ui.views.compose.ui_fight_possessUI;
    private model:ComposeModel;
    protected autoFree:boolean = true;
    protected mMask:boolean = true;
    private _panelCtl:ScrollPanelControl;
    private leftBuff:FightPossessAttrPlayerCtl;
    private rightBuff:FightPossessAttrPlayerCtl;
    private bgInitY:number;
    private bgInitHeight:number;
    private panel1InitHeight:number;
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
    }
    protected onExit(): void {
        // throw new Error("Method not implemented.");
        this.model.off(ComposeEvent.BattleStatistic,this,this.onInfoCallBack);
        this._panelCtl && this._panelCtl.clear();
        this.leftBuff.dispose();
        this.rightBuff.dispose();
        E.ViewMgr.Close(EViewType.PossessBuffTips);
    }
    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if(!this.UI){
            this.model = ComposeModel.Ins;
            this.UI = this._ui = new ui.views.compose.ui_fight_possessUI();
            this.bgInitY = this._ui.bg1.y;
            this.bgInitHeight = this._ui.bg1.height;
            this.panel1InitHeight = this._ui.panel1.height;
            this.bindClose(this._ui.closeBtn);
            this._ui.leftPlayer.bottomImg.skin = `remote/fight/bottom_lf.png`;

        }
    }
    protected onInit(): void {
        this.model.on(ComposeEvent.BattleStatistic,this,this.onInfoCallBack);
        let req:BattleStatisticPull_req = new BattleStatisticPull_req();
        SocketMgr.Ins.SendMessageBin(req);
        this.leftBuff = new FightPossessAttrPlayerCtl(this._ui.leftPlayer.con1);
        this.rightBuff = new FightPossessAttrPlayerCtl(this._ui.rightPlayer.con1);

        FightUIFactory.setPlayer(this._ui.leftPlayer,this.model.ownerPlayer);
        FightUIFactory.setPlayer(this._ui.rightPlayer,this.model.enemyPlayer);
    }

    private onInfoCallBack(){

        this.leftBuff.refresh(this.model.battleStaticList,this.model.ownerPlayer);
        this.rightBuff.refresh(this.model.battleStaticList,this.model.enemyPlayer);

        let offsetHeight:number = Math.max(this.leftBuff.height,this.rightBuff.height);

        if(offsetHeight > 0){
            this._ui.tips1.visible = false;
            this._ui.bg1.y = this.bgInitY + offsetHeight;
        }else{
            this._ui.tips1.visible = true;
            this._ui.bg1.y = this._ui.tips1.y + this._ui.tips1.height;
        }

        let oh:number = this._ui.bg1.y - this.bgInitY;
        this._ui.bg1.height = this.bgInitHeight - oh;

        this._ui.panel1.height = this.panel1InitHeight - oh;

        this._panelCtl = new ScrollPanelControl();
        this._panelCtl.init(this._ui.panel1);

        this._panelCtl.clear();
        let dataList:Configs.t_Battle_Statistics_Type_dat[] = t_Battle_Statistics_TypeProxy.Ins.List;
        for(let i = 0;i < dataList.length;i++){
            let cfg = dataList[i];
            this._panelCtl.split([cfg.f_name],FightPossessCellTitleView,45);
            let arr = cfg.f_include_entries.split("|");
            for(let i = 0;i < arr.length;i++){
                let id:number = parseInt(arr[i]);
                this._panelCtl.split([id],FightPossessCellView,93);
            }
        }
        this._panelCtl.end();
       
    }

}