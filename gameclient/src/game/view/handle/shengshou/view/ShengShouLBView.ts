import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { ActivityModel } from "../../activity/ActivityModel";
import { ShengShouModel } from "../model/ShengShouModel";
import { t_HolyBeast_Pack } from "../proxy/t_HolyBeast_Pack";
import { t_HolyBeast_Resource } from "../proxy/t_HolyBeast_Resource";
import { ShengShouLBItem } from "./item/ShengShouLBItem";

export class ShengShouLBView extends ViewBase{
    private _ui:ui.views.shengshou.ui_LBViewUI;

    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private _timeCtl:TimeCtl;

    protected onAddLoadRes(): void {
        this.addAtlas('shengshou.atlas');
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.shengshou.ui_LBViewUI();
            this.bindClose(this._ui.btn_close);

            let cfg = t_HolyBeast_Resource.Ins.getCfgById(ShengShouModel.Ins.actID);
            this._ui.titleHero.name = cfg.f_hero_id;

            this._ui.list.itemRender = ShengShouLBItem;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);

            this._timeCtl = new TimeCtl(this._ui.lab_time);
        }
    }

    private onRenderHandler(item:ShengShouLBItem){
        item.setData(item.dataSource,this._type);
    }

    private _type;
    protected onInit(): void {
        ActivityModel.Ins.on(ActivityModel.UPDATE_DATA,this,this.updateView);
        this._type = this.Data;
        this._ui.img.skin = `o/shengshou/lb${this._type}_${ShengShouModel.Ins.actID}.png`;
        this._ui.img1.skin = `o/shengshou/lbb${this._type}_${ShengShouModel.Ins.actID}.png`;
        this.updateView();
        let data = ShengShouModel.Ins.getRankTimeData(ShengShouModel.Ins.actID);
        if(!data)return;
        let time = data.end - TimeUtil.serverTime;
        if (time > 0) {
            this._timeCtl.start(time, new Laya.Handler(this, this.onUpdateTime), new Laya.Handler(this, this.endTime));
        } else {
            this.endTime();
        }
    }

    protected onExit(): void {
        ActivityModel.Ins.off(ActivityModel.UPDATE_DATA,this,this.updateView);
        if(this._timeCtl){
            this._timeCtl.dispose();
            this._timeCtl = null;
        }
    }

    private onUpdateTime() {
        let time_str = TimeUtil.subTimeCC(this._timeCtl.tickVal);
        this._timeCtl.setText(time_str);
    }

    private endTime() {
        this._timeCtl.setText("已结束");
    }

    private updateView(){
        this._ui.list.array = t_HolyBeast_Pack.Ins.getListByIdAT(ShengShouModel.Ins.actID,this._type);
    }

}