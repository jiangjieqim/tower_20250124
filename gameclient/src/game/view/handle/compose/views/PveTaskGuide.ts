import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { EPageType } from "../../../../common/defines/EnumDefine";
import { ScreenAdapter } from "../../../../G";
import { NoContainerSimpleEffect } from "../../avatar/NoContainerSimpleEffect";
import { SpineEffectMgr } from "../../avatar/SpineEffectMgr";
import { EGuideEvent, GuideModel } from "../../guide/GuideModel";
import { ComposeConfig } from "../ComposeConfig";
import { IFightMainView } from "../vos/IFightMainView";

/**小任务引导 */
export class PveTaskGuide extends ViewBase{
    public PageType: EPageType = EPageType.None;
    private _ui:ui.views.compose.fightcell.ui_pve_guide_itemUI;
    private tw:Laya.Tween;
    private effect:NoContainerSimpleEffect;
    private effCon:Laya.Sprite = new Laya.Sprite();
    private get guidemodel(){
        return GuideModel.Ins;
    }
    private readonly playTime:number = 250;
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
    }
    protected onExit(): void {
        // throw new Error("Method not implemented.");
        // Laya.timer.clear(this,this.onNextTime);
        if(this.tw){
            this.tw.clear();
        }
        if(this.effect){
            this.effect.dispose();
            this.effect = null;
        }
        // this.clearTime("onExit");
        this.guidemodel.off(EGuideEvent.UpdateTask,this,this.onUpdateView);
    }
    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if(!this.UI){
            this.UI = this._ui = new ui.views.compose.fightcell.ui_pve_guide_itemUI();
            this._ui.aniCon.x = this._ui.width;
            this._ui.aniCon.addChild(this.effCon);
            this.tw = new Laya.Tween();
            ButtonCtl.Create(this._ui.clickImg,new Laya.Handler(this,this.onImgClick));
        }
    }

    private onImgClick(){
        // this.clearTime("onImgClick");
    }

    private onPlayEnd(){
        this._ui.aniCon.x = 0;
    }

    protected onInit(): void {
        this.effect = SpineEffectMgr.createLoopNoSimpleEffect(`o/spine/scene/hezuofengfu/hezuofengfu`,this.effCon,this._ui.width/2 + 28,this._ui.height/2);

        this.guidemodel.on(EGuideEvent.UpdateTask,this,this.onUpdateView);
        // throw new Error("Method not implemented.");
        this._ui.aniCon.x = this._ui.width;

        let cfg:Configs.t_Tasks_Guide_dat = this.Data;
        this.refresh(cfg.f_guidetask);
    }

    // private clearTime(s:string){
    // let cfg:Configs.t_Tasks_Guide_dat = this.Data;
    // LogSys.Log(`clearTime ${s} : fid${cfg.f_id}`);
    // Laya.timer.clear(this,this.onNextTime);
    // }
    private set effectVisible(v:boolean){
        this.effCon.visible = v;
        if(this.effect){
            if(v){
                this.effect.play(0,true);
            }else{
                this.effect.stop();
            }
        }
    }
    private refresh(str:string){

        this.tw.clear();
        this.tw.to(this._ui.aniCon,{x:0},this.playTime,null,new Laya.Handler(this,this.onPlayEnd));
        if(!StringUtil.IsNullOrEmpty(str)){
            // 召唤英雄|召唤英雄消灭怪物|0|1500
            let arr = str.split("|");
            this._ui.lb1.text = arr[0];
            this._ui.lb2.text = arr[1];
            let type = parseInt(arr[2]);
            this._ui.signImg.visible = false;
            this.effectVisible = false;
            switch(type){
                case 1:
                    this._ui.signImg.visible = true;
                    break;
                case 2:
                    this.effectVisible = true;
                    break;
            }
            
            // let nextTime:number = parseInt(arr[3]);

            // let cfg:Configs.t_Tasks_Guide_dat = this.Data;
            // this.clearTime("refresh");
            // Laya.timer.once(nextTime,this,this.onNextTime,[cfg.f_id]);
        }
    }

    private onPlayEnd1(_str:string){
        this.refresh(_str);
    }

    private onUpdateView(cfg:Configs.t_Tasks_Guide_dat){
        this.Data = cfg;
        let _data = cfg.f_guidetask;
        let arr = _data.split("|");
        let title:string = arr[0];
        if( this._ui.lb1.text == title){
            this.refresh(_data);
        }else{
            this.tw.clear();
            this.tw.to(this._ui.aniCon,{x:this._ui.width},this.playTime,null,new Laya.Handler(this,this.onPlayEnd1,[_data]));
        }
    }

    SetCenter(){
        if (this.UI && !this.UI.destroyed) {
            let fightView: IFightMainView = this.guidemodel.model.fightView;
            if (fightView) {
                let pos: Laya.Point = fightView.getCenterXY();
                this.UI.anchorX = this.UI.anchorY = 0.5;
                if (pos) {
                    this.UI.x = pos.x + ScreenAdapter.UIRefWidth/2 - this.UI.width/2;
                    this.UI.y = pos.y - ComposeConfig.cellH * 2.5;
                } else {
                    this.UI.x = this.ViewParent.width >> 1;
                    this.UI.y = this.ViewParent.height >> 1;
                }
            }
        }
    }
}