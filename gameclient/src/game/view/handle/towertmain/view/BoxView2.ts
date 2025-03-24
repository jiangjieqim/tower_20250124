import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { EPageType, EViewType } from "../../../../common/defines/EnumDefine";
import { stBoxReward, stCellValueConvert } from "../../../../network/protocols/BaseProto";
import { SimpleEffect } from "../../avatar/SimpleEffect";
import { SpineCoreSkel } from "../../avatar/spine/SpineCoreSkel";
import { IconUtils } from "../../main/model/IconUtils";
import { MainModel } from "../../main/model/MainModel";
import { ItemProxy } from "../../main/proxy/ItemProxy";
import { TowertMainHeroModel } from "../../towertmainhero/model/TowertMainHeroModel";
import { HeroListLvProxy, HeroListProxy } from "../../towertmainhero/proxy/HeroProxy";
import { TowerMainFightModel } from "../model/TowerMainFightModel";
import { t_Box_Match } from "../proxy/t_Box_Match";

export class BoxView2 extends ViewBase{
    private _ui:ui.views.main.ui_baoxiangView2UI;

    public PageType: EPageType = EPageType.None;
    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;
    protected mMaskClick:boolean = false;

    public isPlay:boolean;
    private _wid:number;
    private _boxData:stBoxReward;

    private _boxSe:SimpleEffect;
    private _fanSe:SpineCoreSkel;
    private _isOpen:boolean;
    private _isFan:boolean;

    protected onAddLoadRes(): void {
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.main.ui_baoxiangView2UI();
            this._wid = this._ui.pro.width;
            // this._ui.sp_click.on(Laya.Event.CLICK,this,this.onClick);
        }
    }

    private _isOne:boolean;
    private onClick(){
        // if(this._isOpen || this._isFan)return;
        if(this._isOpen){
            this.Close();
            E.ViewMgr.Open(EViewType.BoxView3,null,this._boxId);
            return;
        }
        if(this._boxData.datalist.length){
            this.openBox();
        }else{
            this.Close();
            E.ViewMgr.Open(EViewType.BoxView3,null,this._boxId);
        }
    }

    private _data:stCellValueConvert;
    private _boxId:number;
    protected onInit(): void {
        TowerMainFightModel.Ins.boxRewList = [];
        this._boxData = TowerMainFightModel.Ins.boxTempList.shift();
        this._boxId = this._boxData.boxId;
        this._ui.lab8.text = this._boxData.datalist.length + "";
        this._isOne = true;
        this._isOpen = false;
        this._isFan = false;
        this._ui.sp2.visible = false;
        this._ui.sp3.visible = false;
        let cfg = t_Box_Match.Ins.getCfgById(this._boxId);
        if (!this._boxSe) {
            this._boxSe = new SimpleEffect(this._ui.box,`o/spine/succeed/baoxiangdakai${cfg.f_box_qua}/${cfg.f_box_qua}`);
            this._boxSe.labelHandler = new Laya.Handler(this,this.onLabelHandler);
        }
        this._boxSe.play(0,true);
        this.openBox();
    }

    protected onExit(): void {
        if(this._boxSe){
            this._boxSe.dispose();
            this._boxSe = null;
        }
        if(this._fanSe){
            this._fanSe.dispose();
            this._fanSe = null;
        }
    }

    private onLabelHandler(e){
        if(e.name == "Show"){
            this.playFan();
            this._ui.lab8.text = this._boxData.datalist.length + "";
        }
    }

    private openBox() {
        this._ui.fan.visible = false;
        this._ui.sp2.visible = false;
        this._ui.sp3.visible = false;
        this._data = this._boxData.datalist.shift();
        TowerMainFightModel.Ins.boxRewList.push(this._data);
        this._isOpen = true;
        if (this._boxSe) {
            if (this._isOne) {
                this._isOne = false;
                this._boxSe.play(1, false, this, this.onOpenEnd);
            } else {
                this._boxSe.play(3, false, this, this.onOpenEnd);
            }
        }
    }

    private onOpenEnd(){
        this._boxSe.play(2,true);
        this._isOpen = false;
        this.onClick();
    }

    private playFan(){
        this._ui.fan.visible = true;
        this._isFan = true;
        let iCfg = ItemProxy.Ins.getCfg(this._data.original.id);
        if(!this._fanSe){
            this._fanSe = new SpineCoreSkel();
        }
        this._fanSe.setSlotImg("tihuan", IconUtils.getIconByCfgId(iCfg.f_itemid));
        this._fanSe.once(Laya.Event.COMPLETE, this, this.onCompleteHander);
        this._fanSe.load(`o/spine/succeed/baoxiangtanchu/skeleton.skel`);
        this._fanSe.play(iCfg.f_qua - 1, this, this.onFanEnd, [iCfg.f_qua], true);
    }

    private onCompleteHander(){
        if(this._fanSe && this._fanSe.skeleton){
            this._fanSe.skeleton.pos(0,0);
            this._ui.fan.addChild(this._fanSe.skeleton);
        }else{
            LogSys.Error(`yonr this.skel.skeleton is null`)
        }
    }

    private onFanEnd(qua:number){
        this._fanSe.play(qua + 4);
        this._isFan = false;
        this.updateView();
        let iCfg = ItemProxy.Ins.getCfg(this._data.original.id);
        if(iCfg.f_type == 1 && iCfg.f_qua == 5){
            TowerMainFightModel.Ins.heroList.push(this._data);
            E.ViewMgr.Open(EViewType.GetHeroView,null,true);
        }
    }

    private updateView(){
        if(!this._data)return;
        let iCfg = ItemProxy.Ins.getCfg(this._data.original.id);
        if(iCfg.f_type == 1){
            this._ui.sp2.visible = true;
            this._ui.sp3.visible = false;
            this._ui.lab.text = IconUtils.getNameByID(iCfg.f_itemid);
            let hCfg = HeroListProxy.Ins.getCfgByItemId(iCfg.f_itemid);
            let hData = TowertMainHeroModel.Ins.getHeroById(hCfg.f_heroid);
            if(hData){
                this._ui.lab1.text = "lv:" + hData.level;
                this._ui.lab3.text = "+" + this._data.original.count;
                let nextCfg = HeroListLvProxy.Ins.getNextCfgByIdAndLv(hData.id, hData.level);
                if (nextCfg) {
                    let cfg = HeroListLvProxy.Ins.getCfgByIdAndLv(hData.id, hData.level);
                    let arr = cfg.f_consumption.split("|");
                    let id = parseInt(arr[0].split("-")[0]);
                    let need = parseInt(arr[0].split("-")[1]);
                    let count = MainModel.Ins.mRoleData.getVal(id);
                    if (count >= need) {
                        this._ui.pro.width = this._wid;
                        this._ui.sp.visible = true;
                    } else {
                        this._ui.pro.width = count / need * this._wid;
                        this._ui.sp.visible = false;
                    }
                    this._ui.lab2.text = count + "/" + need;
                } else {
                    this._ui.pro.width = this._wid;
                    this._ui.lab2.text = "已满级";
                    this._ui.sp.visible = false;
                }
            }
        }else{
            this._ui.sp2.visible = false;
            this._ui.sp3.visible = true;
            this._ui.lab5.text = IconUtils.getNameByID(iCfg.f_itemid);
            this._ui.lab6.text = "+" + this._data.original.count;
            this._ui.icon1.skin = IconUtils.getIconByCfgId(iCfg.f_itemid);
            this._ui.lab7.text = MainModel.Ins.mRoleData.getVal(iCfg.f_itemid) + "";
        }
    }
}