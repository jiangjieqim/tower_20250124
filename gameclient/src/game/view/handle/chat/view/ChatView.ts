// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { RowMoveBaseNode, ScrollPanelControl } from "../../../../../frame/view/ScrollPanelControl";
// import { TabControl } from "../../../../../frame/view/TabControl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { SocketMgr } from "../../../../network/SocketMgr";
import { Chat_req, FriendPrivateChatAction_req, FriendPrivateChatContents_req, FriendPrivateChatOnLeave_req, FriendPrivateChatRoles_req, stFriendPrivateChatRole } from "../../../../network/protocols/BaseProto";
import { DotManager } from "../../common/DotManager";
import { FunctionModel } from "../../funs/FunctionModel";
import { System_RefreshTimeProxy } from "../../main/ctl/System_RefreshTimeProxy";
import { EFuncDef } from "../../main/model/EFuncDef";
import { MainModel } from "../../main/model/MainModel";
import { TowerMainFightModel } from "../../towertmain/model/TowerMainFightModel";
import { ChatModel } from "../model/ChatModel";
import { t_World_Chat_Emoji } from "../proxy/t_World_Chat_Emoji";
import { ChatItem } from "./ChatItem";
import { ChatItem1 } from "./ChatItem1";
import { ChatItem2 } from "./ChatItem2";
import { ChatItem3 } from "./ChatItem3";

class ChatMyItemNode extends RowMoveBaseNode {
    protected clsKey: string = "ChatMyItemNode";
    protected createNode(index) {
        let _skin: ChatItem2 = Laya.Pool.getItemByClass(this.clsKey, ChatItem2);
        _skin.setData(this.list[index].data);
        _skin.height = this.list[index].h;
        _skin.y = this.y;
        return _skin;
    }
}

class ChatOtherItemNode extends RowMoveBaseNode {
    protected clsKey: string = "ChatOtherItemNode";
    protected createNode(index) {
        let _skin: ChatItem1 = Laya.Pool.getItemByClass(this.clsKey, ChatItem1);
        _skin.setData(this.list[index].data);
        _skin.height = this.list[index].h;
        _skin.y = this.y;
        return _skin;
    }
}
export class ChatView extends ViewBase{
    private _ui: ui.views.chat.ui_chatViewUI;
    protected mMask = true;
    protected mMainSnapshot = true;
    protected autoFree: boolean = true;

    private _isEnter:boolean;
    private _panelCtl: ScrollPanelControl;

    private tabsCtl:TabControl;
    private tabList: any;

    protected onAddLoadRes() {
        this.addAtlas("chat.atlas");
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.chat.ui_chatViewUI;
            this.bindClose(this._ui.btn_close);

            this._ui.input.maxChars = parseInt(System_RefreshTimeProxy.Ins.getVal(49));

            this._ui.img1.on(Laya.Event.CLICK,this,this.onImgClick);
            this._ui.img.on(Laya.Event.CLICK,this,this.onImgClick);

            const tabsSkin = [this._ui.tab1,this._ui.tab2];
            this.tabList = E.getLang("chatTab").split("-");
            this.tabsCtl  = new TabControl();
            this.tabsCtl.init(tabsSkin, new Laya.Handler(this,this.onTabSelectHandler), new Laya.Handler(this, this.itemTabHandler));

            this.btnList.push(
                ButtonCtl.CreateBtn(this._ui.btn, this, this.onBtnClick,true,null,true),
                ButtonCtl.CreateBtn(this._ui.btn2, this, this.onBtn2Click,true,null,true),
                ButtonCtl.CreateBtn(this._ui.btn1, this, this.onBtn1Click,true,null,true)
            )

            this._panelCtl = new ScrollPanelControl();
            this._panelCtl.init(this._ui.panel);

            this._ui.list.itemRender = ChatItem;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);
            this._ui.list.selectEnable = true;
            this._ui.list.selectHandler = new Laya.Handler(this,this.onSelectHandler);

            this._ui.list1.itemRender = ui.views.chat.ui_chatItem3UI;
            this._ui.list1.renderHandler = new Laya.Handler(this,this.onRenderHandler1);
            this._ui.list1.selectEnable = true;
            this._ui.list1.selectHandler = new Laya.Handler(this,this.onSelectHandler1);

