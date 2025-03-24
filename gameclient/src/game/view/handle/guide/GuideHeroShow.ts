import { ViewBase } from "../../../../frame/view/ViewBase";
import { ui } from "../../../../ui/layaMaxUI";
import { EPageType } from "../../../common/defines/EnumDefine";
import { E } from "../../../G";
import { stCellValueConvert, stHero } from "../../../network/protocols/BaseProto";
import { SimpleEffect } from "../avatar/SimpleEffect";
import { SpineCoreSkel } from "../avatar/spine/SpineCoreSkel";
import { IconUtils } from "../main/model/IconUtils";
import { MainModel } from "../main/model/MainModel";
import { ItemProxy } from "../main/proxy/ItemProxy";
import { HeroListLvProxy, HeroListProxy } from "../towertmainhero/proxy/HeroProxy";
/**英雄展示引导面板 */
export class GuideHeroShow extends ViewBase{
    public PageType: EPageType = EPageType.None;
    private _ui:ui.views.common.ui_getHeroViewUI;
    protected mMask = true; 
    protected mMainSnapshot = true;
    protected mMaskClick: boolean = false;
    protected autoFree:boolean = true;
    private _data:stCellValueConvert;

    private _yun1:SimpleEffect;
    private _yun2:SimpleEffect;
    private skel:SpineCoreSkel;
    private btn:ButtonCtl;
    private _wid:number;
    protected bNextGuideStep:boolean = true;
    protected onAddLoadRes() {
    }

    protected onFirstInit() {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.common.ui_getHeroViewUI();
            this.btn = ButtonCtl.CreateBtn(this._ui.bg,this,this.onClick);
            // this._ui.bg.on(Laya.Event.CLICK,this,this.onClick);
            this._wid = this._ui.pro.width;
        }
    }

    private onClick(){
        // GuideModel.Ins.nextGuide();
        this.Close();
    }

    // private _flag:boolean;
    protected onInit(): void {
        // if(this.Data){
        //     this._flag = this.Data;
        // }else{
        //     this._flag = false;
        // }
        // this.updateView();
        this._data = this.Data;//TowerMainFightModel.Ins.heroList.shift();
        this.playSE();
        this.setData();
    }

    protected onExit(): void {
        if(this.btn){
            this.btn.dispose();
            this.btn = null;
        }
        if(this._yun1){
            this._yun1.dispose();
            this._yun1 = null;
        }
        if(this._yun2){
            this._yun2.dispose();
            this._yun2 = null;
        }
        if(this.skel){
            this.skel.dispose();
            this.skel = null;
        }
    }
    private setData() {
        let iCfg = ItemProxy.Ins.getCfg(this._data.original.id);
        let hCfg = HeroListProxy.Ins.getCfgByItemId(iCfg.f_itemid);
        if(hCfg.f_sound){
            E.AudioMgr.StopSound();
            E.AudioMgr.PlaySound1(hCfg.f_sound + ".mp3");
        }
        let hData = new stHero();
        hData.id = this._data.convertedId;
        hData.level = 1;
        // TowertMainHeroModel.Ins.getHeroById(hCfg.f_heroid);
        this._ui.lab_lv.text = "lv:" + hData.level;
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

        if(this._data.isConverted == 2){
            this._ui.sp12.visible = true;
            this._ui.sp11.visible = false;
        }else{
            this._ui.sp12.visible = false;
            this._ui.sp11.visible = true;
            this._ui.icon.skin = IconUtils.getIconByCfgId(this._data.convertedId);
            this._ui.lab1.text = this._data.convertedNum + "";
        }
    }

    private playSE(){
        this._yun1 = new SimpleEffect(this._ui.yun1, `o/spine/succeed/yun1/yun1`,this._ui.yun1.width*0.5,this._ui.yun1.height*0.5);
        this._yun1.play(0,true);
        this._yun2 = new SimpleEffect(this._ui.yun2, `o/spine/succeed/yun1/yun1`,this._ui.yun2.width*0.5,this._ui.yun2.height*0.5);
        this._yun2.play(0,true);

        if(!this.skel){
            this.skel = new SpineCoreSkel();
        }
        let iCfg = ItemProxy.Ins.getCfg(this._data.original.id);
        let hCfg = HeroListProxy.Ins.getCfgByItemId(iCfg.f_itemid);
        this.skel.setSlotImg("Hero", `o/heroshow/${hCfg.f_heroid}.png`);
        this.skel.once(Laya.Event.COMPLETE, this, this.onCompleteHander);
        this.skel.play(0, this, this.onPlayEnd, undefined, true);
        this.skel.load(`o/spine/succeed/admission_obtain/admission_obtain.skel`);
    }

    private onCompleteHander(){
        if(this.skel && this.skel.skeleton){
            this.skel.skeleton.pos(0,0);
            this._ui.sp_a.addChild(this.skel.skeleton);
        }else{
            LogSys.Error(`yonr this.skel.skeleton is null`)
        }
    }

    private onPlayEnd(){
        this.skel.play(1);
    }
}