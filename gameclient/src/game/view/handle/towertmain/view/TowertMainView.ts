import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { EPageType } from "../../../../common/defines/EnumDefine";
import { E, ScreenAdapter } from "../../../../G";
import { LayerMgr } from "../../../../layer/LayerMgr";
import { LoginClient } from "../../../../network/clients/LoginClient";
import { ActivityModel } from "../../activity/ActivityModel";
import { SimpleEffect } from "../../avatar/SimpleEffect";
import { ChengHaoModel } from "../../chenghao/model/ChengHaoModel";
import { DotManager } from "../../common/DotManager";
import { FunctionModel } from "../../funs/FunctionModel";
import { System_RefreshTimeProxy } from "../../main/ctl/System_RefreshTimeProxy";
import { EFuncDef } from "../../main/model/EFuncDef";
import { TowertMainCardModel } from "../../towertmaincard/model/TowertMainCardModel";
import { TowertMainCardView } from "../../towertmaincard/view/TowertMainCardView";
import { TowertMainHeroModel } from "../../towertmainhero/model/TowertMainHeroModel";
import { TowertMainHeroView } from "../../towertmainhero/view/TowertMainHeroView";
import { TowertMainLinbaoModel } from "../../towertmainlinbao/model/TowertMainLinbaoModel";
import { TowertMainLinbaoView } from "../../towertmainlinbao/view/TowertMainLinbaoView";
import { TowertMainShopModel } from "../../towertmainshop/model/TowertMainShopModel";
import { TowertMainShopView } from "../../towertmainshop/view/TowertMainShopView";
import { TowerMainEvent } from "../model/TowerMainEvent";
import { TowerMainFightModel } from "../model/TowerMainFightModel";
import { TowerMainModel } from "../model/TowerMainModel";
import { TowerMainBBCtl } from "./item/TowerMainBBCtl";
import { TowertMainFightView } from "./TowertMainFightView";

export class TowertMainView extends ViewBase{
    private _ui:ui.views.main.ui_tower_mainUI;
    public PageType: EPageType = EPageType.None;

    private _towerMainBBList:TowerMainBBCtl[];

    private _shopView:TowertMainShopView;
    private _heroView:TowertMainHeroView;
    private _fightView:TowertMainFightView;
    private _linbaoView:TowertMainLinbaoView;
    private _cardView:TowertMainCardView;
    private _viewList;
    private _sp1Y:number;

    protected onAddLoadRes(): void {
        this.addAtlas('towerMain.atlas');
    }

    /**重置 */
    // resetUpdate() {
    // }

    public getSkinUiByFuncId(funcId:number){
        return this._ui;
    }
    
    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.main.ui_tower_mainUI();
            E.ViewMgr.closeLoading();

            this._viewList = [];
            this._shopView = new TowertMainShopView();
            this._heroView = new TowertMainHeroView();
            this._fightView = new TowertMainFightView();
            this._linbaoView = new TowertMainLinbaoView();
            this._cardView = new TowertMainCardView();
            this._viewList.push(this._shopView);
            this._viewList.push(this._heroView);
            this._viewList.push(this._fightView);
            this._viewList.push(this._linbaoView);
            this._viewList.push(this._cardView);

            this._sp1Y = this._ui.sp1.y;

