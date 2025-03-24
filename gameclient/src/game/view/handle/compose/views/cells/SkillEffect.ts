import { SpineCoreSkel } from "../../../avatar/spine/SpineCoreSkel";
import { EAvatarAnim } from "../../../avatar/vos/EAvatarAnim";
import { FightValueConfig } from "../../vos/FightValueConfig";

/**地面常驻特效 播放完成消失*/
export class SkillEffect{
    private skel:SpineCoreSkel;
    private ox:number;
    private oy:number;
    private rot:number;
    private parent:Laya.Sprite;
    autoFree:boolean = true;   
    constructor() {
    }
    /**
     * 
     * @param parent 
     * @param id 
     * @param x 
     * @param y 
     * @param mScale 
     * @param rot 角位移值
     */
    load(parent:Laya.Sprite,id:number,x:number,y:number,mScale:number,rot:number){
        this.rot = rot;
        this.parent = parent;
        this.ox = x;
        this.oy = y;
        this.skel = new SpineCoreSkel();
        this.skel.curScale = mScale;
        // this.skel.anim  = EAvatarAnim.TowerAtk;
        this.skel.once(Laya.Event.COMPLETE,this,this.onSpine1Complete);
        this.skel.play(EAvatarAnim.TowerIdle,this,this.onDispose);
        this.skel.load(`o/spine/skill/${id}/${id}.skel`);
    }
    protected onSpine1Complete(){
        if(this.skel){
            this.parent.addChild(this.skel.skeleton);
            this.skel.playbackRate(FightValueConfig.speedScale);
            this.skel.skeleton.rotation = this.rot;
            this.skel.skeleton.pos(this.ox,this.oy);
        }
    }
    private onDispose(){
        if(this.autoFree){
            this.dispose();
        }
    }

    dispose(){
        this.skel.dispose();
        this.skel = null;
        this.parent = null;
    }
}