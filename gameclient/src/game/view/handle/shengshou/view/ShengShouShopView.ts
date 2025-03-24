// import { TabControl } from "../../../../../frame/view/TabControl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { EPageType, EViewType } from "../../../../common/defines/EnumDefine";
import { ActivityModel } from "../../activity/ActivityModel";
import { ValCtl } from "../../main/ctl/ValLisCtl";
import { ShengShouModel } from "../model/ShengShouModel";
import { t_HolyBeast_Resource } from "../proxy/t_HolyBeast_Resource";
import { t_HolyBeast_Shop } from "../proxy/t_HolyBeast_Shop";
import { ShengShouShopItem } from "./item/ShengShouShopItem";
import { ShengShouTabItem } from "./item/ShengShouTabItem";

export class ShengShouShopView extends ViewBase{
    private _ui:ui.views.shengshou.ui_shopViewUI;
    public PageType: EPageType = EPageType.None;

    protected mMask = true; 
    protected mMaskClick: boolean = false;
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private _timeCtl:TimeCtl;

    protected onAddLoadRes(): void {
        this.addAtlas('shengshou.atlas');
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.shengshou.ui_shopViewUI();
            this.bindClose(this._ui.btn_close);

            this.btnList.push(
                ButtonCtl.Create(this._ui.btn_l,new Laya.Handler(this,this.onBtnLClick))
            )

            this._ui.money1.on(Laya.Event.CLICK,this,this.onMoney1Click);
            this._ui.money2.on(Laya.Event.CLICK,this,this.onMoney2Click);

            this._timeCtl = new TimeCtl(this._ui.lab_time);

            this._ui.list.itemRender = ShengShouShopItem;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);

            this._ui.list1.itemRender = ShengShouTabItem;
            this._ui.list1.renderHandler = new Laya.Handler(this,this.itemTabHandler);
            this._ui.list1.selectHandler = new Laya.Handler(this,this.onTabSelectHandler);
            this._ui.list1.selectEnable = true;
        }
    }

    private onBtnLClick(){
        let st = E.getLang("shengshouskin_" + ShengShouModel.Ins.actID);
        E.ViewMgr.Open(EViewType.HeroSkinView,null,parseInt(st));
    }

    private onRenderHandler(item:ShengShouShopItem){
        item.setData(item.dataSource);
    }
    
    private itemTabHandler(skin:ShengShouTabItem, index: number){
        skin.setData(skin.dataSource);
        if (index == this._ui.list1.selectedIndex) {
            skin.lab.color = "#fff68f";
            skin.lab.strokeColor = "#ab3000";
            skin.sp.visible = true;
        } else {
            skin.lab.color = "#e3e7ff";
            skin.lab.strokeColor = "#222241";
            skin.sp.visible = false;
        }
    }

    private onTabSelectHandler(v: number) {
        if(v == -1)return;
        this._ui.img.skin = `o/shengshou/shop${v}_${ShengShouModel.Ins.actID}.png`;
        this._ui.img1.skin = `o/shengshou/shopbh${v}_${ShengShouModel.Ins.actID}.png`;
        this.updateView();
        if(v == 0){
            this._ui.btn_l.visible = false;
        }else{
            this._ui.btn_l.visible = true;
        }
    }

    private onMoney1Click(){
        if (!ShengShouModel.Ins.isOpen(ShengShouModel.Ins.actID,true)) {
            return;
        }
        E.ViewMgr.Open(EViewType.ShengShouLBView,null,1);
    }

    private onMoney2Click(){
        E.ViewMgr.Open(EViewType.ShengShouView1);
    }

    protected onInit(): void {
        ShengShouModel.Ins.on(ShengShouModel.UPDATE_SHOP,this,this.updateView);
        this.initUI();
        this._ui.list1.array = [0,1];
        this._ui.list1.selectedIndex = 0;
    }

    protected onExit(): void {
        ShengShouModel.Ins.off(ShengShouModel.UPDATE_SHOP,this,this.updateView);
        if(this._timeCtl){
            this._timeCtl.dispose();
            this._timeCtl = null;
        }
    }

    private initUI(){
        this._ui.bg.skin = "static/bj_sh2_" + ShengShouModel.Ins.actID + ".jpg";
        let recCfg = t_HolyBeast_Resource.Ins.getCfgById(ShengShouModel.Ins.actID);
        let arr = recCfg.f_shop_icon.split("|");
        ValCtl.Create(this._ui.money1.lab,this._ui.money1.icon,parseInt(arr[0]),this._ui.money1.sp,false);
        ValCtl.Create(this._ui.money2.lab,this._ui.money2.icon,parseInt(arr[1]),this._ui.money2.sp,false);
        let data = ActivityModel.Ins.getActivityStatusData(ShengShouModel.Ins.actID);
        if(!data)return;
        let time = data.endtime - TimeUtil.serverTime;
        if (time > 0) {
            this._timeCtl.start(time, new Laya.Handler(this, this.onUpdateTime), new Laya.Handler(this, this.endTime));
        } else {
            this.endTime();
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
        this._ui.list.array = t_HolyBeast_Shop.Ins.getListByIdAt(ShengShouModel.Ins.actID,this._ui.list1.selectedIndex + 1);
    }
}