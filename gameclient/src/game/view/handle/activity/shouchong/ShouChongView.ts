import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { stActivity } from "../../../../network/protocols/BaseProto";
import { SimpleEffect } from "../../avatar/SimpleEffect";
import { DotManager } from "../../common/DotManager";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { TowertMainShopModel } from "../../towertmainshop/model/TowertMainShopModel";
import { t_Recharge } from "../../towertmainshop/proxy/t_Recharge";
import { EActivityID, EActivityStatus } from "../ActivityEnum";
import { ActivityModel } from "../ActivityModel";
import { ShouChongItem } from "./ShouChongItem";
import { ShouChongItem1 } from "./ShouChongItem1";
import { ShouChongModel } from "./ShouChongModel";
import { t_First_Recharge } from "./t_First_Recharge";

export class ShouChongView extends ViewBase{
    private _ui:ui.views.shouchong.ui_shouchongViewUI;
    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private tabsCtl:TabControl;
    private tabList: any;

    private skel:SimpleEffect;

    private _se2:SimpleEffect;
    private _se3:SimpleEffect;
    private _se4:SimpleEffect;

    private _seUI:SimpleEffect;

    protected onAddLoadRes() {
        this.addAtlas('shouchong.atlas');
    }

    protected onFirstInit() {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.shouchong.ui_shouchongViewUI();
            this._ui.btn.visible = false;
            this.btnList.push(
                ButtonCtl.Create(this._ui.btn1,new Laya.Handler(this,this.onBtnClick1)),
                ButtonCtl.Create(this._ui.btn2,new Laya.Handler(this,this.onBtnClick2))
            )

            const tabsSkin = [this._ui.tab1, this._ui.tab2];
            let st = E.getLang("shouchongTab");
            this.tabList = st.split("-");
            this.tabsCtl = new TabControl();
            this.tabsCtl.init(tabsSkin, new Laya.Handler(this, this.onTabSelectHandler), new Laya.Handler(this, this.itemTabHandler));

            this._ui.list.itemRender = ShouChongItem;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);
            this._ui.list.selectHandler = new Laya.Handler(this,this.onSelectHandler);
            this._ui.list.selectEnable = true;

