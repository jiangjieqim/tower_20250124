import { ScreenAdapter } from "../../../../G";
import { LayerMgr } from "../../../../layer/LayerMgr";
import { SpineCoreSkel } from "../../avatar/spine/SpineCoreSkel";
import { ComposeEvent } from "../ComposeEvent";
import { ComposeModel } from "../ComposeModel";
export class StealEffectVo{
    url:string;
    type:number;
}
export class StealEffect {
    private tween:Laya.Tween;
    private p: Laya.Sprite;
    private skel: SpineCoreSkel;
    private url:string = `o/spine/scene/TQ/TQ.skel`;
    // private readonly animTime:number = 500;
    private offset:Laya.Point = new Laya.Point();
    private ox:number = 0;
    private oy:number = 0;
    private get model() {
        return ComposeModel.Ins;
    }
    private animIndex:number;
    constructor(p: Laya.Sprite) {
        this.tween = new Laya.Tween();
        this.p = p;
        this.p.on(Laya.Event.DISPLAY,this,this.onDisplay);
        this.p.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
    }
    private disposeEffect(){
        if(this.skel){
            this.skel.dispose();
            this.skel = null;
        }
    }
    private onDisplay(){
        this.model.on(ComposeEvent.PlayStealEffect, this, this.onStealEffect);
    }
    private onUnDisplay(){
        this.model.off(ComposeEvent.PlayStealEffect, this, this.onStealEffect);
    }
    private load() {

        this.skel = new SpineCoreSkel();
        this.skel.once(Laya.Event.COMPLETE, this, this.onCompleteHander);
        this.skel.play(this.animIndex, this, this.onPlayEnd, undefined, true);
        this.skel.load(this.url);
    }

    private onCompleteHander(){
        LayerMgr.Ins.screenEffectLayer.addChild(this.skel.skeleton);
        let offset = this.offset;

        switch(this.animIndex){
            case 1:
                this.skel.skeleton.pos(this.ox, this.oy);
                break;
            case 0:
                this.skel.skeleton.pos(offset.x,offset.y);
                this.tween.to(this.skel.skeleton,{x:this.ox,y:this.oy},500);
                break;
        }
        this.skel.skeleton.on(Laya.Event.LABEL,this,this.onMove);
    }

    private onMove(e){
        if(e.name == "SHOW"){

            let time:number = 0;
            if(!StringUtil.IsNullOrEmpty(e.stringValue)){
                time = parseInt(e.stringValue);
            }
            let offset = this.offset;
            this.tween.clear();
            switch(this.animIndex){
                case 1:
                    this.tween.to(this.skel.skeleton,{x:offset.x,y:offset.y},time);
                    break;
                case 0:
                    this.tween.to(this.skel.skeleton,{x:this.ox,y:this.oy},time);
                    break;
            }
            Laya.timer.once(time,this,this.disposeEffect);
        }
    }

    private onPlayEnd(){
        // 
    }
    /**0动画是被偷 1是偷别人 */
    private onStealEffect(vo:StealEffectVo) {
        this.animIndex = vo.type;
        this.url = vo.url;
        this.disposeEffect();
        let layer = LayerMgr.Ins.screenEffectLayer;
        let pos1 = (layer.parent as Laya.Sprite).localToGlobal(new Laya.Point(layer.x,layer.y));
        let pos2 = (this.p.parent as Laya.Sprite).localToGlobal(new Laya.Point(this.p.x,this.p.y));
        this.ox = pos2.x - pos1.x + ScreenAdapter.UIRefWidth;
        this.oy = pos2.y - pos1.y + 50;

        let pos =  (this.p.parent as Laya.Sprite).localToGlobal(new Laya.Point(this.p.x,this.p.y));
        let targetPos = new Laya.Point(pos.x - ScreenAdapter.UIRefWidth + 100,Laya.stage.height + 50);
        this.offset = new Laya.Point(targetPos.x-pos.x + this.ox,targetPos.y-pos.y+this.oy);
        this.load();
    }
}