import { GameTex } from "../../../../frame/view/GameList";
import { ViewBase } from "../../../../frame/view/ViewBase";
import { EPageType } from "../../../common/defines/EnumDefine";
import { E } from "../../../G";
import { NoContainerSimpleEffect } from "../avatar/NoContainerSimpleEffect";
import { AssetConfig } from "../avatar/spine/AssetConfig";
import { SpineEffectMgr } from "../avatar/SpineEffectMgr";
export class LoadingVo{
    start:number;
    end:number
    /**使用的时间 */
    duration:number;
    callBack:Laya.Handler;
}

// let loadName:string = `ui_loading`;

// class LoadingUI extends ui.views.common.ui_loadingUI{
//     createChildren():void {
//         super.createChildren();
//         this.loadScene(`${loadName}`);
//     }
// }
class LoadingUI extends Laya.View {
    public progressSkin:Laya.Sprite;
    public progressSkinBg:Laya.Sprite;
    public progressTf:Laya.Label;
    public kedu:Laya.Image;
    // private bg:GameTex;
    constructor(){ 
        super();
        this.width = 750;
        this.height = 1334;
        let bg = new GameTex();
        bg.skin = AssetConfig.bg;
        bg.centerX = bg.centerY = 0;
        // this.bg = bg;
        this.addChild(bg);
        
        this.progressSkin = new Laya.Sprite();//Laya.Loader.getRes(`remote/base/jdt_d2.png`)
        // this.progressSkin.sizeGrid = `0,18,0,18`;
        this.progressSkin.pos(38,1397);
        this.progressSkin.size(682,32);
        this.progressSkin.graphics.drawRect(0,0,this.progressSkin.width,this.progressSkin.height,"#000000");

        // this.addChild(this.progressSkin);
        bg.addChild(this.progressSkin)

        this.progressSkinBg = new Laya.Sprite();//Laya.Loader.getRes(`remote/base/jdt_s2.png`)
        // this.progressSkinBg.sizeGrid = "0,24,0,24";
        this.progressSkinBg.pos(5,4);
        this.progressSkinBg.size(672,24);
        this.progressSkin.addChild(this.progressSkinBg);
        this.progressSkinBg.graphics.drawRect(0,0,this.progressSkinBg.width,this.progressSkinBg.height,"#000000");

        this.progressTf = new Laya.Label();
        this.progressTf.centerX = 0;
        this.progressTf.centerY = -31;
        this.progressTf.font = "BOLD";
        this.progressTf.fontSize = 22;
        this.progressTf.color = "#ffffff";
        this.progressTf.stroke = 3;
        this.progressTf.strokeColor = "#D06006";
        this.progressSkin.addChild(this.progressTf);

        this.kedu = new Laya.Image();
        this.progressSkin.addChild(this.kedu);
        this.kedu.pos(5,28);
        this.kedu.size(10,10);
        this.kedu.anchorX = 0.5;
    }
    // createChildren():void {
        // super.createChildren();
        // this.loadScene("views/common/ui_loading");
        // Laya.timer.once(1000,this,()=>{
        // this.loadScene(`${loadName}`);
        // })
    // }
    // dispose(){
    // Laya.Loader.clearTextureRes(this.bg.skin);
    // this.bg.dispose();
    // }
}

/**加载页面*/
export class LoadingView extends ViewBase  {
    public PageType: EPageType = EPageType.None;
    protected checkGuide:boolean = false;
    private _ui: LoadingUI;
    // protected autoFree:boolean = true;
    private initProgressW:number = 0;
    private effect:NoContainerSimpleEffect;
    private yellowbg:Laya.Sprite;
    protected onEnter() {

    }
    protected onExit() {
        // this._ui.dispose();
        E.taLoginTrack("loadingcomplete");
        // console.log("loading完成")
        this.disposeEffect();
    }
    protected onFirstInit() {
        if(!this.UI){
            this.UI = this._ui = new LoadingUI();
            this.yellowbg = new Laya.Sprite();
            // this.yellowbg.alpha = 0.5;
            this._ui.progressSkinBg.addChild(this.yellowbg);
            this.initProgressW = this._ui.progressSkinBg.width;
            //, this._ui.width/2, this._ui.height/2
        }
    }
    private disposeEffect(){
        if(this.effect){
            this.effect.dispose();
            this.effect = null;
        }
    }
    protected onInit() {
        this.disposeEffect();
        if(!initConfig.disable_loading_effect){
            this.effect = SpineEffectMgr.createLoopNoSimpleEffect(`o/spine/scene/dutiao/dutiao`, this._ui.kedu);
        }
        E.taLoginTrack("startloading");
        // console.log("显示加载界面")
        this.initUI();

        if(this.Data instanceof LoadingVo){
            let vo:LoadingVo = this.Data;
            this.playAnim(vo);
        }
    }

    protected onAddLoadRes() {
    }

    /**添加事件监听 */
    protected onAddEventListener() {

    }

    protected onChangeLanguage() {

    }
    //#endregion

    private _flag:boolean;
    // private _prog: number = 0;
    private _curVal:number = 0;
    /**进度刷新
     * @param num 进度值 0-1
    */
    public UpdateProgress(num: number) {
        if(this._ui.destroyed){
            return;
        }

        this._curVal = num;
        // console.log("num:::::::" + num);
        // this._prog = MathUtil.Clamp(num, 0, 1.0);
        // console.log("_prog:::::::" + this._prog);

        //刷新

        let showKedu:boolean = true;
        let flag:boolean = true;
        let v = Math.floor(num * 100).toString();
        this._ui.progressTf.text =     `正在加载中...${v}%`;
        //E.getLang("loading",v);//Math.floor(num * 100).toString()+"%";
        if (num > 0 && num <= 1) {
            if((num*100 > 50) && !this._flag){
                E.taLoginTrack("loading50");
                // console.log("loading50");
                this._flag = true;
            }
            
            this._ui.progressSkinBg.width = /*this._ui.progressSkin.width*/this.initProgressW * num;
            this.keduPosX = this._ui.progressSkinBg.width;// - this._ui.kedu.width;
           
        }else if(num <= 0){
            showKedu = false;
        }else{
            this._ui.progressSkinBg.width = this.initProgressW/*this._ui.progressSkin.width*/;
            this.keduPosX = this._ui.progressSkinBg.width;// - this._ui.kedu.width;
        }
        if(showKedu){
            this._ui.progressSkinBg.visible = true;
            this._ui.kedu.visible = true;
        }else{
            this._ui.progressSkinBg.visible = false;
            this._ui.kedu.visible = false;
        }
        this.yellowbg.graphics.clear();
        this.yellowbg.graphics.drawRect(0,0,this._ui.progressSkinBg.width,this._ui.progressSkinBg.height,"#ffff00");
    }

    private set keduPosX(x:number){
        this._ui.kedu.x = x;
    }
    
    private initUI() {
    }
    private _tween:Laya.Tween = new Laya.Tween();
    /**播放进度条动画 */
    public playAnim(vo:LoadingVo){
        let start:number = vo.start;
        let end:number = vo.end;
        let complete:Laya.Handler = vo.callBack;
        let  duration:number=vo.duration;
        this._tween.clear();
        this.curVal = start;
        this._tween.to(this,{curVal:end},duration,null,complete);
    }

    public set curVal(val:number){
        this.UpdateProgress(val);
    }

    public get curVal(){
        return this._curVal;
    }
}