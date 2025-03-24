import { ui } from "../../../../ui/layaMaxUI";
import { NoContainerSimpleEffect } from "../avatar/NoContainerSimpleEffect";
import { SpineEffectMgr } from "../avatar/SpineEffectMgr";
import { t_Title } from "../chenghao/proxy/t_Title";

export class ChengHaoCtl{
    protected _ui:ui.views.common.ui_chenghaoUI;

    private effect:NoContainerSimpleEffect;

    constructor(skin:ui.views.common.ui_chenghaoUI){
        this._ui = skin;
        this._ui.on(Laya.Event.DISPLAY,this,this.onDisplay);
        this._ui.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
    }

    private onDisplay(){
        
    }

    private onUnDisplay(){
        this.disEff();
        // if(!StringUtil.IsNullOrEmpty(this._ui.img.skin)){
        //     Laya.Loader.clearTextureRes(this._ui.img.skin);
        // }
    }

    public setData(id:number,flag:boolean = true){
        let cfg = t_Title.Ins.getCfgById(id);
        if(cfg){
            if(cfg.f_title_icon){
                this._ui.img.visible = true;
                this._ui.sp.visible = false;
                this._ui.img.skin = t_Title.Ins.getSkinById(cfg.f_title_icon);
            }else if(cfg.f_animation){
                this._ui.img.visible = false;
                this._ui.sp.visible = true;
                if(flag){
                    this.disEff();
                }
                if(!this.effect){
                    this.effect = SpineEffectMgr.createLoopNoSimpleEffect(`o/spine/succeed/${cfg.f_animation}/${cfg.f_animation}`, this._ui.sp,10,10);
                }
            }
        }
    }

    private disEff(){
        if(this.effect){
            this.effect.dispose();
            this.effect = null;
        }
    }
}