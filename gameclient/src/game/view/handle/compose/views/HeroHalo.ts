// D:\Project1\Client\towertrunk\resource\o\spine\halo7\halo7

import { FightFactory } from "../FightFactory";
import { IHaloEffect } from "./cells/DrawHaloView";
import { HeroAvatarView } from "./HeroAvatarView";

/**
*/
export class HeroHalo {
    private hero: HeroAvatarView;
    // private skel: SpineCoreSkel;
    private _halo:IHaloEffect;
    /**光圈的层级 */
    haloLayer: Laya.Sprite;
    dispose() {
        // this.skel.dispose();
        // this.skel = null;
        this._halo.dispose();
        this._halo = null;

        this.hero = null;
        Laya.timer.clear(this, this.onFrameLoop);
    }
    setHero(p: HeroAvatarView) {
        this.hero = p;
        // p.heroCfg.f_qua
        this._halo = FightFactory.createHalo(p.heroVo.fid);
    }

    constructor() {
        Laya.timer.frameLoop(1, this, this.onFrameLoop);
    }

    private onFrameLoop() {
        let haloLayer: Laya.Sprite = this.haloLayer;
        if (haloLayer && this.hero && this._halo && this._halo.container && this.hero.coreSpine.skeleton) {
            let effectContainer:Laya.Sprite = this._halo.container

            let heroSkel: Laya.Sprite = this.hero.coreSpine.skeleton;
            if (heroSkel.parent && heroSkel.parent.parent && haloLayer.parent) {
                if (!effectContainer.parent) {
                    if (this.haloLayer == heroSkel.parent) {
                        let index = heroSkel.parent.getChildIndex(heroSkel);
                        haloLayer.addChildAt(effectContainer, index);
                        effectContainer.pos(heroSkel.x, heroSkel.y);
                    } else {
                        haloLayer.addChild(effectContainer);
                    }
                }
                if (this.haloLayer == heroSkel.parent) {

                } else {
                    let pos = (heroSkel.parent as Laya.Sprite).localToGlobal(new Laya.Point(heroSkel.x, heroSkel.y));
                    let offset = (haloLayer.parent as Laya.Sprite).localToGlobal(new Laya.Point(haloLayer.x, haloLayer.y));
                    effectContainer.pos(pos.x - offset.x, pos.y - offset.y);
                }
            }
        }
    }
}