import { NoContainerSimpleEffect } from "../../avatar/NoContainerSimpleEffect";
import { SpineEffectMgr } from "../../avatar/SpineEffectMgr";
import { ComposeEvent } from "../ComposeEvent";
import { ComposeModel } from "../ComposeModel";

export class BaseBtnDecorator{
    protected btnSkin: Laya.Sprite;
    protected effect: NoContainerSimpleEffect;

    constructor(btnSkin: Laya.Sprite){
        this.btnSkin = btnSkin;
    }
    protected get model() {
        return ComposeModel.Ins;
    }
    protected disposeEffect() {
        if (this.effect) {
            this.effect.dispose();
            this.effect = null;
        }
    }

    protected startPlay(animIndex:number,url:string){
        this.disposeEffect();
        if(animIndex!=-1){
            this.effect = SpineEffectMgr.createLoopNoSimpleEffect(url, this.btnSkin, this.btnSkin.width / 2, this.btnSkin.height / 2, animIndex, 1);
        }
    }
}

/**
 * 祈愿按钮装饰器
 */
export class SupplicatiorDecorator extends BaseBtnDecorator{

    constructor(btnSkin: Laya.Sprite) {
        super(btnSkin);
    }

    onInit() {
        this.model.on(ComposeEvent.SupplicationBtnUpdate, this, this.onRefresh);
        this.onRefresh();
    }

    private onRefresh() {
        let supplicationVo = this.model.supplicationVo;
        let animIndex: number = supplicationVo.animIndex;
        this.startPlay(animIndex,supplicationVo.aniRes);
    }
    onExit() {
        this.model.off(ComposeEvent.SupplicationBtnUpdate, this, this.onRefresh);
        this.disposeEffect();
    }
}