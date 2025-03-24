import { DrawCallConfig } from "../../../DrawCallConfig";
import { BaseAnimSpine } from "./BaseAnimSpine";

/**简单特效 */
export class SimpleEffect extends Laya.EventDispatcher{
    // public name:string = ""
    /**是否已经加载完成 */
    public isLoaded:boolean = false;

    protected container:Laya.Sprite;
    mUrl:string;
    private _loop:boolean = false;
    private curAnim:number = 0;
    
    private needPlay:boolean = false;
    protected offsetX:number = 0;
    protected offsetY:number = 0;
    protected speed:number = 1;
    public anim:BaseAnimSpine = new BaseAnimSpine();
    private target;
    private callBack;
    private args;
    private _hideDispose:boolean;
    labelHandler:Laya.Handler;
    /** 需要停止所有的动画回调事件*/
    // private needStopEvent:boolean = false;
    /**
     * 
     * @param container 
     * @param url 
     * @param offsetX 
     * @param offsetY 
     * @param speed 
     * @param hideDispose 隐藏的时候是否销毁
     */
    constructor(container:Laya.Sprite,url:string,offsetX:number = 0,offsetY:number =0,speed:number = 1.0,hideDispose:boolean = false){
        super();

        this.mUrl = url;
        // this.needStopEvent = needStopEvent;
        this.container = container;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.speed = speed;
        this._hideDispose = hideDispose;
        this.anim.load(url);
        this.anim.once(Laya.Event.COMPLETE,this,this.onInit);
        this.container.on(Laya.Event.UNDISPLAY,this,this.onUndisplay);
    }

    private onUndisplay(){
        if(this._hideDispose){
            this.dispose();
        }else{
            this.stop();
        }
    }

    /**自动播放 */
    public set autoPlay(v:boolean){
        this.needPlay = v;
    }

    public dispose(){
        this.stop();
        this.container && this.container.off(Laya.Event.UNDISPLAY,this,this.onUndisplay);
        this.callBack = null;
        this.target = null;
        this.remove();

        this.labelHandler = null;
        this.anim.dispose();
    }

    public remove(){
        if(this.anim.container){
            this.anim.container.removeSelf();
        }
        // this.offAll(Laya.Event.COMPLETE);
    }

    private onInit(){
        // this.container.addChild(this.anim.container);
        this.startAdd();
        
        this.anim.container.x = this.offsetX;
        this.anim.container.y = this.offsetY;
        this.anim.avatar.skeleton.playbackRate(this.speed);
        // if(E.Debug){
        //     let showSpr = new Laya.Sprite();
        //     this.container.addChild(showSpr);
        //     SmallAnimSpine.drawCross(showSpr);
        // }
        this.isLoaded = true;
        // let cnt = this.anim.avatar.skeleton.getAnimNum();
        if(this.needPlay){
            this.play(this.curAnim,this._loop,this.target,this.callBack,this.args);
            this.needPlay = false;
        }
        this.event(Laya.Event.COMPLETE);
        if(this.labelHandler){
            this.anim.avatar.skeleton.on(Laya.Event.LABEL,this,this.onLabel);
        }
    }

    private onLabel(e){
        this.labelHandler.runWith(e);
    }

    public play(index: number = 0, loop: boolean = false, target?, callBack:Function = null, args?,force:boolean = false) {
        this.needPlay = true;
        this.target = target;
        this.callBack = callBack;
        this.args = args;
        this.addtoStage();
        this._loop = loop;
        this.curAnim = index;
        if(loop){
            this.anim.play(index,loop,force);
        }else{
            this.anim.playOnce(index,target,callBack,args,force);
        }
    }
    // /**播放完成销毁 */
    // public playEndDisplse(index: number = 0,){
    //     this.play(index,false,this,this.dispose);
    //     this.autoPlay = true;
    // }

    private addtoStage(){
        if(this.anim.container && !this.anim.container.parent){
            this.startAdd();
        }
    }

    private startAdd(){
        if(!DrawCallConfig.disable_spine){
            this.container.addChild(this.anim.container);
        }
    }

    public stop(){
        if(this.anim.container){
            this.anim.container.removeSelf();
        }
        this.anim.stop();
        // if(this.needStopEvent){
        //     this.anim.clearStopEvent();
        // }
        this.needPlay = false;
    }
}