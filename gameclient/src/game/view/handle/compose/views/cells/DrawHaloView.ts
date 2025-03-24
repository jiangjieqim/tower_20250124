import { SpineCoreSkel } from "../../../avatar/spine/SpineCoreSkel";
import { EAvatarAnim } from "../../../avatar/vos/EAvatarAnim";
import { EHeroQua } from "../../t_Battle_Config";

export interface IHaloEffect {
    qua: number;
    dispose();
    container: Laya.Sprite;
}
// 英雄脚下的光圈 

export class DrawHaloView extends Laya.Sprite implements IHaloEffect {
    constructor() {
        super();
    }

    /* 
   人物脚底光圈
   1级     ffffff
   2级     3487d7
   3级     ae5bcf
   45*20
   80%透明度
   */
    set qua(v: number) {
        let color: string = "";
        switch (v) {
            case EHeroQua.White:
                color = "#ffffff";
                break;
            case EHeroQua.Blue:
                color = "#3487d7";
                break;
            case EHeroQua.Purple:
                color = "#ae5bcf";
                break;
            default:
                color = "#000000";
                break;
        }
        this.scaleY = 0.44;
        this.alpha = 0.8;
        this.graphics.clear();
        this.graphics.drawCircle(0, 0, 20, color);
    }
    get container() {
        return this;
    }
    dispose() {
        this.graphics.clear();
        this.removeSelf();
    }
}

export class SpineHaloLoad implements IHaloEffect {
    private skel: SpineCoreSkel;
    set qua(v: number) {

        let id: number = 0;
        switch (v) {
            case EHeroQua.Orange:
                id = 1;
                break;
            case EHeroQua.Red:
                id = 2;
                break;
            default:
                id = 1;
                break;
        }
        let _skel = new SpineCoreSkel();
        _skel.load(`o/spine/halo/halo${id}/halo${id}.skel`);
        _skel.play(EAvatarAnim.TowerIdle);
        this.skel = _skel;
    }
    dispose() {
        this.skel.dispose();
        this.skel = null;
    }

    get container(): Laya.Sprite {
        return this.skel && this.skel.skeleton;
    }
}