            this._ui.list1.itemRender = ShouChongItem1;
            this._ui.list1.renderHandler = new Laya.Handler(this,this.onRenderHandler1);
            this._ui.list1.selectHandler = new Laya.Handler(this,this.onSelectHandler1);
            this._ui.list1.selectEnable = true;
        }
    }

    private onSelectHandler(index:number){
        if(index == -1)return;
        if(!this._data)return;
        let arr = t_First_Recharge.Ins.getListByType(2);
        let cfg = arr[0];
        let status = this._data.datalist.find(ele=>ele.id == cfg.f_id).param1;

        DotManager.removeDot(this._ui.btn2);
        this._ui.btn2.disabled = true;
        if(status == EActivityStatus.unclaimable){
            let rCfg = t_Recharge.Ins.getCfgById(arr[0].f_recharge);
            this._ui.lab3.text = StringUtil.moneyCv(rCfg.f_price) + "元";
            this._ui.btn2.disabled = false;
        }else{
            if(index == 0){
                status = this._data.datalist.find(ele=>ele.id == arr[0].f_id).param1;
                if(status == EActivityStatus.Claimed){
                    this._ui.lab3.text = "已领取";
                }else{
                    this._ui.btn2.disabled = false;
                    this._ui.lab3.text = "领取";
                    DotManager.addDot(this._ui.btn2);
                }
            }else if(index == 1){
                status = this._data.datalist.find(ele=>ele.id == arr[1].f_id).param1;
                if(status == EActivityStatus.Claimed){
                    this._ui.lab3.text = "已领取";
                }else if(status == EActivityStatus.Claimable){
                    this._ui.btn2.disabled = false;
                    this._ui.lab3.text = "领取";
                    DotManager.addDot(this._ui.btn2);
                }else{
                    this._ui.lab3.text = "明日可领";
                }
            }else if(index == 2){
                status = this._data.datalist.find(ele=>ele.id == arr[2].f_id).param1;
                if(status == EActivityStatus.Claimed){
                    this._ui.lab3.text = "已领取";
                }else if(status == EActivityStatus.Claimable){
                    this._ui.btn2.disabled = false;
                    this._ui.lab3.text = "领取";
                    DotManager.addDot(this._ui.btn2);
                }else{
                    status = this._data.datalist.find(ele=>ele.id == arr[1].f_id).param1;
                    if(status == EActivityStatus.unclaimable){
                        this._ui.lab3.text = "后日可领";
                    }else{
                        this._ui.lab3.text = "明日可领";
                    }
                }
            }
        }
    }

    private onRenderHandler(item:ShouChongItem,index:number){
        item.setData(item.dataSource,index,this._ui.list.selectedIndex);
    }

    private onSelectHandler1(index:number){
        if(index == -1)return;
        if(!this._data)return;
        let arr = t_First_Recharge.Ins.getListByType(1);
        let cfg = arr[0];
        let status = this._data.datalist.find(ele=>ele.id == cfg.f_id).param1;

        DotManager.removeDot(this._ui.btn1);
        this._ui.btn1.disabled = true;
        if(status == EActivityStatus.unclaimable){
            let rCfg = t_Recharge.Ins.getCfgById(arr[0].f_recharge);
            this._ui.lab2.text = StringUtil.moneyCv(rCfg.f_price) + "元";
            this._ui.btn1.disabled = false;
        }else{
            if(index == 0){
                status = this._data.datalist.find(ele=>ele.id == arr[0].f_id).param1;
                if(status == EActivityStatus.Claimed){
                    this._ui.lab2.text = "已领取";
                }else{
                    this._ui.btn1.disabled = false;
                    this._ui.lab2.text = "领取";
                    DotManager.addDot(this._ui.btn1);
                }
            }else if(index == 1){
                status = this._data.datalist.find(ele=>ele.id == arr[1].f_id).param1;
                if(status == EActivityStatus.Claimed){
                    this._ui.lab2.text = "已领取";
                }else if(status == EActivityStatus.Claimable){
                    this._ui.btn1.disabled = false;
                    this._ui.lab2.text = "领取";
                    DotManager.addDot(this._ui.btn1);
                }else{
                    this._ui.lab2.text = "明日可领";
                }
            }else if(index == 2){
                status = this._data.datalist.find(ele=>ele.id == arr[2].f_id).param1;
                if(status == EActivityStatus.Claimed){
                    this._ui.lab2.text = "已领取";
                }else if(status == EActivityStatus.Claimable){
                    this._ui.btn1.disabled = false;
                    this._ui.lab2.text = "领取";
                    DotManager.addDot(this._ui.btn1);
                }else{
                    status = this._data.datalist.find(ele=>ele.id == arr[1].f_id).param1;
                    if(status == EActivityStatus.unclaimable){
                        this._ui.lab2.text = "后日可领";
                    }else{
                        this._ui.lab2.text = "明日可领";
                    }
                }
            }
        }
    }

    private onRenderHandler1(item:ShouChongItem1,index:number){
        item.setData(item.dataSource,index,this._ui.list1.selectedIndex);
    }

    private onBtnClick1(){
        if(!this._data)return;
        let cfg = t_First_Recharge.Ins.getListByType(1)[0];
        let status = this._data.datalist.find(ele=>ele.id == cfg.f_id).param1;
        if(status == EActivityStatus.unclaimable){
            TowertMainShopModel.Ins.recharge(cfg.f_recharge);
        }else{
            ActivityModel.Ins.sendCmd(EActivityID.ShouChong,cfg.f_id);
        }
    }

    private onBtnClick2(){
        if(!this._data)return;
        let cfg = t_First_Recharge.Ins.getListByType(2)[0];
        let status = this._data.datalist.find(ele=>ele.id == cfg.f_id).param1;
        if(status == EActivityStatus.unclaimable){
            TowertMainShopModel.Ins.recharge(cfg.f_recharge);
        }else{
            cfg = t_First_Recharge.Ins.getListByType(2)[this._ui.list.selectedIndex];
            ActivityModel.Ins.sendCmd(EActivityID.ShouChong,cfg.f_id);
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
        let skin: ui.views.shouchong.ui_tabUI = tabSkin;
        skin.tf1.text = this.tabList[index];
        if(index == 0){
            skin.img1.skin = `remote/shouchong/img_kk1.png`;
            skin.img1.x = 0;
            skin.tf1.x = 92;
        }else{
            skin.img1.skin = `remote/shouchong/img_kk2.png`;
            skin.img1.x = 198;
            skin.tf1.x = 35;
        }
        
        if (sel) {
            skin.img.skin = "remote/shouchong/btn_s.png";
            skin.tf1.color = "#ffffff";
            skin.tf1.strokeColor = "#a75300";
        } else {
            skin.img.skin = "remote/shouchong/btn_n.png";
            skin.tf1.color = "#d4c2a2";
            skin.tf1.strokeColor = "#631500";
        }
    }

    protected onInit(): void {
        ActivityModel.Ins.on(ActivityModel.UPDATE_DATA,this,this.onUpdateView);

        this._ui.sp_ui.visible = false;
        if (!this._seUI) {
            this._seUI = new SimpleEffect(this._ui.sp, `o/spine/succeed/shouchong_in/shouchong_in`);
        }
        this._seUI.play(0, false, this, this.onPlayUIEnd);

        this._ui.sp123.skin = "remote/shouchong/tx_hsq.png";
        this.playSe();
        this.updateView();
        let index = 0;
        if(ShouChongModel.Ins.isRedTip(1)){
            index = 0;
        }else if(ShouChongModel.Ins.isRedTip(2)){
            index = 1;
        }
        this.tabsCtl.selectIndex = index;
    }

    protected onExit(): void {
        ActivityModel.Ins.off(ActivityModel.UPDATE_DATA,this,this.onUpdateView);
        this.tabsCtl.selectIndex = -1;
        this._ui.list.selectedIndex = -1;
        if(this._se2){
            this._se2.dispose();
            this._se2 = null;
        }
        if(this._se3){
            this._se3.dispose();
            this._se3 = null;
        }
        if(this._se4){
            this._se4.dispose();
            this._se4 = null;
        }
        if(this._seUI){
            this._seUI.dispose();
            this._seUI = null;
        }
        if(this.skel){
            this.skel.dispose();
            this.skel = null;
        }
    }

    private onPlayUIEnd(){
        this._ui.sp_ui.visible = true;
        if(!this.skel){
            this.skel = new SimpleEffect(this._ui.sp_1,`o/spine/succeed/shouchong_kun/shouchong_kun`);
            this.skel.labelHandler = new Laya.Handler(this,this.onLabelHandler);
        }
        this.skel.play(0,false,this,this.onPlayEnd);
    }

    private onPlayEnd(){
        this.skel.play(1,true);
    }

    private onLabelHandler(e){
        if(e.name == "show"){
            this._ui.sp123.skin = "remote/shouchong/tx_hsh.png";
        }
    }

    public setRedTip(){
        if(ShouChongModel.Ins.isRedTip(1)){
            DotManager.addDot(this._ui.tab1);
        }else{
            DotManager.removeDot(this._ui.tab1);
        }
        if(ShouChongModel.Ins.isRedTip(2)){
            DotManager.addDot(this._ui.tab2);
        }else{
            DotManager.removeDot(this._ui.tab2);
        }
    }

    private playSe(){
        if (!this._se2) {
            this._se2 = new SimpleEffect(this._ui.sp_2, `o/spine/succeed/baoxiangdakai3/3`);
        }
        this._se2.play(0,true);
        if (!this._se3) {
            this._se3 = new SimpleEffect(this._ui.sp_3, `o/spine/succeed/baoxiangdakai5/5`);
        }
        this._se3.play(2,true);
        if (!this._se4) {
            this._se4 = new SimpleEffect(this._ui.sp_4, `o/spine/succeed/baoxiangdakai4/4`);
        }
        this._se4.play(0,true);
    }

    private onUpdateView(){
        this.updateView();
    }

    private _data:stActivity;
    private updateView(){
        this._data = ActivityModel.Ins.getActivityData(EActivityID.ShouChong);
        if(!this._data)return;

        this._ui.list1.selectedIndex = -1;
        let arr1 = t_First_Recharge.Ins.getListByType(1);
        this._ui.list1.array = arr1;
        let index1 = 0;
        for(let i:number=0;i<arr1.length;i++){
            let ss = this._data.datalist.find(ele=>ele.id == arr1[i].f_id).param1;
            if(ss == EActivityStatus.Claimable){
                index1 = i;
                break;
            }
        }
        this._ui.list1.selectedIndex = index1;

        this._ui.list.selectedIndex = -1;
        let arr = t_First_Recharge.Ins.getListByType(2);
        this._ui.list.array = arr;
        let index = 0;
        for(let i:number=0;i<arr.length;i++){
            let ss = this._data.datalist.find(ele=>ele.id == arr[i].f_id).param1;
            if(ss == EActivityStatus.Claimable){
                index = i;
                break;
            }
        }
        this._ui.list.selectedIndex = index;

        this.setRedTip();
    }
}