// import { ButtonCtl } from "../../../../../../frame/view/ButtonCtl";
import { ViewBase } from "../../../../../../frame/view/ViewBase";
import { ui } from "../../../../../../ui/layaMaxUI";
import { E } from "../../../../../G";
import { SocketMgr } from "../../../../../network/SocketMgr";
import { GodRoad_req } from "../../../../../network/protocols/BaseProto";
import { DotManager } from "../../../common/DotManager";
import { MainModel } from "../../../main/model/MainModel";
import { TowerMainFightModel } from "../../model/TowerMainFightModel";
import { t_God_Road } from "../../proxy/t_God_Road";
import { TrophyItem1 } from "./TrophyItem1";

export class TrophyView1 extends ViewBase{
    private _ui:ui.views.main.ui_trophyView1UI;

    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;
    private _w:number;

    protected onAddLoadRes(): void {
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.main.ui_trophyView1UI();
            this.bindClose(this._ui.btn_close);

            this._w = this._ui.pro.width;
            
            this.btnList.push(
                ButtonCtl.Create(this._ui.btn,new Laya.Handler(this,this.onBtnClick))
            )

            this._ui.list.itemRender = TrophyItem1;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);
        }
    }

    private onBtnClick(){
        let req = new GodRoad_req;
        req.id = 0;
        SocketMgr.Ins.SendMessageBin(req);
    }

    private onRenderHandler(item:TrophyItem1){
        item.setData(item.dataSource);
    }

    protected onInit(): void {
        TowerMainFightModel.Ins.on(TowerMainFightModel.GODROAD_DATE,this,this.updateView);
        this.updateView();
    }

    protected onExit(): void {
        TowerMainFightModel.Ins.off(TowerMainFightModel.GODROAD_DATE,this,this.updateView);
    }

    private updateView(){
        let cfg = t_God_Road.Ins.getCfgBySean(MainModel.Ins.season);
        this._ui.lab.text = cfg.f_season_name;
        this._ui.lab1.text = E.getLang("god_road");
        this._ui.lab2.text = cfg.f_trophy + "分";
        this._ui.list.array = t_God_Road.Ins.List;
        this._ui.pro.width = (MainModel.Ins.season - 1) * this._w;

        if(TowerMainFightModel.Ins.isGodRoadRedTip()){
            DotManager.addDot(this._ui.btn);
            this._ui.btn.disabled = false;
        }else{
            DotManager.removeDot(this._ui.btn);
            this._ui.btn.disabled = true;
        }
    }
}