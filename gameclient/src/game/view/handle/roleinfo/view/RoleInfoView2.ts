// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
// import { TabControl } from "../../../../../frame/view/TabControl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { SocketMgr } from "../../../../network/SocketMgr";
import { HeadChange_req } from "../../../../network/protocols/BaseProto";
import { FightFactory } from "../../compose/FightFactory";
import { HeroAvatarView } from "../../compose/views/HeroAvatarView";
import { MainModel } from "../../main/model/MainModel";
import { TowerMainEvent } from "../../towertmain/model/TowerMainEvent";
import { TowerMainModel } from "../../towertmain/model/TowerMainModel";
import { RoleInfoModel } from "../model/RoleInfoModel";
import { t_Head_Image } from "../proxy/t_Head_Image";

export class RoleInfoView2 extends ViewBase{
    private _ui:ui.views.roleinfo.ui_roleInfoView2UI;

    protected mMask = true; 
    protected mMainSnapshot = true;

    private tabsCtl:TabControl;
    private tabList: any;

    private _anim1:HeroAvatarView;

    protected onAddLoadRes(): void {
        
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.roleinfo.ui_roleInfoView2UI();
            this.bindClose(this._ui.btn_close);

            ButtonCtl.Create(this._ui.btn, new Laya.Handler(this, this.onBtnClick));

            this._ui.list.itemRender = ui.views.roleinfo.ui_roleInfoItemUI;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);
            this._ui.list.selectEnable = true;
            this._ui.list1.itemRender = ui.views.roleinfo.ui_roleInfoItem1UI;
            this._ui.list1.renderHandler = new Laya.Handler(this,this.onRenderHandler1);
            this._ui.list1.selectEnable = true;

