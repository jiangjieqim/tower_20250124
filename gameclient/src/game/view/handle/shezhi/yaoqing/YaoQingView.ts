// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
// import { TabControl } from "../../../../../frame/view/TabControl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { SocketMgr } from "../../../../network/SocketMgr";
import { CommonClaimRewards_req } from "../../../../network/protocols/BaseProto";
import { DotManager } from "../../common/DotManager";
import { System_RefreshTimeProxy } from "../../main/ctl/System_RefreshTimeProxy";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { MainEvent } from "../../main/model/MainEvent";
import { MainModel } from "../../main/model/MainModel";
import { SheZhiModel } from "../model/SheZhiModel";
import { YaoQingItem } from "./YaoQingItem";
import { YaoQingItem1 } from "./YaoQingItem1";
import { YaoQingItem2 } from "./YaoQingItem2";
import { t_Invite_Reward } from "./t_Invite_Reward";

export class YaoQingView extends ViewBase{
    private _ui:ui.views.shezhi.ui_yaoqingViewUI;
    protected mMask = true;
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private _proW:number;

    private tabsCtl:TabControl;
    private tabList: any;
    
    protected onAddLoadRes() {
        this.addAtlas('shezhi.atlas');
    }

    protected onFirstInit() {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.shezhi.ui_yaoqingViewUI();
            this.bindClose(this._ui.btn_close);

            this.btnList.push(
                ButtonCtl.Create(this._ui.btn,new Laya.Handler(this,this.onBtnClick)),
                ButtonCtl.Create(this._ui.btn1,new Laya.Handler(this,this.onBtn1Click))
            )

            this._proW = this._ui.pro.width;

            const tabsSkin = [this._ui.tab1,this._ui.tab2];
            let st = E.getLang("yaoqingTab");
            this.tabList = st.split("-");
            this.tabsCtl = new TabControl();
            this.tabsCtl.init(tabsSkin, new Laya.Handler(this,this.onTabSelectHandler), new Laya.Handler(this, this.itemTabHandler));

            this._ui.list.itemRender = YaoQingItem;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);
            this._ui.list1.itemRender = YaoQingItem1;
            this._ui.list1.renderHandler = new Laya.Handler(this,this.onRenderHandler1);
            this._ui.list2.itemRender = YaoQingItem2;
            this._ui.list2.renderHandler = new Laya.Handler(this,this.onRenderHandler2);
        }
    }

    private onRenderHandler(item:YaoQingItem){
        item.setData(item.dataSource);
    }

    private onRenderHandler1(item:YaoQingItem1){
        item.setData(item.dataSource);
    }

    private onRenderHandler2(item:YaoQingItem2){
        item.setData(item.dataSource);
    }

    private onBtnClick(){
        E.sdk.goShareData('');
    }

    private onBtn1Click(){
        E.sdk.goShareData('inviterId=' + MainModel.Ins.mRoleData.AccountId);
    }

    private onTabSelectHandler(v: number) {
        switch (v) {
            case 0:
                this._ui.sp1.visible = true;
                this._ui.sp2.visible = false;
                break;
            case 1:
                this._ui.sp1.visible = false;
                this._ui.sp2.visible = true;
                break;
        }
    }

    private itemTabHandler(tabSkin, index: number, sel: boolean, data){
        let skin: ui.views.shezhi.ui_tabUI = tabSkin;
        skin.lab.text = this.tabList[index];
        if (sel) {
            skin.img.skin = "remote/shezhi/btn_s.png";
            skin.lab.color = "#fff7cc";
            skin.lab.strokeColor = "#ac2c00";
        } else {
            skin.img.skin = "remote/shezhi/btn_n.png";
            skin.lab.color = "#dfb9ac";
            skin.lab.strokeColor = "#703620";
        }
    }

    private onWxOnShow(){
        if(!SheZhiModel.Ins.yqDay.times && this.tabsCtl.selectIndex == 0){
            let req = new CommonClaimRewards_req;
            req.flag = 2;
            SocketMgr.Ins.SendMessageBin(req);
        }
    }

    protected onInit(): void {
        if(!SheZhiModel.Ins.yqList)return;
        this._ui.tab2.visible = false;
        MainModel.Ins.on(MainEvent.WxOnShow,this,this.onWxOnShow);
        SheZhiModel.Ins.on(SheZhiModel.UPDATE_DATA_YAOQING,this,this.updateView);
        this.tabsCtl.selectIndex = 0;
        this.updateView();
    }

    protected onExit(): void {
        MainModel.Ins.off(MainEvent.WxOnShow,this,this.onWxOnShow);
        SheZhiModel.Ins.off(SheZhiModel.UPDATE_DATA_YAOQING,this,this.updateView);
    }

    private updateView(){
        this.updateView1();
        this.updateView2();
        if(SheZhiModel.Ins.isYQRedTipTab2()){
            DotManager.addDot(this._ui.tab2);
        }else{
            DotManager.removeDot(this._ui.tab2);
        }
    }

    private updateView1(){
        if(!SheZhiModel.Ins.yqDay.times){
            this._ui.btn.disabled = false;
            this._ui.lab_fx.text = "去分享";
        }else{
            this._ui.btn.disabled = true;
            this._ui.lab_fx.text = "已分享";
        }
        let re = System_RefreshTimeProxy.Ins.getVal(43);
        this._ui.list.array = ItemViewFactory.convertItemList(re);
    }

    private updateView2(){
        this._ui.lab.text = SheZhiModel.Ins.yqCount + "";
        let arr = t_Invite_Reward.Ins.getListByType(2);
        if(SheZhiModel.Ins.yqCount >= parseInt(arr[arr.length - 1].f_invite_number)){
            this._ui.pro.width = this._proW;
        }else{
            let cnt = 0;
            for(let i:number=0;i<arr.length;i++){
                if(SheZhiModel.Ins.yqCount >= parseInt(arr[i].f_invite_number)){
                    cnt++;
                }
            }
            if(cnt == 0){
                this._ui.pro.width = SheZhiModel.Ins.yqCount / parseInt(arr[0].f_invite_number) * 0.2 * this._proW;
            }else{
                let n = cnt * 0.2;
                let nn = (SheZhiModel.Ins.yqCount - parseInt(arr[cnt - 1].f_invite_number) ) / 
                (parseInt(arr[cnt].f_invite_number) - parseInt(arr[cnt - 1].f_invite_number)) * 0.2;
                this._ui.pro.width = (n + nn) * this._proW;
            }
        }

        this._ui.list1.array = arr;
        let arr1 = this.sortList(t_Invite_Reward.Ins.getListByType(1));
        this._ui.list2.array = arr1;
    }

    public sortList(list:any[]){
        let arr = [];
        let arr1 = [];
        let arr2 = [];
        for(let i:number=0;i<list.length;i++){
            let data = SheZhiModel.Ins.yqList.find(ele => ele.flag === list[i].f_id);
            if(data.times == 1){
                arr.push(list[i]);
            }else if(data.times == 0){
                arr1.push(list[i]);
            }else if(data.times == 2){
                arr2.push(list[i]);
            }
        }
        return arr.concat(arr1).concat(arr2);
    }
}