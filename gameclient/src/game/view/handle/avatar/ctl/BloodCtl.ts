import { AnimConfig } from "../../../../../InitConfig";

export interface IBloodSkin extends Laya.Sprite{
    bg:Laya.Image;
    b1:Laya.Image;
    b2:Laya.Image;//背景
}
/**血条控制器 */
export class BloodCtl{
    private skin:IBloodSkin;
    // private tween:Laya.Tween;
    private yellowTween:Laya.Tween;
    private mask1:Laya.Sprite;
    
    private _val:number = 1;
    private _yellowval:number = 1;
    private _yellowMask:Laya.Sprite = new Laya.Sprite();
    private playTime:number = 250;
    /**血条需要的时间 */
    public static UseTime:number = 0;
    set visible(v:boolean){
        // this.skin.bg.visible = this.skin.b1.visible = this.skin.b2.visible = v;
        this.skin.visible = v;
    }
    get visible(){
        return this.skin && this.skin.visible;
    }
    constructor(skin:IBloodSkin){
        this.skin = skin;
        let mask1:Laya.Sprite = new Laya.Sprite();
        skin.b1.mask  = mask1;
        this.mask1 = mask1;
        skin.b2.mask = this._yellowMask;
        this.playTime /= AnimConfig.AnimScale;
        BloodCtl.UseTime = 1.5 * this.playTime;
    }
    private set yellowval(val:number){
        this._yellowval = val;
        let mask1 = this._yellowMask;
        let skin = this.skin;
        mask1.graphics.clear();
        let w = skin.b2.width * val;
        if(w <= 0){
            // this.visible  = false;
            w = 1;
        }
        mask1.graphics.drawRect(0,0,w,skin.b2.height,"#00ff00");
    }
    set val(val:number){
        // console.log("val:"+val);
        this._val = val;
        let mask1 = this.mask1;
        let skin = this.skin;
        mask1.graphics.clear();
        let w = skin.b1.width * val;
        if(w <= 0){
            w = 1;
            //this.visible  = false;
        }
        mask1.graphics.drawRect(0,0,w,skin.b1.height,"#00ff00");
    }

    get val(){
        return this._val;
    }
    private get yellowval(){
        return this._yellowval;
    }
    public setValue(v:number){
        if (v < 0.01) {
            if(v > 0){
                v = 0.01;
            }else{
                v = 0;
            }
        }
        // console.log("setValue:",v);
        if(v > 0 && !this.visible){
            this.visible = true;
            // if(E.Debug){
            //     console.log("===============>隐藏转显示");
            // }
        }
        this.val = v;
        Laya.timer.once(this.playTime/2,this,this.delayTime,[v]);
    }

    private delayTime(v:number){
        if(!this.yellowTween){
            this.yellowTween = new Laya.Tween();
        }
        this.yellowTween.clear();
        this.yellowTween.to(this,{yellowval:v},this.playTime,null,new Laya.Handler(this,this.onComplete));
    }

    private onComplete(){
        if(this._val <=0){
            this.visible = false;
            // LogSys.Log("end ==== >" + this._val + " 隐藏血条");
        }else{
            // this.visible = true;
        }
    }
    /**初始化 */
    public initVal(v:number){
        this.visible  = true;
        this.val = v;
        this.yellowval = v;   
    }

}