            const tabsSkin = [this._ui.tab1,this._ui.tab2];
            this.tabList = ["头像","头像框"];
            this.tabsCtl  = new TabControl();
            this.tabsCtl.init(tabsSkin, new Laya.Handler(this,this.onTabSelectHandler), new Laya.Handler(this, this.itemTabHandler));
        }
    }

    private onRenderHandler(item:ui.views.roleinfo.ui_roleInfoItemUI,index:number){
        if(this._ui.list.selectedIndex == -1)return;
        item.icon.skin = t_Head_Image.Ins.getIconSkin(item.dataSource.f_headid);
        if(index == this._ui.list.selectedIndex){
            item.sp.visible = true;
            this.updateView();
        }else{
            item.sp.visible = false;
        }

        item.img.visible = false;
        let url = MainModel.Ins.mRoleData.mPlayer.HeadUrl;
        if(!StringUtil.IsNullOrEmpty(url) && parseInt(url) > 0){
            if(item.dataSource.f_headid == parseInt(url)){
                item.img.visible = true;
            }
        }
        
        let ind = RoleInfoModel.Ins.headList.indexOf(item.dataSource.f_headid);
        if(ind != -1){
            item.img1.visible = false;
        }else{
            item.img1.visible = true;
        }
    }

    private onRenderHandler1(item:ui.views.roleinfo.ui_roleInfoItem1UI,index:number){
        if(this._ui.list1.selectedIndex == -1)return;
        item.icon.skin = t_Head_Image.Ins.getIconKSkin(item.dataSource.f_headid);
        if(index == this._ui.list1.selectedIndex){
            item.sp.visible = true;
            this.updateView();
        }else{
            item.sp.visible = false;
        }

        if(item.dataSource.f_headid == MainModel.Ins.mRoleData.HeadFrame){
            item.img.visible = true;
        }else{
            item.img.visible = false;
        }
        
        let ind = RoleInfoModel.Ins.headKList.indexOf(item.dataSource.f_headid);
        if(ind != -1){
            item.img1.visible = false;
        }else{
            item.img1.visible = true;
        }
    }

    private onTabSelectHandler(v: number) {
        if(v == -1)return;
        switch (v) {
            case 0:
                this._ui.list.visible = true;
                this._ui.list1.visible = false;
                break;
            case 1:
                this._ui.list.visible = false;
                this._ui.list1.visible = true;
                break;
        }
    }

    private itemTabHandler(tabSkin, index: number, sel: boolean, data){
        let skin: ui.views.roleinfo.ui_tabUI = tabSkin;
        skin.lab.text = this.tabList[index];
        if (sel) {
            skin.img.skin = "remote/roleinfo/btn_s.png";
        } else {
            skin.img.skin = "remote/roleinfo/btn_n.png";
        }
    }

    private onBtnClick() {
        let req = new HeadChange_req;
        if(this.tabsCtl.selectIndex == 0){
            req.flag = 1;
            req.val = this._ui.list.selectedItem.f_headid;
        }else if(this.tabsCtl.selectIndex == 1){
            req.flag = 2;
            req.val = this._ui.list1.selectedItem.f_headid;
        }
        SocketMgr.Ins.SendMessageBin(req);
    }

    protected onInit(): void {
        TowerMainModel.Ins.on(TowerMainEvent.UpdateRoleData,this,this.onUpdateView);
        let arr = t_Head_Image.Ins.getListByType(1);
        let arr1 = t_Head_Image.Ins.getListByType(2);
        this._ui.list.array = arr;
        this._ui.list1.array = arr1;

        let index = 0;
        let url = MainModel.Ins.mRoleData.mPlayer.HeadUrl;
        if(!StringUtil.IsNullOrEmpty(url) && parseInt(url) > 0){
            index = arr.findIndex(ele => ele.f_headid == parseInt(url));
        }
        this._ui.list.selectedIndex = index;

        index = arr1.findIndex(ele => ele.f_headid == MainModel.Ins.mRoleData.HeadFrame);
        this._ui.list1.selectedIndex = index;
        
        this.tabsCtl.selectIndex = 0;

        this.disposeHero();
        this._anim1 = FightFactory.createBigHeroAvatar(5, this._ui.sp1,0,15);
    }

    protected onExit(): void {
        TowerMainModel.Ins.off(TowerMainEvent.UpdateRoleData,this,this.onUpdateView);
        this._ui.list.selectedIndex = -1;
        this._ui.list1.selectedIndex = -1;
        this.tabsCtl.selectIndex = -1;
        this.disposeHero();
    }

    private disposeHero() {
        if (this._anim1) {
            this._anim1.dispose();
            this._anim1 = null;
        }
    }

    private onUpdateView(){
        this._ui.list.refresh();
        this._ui.list1.refresh();
        this._ui.btn.disabled = true;
    }

    private updateView(){
        this._ui.img_icon.skin = t_Head_Image.Ins.getIconSkin(this._ui.list.selectedItem.f_headid);
        this._ui.img_k.skin = t_Head_Image.Ins.getIconKSkin(this._ui.list1.selectedItem.f_headid);
        this._ui.btn.disabled = false;
        if(this.tabsCtl.selectIndex == 0){
            this._ui.lab.text = this._ui.list.selectedItem.f_access;
            let url = MainModel.Ins.mRoleData.mPlayer.HeadUrl;
            if (!StringUtil.IsNullOrEmpty(url) && parseInt(url) > 0) {
                if (this._ui.list.selectedItem.f_headid == parseInt(url)) {
                    this._ui.btn.disabled = true;
                }
            }
            let ind = RoleInfoModel.Ins.headList.indexOf(this._ui.list.selectedItem.f_headid);
            if (ind == -1) {
                this._ui.btn.disabled = true;
            }
        }else if(this.tabsCtl.selectIndex == 1){
            this._ui.lab.text = this._ui.list1.selectedItem.f_access;
            if(this._ui.list1.selectedItem.f_headid == MainModel.Ins.mRoleData.HeadFrame){
                this._ui.btn.disabled = true;
            }
            
            let ind = RoleInfoModel.Ins.headKList.indexOf(this._ui.list1.selectedItem.f_headid);
            if(ind == -1){
                this._ui.btn.disabled = true;
            }
        }

    }
}