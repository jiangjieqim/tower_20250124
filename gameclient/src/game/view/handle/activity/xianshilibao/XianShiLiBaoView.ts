import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { stActivityCell } from "../../../../network/protocols/BaseProto";
import { EActivityID } from "../ActivityEnum";
import { ActivityModel } from "../ActivityModel";
import { XianShiLiBaoItem } from "./XianShiLiBaoItem";
import { XianShiLiBaoModel } from "./XianShiLiBaoModel";
import { t_Limited_Time_Pack } from "./t_Limited_Time_Pack";

export class XianShiLiBaoView extends ViewBase{
    private _ui:ui.views.xianshilibao.ui_xianshilibaoViewUI;
    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    protected onAddLoadRes() {
        this.addAtlas('xianshilibao.atlas');
    }

    protected onFirstInit() {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.xianshilibao.ui_xianshilibaoViewUI();
            this.bindClose(this._ui.btn_close);

            this._ui.list.itemRender = XianShiLiBaoItem;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);
        }
    }

    private onRenderHandler(item:XianShiLiBaoItem){
        item.setData(item.dataSource);
    }

    protected onInit(): void {
        ActivityModel.Ins.on(ActivityModel.UPDATE_DATA,this,this.onUpdateView);
        XianShiLiBaoModel.Ins.on(XianShiLiBaoModel.UPDATE_DATA,this,this.onUpdateView);
        this.updateView();
    }

    protected onExit(): void {
        ActivityModel.Ins.off(ActivityModel.UPDATE_DATA,this,this.onUpdateView);
        XianShiLiBaoModel.Ins.off(XianShiLiBaoModel.UPDATE_DATA,this,this.onUpdateView);
    }

    private onUpdateView(){
        Laya.timer.callLater(this,this.updateView);
    }

    private updateView(){
        let data = ActivityModel.Ins.getActivityData(EActivityID.XianShiLiBao);
        if(!data)return;
        let arr = [];
        for(let i:number=0;i<data.datalist.length;i++){
            let cfg:Configs.t_Limited_Time_Pack_dat = t_Limited_Time_Pack.Ins.GetDataById(data.datalist[i].id);
            if(cfg.f_hide){
                continue;
            }
            if(data.datalist[i].param1 < cfg.f_limited_times){
                arr.push(data.datalist[i]);
            }
        }
        arr.sort(this.onSort);
        this._ui.list.array = arr;

        if(arr.length == 0){
            this.Close();
        }
    }

    private onSort(a:stActivityCell,b:stActivityCell){
        let aa:Configs.t_Limited_Time_Pack_dat = t_Limited_Time_Pack.Ins.GetDataById(a.id);
        let bb:Configs.t_Limited_Time_Pack_dat = t_Limited_Time_Pack.Ins.GetDataById(b.id);
        return bb.f_pack_sort - aa.f_pack_sort;
    }
}