import { BaseAnimSpine } from "./BaseAnimSpine";
export interface ISimpleEffect{
    setParent(parent:Laya.Sprite);
    dispose();
    setPos(x: number, y: number);
    isDestory:boolean;
    play(index: number, loop?: boolean, target?, callBack?:Function, args?,force?:boolean);
    stop();
}

export class NoContainerSimpleEffect extends Laya.EventDispatcher implements ISimpleEffect{
    data;//数据
    mScale:number = 1;
    childIndex:number = -1;
    container:Laya.Sprite;
    offsetX:number = 0;
    offsetY:number = 0;
    speed:number = 1;
    /**是否销毁掉了 */
    isDestory:boolean = false;
 // public name:string = ""
    /**是否已经加载完成 */
    private isLoaded:boolean = false;
    private mUrl:string;
    private _loop:boolean = false;
    private curAnim:number = 0;
    private needPlay:boolean = false;
    private anim:BaseAnimSpine = new BaseAnimSpine();
    private target;
    private callBack;
    private args;
    setParent(){

    }
    // private _hideDispose:boolean;
    /** 需要停止所有的动画回调事件*/
    // private needStopEvent:boolean = false;
    /**
     * @param url 
     */
    constructor(url:string){
        super();
        this.mUrl = url;
    }

    /**使用spine缓存 */
    set useSpineCache(v:boolean){
        if(this.anim){
            this.anim.useSpineCache = v;
        }
    }

    public init(){
        this.anim.load(this.mUrl);
        this.anim.once(Laya.Event.COMPLETE,this,this.onInit);
    }

    /**自动播放 */
    public set autoPlay(v:boolean){
        this.needPlay = v;
    }

    public dispose(){
        this.stop();
        this.mScale = 1;
        this.isDestory = true;
        this.callBack = null;
        this.target = null;
        this.remove();
        if(this.anim){
            this.anim.dispose();
        }
    }

    private remove(){
        if(this.anim.container){
            this.anim.container.removeSelf();
        }
        // this.offAll(Laya.Event.COMPLETE);
    }

    private onInit(){
        if(this.isDestory){
            return;
        }
        this.startAdd();
        this.anim.container.scaleX = this.anim.container.scaleY = this.mScale; 
        // this.anim.container.x = this.offsetX;
        // this.anim.container.y = this.offsetY;
        this.setPos(this.offsetX,this.offsetY);
        this.anim.avatar.skeleton.playbackRate(this.speed);
        this.isLoaded = true;
        this.anim.avatar.skeleton.on(Laya.Event.LABEL,this,this.onLabelEvt);
        // let cnt = this.anim.avatar.skeleton.getAnimNum();
        if(this.needPlay){
            this.play(this.curAnim,this._loop,this.target,this.callBack,this.args);
            this.needPlay = false;
        }
        this.event(Laya.Event.COMPLETE,this);
    }

    setPos(x:number,y:number){
        this.offsetX = x;
        this.offsetY = y;
        if(this.anim && this.anim.container){
            this.anim.container.pos(x,y);
        }
    }

    private onLabelEvt(e){
        this.event(Laya.Event.LABEL,e);
    }
    /**当前动作的总时间*/
    get duration(){
        if(this.anim.avatar && this.anim.avatar.skeleton){
            return this.anim.avatar.skeleton['_duration'];
        }
        return 0;
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
    /**暂停 */
    pause(){
        this.anim && this.anim.paused();
    }

    /**继续 */
    resume(){
        this.anim && this.anim.resume();
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
        if(this.container){
            if(this.childIndex == -1){
                this.container.addChild(this.anim.container);
            }else{
                this.container.addChildAt(this.anim.container,this.childIndex);
            }
        }
    }

    public stop(){
        this.anim.stop();
        if(this.anim.container){
            this.anim.container.removeSelf();
        }
        this.needPlay = false;
    }
}