import { ViewBase } from "../../../../../../frame/view/ViewBase";
import { ui } from "../../../../../../ui/layaMaxUI";
import { SocketMgr } from "../../../../../network/SocketMgr";
import { PvPUnlock_req } from "../../../../../network/protocols/BaseProto";
import { DotManager } from "../../../common/DotManager";
import { MainModel } from "../../../main/model/MainModel";
import { TowerMainFightModel } from "../../model/TowerMainFightModel";
import { t_Pvp_Unlock_Condition } from "../../proxy/t_Pvp_Unlock_Condition";
import { t_Pvp_Unlock_Reward } from "../../proxy/t_Pvp_Unlock_Reward";
import { PvpLockItem } from "./PvpLockItem";
import { PvpLockItem1 } from "./PvpLockItem1";

export class PvpLockView extends ViewBase{
    protected mMask = true;
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private _ui:ui.views.main.ui_pwlockViewUI;

    protected onAddLoadRes(): void { 
        this.addAtlas('pvp.atlas');
    }

    protected onFirstInit(): void { 
        if(!this.UI){
            this.UI = this._ui = new ui.views.main.ui_pwlockViewUI();
            this.bindClose(this._ui.btn_close);

            this.btnList.push(
                ButtonCtl.Create(this._ui.btn,new Laya.Handler(this,this.onBtnClick)),
                ButtonCtl.Create(this._ui.btn1,new Laya.Handler(this,this.onBtn1Click)),
            )

            this._ui.list.itemRender = PvpLockItem;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);

            this._ui.list1.itemRender = PvpLockItem1;
            this._ui.list1.renderHandler = new Laya.Handler(this,this.onRenderHandler1);
        }
    }

    private onBtnClick(){
        let req = new PvPUnlock_req;
        req.flag = 0;
        req.finishTrial = MainModel.Ins.isNewPvpGuideComplete ? 1:0;
        SocketMgr.Ins.SendMessageBin(req);
    }

    private onBtn1Click(){
        let req = new PvPUnlock_req;
        req.flag = 1;
        req.finishTrial = MainModel.Ins.isNewPvpGuideComplete ? 1:0;
        SocketMgr.Ins.SendMessageBin(req);
    }

    private onRenderHandler(item:PvpLockItem){
        item.setData(item.dataSource);
    }

    private onRenderHandler1(item:PvpLockItem1,index:number){
        item.setData(item.dataSource,index);
    }

    protected onInit(): void {
        TowerMainFightModel.Ins.on(TowerMainFightModel.UPDATE_PVP,this,this.updateView);
        this.updateView();
    }

    protected onExit(): void {
        TowerMainFightModel.Ins.off(TowerMainFightModel.UPDATE_PVP,this,this.updateView);
    }

    private updateView(){
        this._ui.list.array = t_Pvp_Unlock_Condition.Ins.List;
        this._ui.lab.text = TowerMainFightModel.Ins.pvpReward.length + "/" + t_Pvp_Unlock_Condition.Ins.List.length;
        this._ui.list1.array = t_Pvp_Unlock_Reward.Ins.List;

        if(TowerMainFightModel.Ins.pvpReward.length >= t_Pvp_Unlock_Condition.Ins.List.length){
            this._ui.btn.visible = false;
            this._ui.btn1.visible = true;
        }else{
            this._ui.btn.visible = true;
            this._ui.btn1.visible = false;
            if(TowerMainFightModel.Ins.isPvpRedTip()){
                DotManager.addDot(this._ui.btn);
                this._ui.btn.disabled = false;
            }else{
                DotManager.removeDot(this._ui.btn);
                this._ui.btn.disabled = true;
            }
        }
    }
}