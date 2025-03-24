import { BloodCtl } from "./ctl/BloodCtl";
// ui.views.maoxian.ui_blood_viewUI
export class AvatarBloodSpine extends Laya.Sprite{
    // private effect:SimpleEffect;
    // public fightEffect:FightPureAnim;

    private _bloodVal:number = 0;
    private _bloodCtl:BloodCtl;
    private tf:Laya.Label;
    public curBlood:number = 0;//当前剩余的血量
    private _testStr:string;
    // private starCtl:FuJiangStarCtl;
    private _skillTween:Laya.Tween = new Laya.Tween();
    // private container:Laya.Sprite;
    // private _subFont:SpineFontTexture;
    /**设置初始化血量 */
    
    // public set bloodVal(v){
    // this.curBlood = v;
    // this._bloodVal = v;
    // this.setValue(1);
    // }

    /**血条上限 */
    get maxBlood(){
        return this._bloodVal;
    }

    /**血条是否显示着 */
    get isShow(){
        return this._bloodCtl && this._bloodCtl.visible;
    }

    public setInit(cur:number,max:number){
        this.curBlood = cur;
        this._bloodVal = max;
        this.setValue(cur/max);
    }

    public dispose(){

        // this.removeSelf();
        // this.destroy();
    }

    /**当前的血条 */
    public get curBloodVal(){
        return this.curBlood;
    }
    constructor(){
        super();
        // this._bloodCtl = new BloodCtl(this);
        // this.skillTf.visible = false;
        // this.con1.visible = false;
    }

    // private initFightEffect(){
    //     this.fightEffect =  new FightPureAnim();
    //     this.fightEffect.load(IconUtils.effect+".skel");
    // }

    public playSkillTxt(f_SkillType:number,f_SkillName:string){
        /**
         *   1:主动触发
         *   2：被动触发
         */
        /*
        if(f_SkillType == 1){
            this.skillTf.color = "#FFFF99";
            this.skillTf.strokeColor = "#9F540C";

        }else if(f_SkillType == 2){
            this.skillTf.color = "#996AD8";
            this.skillTf.strokeColor = "#460548";
        }
        this.skillTf.visible = true;
        this.skillTf.alpha = 0.5;
        this.skillTf.y = 100;
        // this.skillTf.scaleX = this.skillTf.scaleY = 0.5;
        this.skillTf.text = f_SkillName;
        this._skillTween.clear();
        this._skillTween.to(this.skillTf,{scaleX:1,scaleY:1,alpha:1.0,y:0},2000/AnimConfig.AnimScale,null,new Laya.Handler(this,this.skillTxtEnd));
        */
    }

    private skillTxtEnd(){
        // this.skillTf.visible = false;
    }

    public reverse(){
        // this.p1.scaleX = -this.p1.scaleX;
    }

    public setHeadTxt(name:string,lv:number){
        /*
        if(E.getLang("hideavatarname") == "1" || StringUtil.IsNullOrEmpty(name)){
            this.con1.visible = false;
        }else{
            this.con1.visible = true;
            this.nameTf.text = `Lv.${lv} ${name}`;
            // this.starCtl.setStar(vo.star);
            // this.starCtl.centerX();
        }
        */
    }

    public set bgVisible(v:boolean){
        // this.p1.visible = v;
    }

    public reset(){
        // if(this.fightEffect){
        //     this.fightEffect.stop();
        // }
        this._bloodCtl.initVal(1);
        this.bgVisible = true;
    }
    /**设置血条百分比 */
    private setValue(v:number){
        this._bloodCtl.setValue(v);
    }

    get percent(){
        return this._bloodCtl.val;
    }
    /**
     * @param v 飘字的值
     */
    public flyTxt(v:number){
        this.curBlood = this.curBlood + v;
        if (this.curBlood < 0) {
            // this.curBlood = 0;
        }else if(this.curBlood > this._bloodVal){
            this.curBlood = this._bloodVal;
        }
        this.setValue(this.curBlood/this._bloodVal);
        // if(E.Debug){
        //     if(!this.tf){
        //         this.tf = new Laya.Label();
        //         this.addChild(this.tf);
        //         this.tf.color = "#ffffff";
        //         this.tf.stroke = 2;
        //         this.tf.strokeColor = "#000000";
        //         this.tf.fontSize = 22;
        //         this._testStr = "["+this._bloodVal+"]\n";
        //     }
        //     this.tf.x = -this.p1.scaleX*this.width;
        // }
    }
}
