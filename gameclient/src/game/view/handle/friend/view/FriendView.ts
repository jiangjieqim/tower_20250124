// import { TabControl } from "../../../../../frame/view/TabControl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { SocketMgr } from "../../../../network/SocketMgr";
import { FriendList_req, FriendSearch_req } from "../../../../network/protocols/BaseProto";
import { DotManager } from "../../common/DotManager";
import { System_RefreshTimeProxy } from "../../main/ctl/System_RefreshTimeProxy";
import { FriendModel } from "../model/FriendModel";
import { FriendItem } from "./FriendItem";
import { FriendItem1 } from "./FriendItem1";
import { FriendItem2 } from "./FriendItem2";

export class FriendView extends ViewBase{
    private _ui:ui.views.friend.ui_friendViewUI;
    protected mMask = true;
    protected mMainSnapshot = true;
    protected autoFree:boolean = true; 
    
    private tabsCtl:TabControl;
    private tabList: any;

    protected onAddLoadRes() {
        this.addAtlas("friend.atlas");
    }

    protected onFirstInit(): void {
        if(!this.UI){
            this.UI = this._ui = new ui.views.friend.ui_friendViewUI;
            this.bindClose(this._ui.btn_close);

            this.btnList.push(
                ButtonCtl.Create(this._ui.btn,new Laya.Handler(this,this.onBtnClick)),
                ButtonCtl.Create(this._ui.btn1,new Laya.Handler(this,this.onBtn1Click)),
                ButtonCtl.Create(this._ui.btn2,new Laya.Handler(this,this.onBtn2Click)),
                ButtonCtl.Create(this._ui.btn3,new Laya.Handler(this,this.onBtn3Click))
            )

            const tabsSkin = [this._ui.tab1,this._ui.tab2,this._ui.tab3];
            this.tabList = E.getLang("friendTab").split("-");
            this.tabsCtl  = new TabControl();
            this.tabsCtl.init(tabsSkin, new Laya.Handler(this,this.onTabSelectHandler), new Laya.Handler(this, this.itemTabHandler));

            this._ui.list.itemRender = FriendItem;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);
            this._ui.list1.itemRender = FriendItem1;
            this._ui.list1.renderHandler = new Laya.Handler(this,this.onRenderHandler1);
            this._ui.list2.itemRender = FriendItem2;
            this._ui.list2.renderHandler = new Laya.Handler(this,this.onRenderHandler2);
        }
     }

     private onRenderHandler(item:FriendItem){
        item.setData(item.dataSource);
     }

     private onRenderHandler1(item:FriendItem1){
        item.setData(item.dataSource);
     }

     private onRenderHandler2(item:FriendItem2){
        item.setData(item.dataSource);
     }

     private itemTabHandler(tabSkin, index: number, sel: boolean, data){
        let skin: ui.views.friend.ui_tabUI = tabSkin;
        skin.lab.text = this.tabList[index];
        if (sel) {
            skin.img.skin = "remote/friend/bt_s.png";
            skin.lab.color = "#fff2b5";
            skin.lab.strokeColor = "#bd6600";
        } else {
            skin.img.skin = "remote/friend/bt_n.png";
            skin.lab.color = "#ffeddf";
            skin.lab.strokeColor = "#987d5e";
        }
    }

    private onBtnClick(){
        let str = this._ui.input.textField.text;
        if(StringUtil.IsNullOrEmpty(str)){
            E.ViewMgr.ShowMidError(E.getLang("friend1"));
            return;
        }
        let req = new FriendSearch_req;
        req.name = str;
        SocketMgr.Ins.SendMessageBin(req);
    }

    private onBtn1Click(){
        let req = new FriendList_req;
        req.type = 3;
        SocketMgr.Ins.SendMessageBin(req);
    }

    private onBtn2Click(){
        FriendModel.Ins.sendCmdManage(0,0);
    }

    private onBtn3Click(){
        FriendModel.Ins.sendCmdManage(0,1);
    }

    private onTabSelectHandler(v: number) {
        if (v == -1) return;
        let req = new FriendList_req;
        switch (v) {
            case 0:
                this._ui.sp1.visible = true;
                this._ui.sp2.visible = false;
                this._ui.sp3.visible = false;
                req.type = 1;
                break;
            case 1:
                this._ui.input.text = "";
                this._ui.lab1.text = "推荐好友";
                this._ui.btn1.visible = true;
                this._ui.sp1.visible = false;
                this._ui.sp2.visible = true;
                this._ui.sp3.visible = false;
                req.type = 3;
                break;
            case 2:
                this._ui.sp1.visible = false;
                this._ui.sp2.visible = false;
                this._ui.sp3.visible = true;
                req.type = 0;
                break;
        }
        SocketMgr.Ins.SendMessageBin(req);
    }

     protected onInit(): void {
        FriendModel.Ins.on(FriendModel.UPDATE_VIEW,this,this.updateView);
        this._ui.list.array = [];
        this._ui.list1.array = [];
        this._ui.list2.array = [];
        this.updateView();
        this.tabsCtl.selectIndex = 0;
     }

     protected onExit(): void {
        FriendModel.Ins.off(FriendModel.UPDATE_VIEW,this,this.updateView);
     }
     
     private updateView(type:number = 0){
        this._ui.lab.text = FriendModel.Ins.firendList.length + "/" + System_RefreshTimeProxy.Ins.getVal(99);
        if(type == 2){
            this._ui.lab1.text = "搜索结果";
            this._ui.btn1.visible = false;
        }
        this._ui.list.array = FriendModel.Ins.firendList;
        if(FriendModel.Ins.firendList.length){
            this._ui.img.visible = false;
        }else{
            this._ui.img.visible = true;
        }
        this._ui.list1.array = FriendModel.Ins.firendTJList;
        this._ui.list2.array = FriendModel.Ins.firendSQList;

        if(FriendModel.Ins.isRedTip()){
            this._ui.sp_r.visible = true;
        }else{
            this._ui.sp_r.visible = false;
        }
     }
}