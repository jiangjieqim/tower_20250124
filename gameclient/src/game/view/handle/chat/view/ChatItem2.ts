import { ui } from "../../../../../ui/layaMaxUI";
import { stChat } from "../../../../network/protocols/BaseProto";
import { NoContainerSimpleEffect } from "../../avatar/NoContainerSimpleEffect";
import { SpineEffectMgr } from "../../avatar/SpineEffectMgr";
import { ChengHaoCtl } from "../../common/ChengHaoCtl";
import { HeadCtl } from "../../common/HeadCtl";
import { MainModel } from "../../main/model/MainModel";
import { t_World_Chat_Degree } from "../proxy/t_World_Chat_Degree";

export class ChatItem2 extends ui.views.chat.ui_chatItem1UI{
    private _ctl:ChengHaoCtl;
    private _ctl1:HeadCtl;
    private effect:NoContainerSimpleEffect;
    private effectTR:NoContainerSimpleEffect;

    private _inx:number;
    private _inx1:number;

    constructor(){
        super();
        this.on(Laya.Event.DISPLAY,this,this.onDisplay);
        this.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);

        this._inx = this.view1.x;
        this._inx1 = this.sp_v.x;

        this._ctl = new ChengHaoCtl(this.view1);
        this._ctl1 = new HeadCtl(this.view);
    }

    private onDisplay(){
        
    }

    private onUnDisplay(){
        this.disEff();
    }

    public setData(value:stChat){
       if(!value)return;
        this._ctl.setData(value.titleId);
        this.lab_lv.text = value.level + "";
        this.lab1.text = value.nickName;
        this.lab_tr.text = value.trophy + "";

        this.disEff();
        if(value.diamond){
            if (!this.effectTR) {
                this.effectTR = SpineEffectMgr.createLoopNoSimpleEffect(`o/spine/succeed/vip_baoshi/vip_baoshi`, this.sp_v, -10, this.sp_v.height);
            }
            this.sp_v.x =  this._inx1 + (this.lab1.width - this.lab1.textField.textWidth);
            this.view1.x = this._inx + (this.lab1.width - this.lab1.textField.textWidth) - 42;
        }else{
            this.view1.x = this._inx + (this.lab1.width - this.lab1.textField.textWidth);
        }

        let headUrl = MainModel.Ins.convertHead(value.headUrl);
        this._ctl1.setData(headUrl,value.headFrame);
        // let cfg = t_World_Chat_Degree.Ins.getCfg(value.trophyStage);
        // this.img.skin = "remote/base/t_jl_d_" + cfg.f_background + ".png";
        // this.img1.skin = `o/trophyicon/${cfg.f_degree}.png`;

        if(value.emojiId){
            this.img2.visible = this.lab.visible = false;
            this.sp.visible = true;
            if(!this.effect){
                this.effect = SpineEffectMgr.createLoopNoSimpleEffect(`o/spine/face/${value.emojiId}/${value.emojiId}`,this.sp,this.sp.width/2,this.sp.height);
            }
        }else{
            this.img2.visible = this.lab.visible = true;
            this.sp.visible = false;
            this.lab.text = value.chat;
            if(this.lab.textField.textHeight > (this.lab.fontSize + this.lab.leading)){
                this.lab.align = "left";
                this.lab.x = 41;
            }else{
                this.lab.align = "right";
                this.lab.x = 36;
            }
            this.img2.width = this.lab.textField.textWidth + 52;
            this.img2.height = this.lab.textField.textHeight + 42;
        }
    }

    private disEff(){
        if(this.effect){
            this.effect.dispose();
            this.effect = null;
        }
        if(this.effectTR){
            this.effectTR.dispose();
            this.effectTR = null;
        }
    }
}