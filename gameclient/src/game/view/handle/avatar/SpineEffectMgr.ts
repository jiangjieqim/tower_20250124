import { TowerBaseAvatar } from "../compose/views/avatar/TowerBaseAvatar";
import { AvatarOnceEffect } from "../compose/views/cells/AvatarOnceEffect";
import { NoContainerSimpleEffect } from "./NoContainerSimpleEffect";

export class SpineEffectMgr {

    /**只播放一次,播发完成销毁 */
    public static playOnce(url: string, container: Laya.Sprite, x: number = 0, y: number = 0, index: number = 0, childIndex = -1,playEnd:Laya.Handler = null) {
        // let spine = new SimpleEffect(container, url, x, y);
        // spine.playEndDisplse(index);
        let effect = new NoContainerSimpleEffect(url);
        effect.childIndex = childIndex;
        effect.container = container;
        effect.offsetX = x;
        effect.offsetY = y;
        effect.init();
        effect.play(index, false, this, this.onPlayEnd,[effect,playEnd]);
        effect.autoPlay = true;
        return effect;
    }

    private static onPlayEnd(effect:NoContainerSimpleEffect,playEnd:Laya.Handler){
        effect.dispose();
        if(playEnd){
            playEnd.run();
        }
    }

    public static playOnceEnd(url: string, container: Laya.Sprite,playEnd:Laya.Handler = null,ox:number = 0,oy:number = 0){
        return this.playOnce(url,container,ox,oy,undefined,undefined,playEnd);
    }

    /**TowerBaseAvatar创建一个只播放一次的特效 */
    public static playAvatarEffectOnce(layer:Laya.Sprite,avatar:TowerBaseAvatar,url:string,ox:number,oy:number){
        let effect = new AvatarOnceEffect();
        effect.offsetX = ox;
        effect.offsetY = oy;
        effect.play(layer,avatar,url);
    }

    /**创建一个指向容器循环特效 */
    static createLoopNoSimpleEffect(url: string, container: Laya.Sprite, ox: number = 0, oy: number = 0, animIndex: number = 0, childIndex: number = -1, mScale: number = 1){
        let effect = new NoContainerSimpleEffect(url);
        effect.mScale = mScale;
        effect.childIndex = childIndex;
        effect.container = container;
        effect.offsetX = ox;
        effect.offsetY = oy;
        effect.init();
        effect.play(animIndex, true);
        return effect;
    }

    /**
     * 创建Spine缓存池中的特效 
     * 该特效不会频繁创建和销毁
    */
    static createSimpleEffectSpineCache(url: string, container: Laya.Sprite, ox: number = 0, oy: number = 0) {
        let effect = new NoContainerSimpleEffect(url);
        effect.useSpineCache = true;
        effect.mScale = 1;
        effect.childIndex = -1;
        effect.container = container;
        effect.offsetX = ox;
        effect.offsetY = oy;
        effect.init();
        effect.play(0, true);
        return effect;
    }

    /**创建一个指向容器非循环特效 */
    static createNoSimpleEffect(url: string, container: Laya.Sprite, ox: number = 0, oy: number = 0, childIndex: number = -1, mScale: number = 1) {
        let effect = new NoContainerSimpleEffect(url);
        effect.mScale = mScale;
        effect.childIndex = childIndex;
        effect.container = container;
        effect.offsetX = ox;
        effect.offsetY = oy;
        effect.init();
        // effect.play(animIndex, true);
        return effect;
    }

    private static onComplete(effect: NoContainerSimpleEffect, that, func: Function) {
        func.call(that, effect);
        effect.dispose();
    }

    static getAnimDuration(url: string, index: number, that, func: Function) {
        let effect = new NoContainerSimpleEffect(url);
        effect.init();
        effect.play(index);
        effect.once(Laya.Event.COMPLETE, this, this.onComplete, [effect, that, func]);
        // that,()=>{
        //     func.call(that,effect);
        //     effect.dispose();
        // }
    }

    /**创建一个勋章特效 */
    static createMedalEffect(eff:Laya.Sprite,cfgTr:Configs.t_Medal_dat,_scale:number = 1){
        eff.scaleX = eff.scaleY = cfgTr.f_size_zoom / 100 * _scale;
        let _hzEff = this.createLoopNoSimpleEffect(`o/spine/succeed/${cfgTr.f_medal_id}/${cfgTr.f_medal_id}`,eff);
        return _hzEff;
    }

    /**创建一个英雄皮肤标签特效 */
    static createIllustration(cfg: Configs.t_Hero_Skin_dat,eff:Laya.Sprite,_mScale:number = 1) {
        let url = cfg.f_qua_label.split("-")[1];
        let scale = _mScale;
        let _spineEff = this.createLoopNoSimpleEffect(`o/spine/succeed/${url}/${url}`, eff, undefined, undefined, undefined, undefined, scale);
        return _spineEff;
    }
}