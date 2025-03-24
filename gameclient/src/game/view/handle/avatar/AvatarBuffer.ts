import { BaseCfg } from "../../../static/json/data/BaseCfg";
import { SimpleEffect } from "./SimpleEffect";

class t_BufferEffect extends BaseCfg{
    public GetTabelName():string{
        return "t_BufferEffect";
    }
    public static get Ins(){
        if(!this._ins){
            this._ins = new t_BufferEffect();
        }
        return this._ins;
    }
    private static _ins:t_BufferEffect;
}
/**buffer特效*/
export class AvatarBuffer {
    con:Laya.Sprite;
    private efflist:SimpleEffect[]=[];
    private getURL(id:number){
        // let l:Configs.t_BufferEffect_dat[] = t_BufferEffect.Ins.List;
        // let cfg =  l.find(cell=>cell.f_id == id);
        // let urlKey:string = cfg.f_res;
        // // urlKey = "cardfly";
        // let url = `o/spine/${urlKey}/${urlKey}`
        // return url
        return "";
    }

    play(id:number){
        let url = this.getURL(id);

        let eff1 =  this.efflist.find(cell=>cell.mUrl == url);
        let eff:SimpleEffect;
        if(eff1){
            eff = eff1;
        }else{
            eff = new SimpleEffect(this.con, url);
            this.efflist.push(eff);
        }
        eff.play(0,true);
    }

    stop(id:number){
        let url = this.getURL(id);
        let eff1 =  this.efflist.find(cell=>cell.mUrl == url);
        if(eff1){
            eff1.stop();
        }
    }

    dispose(){
        while(this.efflist.length){
            let eff = this.efflist.shift();
            eff.dispose();
        }
    }
}