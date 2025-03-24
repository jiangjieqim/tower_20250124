import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E, ScreenAdapter } from "../../../../G";
import { EMsgBoxType, EViewType } from "../../../../common/defines/EnumDefine";
import { SocketMgr } from "../../../../network/SocketMgr";
import { ActivityExchange_req, RoomMode_req, SpringFestivalDailyRecharge_req, SpringFestivalRank_req, SpringFestivalSignIn_req, stSpringFestivalRank } from "../../../../network/protocols/BaseProto";
import { EActivityID } from "../../activity/ActivityEnum";
import { ActivityModel } from "../../activity/ActivityModel";
import { DotManager } from "../../common/DotManager";
import { FunctionModel } from "../../funs/FunctionModel";
import { ValCtl } from "../../main/ctl/ValLisCtl";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { ItemSlotCtl } from "../../main/views/icon/SoltItemView";
import { ECellType } from "../../main/vos/ECellType";
import { NewYearModel } from "../model/NewYearModel";
import { t_Spring_Festival_2025_Config } from "../proxy/t_Spring_Festival_2025_Config";
import { t_Spring_Festival_2025_Daily_Recharge } from "../proxy/t_Spring_Festival_2025_Daily_Recharge";
import { t_Spring_Festival_2025_Daily_Recharge_Reward } from "../proxy/t_Spring_Festival_2025_Daily_Recharge_Reward";
import { t_Spring_Festival_2025_Shop } from "../proxy/t_Spring_Festival_2025_Shop";
import { NRankCtl } from "./NRankCtl";
import { NewYearItem } from "./NewYearItem";
import { NewYearItem1 } from "./NewYearItem1";
import { NewYearItem2 } from "./NewYearItem2";
import { NewYearItem3 } from "./NewYearItem3";

export class NewYearView extends ViewBase{
    private _ui:ui.views.newyear.ui_newyearViewUI;

    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;
    protected mMaskClick:boolean = false;

    private tabCtl:TabControl;
    private tabList: any;

    private tabCtl1:TabControl;
    private tabList1: any;

    private _timeCtl:TimeCtl;
    private _timeCtl1:TimeCtl;
    private _timeCtl2:TimeCtl;
    private _timeCtl3:TimeCtl;

    private _ctl1:NRankCtl;
    private _ctl2:NRankCtl;
    private _ctl3:NRankCtl;

    private _itemCtl1:ItemSlotCtl;
    private _itemCtl2:ItemSlotCtl;
    private _itemCtl3:ItemSlotCtl;
    private _proW;

    protected onAddLoadRes(): void {
        this.addAtlas('newyear.atlas');
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.newyear.ui_newyearViewUI();
            this.bindClose(this._ui.btn_close);

            this.btnList.push(
                ButtonCtl.Create(this._ui.btn_tip,new Laya.Handler(this,this.onBtnTipClick)),
                ButtonCtl.Create(this._ui.btnadd,new Laya.Handler(this,this.onBtnAddClick)),
                ButtonCtl.Create(this._ui.btn,new Laya.Handler(this,this.onBtnClick)),
                ButtonCtl.Create(this._ui.btn1,new Laya.Handler(this,this.onBtnClick1)),
                ButtonCtl.Create(this._ui.btn_add, new Laya.Handler(this, this.onBtn_AddClick))
            )

            ValCtl.Create(this._ui.money.lab,this._ui.money.icon,ECellType.NianShou,this._ui.money.sp,false);

            const tabsSkin = [this._ui.tab1,this._ui.tab2,this._ui.tab3,this._ui.tab4,this._ui.tab5];
            let st = E.getLang("newyeartab");
            this.tabList = st.split("-");
            this.tabCtl = new TabControl();
            this.tabCtl.init(tabsSkin, new Laya.Handler(this, this.onTabSelectHandler), new Laya.Handler(this, this.itemTabHandler));

            this._timeCtl = new TimeCtl(this._ui.lab);
            this._timeCtl1 = new TimeCtl(this._ui.lab3);
            this._timeCtl2 = new TimeCtl(this._ui.lab4);
            this._timeCtl3 = new TimeCtl(this._ui.lab9);

            this._ctl1 = new NRankCtl(this._ui.view1);
            this._ctl2 = new NRankCtl(this._ui.view2);
            this._ctl3 = new NRankCtl(this._ui.view3);
            this._ui.list1.array = [];
            this._ui.list1.itemRender = NewYearItem;
            this._ui.list1.renderHandler = new Laya.Handler(this,this.onRenderHandler);

            this._ui.list.itemRender = NewYearItem1;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler1);

