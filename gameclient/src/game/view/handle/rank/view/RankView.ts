// import { TabControl } from "../../../../../frame/view/TabControl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { EViewType } from "../../../../common/defines/EnumDefine";
import { SocketMgr } from "../../../../network/SocketMgr";
import { CommonRank_req, stCommonRank } from "../../../../network/protocols/BaseProto";
import { ChengHaoCtl } from "../../common/ChengHaoCtl";
import { HeadCtl } from "../../common/HeadCtl";
import { System_RefreshTimeProxy } from "../../main/ctl/System_RefreshTimeProxy";
import { MainModel } from "../../main/model/MainModel";
import { RankModel } from "../model/RankModel";
import { RankCtl } from "./RankCtl";
import { RankItem } from "./RankItem";

export class RankView extends ViewBase{
    private _ui:ui.views.rank.ui_rankViewUI;
    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private _ctl:HeadCtl;
    private _chCtl:ChengHaoCtl;

    private _ctl1:RankCtl;
    private _ctl2:RankCtl;
    private _ctl3:RankCtl;

    private tabsCtl:TabControl;
    private tabList: any;

    protected onAddLoadRes(): void {
        this.addAtlas('rank.atlas');
    }
    
    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.rank.ui_rankViewUI();
            this.bindClose(this._ui.btn_close);

            this.btnList.push(
                ButtonCtl.Create(this._ui.btn_jl,new Laya.Handler(this,this.onJLHandler))
            )

            this._ctl1 = new RankCtl(this._ui.view1);
            this._ctl2 = new RankCtl(this._ui.view2);
            this._ctl3 = new RankCtl(this._ui.view3);

            this._ctl = new HeadCtl(this._ui.view);
            this._chCtl = new ChengHaoCtl(this._ui.view_ch);

            this._ui.list.itemRender = RankItem;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);

            const tabsSkin = [this._ui.tab1,this._ui.tab2,this._ui.tab3];
            this.tabList = E.getLang("rankTab").split("-");
            this.tabsCtl  = new TabControl();
            this.tabsCtl.init(tabsSkin, new Laya.Handler(this,this.onTabSelectHandler), new Laya.Handler(this, this.itemTabHandler));
        }
    }

    private onTabSelectHandler(v: number) {
        if(v == -1)return;
        this._ui.btn_jl.visible = false;
        let req = new CommonRank_req;
        switch (v) {
            case 0:
                if(this.Data == 0){
                    this._ui.btn_jl.visible = true;
                }
                req.flag = 0;
                break;
            case 1:
                req.flag = 2;
                break;
            case 2:
                req.flag = 1;
                break;
        }
        req.category = this.Data; 
        SocketMgr.Ins.SendMessageBin(req);
    }

    private itemTabHandler(tabSkin, index: number, sel: boolean, data){
        let skin: ui.views.rank.ui_tabUI = tabSkin;
        skin.lab.text = this.tabList[index];
        if (sel) {
            skin.img.skin = "remote/rank/bt_s.png";
            skin.lab.color = "#ffffff";
            skin.lab.strokeColor = "#ba5b0f";
        } else {
            skin.img.skin = "remote/rank/bt_n.png";
            skin.lab.color = "#ffd3ab";
            skin.lab.strokeColor = "#893e19";
        }
    }

    private onJLHandler(){
        E.ViewMgr.Open(EViewType.RankRewView);
    }

    private onRenderHandler(item:RankItem){
        item.setData(item.dataSource);
    }

    protected onInit(): void {
        RankModel.Ins.on(RankModel.UPDATE_RANK,this,this.updateView);
        this.tabsCtl.selectIndex = 0;
    }

    protected onExit(): void {
        RankModel.Ins.off(RankModel.UPDATE_RANK,this,this.updateView);
    }

    private updateView(){
        let arr = RankModel.Ins.rankList.sort(this.onSort);
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
        this._ui.list.array = array;

        let data = RankModel.Ins.rankSelf;
        this._ui.lab_name.text = data.nickName;
        let headUrl = MainModel.Ins.convertHead(data.headUrl);
        this._ctl.setData(headUrl,data.HeadFrame);
        this._chCtl.setData(data.titleId);
        this._ui.lab.text = data.trophy + "";
        this._ui.lab4.text = data.trophy + "";
        this._ui.lab3.text = data.trophy + "波";
        this._ui.lab_f.text = data.serverName;
        this._ui.sp.visible = this._ui.sp1.visible = this._ui.sp2.visible = false;
        if(RankModel.Ins.rankFlag == 0){
            this._ui.sp.visible = true;
        }else if(RankModel.Ins.rankFlag == 1){
            this._ui.sp2.visible = true;
        }else if(RankModel.Ins.rankFlag == 2){
            this._ui.sp1.visible = true;
            this._ui.sp1.skin = `remote/rank/bottom_hh${data.mode}.png`;
            if(data.mode == 0){
                this._ui.lab11.text = "普通";
                this._ui.lab11.color = "#ffcf72";
                this._ui.lab11.strokeColor = "#7f3300";
            }else if(data.mode == 1){
                this._ui.lab11.text = "困难";
                this._ui.lab11.color = "#c574ff";
                this._ui.lab11.strokeColor = "#3c095f";
            }
        }
        let val = System_RefreshTimeProxy.Ins.getVal(30);
        if(data.ranking == 0 || data.ranking > parseInt(val)){
            this._ui.lab1.visible = false;
            this._ui.lab2.visible = true;
        }else{
            this._ui.lab1.visible = true;
            this._ui.lab1.text = data.ranking + "";
            this._ui.lab2.visible = false;
        }
    }

    private onSort(a:stCommonRank,b:stCommonRank){
        return a.ranking - b.ranking;
    }
}