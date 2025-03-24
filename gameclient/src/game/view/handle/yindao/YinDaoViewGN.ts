import { ViewBase } from "../../../../frame/view/ViewBase";
import { ui } from "../../../../ui/layaMaxUI";
import { E } from "../../../G";
import { NoContainerSimpleEffect } from "../avatar/NoContainerSimpleEffect";
import { SpineEffectMgr } from "../avatar/SpineEffectMgr";
import { HeroAvatarView } from "../compose/views/HeroAvatarView";

export class YinDaoViewGN extends ui.views.yindao.ui_yindaoViewUI{
    private effect:NoContainerSimpleEffect;
    private _jxx:number;
    private _spxx:number;
    private heroAvatar:HeroAvatarView;

    constructor(){
        super();
        this._jxx = this.arrow1.x;
        this._spxx = this.sp.x;
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
        this.disposeAvatar();
        E.AudioMgr.StopSound();
    }

    public setData(value:Configs.t_Function_Guide_dat){
        if(!this.effect){
            this.effect = SpineEffectMgr.createLoopNoSimpleEffect(`o/spine/scene/Click_1/Click_1`, this.sp, this.sp.width / 2, this.sp.height / 2);
        }
        this.arrow1.x = this._jxx + value.f_arrow_position;
        this.sp.x = this._spxx + value.f_finger_position;
        this.lab.text = value.f_info;
        this.disposeAvatar();
        this.heroAvatar = ViewBase.createBigHeroAvatar.runWith([5, this.anicon]);
        if(value.f_info_voice != ""){
            E.AudioMgr.StopSound();
            E.AudioMgr.PlaySound1(value.f_info_voice);
        }
    }

    private disposeAvatar(){
        if(this.heroAvatar){
            this.heroAvatar.dispose();
            this.heroAvatar = null;
        }
    }
}