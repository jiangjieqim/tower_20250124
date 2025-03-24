import { NoContainerSimpleEffect } from "../avatar/NoContainerSimpleEffect";
import { SpineEffectMgr } from "../avatar/SpineEffectMgr";

export class HandAnim {
    private effect: NoContainerSimpleEffect;
    constructor(con: Laya.Sprite, ox: number = 0, oy: number = 0) {
        let animKey: string = "Click_1";
        this.effect = SpineEffectMgr.createLoopNoSimpleEffect(`o/spine/scene/${animKey}/${animKey}`, con, ox, oy);
    }

    dispose() {
        if (this.effect) {
            this.effect.dispose();
            this.effect = null;
        }
    }

    set visible(v:boolean){
        if(this.effect){
            if(v){
                this.effect.play(0,true);
            }else{
                this.effect.stop()
            }
        }
    }
}