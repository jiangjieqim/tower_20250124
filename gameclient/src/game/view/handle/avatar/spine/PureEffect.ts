import { EAvatarAnim } from "../vos/EAvatarAnim";
import { BaseSpineCoreSkel } from "./BaseSpineCoreSkel";

export class PureEffect extends BaseSpineCoreSkel{
    public anim: EAvatarAnim = EAvatarAnim.Invalid;

//  Laya.EventDispatcher{
    protected parent:Laya.Node;
    private ox:number = 0;
    private oy:number = 0;
    public get baseSkel():Laya.SpineSkeleton{
        return this.skeleton;
    }
    // protected mAtlasPage:boolean = false;
    // protected animIndex:number = -1;//当前的动画
    // protected mUrl:string;
    // private mLoop:boolean = false;
    // private mForce:boolean;
    // private mStart:number;
    // private mStop:number;
    // private needStop:boolean = false;
    // private baseTemplet:Laya.SpineTemplet;
    // private _numAtlas:AtlasPage;
    // constructor(){
    //     super();
    // }

    public setPos(parent:Laya.Node,ox:number = 0,oy:number = 0){
        this.parent = parent;
        this.ox = ox;
        this.oy = oy;
        if(this.baseSkel){
            this.baseSkel.removeSelf();
            this.parent.addChild(this.baseSkel);
            this.baseSkel.pos(this.ox,this.oy); 
        }
    }

    dispose(){
        super.dispose();
    }

    // private onCompleteHandler(){
    //     this.parseAnim();
    //     // Laya.timer.callLater(this,this.parseAnim);
    // }
    public get isLoaded(){
        return this.baseSkel;
    }

    // protected completeAction(){
    // this.play(this.animIndex,this.mLoop,this.mForce,this.mStart,this.mStop,this,this.onAnimComplete);
    // }

    // protected onAnimComplete(){

    // }

    protected onLoadFinish(cache){
        super.onLoadFinish(cache);
        if(this.baseSkel){
            this.baseSkel.on(Laya.Event.DISPLAY,this,this.onDisplay);
            this.baseSkel.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
        }
        if (this.parent) {
            this.setPos(this.parent, this.ox, this.oy);
        }
    }

    free(){
        this.parent = null;
        if(this.baseSkel){
            this.baseSkel.off(Laya.Event.DISPLAY,this,this.onDisplay);
            this.baseSkel.off(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
            this.onUnDisplay();
        }
    }

    // dispose(){
        // super.dispose();
    // }

    // protected parseAnim(){
    //     if(this.baseTemplet){
    //         this.baseSkel = this.baseTemplet.buildArmature();
    //         this.baseSkel.pos(0,0);
    //         // this.addChild(this.baseSkel);

    //         this.baseSkel.on(Laya.Event.DISPLAY,this,this.onDisplay);
    //         this.baseSkel.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
    //         if(E.Debug){
    //             this.baseSkel.graphics.drawCircle(0,0,5,null,"#00ff00",1);
    //         }

    //         this.completeAction();
    //         if (this.mAtlasPage) {
    //             let url = this.mUrl.replace(".skel", ".atlas");
    //             this._numAtlas = AtlasParserV.parse(Laya.Loader.getRes(url));
    //             // SpineUtil.forEachSlot(this.baseSkel);
    //             // console.log(1);
    //         }
    //         this.event(Laya.Event.COMPLETE);
    //         if(this.needStop){
    //             this.baseSkel.stop();
    //         }
    //         if(this.parent){
    //             // this.parent.addChild(this.baseSkel);
    //             this.setPos(this.parent,this.ox,this.oy);
    //         }
    //         if(this.needDel){
    //             this.dispose();
    //         }

    //     }
    // }

    private onUnDisplay(){
        Laya.timer.clear(this,this.onLoopHandler);
    }

    private onDisplay(){
        Laya.timer.frameLoop(1,this,this.onLoopHandler);
    }

    protected onLoopHandler(){

    }
    // public play(index:number,loop:boolean = false,force:boolean = false ,start:number = 0,stop:number = 0,that = null,endCall:Function = null,arg = null){
    //     this.mForce = force;
    //     this.mStart = start;
    //     this.mStop = stop;
    //     this.animIndex = index;
    //     this.mLoop = loop;
    //     if(this.baseSkel){
    //         if(this.animIndex == -1){
    //             this.baseSkel.stop();
    //         }else{
    //             this.baseSkel.play(this.animIndex,loop,force,start);
    //             if(that){
    //                 this.baseSkel.once(Laya.Event.STOPPED,that,endCall,arg);
    //             }
    //         }
    //     }
    // }


    play2(index:number,loop:boolean = false,force:boolean = false ,that = null,endCall:Function = null,arg = null){
        // this.mForce = force;
        // this.mStart = start;
        // this.mStop = stop;
        // this.animIndex = index;
        // this.mLoop = loop;
        this.play(index,that,endCall,arg,true,force,loop);
    }

    // public dispose(){
    //     if(this.baseTemplet){
    //         this.baseTemplet.destroy();
    //         this.baseTemplet = null;
    //     }
    //     if(this.baseSkel){
    //         this.baseSkel.removeSelf();
    //         this.baseSkel.destroy();
    //         this.baseSkel = null;
    //     }else{
    //         this.needDel = true;
    //     }
    //     this.parent = null;
    // }

    // public stop(){
    //     if(this.baseSkel){
    //         this.baseSkel.stop();
    //     }else{
    //         this.needStop = true;
    //     }
    // }
}