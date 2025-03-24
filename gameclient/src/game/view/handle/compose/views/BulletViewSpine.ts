import { NoContainerSimpleEffect } from "../../avatar/NoContainerSimpleEffect";
import { SpineEffectMgr } from "../../avatar/SpineEffectMgr";
import { ComposeConfig } from "../ComposeConfig";
import { BulletView, IBulletView } from "./BulletView";

/**spine子弹 */
export class BulletViewSpine extends BulletView implements IBulletView{
    private effect:NoContainerSimpleEffect;
    constructor(){
        super();
    }

    /**
     * @param pet 攻击者
     * @param cur1 被击者
     */
    public moveAvatar(startX:number,startY:number,endX:number,endY:number){
        let id:number = this.resId;
        let effect = SpineEffectMgr.playOnceEnd(`o/spine/skill/${id}/${id}`,this,new Laya.Handler(this,this.onPlayEnd));
        this.effect = effect as any;
        this.effect.once(Laya.Event.COMPLETE,this,this.onComplete,[startX,startY,endX,endY]);
    }

    private onPlayEnd(){
        this.dispose();
    }
    protected onComplete(startX: number, startY: number, endX: number, endY: number) {
        if (this.pass) {
            this.effect.once(Laya.Event.LABEL,this,this.onLabel,[startX, startY, endX, endY]);
        }else{
            this.startMove(startX, startY, endX, endY);
        }
    }

    private onLabel(startX:number, startY:number, endX:number, endY:number,e){
        // LogSys.Log(e);
        if(e.name == "show"){
            //穿透算法
            let p = new Laya.Point(endX - startX, endY - startY);
            p.normalize();
            let time = this.effect.duration * 1000;//动画播放时长

            /*
                f_bullet_spine_pass == 1的时候
                
                spine动画播放时长 /cfg.f_bullet_speed = 移动的区块格子数量
                移动时间=spine动画播放时长

                per(需要移动的单位区块数,02至12为一个区块) = 动画时长/cfg.f_bullet_speed
                +----+----+
                | 02 | 12 |
                +----+----+
            */
            let per: number = time / this.flyTime;
            this.flyTime = time;
            endX = startX + p.x * ComposeConfig.cellW * per;
            endY = startY + p.y * ComposeConfig.cellH * per;
            this.startMove(startX, startY, endX, endY);
        }
    }

    /**移动结束 */
    protected onMoveEnd(){

    }
}