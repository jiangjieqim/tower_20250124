import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { SocketMgr } from "../../../../network/SocketMgr";
import { OnlineSec_req } from "../../../../network/protocols/BaseProto";
import { EActivityID, EActivityStatus } from "../../activity/ActivityEnum";
import { ActivityModel } from "../../activity/ActivityModel";
import { NoContainerSimpleEffect } from "../../avatar/NoContainerSimpleEffect";
import { SpineEffectMgr } from "../../avatar/SpineEffectMgr";
import { DotManager } from "../../common/DotManager";
import { FunctionModel } from "../../funs/FunctionModel";
import { FuncProxy } from "../../funs/proxy/FunctionProxy";
import { EFuncDef } from "../../main/model/EFuncDef";
import { IconUtils } from "../../main/model/IconUtils";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { ItemVo } from "../../main/vos/ItemVo";
import { FuLiModel } from "../model/FuLiModel";
import { t_Activity_Daily_Login } from "../proxy/t_Activity_Daily_Login";
import { t_Activity_Daily_Online } from "../proxy/t_Activity_Daily_Online";
import { t_Activity_Daily_OwnRewards } from "../proxy/t_Activity_Daily_OwnRewards";
import { t_Activity_Daily_Power } from "../proxy/t_Activity_Daily_Power";
import { FuLiItem1 } from "./FuLiItem1";
import { FuLiItem2 } from "./FuLiItem2";
import { TabItem } from "./TabItem";

export class FuLiView extends ViewBase{
    private _ui:ui.views.fuli.ui_fuliViewUI;

    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private effect1:NoContainerSimpleEffect;
    private effect2:NoContainerSimpleEffect;

    private _selectList:number[];

