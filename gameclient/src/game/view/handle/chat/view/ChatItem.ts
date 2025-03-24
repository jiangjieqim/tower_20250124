import { ui } from "../../../../../ui/layaMaxUI";
import { NoContainerSimpleEffect } from "../../avatar/NoContainerSimpleEffect";
import { SpineEffectMgr } from "../../avatar/SpineEffectMgr";

export class ChatItem extends ui.views.chat.ui_chatItem2UI{
    private effect:NoContainerSimpleEffect;

    constructor(){
        super();
        this.on(Laya.Event.DISPLAY,this,this.onDisplay);
        this.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
    }

    private onDisplay(){
        
    }

    private onUnDisplay(){
       this.disEff();
    }

    public setData(value:Configs.t_World_Chat_Emoji_dat){
        if(!value)return;
        this.disEff();
        if(!this.effect){
            this.effect = SpineEffectMgr.createLoopNoSimpleEffect(`o/spine/face/${value.f_emoji}/${value.f_emoji}`,this,this.width/2,this.height);
        }
    }

    private disEff(){
        if(this.effect){
            this.effect.dispose();
            this.effect = null;
        }
    }
}