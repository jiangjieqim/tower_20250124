// import { ButtonCtl } from "../../../../../../frame/view/ButtonCtl";
import { RowMoveBaseNode, ScrollPanelControl } from "../../../../../../frame/view/ScrollPanelControl";
import { ViewBase } from "../../../../../../frame/view/ViewBase";
import { ui } from "../../../../../../ui/layaMaxUI";
import { TrophyReward_req } from "../../../../../network/protocols/BaseProto";
import { SocketMgr } from "../../../../../network/SocketMgr";
import { MainModel } from "../../../main/model/MainModel";
import { t_Arena } from "../../../towertmaincard/proxy/t_Arena";
import { TowerMainFightModel } from "../../model/TowerMainFightModel";
import { t_Trophy_Reward } from "../../proxy/t_Trophy_Reward";
import { TrophyItem } from "./TrophyItem";

class TrophyNode extends RowMoveBaseNode{
    protected clsKey:string = "TrophyNode";
    protected createNode (index){
        let _skin:TrophyItem = Laya.Pool.getItemByClass(this.clsKey,TrophyItem);
        _skin.setData(this.list[index],t_Trophy_Reward.Ins.getCfgByTrophy(MainModel.Ins.mRoleData.trophy));
        _skin.y = this.y;
        return _skin;
    }
}

class TrophyNode1 extends RowMoveBaseNode{
    protected clsKey:string = "TrophyNode1";
    protected createNode (index){
        let _skin:ui.views.main.ui_trophyItem1UI = Laya.Pool.getItemByClass(this.clsKey,ui.views.main.ui_trophyItem1UI);
        _skin.lab.text = this.list[index];
        _skin.y = this.y;
        return _skin;
    }
}

export class TrophyView extends ViewBase{
    private _ui:ui.views.main.ui_trophyViewUI;

    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;
    private _panelCtl: ScrollPanelControl;

    protected onAddLoadRes(): void {
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.main.ui_trophyViewUI();
            this.bindClose(this._ui.btn_close);
            this._panelCtl = new ScrollPanelControl();
            this._panelCtl.init(this._ui.panel);
            
            this.btnList.push(
                ButtonCtl.Create(this._ui.btn,new Laya.Handler(this,this.onBtnClick)),
            )
        }
    }

    private onBtnClick(){
        let req = new TrophyReward_req;
        req.id = 0;
        SocketMgr.Ins.SendMessageBin(req);
    }

    protected onInit(): void {
        TowerMainFightModel.Ins.on(TowerMainFightModel.TROPHY_REWARD,this,this.onUpdateView);
        this.updateView();
    }

    protected onExit(): void {
        TowerMainFightModel.Ins.off(TowerMainFightModel.TROPHY_REWARD,this,this.onUpdateView);
    }

    private onUpdateView(){
        this.updateView(true);
    }

    private updateView(flag:boolean = false){
        let arr = this.getList();
        this._panelCtl.clear();
        for(let i = 0;i<arr.length ;i++){
            if(arr[i].lab != ""){
                this._panelCtl.split([arr[i].lab],TrophyNode1,26);
            }else{
                this._panelCtl.split([arr[i].data],TrophyNode,186);
            }
        }

        if(flag){
            this._panelCtl.end(this._panelCtl.getScrollValue());
        }else{
            let cfg = t_Trophy_Reward.Ins.getCfgByTrophy(MainModel.Ins.mRoleData.trophy);
            let index = arr.length - cfg.f_id - cfg.f_arena;
            if(cfg.f_id > 3){
                index -= 2;
            }
            if(index < 0){
                index = 0;
            }
            this._panelCtl.endIndex(index);
        }

        if(TowerMainFightModel.Ins.isTrophyViewRedTip()){
            this._ui.btn.visible = true;
        }else{
            this._ui.btn.visible = false;
        }
    }

    private getList() {
        let array = [];
        let arr = t_Trophy_Reward.Ins.List;
        let type = t_Arena.Ins.List[t_Arena.Ins.List.length - 1].f_arenaid;
        for (let i: number = arr.length - 1; i >= 0; i--) {
            if (arr[i].f_arena != type) {
                let voo: any = {};
                voo.lab = t_Arena.Ins.getCfgById(type).f_name;
                voo.data = null;
                array.push(voo);
                type = arr[i].f_arena;
            }
            let vo: any = {};
            vo.lab = "";
            vo.data = arr[i];
            array.push(vo);
            if (i == 0) {
                let voo: any = {};
                voo.lab = t_Arena.Ins.getCfgById(1).f_name;
                voo.data = null;
                array.push(voo);
            }
        }
        return array;
    }
}