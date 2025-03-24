import { LayerMgr } from "../../../../layer/LayerMgr";
import { SpineCoreSkel } from "../../avatar/spine/SpineCoreSkel";
import { EAvatarAnim } from "../../avatar/vos/EAvatarAnim";
export class SlotImgs{
    name:string;
    url:string;
    constructor(_name:string,_url:string){
        this.name = _name;
        this.url = _url;
    }
}

/**基础横幅展示 */
export class BaseAdmissionShow{
    // protected readonly allFrame: number = 30;
    layer:Laya.Sprite;
    pos:Laya.Point = new Laya.Point();
    slots:SlotImgs[] = [];
    /**结束回调 */
    endHandler:Laya.Handler;
    url:string;
    protected skel: SpineCoreSkel;
    protected defaultAnim:EAvatarAnim = EAvatarAnim.TowerIdle;
    constructor(){
    }
    load() {
        this.skel = new SpineCoreSkel();
        this.skel.once(Laya.Event.COMPLETE, this, this.onCompleteHander);
        this.skel.play(this.defaultAnim, this, this.onPlayEnd, undefined, true);
        this.skel.load(this.url);
    }
    protected onCompleteHander(){
        if(!this.skel.destroyed){
            if(this.layer){
                this.layer.addChild(this.skel.skeleton);
                this.skel.skeleton.pos(this.pos.x,this.pos.y);
            }else{
                LayerMgr.Ins.screenEffectLayer.addChild(this.skel.skeleton);
                this.skel.skeleton.pos(Laya.stage.width / 2, Laya.stage.height / 2);
            }
            for(let i = 0;i < this.slots.length;i++){
                let cell = this.slots[i];
                this.skel.setSlotImg(cell.name,cell.url);
            }
        }else{
            LogSys.Warn(`BaseAdmissionShow, skel is destoryed...`);
        }
    }
    protected onPlayEnd() {
        this.dispose();
        if(this.endHandler){
            this.endHandler.run();
        }
    }
    dispose() {
        if(this.skel){
            this.skel.dispose();
            this.skel = null;
        }
    }
}