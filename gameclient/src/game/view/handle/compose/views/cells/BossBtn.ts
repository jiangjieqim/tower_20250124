// import { DebugUtil } from "../../../../../../frame/util/DebugUtil";
import { ui } from "../../../../../../ui/layaMaxUI";
import { EViewType } from "../../../../../common/defines/EnumDefine";
import { E } from "../../../../../G";
import { NoContainerSimpleEffect } from "../../../avatar/NoContainerSimpleEffect";
import { SpineEffectMgr } from "../../../avatar/SpineEffectMgr";
import { ComposeModel } from "../../ComposeModel";
// import { t_Monster } from "../../t_Monster_Template";
import { FightValueConfig } from "../../vos/FightValueConfig";
/**boss挑战按钮 */
export class BossBtn extends ui.views.compose.fightcell.ui_boss_btnUI {
    // private bossBtnCtl: ButtonCtl;
    private model: ComposeModel;
    private tw:Laya.Tween;
    private readonly useTime:number = 400;
    private readonly tScale:number = 0.85;
    private effect:NoContainerSimpleEffect;
    constructor() {
        super();
        this.model = ComposeModel.Ins;
        DebugUtil.draw(this);
        // this.btn.anchorX = this.anchorY = 0.5;
        // this.bossBtnCtl = ButtonCtl.CreateBtn(this.btn, this, this.onBossClickHandler);
        // NoContainerSimpleEffect

        this.on(Laya.Event.CLICK,this,this.onBossClickHandler);
        this.tw = new Laya.Tween();
    }
    private onBossClickHandler() {
        E.ViewMgr.Open(EViewType.FightBossTips);
    }
    refresh() {
        this.bossIcon.skin = this.model.fightTypeAdaper.monsterCfg.getHeadIcon(this.model.bossMonsterId);
    }
    show(){
        // this.bossBtnCtl.setpos(,);
        this.x = (this.parent as Laya.Sprite).width-this.width;
        this.y = FightValueConfig.fightViewY - this.height/2;
        this.visible = true;
        this.disposEffect();
        this.effect = SpineEffectMgr.createLoopNoSimpleEffect(`o/spine/scene/xianshitoumu/xianshitoumu`,this.btn,this.btn.width/2,this.btn.height/2,undefined,0);
        this.scaleX = this.scaleY = 1.0;
        this.playAnim();
        // if (!this.bossIcon.parent) {
        //     this.addChild(this.bossIcon);
        // }
        this.bossIcon.visible = true;
    }

    private disposEffect(){
        if(this.effect){
            this.effect.dispose();
            this.effect = null;
        }
    }

    private playAnim(){
        this.tw.to(this.btn,{scaleX:this.tScale,scaleY:this.tScale},this.useTime,null,new Laya.Handler(this,this.playEnd));
    }

    private playEnd(){
        this.tw.to(this.btn,{scaleX:1,scaleY:1},this.useTime,null,new Laya.Handler(this,this.playAnim));
    }

    hide(){
        // if(this.bossIcon.parent){
        //     this.bossIcon.removeSelf();
        // }
        this.bossIcon.visible = false;
        this.disposEffect();
        this.tw.clear();
        this.visible = false;
    }
}