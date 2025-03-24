import { AvatarFactory } from "../AvatarFactory";
import { EAvatarEffectAnim } from "../AvatarView";
import { BaseSpineCoreSkel } from "./BaseSpineCoreSkel";
import { PureEffect } from "./PureEffect";
import { SpineAnimResultVo, SpineAnimUtils } from "./SpineAnimUtils";
import { SpineUtil } from "./SpineManager";
import { TemplateCache } from "./SpineTemplateCache";
/**战斗特效 */
export class FightPureAnim extends PureEffect{
    autoFree:boolean;//自动释放
    public poolCache:boolean = false;
    private _curText:SpineAnimResultVo[];
    private _valList:SpineAnimResultVo[] = [];
    private valStr:string = "";
    constructor(url:string=null,parent:Laya.Sprite = null){
        super();
        this.parent = parent;
        if(url){
            this.load(url);
        }
    }

    // protected completeAction(){ 
        // super.completeAction();
        // this.setText(this.animIndex, this._curText);
    // }

    protected onLoadFinish(cache:TemplateCache){
        super.onLoadFinish(cache)
        this.setText(this.anim, this._curText,this.valStr);
    }

    private get urlKey(){
        return this.url.replace(".skel", ".png");
    }
    private refresh(val:SpineAnimResultVo[]) {
        for(let i = 0;i < val.length;i++){
            let cell:SpineAnimResultVo = val[i];
            let status:boolean = SpineUtil.f_setSlotUV(this.baseSkel, this.urlKey, cell.slot, cell.uv);
            if(status){
                val.splice(i,1);
                i--;
            }else{
                // console.log("draw.." + i);
                // LogSys.Warn(`${this.url} is false  , ${this.urlKey}. ${this.valStr}`);
            }
        }
    }

    protected onLoopHandler(){
        if (this.baseSkel && this.baseSkel.playState == Laya.SpineSkeleton.playing 
            && this.baseSkel.parent && !this.baseSkel.destroyed) 
        {
            // LogSys.Warn(`this.baseSkel.playState: ${this.baseSkel.playState} ${this.valStr}`);
            this.refresh(this._valList);
        }
    }

    /**启动动画 */
    public setText(animIndex:number,val:SpineAnimResultVo[],str?:string){
        val = val || [];
        this.valStr = str;
        this._curText = val;
        if(this.isLoaded){
            this._valList = val;
            this.refresh(val);
        }else{
            // this._curText = val;
        }
        this.play2(animIndex,false,true,this,this.onAnimComplete);
    }

    protected onAnimComplete(){
        if(this.poolCache){
            Laya.Pool.recover("FightPureAnim",this);
            AvatarFactory.effLength--;
            // LogSys.Log("AvatarFactory.effLength:"+AvatarFactory.effLength);
        }
        if(this.autoFree){
            this.dispose();
        }
        this.event(BaseSpineCoreSkel.PLAY_END);
    }

    public poolPlay(anim:EAvatarEffectAnim,val:string = ""){
        if(val.length > 0){
            let result = SpineAnimUtils.createFight(SpineUtil.fightEffectAtlas,anim,val);
            // LogSys.Warn(`Play... ${val}`);
            this.setText(anim,result,val);
        }else{
            this.play2(anim,null,null,this,this.onAnimComplete);
        }
    }

    // public playParam(index:number,loop:boolean = false,force:boolean = false ,start:number = 0,stop:number = 0,
    //     that = null,endCall:Function = null,arg = null){
    //     super.play(index,loop,force,start,stop,that,endCall,arg);
    // }
    // public play(anim:number){
    // super.play(anim);
    // }

    // public play(anim:number){
    //     super.play(anim);
    // }
    /**播放普通飘字扣血 */
    private playNormalBlood(v:string){
        this.poolPlay(EAvatarEffectAnim.NormalBloodTxt,v);
    }
    /**播放暴击飘字扣血 */
    private playCsBloodTxt(v:string){
        this.poolPlay(EAvatarEffectAnim.CsBloodTxt,v);
    }
    
    /**闪避和连击特效 */
/*
    public play_Dodge_LianJi_Effect(val: EActionSkill) {
        let s = "";
        switch (val) {
            case EActionSkill.PassiveDodge:
                // s = "闪避";
                this.bloodPlay(EAvatarEffectAnim.Dodge, "");
                break;
            case EActionSkill.LianJi:
                this.bloodPlay(EAvatarEffectAnim.Lianji, "");
                break;
            default:
                s = "skill id:" + val;
                console.log("###" + s.toString());
                break;
        }
    }
*/
    /**加血 数字飘字动画 */
    public flyBlood(v:number,criticalStrike:boolean,anim:EAvatarEffectAnim){
        if(v >= 0){
            let _sign:string = "";
            //加血
            _sign = "+";
            this.poolPlay(anim,_sign + v);
        } else {
            //伤害减血
            if (criticalStrike) {
                this.playCsBloodTxt(v.toString());
            } else {
                this.playNormalBlood(v.toString());
            }
        }
    }
}