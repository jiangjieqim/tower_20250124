import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { ScreenAdapter } from "../../../../G";
import { NoContainerSimpleEffect } from "../../avatar/NoContainerSimpleEffect";
import { SpineEffectMgr } from "../../avatar/SpineEffectMgr";
import { EGuideEvent, GuideModel } from "../../guide/GuideModel";
import { ComposeModel } from "../ComposeModel";
import { EFightMode, EFightSceneStatus } from "../vos/EFightEnum";
import { FightVsItem } from "./cells/FightVsItem";
/**
 * VS对决
 */
export class FightVsView extends ViewBase{
    private effect:NoContainerSimpleEffect;
    private _ui:ui.views.compose.ui_fight_vsUI;
    private leftItem:FightVsItem;
    private rightItem:FightVsItem;
    private model:ComposeModel;
    protected autoFree:boolean = true;
    // private curTime:number;
    // protected mHitFull:boolean = true;
    protected onAddLoadRes(): void {
    }
    get winType():EFightSceneStatus{
        return this.Data;
    }
    protected onExit(): void {
        this.disposeEffect();
        if(this.leftItem){
            this.leftItem.dispose();
            this.leftItem = null;
        }
        if(this.rightItem){
            this.rightItem.dispose();
            this.rightItem = null;
        }
        LogSys.Log(`####### 前端战斗准备阶段完成,通知后端 #######`);
        this.model.curAdapter.readyComplete();
    }

    private disposeEffect(){
        if(this.effect){
            this.effect.dispose();
            this.effect = null;
        }
    }

    protected onFirstInit(): void {
        if(!this.UI){
            this.model = ComposeModel.Ins;
            
            this.UI = this._ui = this.model.fightTypeAdaper.createVsSkin();
            this.pvpTipsVisible = false;
            this.leftItem = new FightVsItem(this._ui.item0,-this._ui.item0.width,0);//30
            this.rightItem = new FightVsItem(this._ui.item1,ScreenAdapter.UIRefWidth,ScreenAdapter.UIRefWidth-this._ui.item1.width);//457

            this.leftItem.visible = this.rightItem.visible = false;
        }
    }

    protected onInit(): void {
        
        // this.curTime = Laya.timer.currTimer;
        this.disposeEffect();

        // `o/spine/scene/vs/vs`
        this.effect = SpineEffectMgr.createNoSimpleEffect(this.model.fightTypeAdaper.vs,this._ui,this._ui.width/2,this._ui.height/2,0);
        this.effect.on(Laya.Event.LABEL,this,this.onLabelEvt);
        this.effect.play(0, false, this, this.onPlayEnd);

        if(typeof this._ui['monsterCntTf']!="undefined"){
            let all = this.model.ownerPlayer.maxMonster + this.model.enemyPlayer.maxMonster;
            this._ui["monsterCntTf"].text = `${all}`;
        }

    }

    private set pvpTipsVisible(v:boolean){
        if(typeof this._ui.pvptips != "undefined"){
            this._ui.pvptips.visible = v;
        }
    }
    private onEmpty(){
        // this.Close();
    }
    private onLabelEvt(e) {
        if(this.destroyed){
            return;
        }
        if (e.name == 'start') {
            this.pvpTipsVisible = true;
            this.leftItem.visible = this.rightItem.visible = true;
            if(this.model.fightTypeAdaper.mode == EFightMode.PVE){
                this.leftItem.updateItem(this.model.ownerPlayer);
                this.rightItem.updateItem(this.model.enemyPlayer);
            }else{
                this.leftItem.updateItem(this.model.enemyPlayer);
                this.rightItem.updateItem(this.model.ownerPlayer);
            }
        } 
        else if(e.name == 'stop1'){
            if(this.winType == EFightSceneStatus.PVP_Fight_New_Guide){
                if(this.effect){
                    this.effect.pause();
                }
                GuideModel.Ins.event(EGuideEvent.ActionNextStep);
                if(this.leftItem){
                    ButtonCtl.CreateBtn(this.leftItem.skin,this,this.onEmpty,false);
                }
                else{
                    LogSys.Error(`leftItem is null`);
                }
            }
        }
        else if (e.name == "end") {
            this.pvpTipsVisible = false;
            this.leftItem.visible = this.rightItem.visible = false;
        }
    }

    private onPlayEnd(){
        if(this.winType == EFightSceneStatus.PVP_Fight_New_Guide){

        }else{
            this.Close();
        }
    }

}