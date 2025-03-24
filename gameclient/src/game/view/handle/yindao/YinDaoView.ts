import { ui } from "../../../../ui/layaMaxUI";
import { NoContainerSimpleEffect } from "../avatar/NoContainerSimpleEffect";
import { SpineEffectMgr } from "../avatar/SpineEffectMgr";

export class YinDaoView extends ui.views.yindao.ui_yindaoViewUI{
    private effect:NoContainerSimpleEffect;

    constructor(){
        super();
        this.on(Laya.Event.DISPLAY,this,this.onDisplay);
        this.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
    }

    private onDisplay(){

    }

    private onUnDisplay(){
        if(this.effect){
            this.effect.dispose();
            this.effect = null;
        }
    }

    public setData(){
        if(!this.effect){
            this.effect = SpineEffectMgr.createLoopNoSimpleEffect(`o/spine/scene/Click_1/Click_1`, this.sp, this.sp.width / 2, this.sp.height / 2);
        }
    }
}