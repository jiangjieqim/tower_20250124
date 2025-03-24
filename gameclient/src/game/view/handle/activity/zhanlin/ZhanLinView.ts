// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
// import { TabControl } from "../../../../../frame/view/TabControl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { EViewType } from "../../../../common/defines/EnumDefine";
import { E } from "../../../../G";
import { BattlePassBuyExp_req } from "../../../../network/protocols/BaseProto";
import { SocketMgr } from "../../../../network/SocketMgr";
import { DotManager } from "../../common/DotManager";
import { EBuyType, IShopBuyItem } from "../../common/ShopBuyView";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { MainModel } from "../../main/model/MainModel";
import { TowerMainModel } from "../../towertmain/model/TowerMainModel";
import { t_Recharge } from "../../towertmainshop/proxy/t_Recharge";
import { EActivityID } from "../ActivityEnum";
import { ActivityModel } from "../ActivityModel";
import { t_Battle_Pass } from "./t_Battle_Pass";
import { t_Battle_Pass_Task } from "./t_Battle_Pass_Task";
import { t_Competition_Season } from "./t_Competition_Season";
import { ZhanLinItem } from "./ZhanLinItem";
import { ZhanLinItem1 } from "./ZhanLinItem1";
import { ZhanLinModel } from "./ZhanLinModel";

export class ZhanLinView extends ViewBase{
    private _ui:ui.views.zhanlin.ui_zhanlinViewUI;
    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private tabsCtl:TabControl;
    private tabList: any;
    private _timeCtl:TimeCtl;
    private tabsCtl1:TabControl;
    private tabList1: any;

    private _proW:number;

    protected onAddLoadRes() {
        this.addAtlas('zhanlin.atlas');
    }

    protected onFirstInit() {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.zhanlin.ui_zhanlinViewUI();
            this.bindClose(this._ui.btn_close);
            this.btnList.push(
                ButtonCtl.Create(this._ui.btn,new Laya.Handler(this,this.onBtnClick)),
                ButtonCtl.Create(this._ui.btn1,new Laya.Handler(this,this.onBtn1Click)),
                ButtonCtl.Create(this._ui.btn2,new Laya.Handler(this,this.onBtn2Click)),
                ButtonCtl.Create(this._ui.btn3,new Laya.Handler(this,this.onBtn3Click))
            )

            this._proW = this._ui.pro.width;
            this._timeCtl = new TimeCtl(this._ui.lab_time);

            const tabsSkin = [this._ui.tab_1, this._ui.tab_2];
            let st = E.getLang("zhanlinTab");
            this.tabList = st.split("-");
            this.tabsCtl = new TabControl();
            this.tabsCtl.init(tabsSkin, new Laya.Handler(this, this.onTabSelectHandler), new Laya.Handler(this, this.itemTabHandler));

            const tabsSkin1 = [this._ui.tab1, this._ui.tab2,this._ui.tab3];
            let st1 = E.getLang("zhanlinTab1");
            this.tabList1 = st1.split("-");
            this.tabsCtl1 = new TabControl();
            this.tabsCtl1.init(tabsSkin1, new Laya.Handler(this, this.onTabSelectHandler1), new Laya.Handler(this, this.itemTabHandler1));

            this._ui.list.itemRender = ZhanLinItem;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);

