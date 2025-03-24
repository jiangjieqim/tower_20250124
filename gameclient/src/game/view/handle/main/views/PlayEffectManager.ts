import { BaseSpineCoreSkel } from "../../avatar/spine/BaseSpineCoreSkel";
import { BetterEffectSpine } from "./Sell2Spine";

export class PlayEffectManager {
    private static _ins: PlayEffectManager;
    public static get Ins() {
        if (!this._ins) {
            this._ins = new PlayEffectManager();
        }
        return this._ins;
    }

    playStarWar(url:string,con:Laya.Sprite,x:number,y:number,val:number,index:number,that,func:Function){
        let atlasurl = url.replace(".skel", ".atlas");
        Laya.loader.load(atlasurl,new Laya.Handler(this,()=>{
            let _animCtl = new BetterEffectSpine();
            _animCtl.autoFree = true;
            _animCtl.setPos(con,x,y);
            _animCtl.load(url);

            // _animCtl.anim = index;
            // _animCtl.once(Laya.Event.COMPLETE,this,()=>{
            // _animCtl.xxzdz(val,index,this,()=>{
            //     _animCtl.dispose();
            //     // func.call(that);
            //     handler.run();
            // });
    
            _animCtl.xxzdz(val,index);
            if(that){
                _animCtl.once(BaseSpineCoreSkel.PLAY_END,that,func);
            }
            // });
        }),null,Laya.Loader.TEXT);      
    }
}