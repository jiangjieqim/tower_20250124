import { ui } from "../../../../../../ui/layaMaxUI";
import { E } from "../../../../../G";
import { NoContainerSimpleEffect } from "../../../avatar/NoContainerSimpleEffect";
import { SpineEffectMgr } from "../../../avatar/SpineEffectMgr";
import { ShengShouModel } from "../../model/ShengShouModel";

export class ShengShouTabItem extends ui.views.shengshou.ui_tabUI{
    private effect:NoContainerSimpleEffect;

    constructor() {
        super();
        this.on(Laya.Event.DISPLAY,this,this.onDisplay);
        this.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
    }

    private onDisplay(){

    }

    private onUnDisplay(){
       this.disEff();
    }

    public setData(value:number) {
        let arr = E.getLang(`shengshoutab_${ShengShouModel.Ins.actID}`).split("-");
        this.lab.text = arr[value];
        this.img.skin = "remote/shengshou/tab_" + value + ".png";
        if (!this.effect) {
            this.effect = SpineEffectMgr.createLoopNoSimpleEffect(`o/spine/succeed/ICON_TX/ICON_TX`, this.sp, 8, 0);
        }
    }

    private disEff(){
        if(this.effect){
            this.effect.dispose();
            this.effect = null;
        }
    }
}