            this._ui.list1.itemRender = ZhanLinItem1;
            this._ui.list1.renderHandler = new Laya.Handler(this,this.onRenderHandler1);
        }
    }

    private onRenderHandler1(item:ZhanLinItem1){
        item.setData(item.dataSource,this.tabsCtl1.selectIndex + 1);
    }

    private onRenderHandler(item:ZhanLinItem,index:number){
        item.setData(item.dataSource,index);
    }

    private onBtn1Click(){
        ActivityModel.Ins.sendCmd(EActivityID.ZhanLin,0);
    }

    private onBtn2Click(){
        E.ViewMgr.Open(EViewType.ZhanLinView1);
    }

    private onBtn3Click(){
        let sel = this.tabsCtl1.selectIndex + 1;
        ActivityModel.Ins.sendCmd(EActivityID.ZhanLin,0,sel.toString());
    }

    private onBtnClick(){
        let cfg = t_Competition_Season.Ins.getCfgBySeason(MainModel.Ins.season);
        let vo = ItemViewFactory.convertItem(cfg.f_exp_price);
        let vo1 = ItemViewFactory.convertItem(cfg.f_exp_reward);
        TowerMainModel.Ins.buyItem(vo, vo1, new Laya.Handler(this, this.onBuyClick), EBuyType.Item,
        false,null,new Laya.Handler(this,this.getMaxNum));
    }

    private onBuyClick(value:IShopBuyItem,selCount:number){
        let req = new BattlePassBuyExp_req;
        req.num = selCount;
        SocketMgr.Ins.SendMessageBin(req);
    }

    private getMaxNum(){
        let max = t_Battle_Pass.Ins.getMaxBySeason(MainModel.Ins.season);
        return max - ZhanLinModel.Ins.lv;
    }

    private onTabSelectHandler1(v: number) {
        if(v == -1)return;
        this.updateView2();
    }

    private itemTabHandler1(tabSkin, index: number, sel: boolean, data){
        let skin: ui.views.zhanlin.ui_tabUI = tabSkin;
        skin.lab.text = this.tabList1[index];
        if (sel) {
            skin.img.skin = "remote/zhanlin/btn_s1.png";
            skin.lab.color = "#ffe84f";
        } else {
            skin.img.skin = "remote/zhanlin/btn_n1.png";
            skin.lab.color = "#ffffff";
        }
    }

    private onTabSelectHandler(v: number) {
        if(v == -1)return;
        if(v == 0){
            this._ui.sp1.visible = true;
            this._ui.sp2.visible = false;
        }else{
            this._ui.sp1.visible = false;
            this._ui.sp2.visible = true;
        }
    }

    private itemTabHandler(tabSkin, index: number, sel: boolean, data){
        let skin: ui.views.zhanlin.ui_tab1UI = tabSkin;
        skin.lab.text = this.tabList[index];
        if(index == 0){
            skin.lab.x = 56;
            if (sel) {
                skin.img.skin = `remote/zhanlin/btn_s.png`;
            }else{
                skin.img.skin = `remote/zhanlin/btn_s2.png`;
            }
        }else{
            skin.lab.x = 35;
            if (sel) {
                skin.img.skin = `remote/zhanlin/btn_n2.png`;
            }else{
                skin.img.skin = `remote/zhanlin/btn_n.png`;
            }
        }

        if (sel) {
            skin.lab.color = "#ffffff";
            skin.lab.strokeColor = "#bd4c00";
        } else {
            skin.lab.color = "#edd7b1";
            skin.lab.strokeColor = "#631500";
        }
    }

    protected onInit(): void {
        ZhanLinModel.Ins.on(ZhanLinModel.UPDATE_DATA,this,this.onUpdateView);
        ActivityModel.Ins.on(ActivityModel.UPDATE_DATA,this,this.onUpdateView);
        this.tabsCtl.selectIndex = 0;
        this.updateView();
        this.updateView1();
        this.tabsCtl1.selectIndex = 0;
    }

    protected onExit(): void {
        ZhanLinModel.Ins.off(ZhanLinModel.UPDATE_DATA,this,this.onUpdateView);
        ActivityModel.Ins.off(ActivityModel.UPDATE_DATA,this,this.onUpdateView);
        this.tabsCtl.selectIndex = -1;
        this.tabsCtl1.selectIndex = -1;
        if(this._timeCtl){
            this._timeCtl.dispose();
            this._timeCtl = null;
        }
    }

    private onUpdateView(){
        this.updateView();
        this.updateView1();
        this.updateView2();
    }

    private onUpdateTime() {
        let time_str = TimeUtil.subTime(this._timeCtl.tickVal);
        this._timeCtl.setText(time_str);
    }

    private endTime() {
        this._timeCtl.setText("00:00:00");
    }

    private updateView(){
        let data = ActivityModel.Ins.getActivityStatusData(EActivityID.ZhanLin);
        if(!data)return;
        let time = data.endtime - TimeUtil.serverTime;
        if (time > 0) {
            this._ui.img_bg.visible = true;
            this._timeCtl.start(time, new Laya.Handler(this, this.onUpdateTime), new Laya.Handler(this, this.endTime));
        } else {
            this._ui.img_bg.visible = false;
            this._timeCtl.stop();
        }

        this._ui.lab_lv.text = "lv:" + ZhanLinModel.Ins.lv;
        let max = t_Battle_Pass.Ins.getMaxBySeason(MainModel.Ins.season);
        if(ZhanLinModel.Ins.lv >= max){
            this._ui.pro.width = this._proW;
            this._ui.lab_mj.visible = true;
            this._ui.lab_pro.visible = false;
            this._ui.btn.disabled = true;
        }else{
            let cfg = t_Battle_Pass.Ins.getCfgBySeason(MainModel.Ins.season,ZhanLinModel.Ins.lv);
            let exp = cfg.f_exp;
            this._ui.pro.width = ZhanLinModel.Ins.exp / exp * this._proW;
            this._ui.lab_mj.visible = false;
            this._ui.lab_pro.visible = true;
            this._ui.lab_pro.text = ZhanLinModel.Ins.exp + "/" + exp;
            this._ui.btn.disabled = false;
        }

        if(ZhanLinModel.Ins.isRedTip1()){
            DotManager.addDot(this._ui.tab_1);
        }else{
            DotManager.removeDot(this._ui.tab_1);
        }
        if(ZhanLinModel.Ins.isRedTip2()){
            DotManager.addDot(this._ui.tab_2);
        }else{
            DotManager.removeDot(this._ui.tab_2);
        }
    }

    private updateView1(){
        let data = ActivityModel.Ins.getActivityData(EActivityID.ZhanLin);
        if(!data)return;
        let arr = t_Battle_Pass.Ins.getListBySeason(MainModel.Ins.season);
        this._ui.list.array = arr;
        for(let i:number=0;i<arr.length;i++){
            if(ZhanLinModel.Ins.lv == arr[i].f_level){
                this._ui.list.scrollTo(i);
            }
        }

        DotManager.removeDot(this._ui.btn1);
        if(ZhanLinModel.Ins.isRedTip1()){
            this._ui.btn1.disabled = false;
            DotManager.addDot(this._ui.btn1);
        }else{
            this._ui.btn1.disabled = true;
        }

        if(ZhanLinModel.Ins.isChongZhi()){
            this._ui.img_lv.visible = false;
            this._ui.btn2.mouseEnabled = false;
            this._ui.lab.text = "已解锁";
        }else{
            this._ui.img_lv.visible = true;
            this._ui.btn2.mouseEnabled = true;
            let cfg = t_Competition_Season.Ins.getCfgBySeason(MainModel.Ins.season);
            let pCfg = t_Recharge.Ins.getCfgById(cfg.f_recharge_id);
            this._ui.lab.text = StringUtil.moneyCv(pCfg.f_price) + "元";
        }
    }

    private updateView2(){
        let arr = ZhanLinModel.Ins.taskList;
        if(!arr)return;
        let array = [];
        for(let i:number=0;i<arr.length;i++){
            let cfg = t_Battle_Pass_Task.Ins.getCfgById(arr[i].id);
            if(cfg.f_task_type == this.tabsCtl1.selectIndex + 1){
                array.push(arr[i]);
            }
        }
        array = TowerMainModel.Ins.sortList(array);
        this._ui.list1.array = array;

        DotManager.removeDot(this._ui.btn3);
        if(ZhanLinModel.Ins.isRedTip2(this.tabsCtl1.selectIndex + 1)){
            this._ui.btn3.disabled = false;
            DotManager.addDot(this._ui.btn3);
        }else{
            this._ui.btn3.disabled = true;
        }
        
        if(ZhanLinModel.Ins.isRedTip2(1)){
            DotManager.addDot(this._ui.tab1);
        }else{
            DotManager.removeDot(this._ui.tab1);
        }
        if(ZhanLinModel.Ins.isRedTip2(2)){
            DotManager.addDot(this._ui.tab2);
        }else{
            DotManager.removeDot(this._ui.tab2);
        }
        if(ZhanLinModel.Ins.isRedTip2(3)){
            DotManager.addDot(this._ui.tab3);
        }else{
            DotManager.removeDot(this._ui.tab3);
        }
    }
}