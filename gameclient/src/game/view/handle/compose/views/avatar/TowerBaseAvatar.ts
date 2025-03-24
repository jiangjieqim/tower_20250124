import { SpineEffectMgr } from "../../../avatar/SpineEffectMgr";
import { ComposeModel } from "../../ComposeModel";
import { FightFactory } from "../../FightFactory";
import { EAvatarLayar, EFightLayer, IPlayOnceAvatar } from "../../vos/EFightEnum";
import { FightValueConfig } from "../../vos/FightValueConfig";
import { FightMonsterDebug } from "../debug/FightMonsterDebug";
import { ITowerMonster } from "../ITowerMonster";
import { ITowerAvatarBehaviour } from "./ITowerAvatarBehaviour";
import { NormalAvatarEffect } from "./NormalAvatarEffect";
/**角色基础抽象类 */
export abstract class TowerBaseAvatar implements ITowerAvatarBehaviour {
    effectList: NormalAvatarEffect[] = [];

    coreSpine: ITowerMonster;
    /**
     * 父容器对象
     */
    parent: Laya.Sprite;
    /**是否销毁了 */
    isDestory: boolean = false;

    chindIndex: number = -1;
    /**是否加载完成 */
    isLoaded: boolean = false;

    /**动画播放速度 */
    playSpeed: number = 1;

    /**更新播放比率 */
    updatePlaybackRate() {
        let v: number = this.playSpeed * FightValueConfig.speedScale;
        if (this.coreSpine) {
            this.coreSpine.playbackRate(v);
        }
    }
    /**创建一个avatar渲染对象 */
    abstract create(): ITowerMonster;
    /**特效检测 */
    protected abstract checkTarget(obj: IPlayOnceAvatar): boolean;
    protected abstract onSpine1Complete();

    /**在所在层级播放一次特效 */
    protected playOnceEffect(url: string, layer: EAvatarLayar,offsetY:number) {
        if (!this.isDestory) {
            if(this.coreSpine && this.coreSpine.skeleton){
                SpineEffectMgr.playAvatarEffectOnce(this.model.fightView.getLayer(EFightLayer.HitMonsterLayer),this,url,0,offsetY);
            }
        }
        else{
            LogSys.Warn(`playOnceEffect fail ${url},avatar is isDestory!`);
        }
    }


    protected get model(){
        return ComposeModel.Ins;
    }

    dispose() {
        this.isDestory = true;
        this.playSpeed = 1;
        this.chindIndex = -1;
        while (this.effectList.length) {
            let cell = this.effectList.shift();
            cell.dispose();
        }
        if (this.coreSpine) {
            if (this.coreSpine.skeleton) {
                let src: Laya.Script = this.coreSpine.skeleton.getComponent(FightMonsterDebug);
                if (src) {
                    src.destroy();
                }
            }
            this.coreSpine.playbackRate(1);
            this.coreSpine.off(Laya.Event.COMPLETE, this, this.onSpine1Complete);
            this.coreSpine.dispose();
            this.coreSpine = null;
        }
    }
    bindEffect(url: string, ox: number = 0, oy: number = 0) {
        this.disposeBindEffect(url);
        FightFactory.createAvatarEasyEffect(this, url,ox,oy);
    }
    disposeBindEffect(url: string) {
        let cellIndex = this.effectList.findIndex(o => o.resURL == url);
        if (cellIndex != -1) {
            this.effectList[cellIndex].dispose();
        }
    }
}