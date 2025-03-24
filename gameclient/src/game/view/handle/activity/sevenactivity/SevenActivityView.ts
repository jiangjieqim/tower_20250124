import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E, ScreenAdapter } from "../../../../G";
import { SocketMgr } from "../../../../network/SocketMgr";
import { SevenDayBigReward_req } from "../../../../network/protocols/BaseProto";
import { DotManager } from "../../common/DotManager";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { ItemVo } from "../../main/vos/ItemVo";
import { EActivityID, EActivityStatus } from "../ActivityEnum";
import { ActivityModel } from "../ActivityModel";
import { SevenActivityItem } from "./SevenActivityItem";
import { SevenActivityModel } from "./SevenActivityModel";
import { t_Sevenday_Task } from "./t_Sevenday_Task";
import { t_Sevenday_Task_Config } from "./t_Sevenday_Task_Config";

export class SevenActivityView extends ViewBase{
    private _ui:ui.views.sevenactivity.ui_sevenActivityViewUI;
    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private _timeCtl:TimeCtl;
    private _btnCtl:ButtonCtl;

    protected onAddLoadRes() {
        this.addAtlas('sevenactivity.atlas');
    }

    
    protected onFirstInit() {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.sevenactivity.ui_sevenActivityViewUI();
            this._btnCtl = this.bindClose(this._ui.btn_close);

            this.btnList.push(
                ButtonCtl.Create(this._ui.btn,new Laya.Handler(this,this.onBtnClick))
            )

            this._timeCtl = new TimeCtl(this._ui.lab_time);

            this._ui.list.itemRender = SevenActivityItem;
            this._ui.list.renderHandler = new Laya.Handler(this, this.onRenderHandler);

            this._ui.list1.itemRender = ui.views.sevenactivity.ui_tabUI;
            this._ui.list1.renderHandler = new Laya.Handler(this, this.onRenderHandler1);
            this._ui.list1.selectEnable = true;
        }
    }

    private onBtnClick(){
        let cfg:Configs.t_Sevenday_Task_Config_dat = this._ui.list1.selectedItem;
        if(!cfg)return;
        let req = new SevenDayBigReward_req;
        req.id = cfg.f_id;
        SocketMgr.Ins.SendMessageBin(req);
    }

    private onRenderHandler(item:SevenActivityItem){
        item.setData(item.dataSource);
    }

    private onRenderHandler1(item:ui.views.sevenactivity.ui_tabUI,index:number){
        let cfg:Configs.t_Sevenday_Task_Config_dat = item.dataSource;
        item.lab.text = "第" + cfg.f_day + "天";
        if(index == this._ui.list1.selectedIndex){
            item.img.skin = "remote/sevenactivity/btn_s_cczl.png";
            item.lab.color = "#ffffff";
            item.lab.strokeColor = "#b02e00";
            this.updateView();
        }else{
            item.img.skin = "remote/sevenactivity/btn_n_cczl.png";
            item.lab.color = "#ffcab7";
            item.lab.strokeColor = "#794437";
        }

        if(cfg.f_type == 1){
            item.icon.visible = true;
            item.quality.visible = false;
            item.icon.skin = `remote/sevenactivity/${cfg.f_appear_id}.png`
        }else{
            item.icon.visible = false;
            item.quality.visible = true;
            let vo: ItemVo = new ItemVo();
            vo.cfgId = cfg.f_appear_id;
            vo.count = 1;
            item.quality.skin = vo.quaIcon();
            item.icon1.skin = vo.getIcon();
        }

        let sCfg = t_Sevenday_Task_Config.Ins.GetDataById(SevenActivityModel.Ins.dayId);
        if(sCfg.f_day >= cfg.f_day){
            item.sp.visible = false;
        }else{
            item.sp.visible = true;
        }

        if(SevenActivityModel.Ins.isTabRedTip(cfg)){
            DotManager.addDot(item);
        }else{
            DotManager.removeDot(item);
        }
    }

    protected onInit(): void {
        this.setUI();
        SevenActivityModel.Ins.on(SevenActivityModel.UPDATE_DATA,this,this.onUpdateView);

        let data = ActivityModel.Ins.getActivityStatusData(EActivityID.SevenAct);
        if(!data)return;
        let time = data.endtime - TimeUtil.serverTime;
        if (time > 0) {
            this._timeCtl.start(time, new Laya.Handler(this, this.onUpdateTime), new Laya.Handler(this, this.endTime));
        } else {
            this.endTime();
        }

        let cfg = t_Sevenday_Task_Config.Ins.GetDataById(SevenActivityModel.Ins.dayId);
        if(!cfg)return;
        this._ui.list1.array = t_Sevenday_Task_Config.Ins.List;
        this._ui.list1.selectedIndex = cfg.f_day - 1;
        if(cfg.f_day > 4){
            this._ui.list1.scrollTo(cfg.f_day - 1);
        }
    }

    protected onExit(): void {
        SevenActivityModel.Ins.off(SevenActivityModel.UPDATE_DATA,this,this.onUpdateView);

        if(this._timeCtl){
            this._timeCtl.dispose();
            this._timeCtl = null;
        }
    }

    private setUI() {
        let yy = (Laya.stage.height - ScreenAdapter.DefaultHeight);
        if (yy > 0) {
            this._ui.height += yy;
            this._ui.img_bg.height += yy;
            this._ui.img_bg1.height += yy;
            this._ui.list.height += yy;

            this._ui.img_bg2.y += yy;
            this._ui.img_bg3.y += yy;
            this._ui.list1.y += yy;
            this._btnCtl.setY(this._ui.btn_close.y + yy);
        }
    }

    private onUpdateTime() {
        let time_str = TimeUtil.subTime(this._timeCtl.tickVal);
        this._timeCtl.setText(time_str);
    }

    private endTime() {
        this._timeCtl.setText("00:00:00");
    }

    private onUpdateView(){
        this._ui.list1.refresh();
        this.updateView();
    }

    private updateView(){
        let cfg:Configs.t_Sevenday_Task_Config_dat = this._ui.list1.selectedItem;
        if(!cfg)return;
        let arr = t_Sevenday_Task.Ins.getListById(cfg.f_day);
        this._ui.lab.text = SevenActivityModel.Ins.getNum(arr) + "/" + arr.length;  
        ItemViewFactory.renderItemSlots(this._ui.sp,cfg.f_reward,true,10,0.95,"left");

        if(!SevenActivityModel.Ins.bigRewardList)return;
        if(!SevenActivityModel.Ins.taskList)return;
        DotManager.removeDot(this._ui.btn);
        let state = SevenActivityModel.Ins.bigRewardList.find(ele => ele.id == cfg.f_id).state;
        if (state == EActivityStatus.unclaimable) {
            this._ui.btn.disabled = true;
            this._ui.lab1.text = "领取";
        }else if(state == EActivityStatus.Claimable){
            this._ui.btn.disabled = false;
            this._ui.lab1.text = "领取";
            DotManager.addDot(this._ui.btn);
        }else{
            this._ui.btn.disabled = true;
            this._ui.lab1.text = "已领取";
        }

        let sCfg = t_Sevenday_Task_Config.Ins.GetDataById(SevenActivityModel.Ins.dayId);
        if(cfg.f_day <= sCfg.f_day){
            this._ui.img.visible = false;
            this._ui.list.visible = true;
            arr.sort(this.onSort);
            let arr1 = [];
            let arr2 = [];
            let arr3 = [];
            for(let i:number=0;i<arr.length;i++){
                let state = SevenActivityModel.Ins.taskList.find(ele => ele.id == arr[i].f_id).state;
                if (state == EActivityStatus.unclaimable) {
                    arr2.push(arr[i]);
                }else if(state == EActivityStatus.Claimable){
                    arr1.push(arr[i]);
                }else{
                    arr3.push(arr[i]);
                }
            }
            this._ui.list.array = arr1.concat(arr2).concat(arr3);
        }else{
            this._ui.img.visible = true;
            this._ui.lab2.text = E.getLang("sevenActivity",cfg.f_day);
            this._ui.list.visible = false;
        }
    }

    private onSort(a:Configs.t_Sevenday_Task_dat,b:Configs.t_Sevenday_Task_dat){
        return a.t_task_sort - b.t_task_sort;
    }
}