            const tabsSkin1 = [this._ui.tab6,this._ui.tab7];
            let st1 = E.getLang("newyeartab1");
            this.tabList1 = st1.split("-");
            this.tabCtl1 = new TabControl();
            this.tabCtl1.init(tabsSkin1, new Laya.Handler(this, this.onTabSelectHandler1), new Laya.Handler(this, this.itemTabHandler1));
            this._ui.list2.itemRender = NewYearItem2;
            this._ui.list2.renderHandler = new Laya.Handler(this,this.onRenderHandler2);
            this._itemCtl1 = new ItemSlotCtl(this._ui.view4);
            this._itemCtl2 = new ItemSlotCtl(this._ui.view5);
            this._itemCtl3 = new ItemSlotCtl(this._ui.view6);
            this._proW = this._ui.pro.width;
            this._ui.view4.on(Laya.Event.CLICK,this,this.onClick,[1]);
            this._ui.view5.on(Laya.Event.CLICK,this,this.onClick,[2]);
            this._ui.view6.on(Laya.Event.CLICK,this,this.onClick,[3]);

            this._ui.list3.itemRender = NewYearItem3;
            this._ui.list3.renderHandler = new Laya.Handler(this,this.onRenderHandler3);
        }
    }

    private itemTabHandler(tabSkin, index: number, sel: boolean, data){
        let skin: ui.views.newyear.ui_tabUI = tabSkin;
        skin.lab.text = this.tabList[index];
        skin.icon.skin = `remote/newyear/tab${index}.png`;
        if (sel) {
            skin.img.skin = "remote/newyear/btn_s_qgns.png";
            skin.lab.color = "#ffffff";
        } else {
            skin.img.skin = "remote/newyear/btn_n_qgns.png";
            skin.lab.color = "#ffcab7";
        }
    }

    private _sel:number;
    private onTabSelectHandler(v: number) {
        if (v == -1) return;
        if(v == 0 || v == 2 || v == 3){
            if(!NewYearModel.Ins.isOpen(true)){
                this.tabCtl.selectIndex = this._sel;
                return;
            }
        }
        this._sel = v;
        switch (v) {
            case 0:
                this._ui.bg.visible = true;
                this._ui.sp1.visible = true;
                this._ui.sp2.visible = false;
                this._ui.sp3.visible = false;
                this._ui.sp4.visible = false;
                this._ui.sp5.visible = false;
                break;
            case 1:
                this._ui.bg.visible = false;
                this._ui.sp1.visible = false;
                this._ui.sp2.visible = true;
                this._ui.sp3.visible = false;
                this._ui.sp4.visible = false;
                this._ui.sp5.visible = false;
                break;
            case 2:
                this._ui.bg.visible = false;
                this._ui.sp1.visible = false;
                this._ui.sp2.visible = false;
                this._ui.sp3.visible = true;
                this._ui.sp4.visible = false;
                this._ui.sp5.visible = false;
                break;
            case 3:
                this._ui.bg.visible = false;
                this._ui.sp1.visible = false;
                this._ui.sp2.visible = false;
                this._ui.sp3.visible = false;
                this._ui.sp4.visible = true;
                this._ui.sp5.visible = false;
                break;
            case 4:
                this._ui.bg.visible = false;
                this._ui.sp1.visible = false;
                this._ui.sp2.visible = false;
                this._ui.sp3.visible = false;
                this._ui.sp4.visible = false;
                this._ui.sp5.visible = true;
                break;
        }
    }

    private onBtnTipClick(){
        E.ViewMgr.openTipView("newyearT","newyearD");
    }

    //************************************************** */
    protected onInit(): void {
        this.setUI();
        NewYearModel.Ins.on(NewYearModel.UPDATE_VIEW,this,this.updataView1);
        NewYearModel.Ins.on(NewYearModel.UPDATE_RANK,this,this.updataView2);
        NewYearModel.Ins.on(NewYearModel.UPDATE_SIGN,this,this.updataView3);
        NewYearModel.Ins.on(NewYearModel.UPDATE_RECHARGE,this,this.updataView4);
        NewYearModel.Ins.on(NewYearModel.UPDATE_SHOP,this,this.updataView5);
        let req = new SpringFestivalRank_req;
        SocketMgr.Ins.SendMessageBin(req);
        this.updataView1();
        this.updataView3();
        this.tabCtl1.selectIndex = 0;
        this.updataView5();
        if(NewYearModel.Ins.isOpen()){
            this.tabCtl.selectIndex = 0;
        }else{
            this.tabCtl.selectIndex = 4;
        }
    }

    protected onExit(): void {
        NewYearModel.Ins.off(NewYearModel.UPDATE_VIEW,this,this.updataView1);
        NewYearModel.Ins.off(NewYearModel.UPDATE_RANK,this,this.updataView2);
        NewYearModel.Ins.off(NewYearModel.UPDATE_SIGN,this,this.updataView3);
        NewYearModel.Ins.off(NewYearModel.UPDATE_RECHARGE,this,this.updataView4);
        NewYearModel.Ins.off(NewYearModel.UPDATE_SHOP,this,this.updataView5);
        if(this._timeCtl){
            this._timeCtl.dispose();
            this._timeCtl = null;
        }
        if(this._timeCtl1){
            this._timeCtl1.dispose();
            this._timeCtl1 = null;
        }
        if(this._timeCtl2){
            this._timeCtl2.dispose();
            this._timeCtl2 = null;
        }
        if(this._timeCtl3){
            this._timeCtl3.dispose();
            this._timeCtl3 = null;
        }
    }

    //****************************************************************************** */
    private updataView1(){
        if(!NewYearModel.Ins.rankTime)return;
        let time = NewYearModel.Ins.rankTime.end - TimeUtil.serverTime;
        if (time > 0) {
            this._timeCtl.start(time, new Laya.Handler(this, this.onUpdateTime), new Laya.Handler(this, this.endTime));
        } else {
            this.endTime();
        }
        this._ui.lab1.text = NewYearModel.Ins.getNumById(1) + "/" + t_Spring_Festival_2025_Config.Ins.getValueById(1);
        if(NewYearModel.Ins.isRedTab1()){
            DotManager.addDot(this._ui.btn);
            DotManager.addDot(this._ui.tab1);
        }else{
            DotManager.removeDot(this._ui.btn);
            DotManager.removeDot(this._ui.tab1);
        }
    }

    private onUpdateTime() {
        let time_str = TimeUtil.subTimeCC(this._timeCtl.tickVal);
        this._timeCtl.setText(time_str);
    }

    private endTime() {
        this._timeCtl.setText("已结束");
    }

    private onBtnAddClick(){
        let num = NewYearModel.Ins.getNumById(1);
        let num1 = t_Spring_Festival_2025_Config.Ins.getValueById(1);
        if(num >= parseInt(num1)){
            E.ViewMgr.ShowMidError("次数已满");
            return;
        }
        let arr = t_Spring_Festival_2025_Config.Ins.getValueById(3).split("|");
        let n = NewYearModel.Ins.getNumById(2);
        let st = E.getLang("newyearlab",arr[n].split("-")[1]);
        E.ViewMgr.ShowMsgBox(EMsgBoxType.OkOrCancel,st,new Laya.Handler(this, this.sendCmd));
    }

    private sendCmd(){
        let req = new ActivityExchange_req;
        req.activityId = EActivityID.Newyear;
        req.cnt = 1;
        SocketMgr.Ins.SendMessageBin(req);
    }

    private onBtnClick(){
        let num = NewYearModel.Ins.getNumById(1);
        if(num <= 0){
            E.ViewMgr.ShowMidError("次数不足");
            return;
        }
        E.ViewMgr.Open(EViewType.NewYearView1);
    }

    private onBtn_AddClick(){
        if (this._ui.input.text == "") {
            E.ViewMgr.ShowMidError("输入房间号");
            return;
        }
        let req = new RoomMode_req;
        req.roomSn = this._ui.input.text;
        SocketMgr.Ins.SendMessageBin(req);
    }

    //************************************************************************************** */
    private updataView2(){
        let arr = NewYearModel.Ins.rankList.sort(this.onSort);
        for (let i: number = 0; i < 3; i++) {
            if (arr[i]) {
                this._ui["view" + (i + 1)].visible = true;
                this["_ctl" + (i + 1)].setData(arr[i]);
            } else {
                this._ui["view" + (i + 1)].visible = false;
            }
        }
        let array = [];
        for (let i: number = 0; i<arr.length; i++) {
            if(i > 2){
                array.push(arr[i]);
            }
        }
        this._ui.list1.array = array;
    }

    private onSort(a:stSpringFestivalRank,b:stSpringFestivalRank){
        return a.rank - b.rank;
    }

    private onRenderHandler(item:NewYearItem){
        item.setData(item.dataSource);
    }

    //************************************************************************************** */
    private updataView3(){
        if(!NewYearModel.Ins.rankTime)return;
        let time = NewYearModel.Ins.rankTime.end - TimeUtil.serverTime;
        if (time > 0) {
            this._timeCtl1.start(time, new Laya.Handler(this, this.onUpdateTime1), new Laya.Handler(this, this.endTime1));
        } else {
            this.endTime1();
        }

        this._ui.list.array = NewYearModel.Ins.signInList;
        if(NewYearModel.Ins.isSign()){
            this._ui.btn1.disabled = false;
            this._ui.lab2.text = "签到";
        }else{
            this._ui.btn1.disabled = true;
            this._ui.lab2.text = "已签到";
        }
        if(NewYearModel.Ins.isRedTab3()){
            DotManager.addDot(this._ui.btn1);
            DotManager.addDot(this._ui.tab3);
        }else{
            DotManager.removeDot(this._ui.btn1);
            DotManager.removeDot(this._ui.tab3);
        }
    }

    private onUpdateTime1() {
        let time_str = TimeUtil.subTimeCC(this._timeCtl1.tickVal);
        this._timeCtl1.setText(time_str);
    }

    private endTime1() {
        this._timeCtl1.setText("已结束");
    }

    private onRenderHandler1(item:NewYearItem1){
        item.setData(item.dataSource);
    }

    private onBtnClick1(){
        let id = 0;
        for(let i:number=0;i<NewYearModel.Ins.signInList.length;i++){
            if(NewYearModel.Ins.signInList[i].state == 3){
                id = NewYearModel.Ins.signInList[i].id;
                break;
            }
        }
        if(id){
            let req = new SpringFestivalSignIn_req;
            req.id = id;
            SocketMgr.Ins.SendMessageBin(req);
        }
    }

    //************************************************************************************** */
    private updataView4(){
        if(!NewYearModel.Ins.rankTime)return;
        let time = NewYearModel.Ins.rankTime.end - TimeUtil.serverTime;
        if (time > 0) {
            this._timeCtl2.start(time, new Laya.Handler(this, this.onUpdateTime2), new Laya.Handler(this, this.endTime2));
        } else {
            this.endTime2();
        }

        let num = 0;
        for(let i:number=0;i<NewYearModel.Ins.dailyRechargeList.length;i++){
            let cfg = t_Spring_Festival_2025_Daily_Recharge.Ins.GetDataById(NewYearModel.Ins.dailyRechargeList[i].id);
            if(cfg.f_gear == this.tabCtl1.selectIndex + 1){
                num = NewYearModel.Ins.dailyRechargeList[i].val;
                break;
            }
        }
        this._ui.lab5.text = num + "";
        let arr = t_Spring_Festival_2025_Daily_Recharge_Reward.Ins.getListByGear(this.tabCtl1.selectIndex + 1);
        for(let i:number=0;i<arr.length;i++){
            this._ui["lab" + (6+i)].text = arr[i].f_day + "天";
            this["_itemCtl" + ( i + 1)].setData(ItemViewFactory.convertItem(arr[i].f_reward),false);
            let data = NewYearModel.Ins.dailyRechargeSumList.find(ele => ele.id == arr[i].f_id);
            DotManager.removeDot(this._ui["view" + (4 + i)]);
            if(data.status == 0){
                this._ui["m" + (4+i)].visible = false;
            }else if(data.status == 1){
                DotManager.addDot(this._ui["view" + (4 + i)]);
                this._ui["m" + (4+i)].visible = false;
            }else if(data.status == 2){
                this._ui["m" + (4+i)].visible = true;
            }
        }

        if(num >= parseInt(arr[arr.length - 1].f_day)){
            this._ui.pro.width = this._proW;
        }else{
            let cnt = 0;
            for(let i:number=0;i<arr.length;i++){
                if(num >= parseInt(arr[i].f_day)){
                    cnt++;
                }
            }
            let num1 = 1 / 3;
            if(cnt == 0){
                this._ui.pro.width = num / parseInt(arr[0].f_day) * num1 * this._proW;
            }else{
                let n = cnt * num1;
                let nn = (num - parseInt(arr[cnt - 1].f_day) ) / (parseInt(arr[cnt].f_day) - parseInt(arr[cnt - 1].f_day)) * num1;
                this._ui.pro.width = (n + nn) * this._proW;
            }
        }

        let list = t_Spring_Festival_2025_Daily_Recharge.Ins.getListByGear(this.tabCtl1.selectIndex + 1);
        let list1 = [];
        let list2 = [];
        let list3 = [];
        for(let i:number=0;i<list.length;i++){
            let data = NewYearModel.Ins.dailyRechargeList.find(ele => ele.id == list[i].f_id);
            if(data.status == 0){
                list2.push(list[i]);
            }else if(data.status == 1){
                list1.push(list[i]);
            }else if(data.status == 2){
                list3.push(list[i]);
            }
        }
        this._ui.list2.array = list1.concat(list2).concat(list3);

        let bo = false;
        let bo1 = false;
        for(let i:number=0;i<NewYearModel.Ins.dailyRechargeList.length;i++){
            let status = NewYearModel.Ins.dailyRechargeList[i].status;
            if(status == 1){
                let cfg = t_Spring_Festival_2025_Daily_Recharge.Ins.GetDataById(NewYearModel.Ins.dailyRechargeList[i].id);
                if(cfg.f_gear == 1){
                    bo = true;
                }else if(cfg.f_gear == 2){
                    bo1 = true;
                }
            }
        }
        for(let i:number=0;i<NewYearModel.Ins.dailyRechargeSumList.length;i++){
            let status = NewYearModel.Ins.dailyRechargeSumList[i].status;
            if(status == 1){
                let cfg = t_Spring_Festival_2025_Daily_Recharge_Reward.Ins.GetDataById(NewYearModel.Ins.dailyRechargeSumList[i].id);
                if(cfg.f_gear == 1){
                    bo = true;
                }else if(cfg.f_gear == 2){
                    bo1 = true;
                }
            }
        }
        if(bo){
            DotManager.addDot(this._ui.tab6);
        }else{
            DotManager.removeDot(this._ui.tab6);
        }
        if(bo1){
            DotManager.addDot(this._ui.tab7);
        }else{
            DotManager.removeDot(this._ui.tab7);
        }
        if(NewYearModel.Ins.isRedTab4()){
            DotManager.addDot(this._ui.tab4);
        }else{
            DotManager.removeDot(this._ui.tab4);
        }
    }

    private onUpdateTime2() {
        let time_str = TimeUtil.subTimeCC(this._timeCtl2.tickVal);
        this._timeCtl2.setText(time_str);
    }

    private endTime2() {
        this._timeCtl2.setText("已结束");
    }

    private itemTabHandler1(tabSkin, index: number, sel: boolean, data){
        let skin: ui.views.newyear.ui_tab1UI = tabSkin;
        skin.lab.text = this.tabList1[index];
        if (sel) {
            skin.img.skin = "remote/newyear/btn_yx_s.png";
            skin.lab.color = "#ffffff";
            skin.lab.strokeColor = "#b33417";
        } else {
            skin.img.skin = "remote/newyear/btn_yx_n.png";
            skin.lab.color = "#ffe2de";
            skin.lab.strokeColor = "#794741";
        }
    }

    private onTabSelectHandler1(v: number) {
        if (v == -1) return;
        this.updataView4();
    }

    private onRenderHandler2(item:NewYearItem2){
        item.setData(item.dataSource);
    }

    private onClick(index){
        let fid = this.tabCtl1.selectIndex * 3 + index;
        let data = NewYearModel.Ins.dailyRechargeSumList.find(ele => ele.id == fid);
        if(data.status == 1){
            let req = new SpringFestivalDailyRecharge_req;
            req.flag = 1;
            req.id = fid;
            SocketMgr.Ins.SendMessageBin(req);
        }else{
            let view = this._ui["view" + (3 + index)];
            let cfg = t_Spring_Festival_2025_Daily_Recharge_Reward.Ins.GetDataById(fid);
            FunctionModel.Ins.showItemTip(ItemViewFactory.convertItem(cfg.f_reward),view);
        }
    }

    //************************************************************************************** */
    private updataView5(){
        let data = ActivityModel.Ins.getActivityStatusData(EActivityID.Newyear);
        if(!data)return;
        let time = data.endtime - TimeUtil.serverTime;
        if (time > 0) {
            this._timeCtl3.start(time, new Laya.Handler(this, this.onUpdateTime3), new Laya.Handler(this, this.endTime3));
        } else {
            this.endTime3();
        }

        this._ui.list3.array = t_Spring_Festival_2025_Shop.Ins.List;
    }

    private onUpdateTime3() {
        let time_str = TimeUtil.subTimeCC(this._timeCtl3.tickVal);
        this._timeCtl3.setText(time_str);
    }

    private endTime3() {
        this._timeCtl3.setText("已结束");
    }

    private onRenderHandler3(item:NewYearItem3){
        item.setData(item.dataSource);
    }

    //********************************************** */
    private setUI() {
        let yy = (Laya.stage.height - ScreenAdapter.DefaultHeight);
        if (yy > 0) {
            this._ui.height += yy;

            this._ui.sp1.y += yy*0.5;

            this._ui.bg1.height += yy;
            this._ui.bg2.height += yy;
            this._ui.sp11.y += yy;
            
            this._ui.money.y += yy*0.5;
            this._ui.img_bg2.y += yy;
            this._ui.img_bg3.y += yy;

            this._ui.bg3.height += yy;
            this._ui.bg4.height += yy;
            this._ui.list1.height += yy;

            this._ui.bg5.height += yy;
            this._ui.bg6.height += yy;
            this._ui.list2.height += yy;
            this._ui.sp22.y += yy;

            this._ui.bg7.height += yy;
            this._ui.bg8.height += yy;
            this._ui.list3.height += yy;
        }
    }

}