            this._ui.list2.array = [];
            this._ui.list2.itemRender = ChatItem3;
            this._ui.list2.renderHandler = new Laya.Handler(this,this.onRenderHandler3);
            this._ui.list2.selectEnable = true;
        }
    }

    private onRenderHandler3(item:ChatItem3,index){
        if(index == this._ui.list2.selectedIndex){
            item.setData(item.dataSource,true);
            this._fid = item.dataSource.friendId;
            let req = new FriendPrivateChatContents_req;
            req.friendId = this._fid;
            SocketMgr.Ins.SendMessageBin(req);
        }else{
            item.setData(item.dataSource,false);
        }
    }

    private sendFCmd(){
        let req = new FriendPrivateChatOnLeave_req;
        req.friendId = this._fid;
        SocketMgr.Ins.SendMessageBin(req);
    }

    private onTabSelectHandler(v: number) {
        if (v == -1) return;
        this.initImg();
        switch (v) {
            case 0:
                this.sendFCmd();
                this._ui.labb.text = "世界聊天";
                this._fid = null;
                this._ui.panel.y = 124;
                this._ui.panel.height = 720;
                this._ui.imgsl.visible = false;
                this._ui.btn2.visible = true;
                this._ui.list2.visible = false;
                let num = ChatModel.Ins.getChannelNum();
                let arr = [];
                for (let i: number = 0; i < num; i++) {
                    arr.push(i + 1);
                }
                this._ui.list1.array = arr;
                this._ui.list1.selectedIndex = ChatModel.Ins.channelId - 1;
                break;
            case 1:
                this._ui.labb.text = "好友";
                this._panelCtl.clear();
                this._ui.imgsl.visible = true;
                this._ui.list2.visible = true;
                this._ui.btn2.visible = false;
                this._ui.panel.y = 298;
                this._ui.panel.height = 546;
                if(this._fid){
                    let req = new FriendPrivateChatAction_req;
                    req.flag = 1;
                    req.friendId = this._fid;
                    SocketMgr.Ins.SendMessageBin(req);
                }else{
                    let req = new FriendPrivateChatRoles_req;
                    SocketMgr.Ins.SendMessageBin(req);
                }
                break;
        }
    }

    private itemTabHandler(tabSkin, index: number, sel: boolean, data){
        let skin: ui.views.chat.ui_tabUI = tabSkin;
        skin.lab.text = this.tabList[index];
        if (sel) {
            skin.img.skin = "remote/chat/btn_s.png";
            skin.lab.color = "#ffffff";
            skin.lab.strokeColor = "#a54e00";
        } else {
            skin.img.skin = "remote/chat/btn_n.png";
            skin.lab.color = "#e4b5a9";
            skin.lab.strokeColor = "#793a30";
        }
    }

    private onRenderHandler(item:ChatItem){
        item.setData(item.dataSource);
    }

    private onSelectHandler(index:number){
        if(index == -1)return;
        this.initImg();
        let emoji = this._ui.list.selectedItem.f_emoji;
        this._ui.list.selectedIndex = -1;
        this.sendCmd("",emoji,false);
    }
    
    private _time:number = 0;
    public sendCmd(chat:string = "",emojiId:number=0,flag:boolean){
        let lv = MainModel.Ins.mRoleData.lv;
        let lvv = parseInt(System_RefreshTimeProxy.Ins.getVal(52));
        if(lv < lvv){
            E.ViewMgr.ShowMidError(E.getLang("chat3",lvv));
            return;
        }
        
        let time: number = parseInt(System_RefreshTimeProxy.Ins.getVal(53)) * 1000;
        if (Laya.timer.currTimer - this._time < time) {
            E.ViewMgr.ShowMidError(E.getLang("chat2"));
            return;
        }
        
        this._time = Laya.timer.currTimer;
        this._isEnter = true;
        if(flag)this._ui.input.text = "";
        let req:Chat_req = new Chat_req;
        req.chat = chat;
        if(this.tabsCtl.selectIndex == 0){
            req.type = 0;
            req.channelId = ChatModel.Ins.channelId;
        }else{
            req.type = 1;
            req.channelId = this._fid;
        }
       
        req.emojiId = emojiId;
        SocketMgr.Ins.SendMessageBin(req);
    }

    private onImgClick(e:Laya.Event){
        e.stopPropagation();
    }

    private onRenderHandler1(item:ui.views.chat.ui_chatItem3UI){
        item.lab.text = "频道" + item.dataSource;
    }

    private onSelectHandler1(index:number){
        if(index == -1)return;
        ChatModel.Ins.channelId = index + 1;
        this._ui.lab2.text = "频道" + ChatModel.Ins.channelId;
        this.updataView();
        this.initImg();
        this._ui.list1.selectedIndex = -1;
    }

    private onBtnClick(){
        this._ui.img1.visible = false;
        this._ui.img.visible = !this._ui.img.visible;
    }

    private onBtn1Click(){
        let str = this._ui.input.textField.text;
        if(StringUtil.IsNullOrEmpty(str)){
            E.ViewMgr.ShowMidError(E.getLang("chat1"));
            return;
        }
        this.sendCmd(str,0,true);
    }

    private onBtn2Click(){
        this._ui.img.visible = false;
        this._ui.img1.visible = !this._ui.img1.visible;
    }

    private onInputClick(){
        this.initImg();
    }

    private setRed(){
        if(TowerMainFightModel.Ins.isChatRedTip()){
            DotManager.addDot(this._ui.tab2);
        }else{
            DotManager.removeDot(this._ui.tab2);
        }
    }

    private _fid:number;
    protected onInit(): void {
        this._ui.input.on(Laya.Event.FOCUS,this,this.onInputClick);
        ChatModel.Ins.on(ChatModel.UPDATE_DATA,this,this.onUpdateView);
        ChatModel.Ins.on(ChatModel.UPDATE_DATA_SL,this,this.onUpdateViewSL);
        ChatModel.Ins.on(ChatModel.UPDATE_DATA_SLDATA,this,this.onUpdateView);
        TowerMainFightModel.Ins.on(TowerMainFightModel.UPDATE_CHAT,this,this.setRed);
        this._isEnter = false;
        let array = t_World_Chat_Emoji.Ins.List;
        array.sort(this.onSort);
        this._ui.list.array = array;
        this.setRed();
        if(FunctionModel.Ins.isOpenByFuncId(EFuncDef.SiLiao,false)){
            this._ui.tab2.visible = true;
            this._ui.imgggg.x = 60;
            this._ui.imgggg.y = 356;
        }else{
            this._ui.tab2.visible = false;
            this._ui.imgggg.x = 58;
            this._ui.imgggg.y = 217;
        }

        if(this.Data){
            this._fid = this.Data;
            this.tabsCtl.selectIndex = 1;
        }else{
            this.tabsCtl.selectIndex = 0;
        }
    }

    private onSort(a:Configs.t_World_Chat_Emoji_dat,b:Configs.t_World_Chat_Emoji_dat){
        return a.f_sort - b.f_sort;
    }

    protected onExit(): void {
        this.sendFCmd();
        this._ui.input.off(Laya.Event.FOCUS,this,this.onInputClick);
        ChatModel.Ins.off(ChatModel.UPDATE_DATA,this,this.onUpdateView);
        ChatModel.Ins.off(ChatModel.UPDATE_DATA_SL,this,this.onUpdateViewSL);
        ChatModel.Ins.off(ChatModel.UPDATE_DATA_SLDATA,this,this.onUpdateView);
        TowerMainFightModel.Ins.off(TowerMainFightModel.UPDATE_CHAT,this,this.setRed);
    }

    public setSL(id: number) {
        this._fid = id;
        this.tabsCtl.selectIndex = 1;
    }

    private initImg(){
        this._ui.img1.visible = false;
        this._ui.img.visible = false;
    }

    private onUpdateViewSL(){
        this._panelCtl.clear();
        let arr = ChatModel.Ins.slList;
        arr.sort(this.onSort1);
        this._ui.list2.array = arr;
        if(this._fid){
            let index = ChatModel.Ins.slList.findIndex(ele=>ele.friendId == this._fid);
            if(index != -1){
                this._ui.list2.selectedIndex = index;
            }else{
                this._ui.list2.selectedIndex = 0;
            }
        }else{
            this._ui.list2.selectedIndex = 0;
        }
    }

    private onSort1(a:stFriendPrivateChatRole,b:stFriendPrivateChatRole){
        return b.uid - a.uid;
    }

    private onUpdateView(){
        Laya.timer.callLater(this,this.onCall);
    }

    private onCall(){
        if(this._isEnter){
            this.updataView();
            this._isEnter = false;
        }else{
            if(this._ui.panel.vScrollBar.value >= this._ui.panel.vScrollBar.max){
                this.updataView();
            }else{
                this.updataView(false);
            }
        }
    }

    private updataView(flag:boolean = true){
        let arr = this.getList();
        this._panelCtl.clear();
        let hh = 0;
        for(let i = 0;i < arr.length;i++){
            let type = arr[i].type;
            let data = arr[i].data;
            if(type == 1){
                let h = this.getHeight(data.chat);
                hh = h;
                this._panelCtl.split([{data:data,h:h}], ChatMyItemNode, h ,1);
            }else if(type == 2){
                let h = this.getHeight(data.chat);
                hh = h;
                this._panelCtl.split([{data:data,h:h}], ChatOtherItemNode, h,1);
            }
        }
        Laya.timer.callLater(this,()=>{
            if(flag){
                this._panelCtl.endLast();
            }else{
                this._panelCtl.end(this._panelCtl.getScrollValue() - (hh + 1));
            }
        });
    }

    private getHeight(st:string){
        let num = 140;
        this._ui.lab.text = st;
        let h = (this._ui.lab.fontSize + this._ui.lab.leading);
        let hh = 31;
        if(this._ui.lab.textField.textHeight <= h){
            num = num + hh*0;
        }else if(this._ui.lab.textField.textHeight <= h * 2){
            num = num + hh*1;
        }else if(this._ui.lab.textField.textHeight <= h * 3){
            num = num + hh*2;
        }else if(this._ui.lab.textField.textHeight <= h * 4){
            num = num + hh*3;
        }
        return num;
    }

    private getList() {
        let data;
        if(this.tabsCtl.selectIndex == 0){
            data = ChatModel.Ins.getChatList(ChatModel.Ins.channelId).datalist;
        }else{
            data = ChatModel.Ins.slDataList;
        }

        let array = [];
        for (let i: number = 0; i < data.length; i++) {
            let obj:any = {};
            if (data[i].playerId == MainModel.Ins.mRoleData.mPlayer.AccountId) {
                obj.type = 1;
                obj.data = data[i];
                array.push(obj);
            } else {
                obj.type = 2;
                obj.data = data[i];
                array.push(obj);
            }
        }
        return array;
    }
}