            let arr = [EFuncDef.Shop, EFuncDef.Hero, EFuncDef.Fight, EFuncDef.LinBao, EFuncDef.FunCard,EFuncDef.JunTuan];
            this._towerMainBBList = [];
            for (let i: number = 0; i < arr.length; i++) {
                let tmbb = new TowerMainBBCtl(this._ui["bbtn" + (i + 1)], arr[i], i);
                this._towerMainBBList.push(tmbb);
            }
            TowerMainModel.Ins.event(TowerMainEvent.MainViewInit);
        }
    }

    protected onInit(): void {
        TowerMainModel.Ins.on(TowerMainEvent.UPDATE_BBTN_CLICK,this,this.onBBtnClick);
        TowerMainModel.Ins.on(TowerMainEvent.FunctionChange,this,this.onFunctionChange);

        TowerMainModel.Ins.on(TowerMainEvent.ValChange,this,this.onUpdateRedTip);
        TowertMainHeroModel.Ins.on(TowertMainHeroModel.UPDATE_HERO,this,this.onUpdateRedTip);
        TowertMainLinbaoModel.Ins.on(TowertMainLinbaoModel.UPDATE_LINBAO,this,this.onUpdateRedTip);
        TowertMainCardModel.Ins.on(TowertMainCardModel.UPDATE_CARD,this,this.onUpdateRedTip);
        FunctionModel.Ins.on(TowerMainEvent.FuncSmallIconUpdate,this,this.onUpdateRedTip);
        TowerMainFightModel.Ins.on(TowerMainFightModel.UPDATE_FRIEND_REWARD,this,this.onUpdateRedTip);
        TowerMainFightModel.Ins.on(TowerMainFightModel.TROPHY_REWARD,this,this.onUpdateRedTip);
        TowerMainFightModel.Ins.on(TowerMainFightModel.UPDATE_PVP,this,this.onUpdateRedTip);
        TowerMainFightModel.Ins.on(TowerMainFightModel.UPDATE_INVITE,this,this.onUpdateRedTip);
        TowertMainShopModel.Ins.on(TowertMainShopModel.UPDATE_SHOP,this,this.onUpdateRedTip);
        ChengHaoModel.Ins.on(ChengHaoModel.UPDATE_DATA,this,this.onUpdateRedTip);
        ActivityModel.Ins.on(ActivityModel.UPDATE_DATA,this,this.onUpdateRedTip);
        this.onInitView();
        LoginClient.Ins.startPlayAudio();
    }

    protected onExit(): void {
        TowerMainModel.Ins.off(TowerMainEvent.UPDATE_BBTN_CLICK,this,this.onBBtnClick);
        TowerMainModel.Ins.off(TowerMainEvent.FunctionChange,this,this.onFunctionChange);
        
        TowerMainModel.Ins.off(TowerMainEvent.ValChange,this,this.onUpdateRedTip);
        TowertMainHeroModel.Ins.off(TowertMainHeroModel.UPDATE_HERO,this,this.onUpdateRedTip);
        TowertMainLinbaoModel.Ins.off(TowertMainLinbaoModel.UPDATE_LINBAO,this,this.onUpdateRedTip);
        TowertMainCardModel.Ins.off(TowertMainCardModel.UPDATE_CARD,this,this.onUpdateRedTip);
        FunctionModel.Ins.off(TowerMainEvent.FuncSmallIconUpdate,this,this.onUpdateRedTip);
        TowerMainFightModel.Ins.off(TowerMainFightModel.UPDATE_FRIEND_REWARD,this,this.onUpdateRedTip);
        TowerMainFightModel.Ins.off(TowerMainFightModel.TROPHY_REWARD,this,this.onUpdateRedTip);
        TowertMainShopModel.Ins.off(TowertMainShopModel.UPDATE_SHOP,this,this.onUpdateRedTip);
        ChengHaoModel.Ins.off(ChengHaoModel.UPDATE_DATA,this,this.onUpdateRedTip);
        TowerMainFightModel.Ins.off(TowerMainFightModel.UPDATE_PVP,this,this.onUpdateRedTip);
        TowerMainFightModel.Ins.off(TowerMainFightModel.UPDATE_INVITE,this,this.onUpdateRedTip);
        ActivityModel.Ins.off(ActivityModel.UPDATE_DATA,this,this.onUpdateRedTip);
        this.onExitView();
    }

    private onInitView() {
        this._index = -1;
        this.updateBBtnView();
        this.updateRedTip();
        if(FunctionModel.Ins.isOpenByFuncId(EFuncDef.PaoMaDeng,false)){
            this.playEffPMD();
            let t = parseInt(System_RefreshTimeProxy.Ins.getVal(97));
            Laya.timer.loop(t * 1000,this,this.playEffPMD);
        }
    }

    private onExitView() {
        this.removeView();
        this.onDisposePMD();
        Laya.timer.clear(this,this.playEffPMD);
    }

    private _pmd:SimpleEffect;
    private playEffPMD(){
        this.onDisposePMD();
        let xx = LayerMgr.Ins.screenEffectLayer.width >> 1;
        let yy = (LayerMgr.Ins.screenEffectLayer.height >> 1) - 470;
        this._pmd = new SimpleEffect(LayerMgr.Ins.screenEffectLayer, `o/spine/succeed/danmu/danmu`,xx,yy);
        this._pmd.play(0, false, this, this.onDisposePMD);
    }

    private onDisposePMD(){
        if(this._pmd){
            this._pmd.dispose();
            this._pmd = null;
        }
    }

    private onFunctionChange(){
        this.updateBBtn();
        this.onUpdateRedTip();
    }

    private onUpdateRedTip(){
        Laya.timer.callLater(this,this.updateRedTip);
    }

    private updateRedTip(){
        if(TowertMainShopModel.Ins.isRedTip()){
            DotManager.addDot(this._ui.bbtn1,0,35);
        }else{
            DotManager.removeDot(this._ui.bbtn1);
        }
        if(TowertMainHeroModel.Ins.isHeroRedTip()){
            DotManager.addDot(this._ui.bbtn2,0,35);
        }else{
            DotManager.removeDot(this._ui.bbtn2);
        }
        if(TowerMainFightModel.Ins.isFightRedTip()){
            DotManager.addDot(this._ui.bbtn3,0,35);
        }else{
            DotManager.removeDot(this._ui.bbtn3);
        }
        if(TowertMainLinbaoModel.Ins.isLinBaoRedTip()){
            DotManager.addDot(this._ui.bbtn4,0,35);
        }else{
            DotManager.removeDot(this._ui.bbtn4);
        }
        if(TowertMainCardModel.Ins.isCardRedTip()){
            DotManager.addDot(this._ui.bbtn5,0,35);
        }else{
            DotManager.removeDot(this._ui.bbtn5);
        }
    }

    private updateBBtnView(){
        this.updateBBtn();
        this.selectView(2);
    }

    private updateBBtn(){
        for(let i:number=0; i<this._towerMainBBList.length; i++){
            this._towerMainBBList[i].updateData();
        }
    }

    private onBBtnClick(index:number,value:any){
        TowertMainShopModel.Ins.selectId = value;
        this.selectView(index);
    }

    private _index: number;
    private selectView(index: number) {
        if (TowertMainShopModel.Ins.selectId || this._index != index) {
            this._index = index;
            this.removeView();
            for (let i: number = 0; i < this._towerMainBBList.length; i++) {
                if (index == i) {
                    this._towerMainBBList[i].setStyle1();
                    this._ui.sp.addChild(this._viewList[index]);
                } else {
                    this._towerMainBBList[i].setStyle();
                }
            }
        }
    }

    private removeView(){
        for(let i:number=0;i<this._viewList.length;i++){
            this._viewList[i].removeSelf();
        }
    }

    protected SetCenter(): void {
        if (this.UI && !this.UI.destroyed) {
            this.UI.anchorX = 0.5;
            this.UI.x = this.ViewParent.width >> 1;

            let yy = Laya.stage.height - ScreenAdapter.DefaultHeight;
            if(yy > 0){
                this._ui.height = Laya.stage.height;
                this._ui.sp.y = yy * 0.5;
                this._ui.sp1.y = this._sp1Y + yy;
            }
        }
    }
}