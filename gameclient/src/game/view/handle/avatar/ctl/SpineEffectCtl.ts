import { SimpleEffect } from "../SimpleEffect";

export class SpineEffectCtl{
    private effect:SimpleEffect;
    private con:Laya.Sprite;
    constructor(con:Laya.Sprite){
        this.con = con;
    }
    public play(url:string,animIndex:number = 0){
        if(!this.effect){
            this.effect = new SimpleEffect(this.con,url);
            this.effect.autoPlay = true;
        }
        this.effect.play(animIndex,true);
    }

    public stop(){
        if(this.effect){
            this.effect.stop();
        }
    }

    public dispose(){
        this.effect.dispose();
    }
}