import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { EViewType } from "../../../../common/defines/EnumDefine";
import { SocketMgr } from "../../../../network/SocketMgr";
import { HolyBeastRank_req, stCommonRank } from "../../../../network/protocols/BaseProto";
import { ChengHaoCtl } from "../../common/ChengHaoCtl";
import { HeadCtl } from "../../common/HeadCtl";
import { System_RefreshTimeProxy } from "../../main/ctl/System_RefreshTimeProxy";
import { MainModel } from "../../main/model/MainModel";
import { ShengShouModel } from "../model/ShengShouModel";
import { t_HolyBeast_Resource } from "../proxy/t_HolyBeast_Resource";
import { SSRankCtl } from "./item/SSRankCtl";
import { SSRankItem } from "./item/SSRankItem";

export class ShengShouRankView extends ViewBase{
    private _ui:ui.views.shengshou.ui_rankViewUI;

    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private _ctl:HeadCtl;
    private _chCtl:ChengHaoCtl;

    private _ctl1:SSRankCtl;
    private _ctl2:SSRankCtl;
    private _ctl3:SSRankCtl;

    private _timeCtl:TimeCtl;

    protected onAddLoadRes(): void {
        this.addAtlas('shengshou.atlas');
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.shengshou.ui_rankViewUI();
            this.bindClose(this._ui.btn_close);

            let cfg = t_HolyBeast_Resource.Ins.getCfgById(ShengShouModel.Ins.actID);
            this._ui.titleHero.name = cfg.f_hero_id;
            
            this.btnList.push(
                ButtonCtl.Create(this._ui.btn,new Laya.Handler(this,this.onBtnHandler))
            )

            this._ctl1 = new SSRankCtl(this._ui.view1);
            this._ctl2 = new SSRankCtl(this._ui.view2);
            this._ctl3 = new SSRankCtl(this._ui.view3);

            this._ctl = new HeadCtl(this._ui.view);
            this._chCtl = new ChengHaoCtl(this._ui.view_ch);

            this._ui.list.itemRender = SSRankItem;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);

            this._timeCtl = new TimeCtl(this._ui.lab_time);
        }
    }

    private onBtnHandler(){
        E.ViewMgr.Open(EViewType.ShengShouRankView1);
    }

    private onRenderHandler(item:SSRankItem){
        item.setData(item.dataSource);
    }

    protected onInit(): void {
        ShengShouModel.Ins.on(ShengShouModel.UPDATE_RANK,this,this.updateView);
        let req = new HolyBeastRank_req;
        req.activityId = ShengShouModel.Ins.actID;
        SocketMgr.Ins.SendMessageBin(req);
        let data = ShengShouModel.Ins.getRankTimeData(ShengShouModel.Ins.actID);
        if(!data)return;
        let time = data.end - TimeUtil.serverTime;
        if (time > 0) {
            this._timeCtl.start(time, new Laya.Handler(this, this.onUpdateTime), new Laya.Handler(this, this.endTime));
        } else {
            this.endTime();
        }
    }

    protected onExit(): void {
        ShengShouModel.Ins.off(ShengShouModel.UPDATE_RANK,this,this.updateView);
        if(this._timeCtl){
            this._timeCtl.dispose();
            this._timeCtl = null;
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
        let arr = ShengShouModel.Ins.rankList[0].datalist.sort(this.onSort);
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

        let data = ShengShouModel.Ins.rankList[0].self[0];
        this._ui.lab_name.text = data.nickName;
        let headUrl = MainModel.Ins.convertHead(data.headUrl);
        this._ctl.setData(headUrl,data.HeadFrame);
        this._chCtl.setData(data.titleId);
        this._ui.lab.text = data.trophy + "";
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