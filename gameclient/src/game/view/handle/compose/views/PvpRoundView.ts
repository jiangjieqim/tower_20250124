import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { EMsgBoxType, EPageType } from "../../../../common/defines/EnumDefine";
import { E } from "../../../../G";
import { PvpTurnBasedReady_req } from "../../../../network/protocols/BaseProto";
import { SocketMgr } from "../../../../network/SocketMgr";
import { ISimpleEffect } from "../../avatar/NoContainerSimpleEffect";
import { SpineEffectMgr } from "../../avatar/SpineEffectMgr";
import { EGuideEvent, GuideModel } from "../../guide/GuideModel";
import { TowerMainEvent } from "../../towertmain/model/TowerMainEvent";
import { TowerMainModel } from "../../towertmain/model/TowerMainModel";
import { ComposeMythosVo } from "../adapter/FightAdapter";
import { ComposeEvent } from "../ComposeEvent";
import { ComposeModel } from "../ComposeModel";
import { FuncSommonCardCtl } from "./FuncSommonCardCtl";
import { PvpRoundHeroCell } from "./PvpRoundHeroCell";
import { PvpRoundUICtl } from "./PvpRoundUICtl";
enum EAnimStartEffect{
    /**待机 */
    Idle = 0,
    /**火焰效果 */
    Fire = 1
}
/**PVP回合制 */
export class PvpRoundView extends ViewBase{
    public PageType: EPageType = EPageType.None;
    public _ui:ui.views.compose.ui_pvproundUI;
    protected autoFree:boolean = true;
    private model: ComposeModel;
    private _ctl:FuncSommonCardCtl;
    private startbtn:ButtonCtl;
    // pvpRoundTips:PvpRoundTips;
    private _eff:ISimpleEffect;
    private uiCtl:PvpRoundUICtl;
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
        this.addAtlas("pvpround.atlas");
    }
    private disposeEff(){
        if(this._eff){
            this._eff.dispose();
            this._eff = null;
        }
    }
    protected onExit(): void {
        if(this.uiCtl){
            this.uiCtl.dispose();
            this.uiCtl = null;
        }
        this.disposeEff();
        // if(this.pvpRoundTips){
        //     this.pvpRoundTips.destroy();
        //     this.pvpRoundTips = null;
        // }

        // this._ui.list1.scrollBar.off(Laya.Event.CHANGE,this,this.onChangeEvt);
        this.model.off(ComposeEvent.UpdateOwnerHeroCount,this,this.onUpdateSelfHero);
        // this.model.off(ComposeEvent.PvpRoundStatusChange,this,this.onPvpRoundStatusChange);
        TowerMainModel.Ins.off(TowerMainEvent.ValChange, this, this.onValChangeEvt);
        GuideModel.Ins.off(EGuideEvent.EAnimStartEffect,this,this.onValChangeEvt);

        if(this._ctl){
            this._ctl.onExit();
            this._ctl = null;
        }

        if(this.startbtn){
            this.startbtn.dispose();
            this.startbtn = null;
        }
    }
    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if(!this.UI){
            this.model = ComposeModel.Ins;
            this.UI = this._ui = new ui.views.compose.ui_pvproundUI();
            this._ui.mouseThrough = true;

            this.addBtnMask(this._ui.sommon_btn_mask);
            this.addBtnMask(this._ui.better_btn_mask);
            this.addBtnMask(this._ui.start_btn_mask);

            // this.pvpRoundTips = new PvpRoundTips();

            this.startbtn = ButtonCtl.CreateBtn(this._ui.start_btn, this, this.onStartHandler);
            this._ui.list1.itemRender = PvpRoundHeroCell;
            this._ui.list1.elasticEnabled = false;
            this._ui.list1.mClipY = -104;//-this.pvpRoundTips.height;
            this._ui.list1.renderHandler = new Laya.Handler(this,this.onPvpRoundHeroCellHandler);
            // this._ui.list1.scrollBar.on(Laya.Event.CHANGE,this,this.onChangeEvt);
            this._ui.list1.debugDrawRect();
        }
    }

    private onValChangeEvt(){
        if(this.model.haveItemCanUse){
            this._eff.play(EAnimStartEffect.Idle,true);
        }else{
            this._eff.play(EAnimStartEffect.Fire,true);
        }
    }

    private onPvpRoundHeroCellHandler(item:PvpRoundHeroCell,index:number){
        item.refresh(index);
    }

    /**开始游戏 */
    private onStartHandler(){
        if(this.model.haveItemCanUse){
            E.ViewMgr.ShowMsgBox(EMsgBoxType.OkOrCancel,E.getLang("surebattle"),new Laya.Handler(this,this.okBattleHandler));
        }else{
            this.okBattleHandler();
        }
    }

    private okBattleHandler(){
        let req = new PvpTurnBasedReady_req();
        SocketMgr.Ins.SendMessageBin(req);
    }

    private initCtl(){
        this._ctl = new FuncSommonCardCtl();
        this._ctl.costLabel = this._ui.lab1;
        this._ctl.sommonImg = this._ui.sommon_btn;
        this._ctl.betterImg = this._ui.better_btn;
        this._ctl.copperTf = this._ui.copperTf;
        this._ctl.jadeTf = this._ui.jadeTf;
        this._ctl.lockimg = this._ui.lockimg;
        this._ctl.peoTf = this._ui.peoTf;
        this._ctl.onInit();
    }

    private initUIctl(){
        this.uiCtl = new PvpRoundUICtl();
        this.uiCtl.chatAlgin = "left";
        this.uiCtl.buffCon = this._ui.buffCon;
        this.uiCtl.pre = this._ui.pre;
        this.uiCtl.chatbtn = this._ui.chatbtn;
        this.uiCtl.onInit();
    }
    private maskSommonClick(){
        //LogSys.Log(111);
    }
    private addBtnMask(img:Laya.Image){
        img.on(Laya.Event.CLICK,this,this.maskSommonClick);
        DebugUtil.draw(img,"#0000ff",undefined,undefined,0,0,true);
    }
    protected onInit(): void {
        this.initCtl();
        this._ui.sommon_btn_mask.visible = false;
        this._ui.better_btn_mask.visible = false;
        this._ui.start_btn_mask.visible = false;
        this.initUIctl();
        this._eff = SpineEffectMgr.createLoopNoSimpleEffect(`o/spine/scene/kaishizhandou/kaishizhandou`,this._ui.start_btn,this._ui.start_btn.width/2,this._ui.start_btn.height/2);
        GuideModel.Ins.on(EGuideEvent.EAnimStartEffect,this,this.onValChangeEvt);
        this.model.on(ComposeEvent.UpdateOwnerHeroCount,this,this.onUpdateSelfHero);
        // this.model.on(ComposeEvent.PvpRoundStatusChange,this,this.onPvpRoundStatusChange);
        TowerMainModel.Ins.on(TowerMainEvent.ValChange, this, this.onValChangeEvt);
        //============================================
        // this.onPvpRoundStatusChange();
        this.onUpdateSelfHero(true);
        this.onValChangeEvt();
    }
    // private onPvpRoundStatusChange(){
    // this.onUpdateSelfHero(true);
    // }

    /**收藏排序 */
    private onSortHandler(a:ComposeMythosVo,b:ComposeMythosVo){
        if(a.collect < b.collect ){
            return 1;
        }else if(a.collect > b.collect){
            return -1;
        }
        return 0;
    }
    private onUpdateSelfHero(self:boolean){
        if(self){
            let l = this.model.curAdapter.composeMythos();
            l = l.sort(this.onSortHandler);
            this._ui.list1.array = l;
        }
    }

    protected SetCenter() {
        this.bottomLayout();
    }

}