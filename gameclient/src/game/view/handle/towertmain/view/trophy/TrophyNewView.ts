import { RowMoveBaseNode, ScrollPanelControl } from "../../../../../../frame/view/ScrollPanelControl";
import { ViewBase } from "../../../../../../frame/view/ViewBase";
import { ui } from "../../../../../../ui/layaMaxUI";
import { E, ScreenAdapter } from "../../../../../G";
import { stCommonReward } from "../../../../../network/protocols/BaseProto";
import { MainModel } from "../../../main/model/MainModel";
import { RoleInfoModel } from "../../../roleinfo/model/RoleInfoModel";
import { TowerMainFightModel } from "../../model/TowerMainFightModel";
import { t_Medal } from "../../proxy/t_Medal";
import { t_Trophy_Reward } from "../../proxy/t_Trophy_Reward";
import { TrophyNewItem } from "./TrophyNewItem";
import { TrophyNewItem1 } from "./TrophyNewItem1";

class TrophyNewNode extends RowMoveBaseNode{
    protected clsKey:string = "TrophyNewNode";
    protected createNode (index){
        let _skin:TrophyNewItem = Laya.Pool.getItemByClass(this.clsKey,TrophyNewItem);
        _skin.setData(this.list[index]);
        _skin.y = this.y;
        return _skin;
    }
}

export class TrophyNewView extends ViewBase{
    private _ui:ui.views.trophy.ui_trophyViewUI;

    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;
    private _panelCtl: ScrollPanelControl;

    protected onAddLoadRes(): void {
        this.addAtlas("trophy.atlas");
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.trophy.ui_trophyViewUI();
            this.bindClose(this._ui.btn_close);

            this.btnList.push(
                ButtonCtl.Create(this._ui.btn_tip,new Laya.Handler(this,this.onBtnTipClick)),
            )

            this._panelCtl = new ScrollPanelControl();
            this._panelCtl.init(this._ui.panel);

            this._ui.list.itemRender = TrophyNewItem1;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);
        }
    }

    private onBtnTipClick(){
        E.ViewMgr.openTipView("TrophyT","TrophyD");
    }

    private onRenderHandler(item:TrophyNewItem1,index:number){
        item.setData(item.dataSource,index);
    }

    protected onInit(): void {
        this.setUI();
        TowerMainFightModel.Ins.on(TowerMainFightModel.TROPHY_REWARD,this,this.onUpdateView);
        let array = [];
        let arr = t_Medal.Ins.List;
        for(let i:number=arr.length - 1;i >= 0;i--){
            array.push(arr[i]);
        }

        this._panelCtl.clear();
        this._panelCtl.split(array,TrophyNewNode,215,12);

        let trophy = RoleInfoModel.Ins.getMaxTrophy();
        let cfg = t_Medal.Ins.getCfgByTr(trophy);
        let index = arr.length - cfg.f_id;
        if(cfg.f_id > 3){
            index -= 2;
        }
        if(index < 0){
            index = 0;
        }
        this._panelCtl.endIndex(index);
        this._ui.lab.text = MainModel.Ins.mRoleData.trophy + "";

        let list = t_Trophy_Reward.Ins.List;
        this._ui.list.array = list;
        let ind = 0;
        for(let i:number=0;i<list.length;i++){
            let vo: stCommonReward = TowerMainFightModel.Ins.trophyRewardList.find(ele => ele.id == list[i].f_id);
            if(vo){
                if(vo.state == 1){
                    ind = i;
                    break;
                }else{
                    ind = i;
                }
            }
        }
        this._ui.list.scrollTo(ind);
    }

    protected onExit(): void {
        TowerMainFightModel.Ins.off(TowerMainFightModel.TROPHY_REWARD,this,this.onUpdateView);
    }

    private onUpdateView(){
        this._ui.list.refresh();
    }

    private setUI() {
        let yy = (Laya.stage.height - ScreenAdapter.DefaultHeight);
        if (yy > 0) {
            this._ui.height += yy;
            this._ui.panel.height += yy;

            this._ui.list.y += yy;
            this._ui.img.y += yy;
        }
    }
}