    protected onAddLoadRes(): void {
        this.addAtlas('fuli.atlas');
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.fuli.ui_fuliViewUI();
            this.bindClose(this._ui.btn_close);

            this.btnList.push(
                ButtonCtl.Create(this._ui.btn,new Laya.Handler(this,this.onBtnClick)),
                ButtonCtl.Create(this._ui.btn1,new Laya.Handler(this,this.onBtnClick1)),
                ButtonCtl.Create(this._ui.btn2,new Laya.Handler(this,this.onBtnClick2))
            )

            this._ui.sp_click1.on(Laya.Event.CLICK,this,this.onClick1);
            this._ui.sp_click2.on(Laya.Event.CLICK,this,this.onClick2);

            this._ui.list_tab.itemRender = TabItem;
            this._ui.list_tab.renderHandler = new Laya.Handler(this,this.onTabRenderHandler);
            this._ui.list_tab.selectHandler = new Laya.Handler(this,this.onTabSelectHandler);
            this._ui.list_tab.selectEnable = true;

            this._ui.list.itemRender = ui.views.fuli.ui_fuliItemUI;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);
            this._ui.list.selectEnable = true;
            this._ui.list.selectHandler = new Laya.Handler(this,this.onSelectHandler);
            this._ui.list1.itemRender = FuLiItem1;
            this._ui.list1.renderHandler = new Laya.Handler(this,this.onRenderHandler1);
            this._ui.list2.itemRender = FuLiItem2;
            this._ui.list2.renderHandler = new Laya.Handler(this,this.onRenderHandler2);
        }
    }

    private onClick1(){
        this.ptSendCmd(1);
    }

    private onClick2(){
        this.ptSendCmd(2);
    }

    private ptSendCmd(id){
        let data = ActivityModel.Ins.getActivityData(EActivityID.PTShengYan);
        if(!data)return;

        let obj = data.datalist.find(ele=>ele.id == id);
        if(obj){
            let status = obj.param1;
            if(status == EActivityStatus.Claimable){
                ActivityModel.Ins.sendCmd(EActivityID.PTShengYan,id);
            }
        }
    }

    private onBtnClick(){
        if(this._selectList.length < 3){
            E.ViewMgr.ShowMidError(E.getLang("fuli4"));
            return;
        }
        let st = this._selectList.join("|");
        ActivityModel.Ins.sendCmd(EActivityID.XWFenLu,0,st);
    }

    private onBtnClick1(){
        this.sendCmd(1);
    }

    private onBtnClick2(){
        this.sendCmd(2);
    }

    private sendCmd(id){
        let cfg:Configs.t_Activity_Daily_Power_dat = t_Activity_Daily_Power.Ins.GetDataById(id);
        let vo:ItemVo = ItemViewFactory.convertItem(cfg.f_reward);
        let vo1 = ItemViewFactory.convertItem(cfg.f_price);
        E.ViewMgr.showMsgBoxView(vo,vo1,new Laya.Handler(this,()=>{
            ActivityModel.Ins.sendCmd(EActivityID.PTShengYan,cfg.f_id);
        }));
    }

    private onSelectHandler(v:number){
        if(v == -1)return;
        if(this._isLinQu)return;
        let index = this._selectList.indexOf(this._ui.list.selectedItem.f_id);
        if(index != -1){
            this._selectList.splice(index,1);
        }else{
            if(this._selectList.length >= 3){
                E.ViewMgr.ShowMidError(E.getLang("fuli3"));
                return;
            }else{
                this._selectList.push(this._ui.list.selectedItem.f_id);
            }
        }
        this._ui.lab.text = this._selectList.length + "";
        this._ui.list.selectedIndex = -1;
    }

    private onRenderHandler(item:ui.views.fuli.ui_fuliItemUI){
        let data = ActivityModel.Ins.getActivityData(EActivityID.XWFenLu);
        if(!data)return;
        ItemViewFactory.renderItemSlots(item.sp,item.dataSource.f_reward,true,10,1,"left");
        let status = data.datalist.find(ele=>ele.id == item.dataSource.f_id).param1;
        if (status == EActivityStatus.Claimable) {
            let index = this._selectList.indexOf(item.dataSource.f_id);
                if (index != -1) {
                    item.img.visible = item.img1.visible = item.lab1.visible = true;
                    item.lab.visible = false;
                }else{
                    item.img.visible = item.img1.visible = item.lab1.visible = false;
                    item.lab.visible = true;
                }
        }else if(status == EActivityStatus.Claimed){
            item.img.visible = item.img1.visible = item.lab1.visible = true;
            item.lab.visible = false;
        }else{
            item.img.visible = item.img1.visible = item.lab1.visible = false;
            item.lab.visible = true;
        }
    }

    private onRenderHandler1(item:FuLiItem1){
        item.setData(item.dataSource);
    }
    
    private onRenderHandler2(item:FuLiItem2){
        item.setData(item.dataSource);
    }

    private onTabSelectHandler(index:number){
        this._ui.sp1.visible = this._ui.sp2.visible = this._ui.sp3.visible = this._ui.sp4.visible = false;
        switch(this._ui.list_tab.selectedItem){
            case EFuncDef.DLHaoLi:
                this._ui.sp3.visible = true;
                break;
            case EFuncDef.ZXHaoLi:
                this._ui.sp2.visible = true;
                break;
            case EFuncDef.PTShengYan:
                this._ui.sp4.visible = true;
                break;
            case EFuncDef.XWFenLu:
                this._ui.sp1.visible = true;
                break;  
        }
    }

    private onTabRenderHandler(item:TabItem,index:number){
        item.setData(item.dataSource);
        if(index == this._ui.list_tab.selectedIndex){
            item.lab.color = "#fff889";
            item.lab.strokeColor = "#9d3700";
            item.sp.visible = true;
        }else{
            item.lab.color = "#fee6d3";
            item.lab.strokeColor = "#592711";
            item.sp.visible = false;
        }
    }

    protected onInit(): void {
        ActivityModel.Ins.on(ActivityModel.UPDATE_DATA,this,this.updateView);
        FuLiModel.Ins.on(FuLiModel.UPDATE_OnlineSec,this,this.onUpdateSec);
        let req = new OnlineSec_req;
        SocketMgr.Ins.SendMessageBin(req);

        this.effect1 = SpineEffectMgr.createLoopNoSimpleEffect(`o/spine/succeed/taozi/taozi`, this._ui.tz1,0,-20);
        this.effect2 = SpineEffectMgr.createLoopNoSimpleEffect(`o/spine/succeed/taozi/taozi`, this._ui.tz2,0,-20);

        this._selectList = [];
        this._ui.lab.text = "0";
        this.updateView();

        let cfg = FuncProxy.Ins.getCfgByFuncId(EFuncDef.FuLi);
        let arr = cfg.t_tab_func.split("-");
        let tabArr = [];
        for(let i:number=0;i<arr.length;i++){
            if(FunctionModel.Ins.isOpenByFuncId(parseInt(arr[i]),false)){
                tabArr.push(parseInt(arr[i]));
            }
        }
        this._ui.list_tab.array = tabArr;
        this._ui.list_tab.selectedIndex = 0;
    }

    protected onExit(): void {
        ActivityModel.Ins.off(ActivityModel.UPDATE_DATA,this,this.updateView);
        FuLiModel.Ins.off(FuLiModel.UPDATE_OnlineSec,this,this.onUpdateSec);
        Laya.timer.clear(this,this.updateSec);
        if(this.effect1){
            this.effect1.dispose();
            this.effect1 = null;
        }
        if(this.effect2){
            this.effect2.dispose();
            this.effect2 = null;
        }
    }

    private updateView(){
        this.updateView1();
        this.updateView2();
        this.updateView3();
        this.updateView4();
    }

    private _isLinQu:boolean;
    private updateView1(){
        let data = ActivityModel.Ins.getActivityData(EActivityID.XWFenLu);
        if(!data)return;
        this._ui.list.array = t_Activity_Daily_OwnRewards.Ins.List;

        this._isLinQu = false;
        for(let i:number=0;i<data.datalist.length;i++){
            if(data.datalist[i].param1 == EActivityStatus.Claimed){
                this._isLinQu = true;
                break;
            }
        }
        if(this._isLinQu){
            this._ui.btn.disabled = true;
            this._ui.lab4.text = "已领取";
            this._ui.lab.text = "3";
            DotManager.removeDot(this._ui.btn);
        }else{
            this._ui.btn.disabled = false;
            this._ui.lab4.text = "领取";
            this._ui.lab.text = this._selectList.length + "";
            DotManager.addDot(this._ui.btn);
        }
    }

    private updateView2(){
        let data = ActivityModel.Ins.getActivityData(EActivityID.ZXHaoLi);
        if(!data)return;
        let arr = t_Activity_Daily_Online.Ins.List;
        let arr1 = [];
        let arr2 = [];
        let arr3 = [];
        for(let i:number=0;i<arr.length;i++){
            let status = data.datalist.find(ele=>ele.id == arr[i].f_id).param1;
            if(status == EActivityStatus.Claimable){
                arr1.push(arr[i]);
            }else if(status == EActivityStatus.unclaimable){
                arr2.push(arr[i]);
            }else{
                arr3.push(arr[i]);
            }
        }
        this._ui.list1.array = arr1.concat(arr2).concat(arr3);
    }

    private _num;
    private onUpdateSec(){
        this._num = FuLiModel.Ins.onlineSec;
        this.updateSec();
    }

    private updateSec(){
        this._ui.lab_time.text = TimeUtil.subTime(this._num);
        this._num++;
        Laya.timer.once(1000,this,this.updateSec);
    }

    private updateView3(){
        let data = ActivityModel.Ins.getActivityData(EActivityID.DLHaoLi);
        if(!data)return;
        let arr = t_Activity_Daily_Login.Ins.List;
        let arr1 = [];
        let arr2 = [];
        let arr3 = [];
        for(let i:number=0;i<arr.length;i++){
            let status = data.datalist.find(ele=>ele.id == arr[i].f_id).param1;
            if(status == EActivityStatus.Claimable){
                arr1.push(arr[i]);
            }else if(status == EActivityStatus.unclaimable){
                arr2.push(arr[i]);
            }else{
                arr3.push(arr[i]);
            }
        }
        this._ui.list2.array = arr1.concat(arr2).concat(arr3);
    }

    private updateView4(){
        let data = ActivityModel.Ins.getActivityData(EActivityID.PTShengYan);
        if(!data)return;
        for(let i:number = 0;i<data.datalist.length;i++){
            let cfg:Configs.t_Activity_Daily_Power_dat = t_Activity_Daily_Power.Ins.GetDataById(data.datalist[i].id);
            this._ui["lab_" + cfg.f_id].text = cfg.f_desc;
            this._ui["icon" + cfg.f_id].visible = this._ui["lab_1" + cfg.f_id].visible = this._ui["btn" + cfg.f_id].visible = false;

            let status = data.datalist[i].param1;
            if(status == EActivityStatus.Claimable){
                this["effect" + cfg.f_id].play(1,true);
                this._ui["tz" + cfg.f_id].visible = true;
            }else if(status == EActivityStatus.unclaimable){
                this["effect" + cfg.f_id].play(0,true);
                this._ui["tz" + cfg.f_id].visible = true;
            }else if(status == EActivityStatus.Claimed){
                this["effect" + cfg.f_id].play(0,true);
                this._ui["tz" + cfg.f_id].visible = false;
                this._ui["lab_" + cfg.f_id].text = "已领取";
            }else{
                this["effect" + cfg.f_id].play(0,true);
                this._ui["tz" + cfg.f_id].visible = true;
                this._ui["icon" + cfg.f_id].visible = this._ui["lab_1" + cfg.f_id].visible = this._ui["btn" + cfg.f_id].visible = true;

                let id = parseInt(cfg.f_price.split("-")[0]);
                let val = parseInt(cfg.f_price.split("-")[1]);
                this._ui["icon" + cfg.f_id].skin = IconUtils.getIconByCfgId(id);
                this._ui["lab_1" + cfg.f_id].text = val;
            }
        }

        this._ui.lab8.text = E.getLang("xianweifenglu");
    }
}