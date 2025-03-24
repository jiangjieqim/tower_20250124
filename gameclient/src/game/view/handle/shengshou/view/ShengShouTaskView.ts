import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { EActivityStatus } from "../../activity/ActivityEnum";
import { ShengShouModel } from "../model/ShengShouModel";
import { t_HolyBeast_Resource } from "../proxy/t_HolyBeast_Resource";
import { t_HolyBeast_Task } from "../proxy/t_HolyBeast_Task";
import { ShengShouTaskItem } from "./item/ShengShouTaskItem";

export class ShengShouTaskView extends ViewBase{
    private _ui:ui.views.shengshou.ui_taskViewUI;

    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private _timeCtl:TimeCtl;

    protected onAddLoadRes(): void {
        this.addAtlas('shengshou.atlas');
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.shengshou.ui_taskViewUI();
            this.bindClose(this._ui.btn_close);

            let cfg = t_HolyBeast_Resource.Ins.getCfgById(ShengShouModel.Ins.actID);
            this._ui.titleHero.name = cfg.f_hero_id;

            this._timeCtl = new TimeCtl(this._ui.lab_time);

            this._ui.list.itemRender = ShengShouTaskItem;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);
        }
    }

    private onRenderHandler(item:ShengShouTaskItem){
        item.setData(item.dataSource);
    }

    protected onInit(): void {
        ShengShouModel.Ins.on(ShengShouModel.UPDATE_TASK,this,this.updateView);
        this._ui.img.skin = `o/shengshou/task_${ShengShouModel.Ins.actID}.png`;
        let data = ShengShouModel.Ins.getRankTimeData(ShengShouModel.Ins.actID);
        this.updateView();
        if(!data)return;
        let time = data.end - TimeUtil.serverTime;
        if (time > 0) {
            this._timeCtl.start(time, new Laya.Handler(this, this.onUpdateTime), new Laya.Handler(this, this.endTime));
        } else {
            this.endTime();
        }
    }

    protected onExit(): void {
        ShengShouModel.Ins.off(ShengShouModel.UPDATE_TASK,this,this.updateView);
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
        let data = ShengShouModel.Ins.getTaskData(ShengShouModel.Ins.actID);
        if(!data)return;
        let arr = t_HolyBeast_Task.Ins.getListById(ShengShouModel.Ins.actID);
        let arr1 = [];
        let arr2 = [];
        let arr3 = [];
        for(let i:number=0;i<arr.length;i++){
            let val = data.datalist.find(ele=>ele.id == arr[i].f_id);
            if(val.state == EActivityStatus.Claimed){
                arr3.push(arr[i]);
            }else if(val.state == EActivityStatus.Claimable){
                arr1.push(arr[i]);
            }else{
                arr2.push(arr[i]);
            }
        }
        this._ui.list.array = arr1.concat(arr2).concat(arr3);
    }


}