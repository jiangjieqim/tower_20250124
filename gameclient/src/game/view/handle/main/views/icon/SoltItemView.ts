import { ui } from "../../../../../../ui/layaMaxUI";
import { ISimpleEffect } from "../../../avatar/NoContainerSimpleEffect";
import { SpineEffectMgr } from "../../../avatar/SpineEffectMgr";
import { FunctionModel } from "../../../funs/FunctionModel";
import { ItemProxy } from "../../proxy/ItemProxy";
import { ItemVo } from "../../vos/ItemVo";
interface ISlotSkin extends Laya.Sprite{
    quality: Laya.Image;
    icon: Laya.Image;
    tf1: Laya.Label;
    sp1:Laya.Sprite;
}
export class ItemSlotCtl extends Laya.EventDispatcher{
    private _vo:ItemVo;
    private skin:ISlotSkin;
    private _isClick;

    private skel:ISimpleEffect;

    constructor(skin:ISlotSkin){
        super();
        this.skin = skin;
        this.skin.on(Laya.Event.DISPLAY,this,this.onDisplay);
        this.skin.on(Laya.Event.UNDISPLAY,this,this.onunDisplay);
    }
    private onClickHandler(e:Laya.Event){
        e.stopPropagation();
        if(!this._vo){
            return;
        }
        if(!this._isClick){
            return;
        }
        FunctionModel.Ins.showItemTip(this._vo,this.skin);
    }

    private onDisplay(){
        this.skin.on(Laya.Event.CLICK,this,this.onClickHandler);
    }

    private onunDisplay(){
        this.dispose();
    }

    public setData(_vo:ItemVo,isClick:boolean = true){
        this._vo = _vo;
        this._isClick = isClick;
        if(!this._vo){
            return;
        }
        if(this.skin.quality){
            this.skin.quality.skin = _vo.quaIcon();
        }
        this.skin.icon.skin = "";
        this.skin.icon.skin = _vo.getIcon();
        this.skin.tf1.text = _vo.count.toString();

        this.disposeSE();
        let cfg = ItemProxy.Ins.getCfg(_vo.cfgId);
        if(cfg.f_iconeffect != ""){
            if(!this.skel){
                // createSimpleEffectSpineCache createLoopNoSimpleEffect
                this.skel = SpineEffectMgr.createSimpleEffectSpineCache(`o/spine/succeed/${cfg.f_iconeffect}/${cfg.f_iconeffect}`, this.skin.sp1, this.skin.width / 2, this.skin.height / 2);
            }
            this.skel.play(0,true);
        }
    }

    private disposeSE(){
        if(this.skel){
            this.skel.dispose();
            this.skel = null;
        }
    }

    dispose(){
        this.disposeSE();
        this._vo = null;
        this.skin.off(Laya.Event.CLICK,this,this.onClickHandler);
    }
}
/**道具item */
export class SoltItemView extends ui.views.common.ui_slot_itemUI{
    static CLS_KEY:string = "SoltItemView";
    protected ctl:ItemSlotCtl;
    constructor(){
        super();
        this.ctl = new ItemSlotCtl(this);
    }
    public setData(_vo:ItemVo,isClick:boolean = true){
        this.ctl.setData(_vo,isClick);
    }
}