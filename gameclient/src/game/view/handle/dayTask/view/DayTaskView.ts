// import { TabControl } from "../../../../../frame/view/TabControl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { FightFactory } from "../../compose/FightFactory";
import { HeroAvatarView } from "../../compose/views/HeroAvatarView";
import { IconUtils } from "../../main/model/IconUtils";
import { ECellType } from "../../main/vos/ECellType";
import { TowerMainModel } from "../../towertmain/model/TowerMainModel";
import { DayTaskModel } from "../model/DayTaskModel";
import { t_Daily_Task_Reward } from "../proxy/t_Daily_Task_Reward";
import { DayTaskItem } from "./DayTaskItem";
import { DayTaskItem1 } from "./DayTaskItem1";
import { DayTaskItem2 } from "./DayTaskItem2";

export class DayTaskView extends ViewBase{
    private _ui:ui.views.task.ui_taskViewUI;
    protected mMask = true;
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private _anim1:HeroAvatarView;

    private tabsCtl:TabControl;
    private tabList: any;

    private _wid:number;

    protected onAddLoadRes() {
        this.addAtlas("daytask.atlas");
    }

    protected onFirstInit(): void {
        if(!this.UI){
            this.UI = this._ui = new ui.views.task.ui_taskViewUI;
            this.bindClose(this._ui.btn_close);

            const tabsSkin = [this._ui.tab1,this._ui.tab2];
            this.tabList = ["任务","成就"];
            this.tabsCtl  = new TabControl();
            this.tabsCtl.init(tabsSkin, new Laya.Handler(this,this.onTabSelectHandler), new Laya.Handler(this, this.itemTabHandler));

            this._ui.list.itemRender = DayTaskItem;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);
            this._ui.list1.itemRender = DayTaskItem1;
            this._ui.list1.renderHandler = new Laya.Handler(this,this.onRenderHandler1);
            this._ui.list2.itemRender = DayTaskItem2;
            this._ui.list2.renderHandler = new Laya.Handler(this,this.onRenderHandler2);

            this._wid = this._ui.pro.width;
        }
     }

     private onRenderHandler(item:DayTaskItem){
        item.setData(item.dataSource);
     }

     private onRenderHandler1(item:DayTaskItem1){
        item.setData(item.dataSource);
     }

     private onRenderHandler2(item:DayTaskItem2){
        item.setData(item.dataSource);
     }

     private onTabSelectHandler(v: number) {
        if(v == -1)return;
        switch (v) {
            case 0:
                this._ui.sp1.visible = true;
                this._ui.sp2.visible = false;
                this._ui.lab.text = "每日任务";
                break;
            case 1:
                this._ui.sp1.visible = false;
                this._ui.sp2.visible = true;
                this._ui.lab.text = "成就";
                break;
        }
    }

    private itemTabHandler(tabSkin, index: number, sel: boolean, data){
        let skin: ui.views.roleinfo.ui_tabUI = tabSkin;
        skin.lab.text = this.tabList[index];
        if (sel) {
            skin.img.skin = "remote/daytask/bt_s.png";
            skin.lab.color = "#ffffff";
            skin.lab.strokeColor = "#bb5c00";
        } else {
            skin.img.skin = "remote/daytask/bt_n.png";
            skin.lab.color = "#fdf3eb";
            skin.lab.strokeColor = "#91724e";
        }
    }

    protected onInit(): void {
        DayTaskModel.Ins.on(DayTaskModel.UPDATE_TASK, this, this.updateView);
        this.updateView();
        this.tabsCtl.selectIndex = 0;
        this.disposeHero();
        this._anim1 = FightFactory.createBigHeroAvatar(5, this._ui.sp,0,10);
    }

    protected onExit(): void {
        DayTaskModel.Ins.off(DayTaskModel.UPDATE_TASK, this, this.updateView);
        this.tabsCtl.selectIndex = -1;
        this.disposeHero();
    }

     private updateView(){
        this._ui.list.array = DayTaskModel.Ins.activationRewards;
        this._ui.list1.array = TowerMainModel.Ins.sortList(DayTaskModel.Ins.dailyTasks);
        this._ui.list2.array = TowerMainModel.Ins.sortList(DayTaskModel.Ins.achieveTasks);
        this._ui.icon.skin = IconUtils.getIconByCfgId(ECellType.HYD);
        this._ui.lab1.text = DayTaskModel.Ins.activation + "";
        let need = t_Daily_Task_Reward.Ins.List[t_Daily_Task_Reward.Ins.List.length - 1].f_activation;
        if (DayTaskModel.Ins.activation >= need) {
            this._ui.pro.width = this._wid;
        } else {
            this._ui.pro.width = DayTaskModel.Ins.activation / need * this._wid;
        }
        this._ui.pro1.x = this._ui.pro.width - 25;

        if(DayTaskModel.Ins.isTabRedTip1()){
            this._ui.sp11.visible = true;
        }else{
            this._ui.sp11.visible = false;
        }
        if(DayTaskModel.Ins.isTabRedTip2()){
            this._ui.sp22.visible = true;
        }else{
            this._ui.sp22.visible = false;
        }
     }

     private disposeHero() {
        if (this._anim1) {
            this._anim1.dispose();
            this._anim1 = null;
        }
    }
}