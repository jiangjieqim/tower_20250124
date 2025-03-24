import { GameTex } from "../../../../../frame/view/GameList";
import { ISimpleEffect } from "../../avatar/NoContainerSimpleEffect";
import { SpineEffectMgr } from "../../avatar/SpineEffectMgr";
import { ComposeConfig } from "../ComposeConfig";
import { ComposeModel } from "../ComposeModel";
import { EFightMode } from "../vos/EFightEnum";
/**场景装饰特效层 装饰 */
export class FightArtScene {
    private con:Laya.Sprite;
    private _effectList:ISimpleEffect[] = [];
    private wind:ISimpleEffect;
    private bg5:GameTex;
    constructor(con:Laya.Sprite) {
        this.con = con;
        DebugUtil.drawCross(con,0,0,50,"#00ff00");
    }
    private get model(){
        return ComposeModel.Ins;
    }
    /**战斗主界面的场景表现层 */
    private get scene_con(){
        return this.model.composeView._ui.scene_con;
    }
    private bgHeight:number = 188;
    private createBg5(){
        // const bgHeight:number = 188;
        this.bg5 = new GameTex();
        this.bg5.anchorX = this.bg5.anchorY = 0.5;
        this.bg5.skin = `static/bj_5.png`;
        this.scene_con.addChild(this.bg5);
    }
    onInit(){
        let mode:EFightMode = this.model.fightTypeAdaper.mode;
        switch(mode){
            case EFightMode.PVE:
                this.wind = SpineEffectMgr.createLoopNoSimpleEffect(`o/spine/scene/fengsha/fengsha`,this.con,0,-ComposeConfig.cellH * 4);
                break;
            case EFightMode.PVP_Round:
                this.createBg5();
                break;
        }
        this.initEffectList()
        this.onCenter();
    }

    private initEffectList(){
        let arr = this.model.fightTypeAdaper.cfg.f_scene_effect.split("|");
        for(let i = 0;i < arr.length;i++){
            let _name:string = arr[i];
            if(!StringUtil.IsNullOrEmpty(_name)){
                let id = _name;
                let eff = SpineEffectMgr.createLoopNoSimpleEffect(`o/spine/scene/${id}/${id}`,this.con,ComposeConfig.cellW * 4,ComposeConfig.cellH * 0.5);
                this._effectList.push(eff);
            }
        }
    }

    onExit(){
        if(this.wind){
            this.wind.dispose();
            this.wind = null;
        }

        if(this.bg5){
            this.bg5.removeSelf();
            this.bg5 = null;
        }
        while(this._effectList.length){
            let eff = this._effectList.shift();
            eff.dispose();
        }
    }
    onCenter() {
        if (this.bg5) {
            let view: Laya.View = this.model.composeView.UI;
            this.bg5.x = view.width >> 1;

            let half = this.bgHeight/2;
            let oy:number = Laya.stage.height - half - Math.abs((view.height - Laya.stage.height) / 2);
            if(oy < view.height - half){
                oy = view.height - half;
            }
            this.bg5.y = oy;
        }
    }
}