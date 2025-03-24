import { ui } from "../../../../../ui/layaMaxUI";
import { SpineEffectMgr } from "../../avatar/SpineEffectMgr";

/**心组件 */
export class HeartComponent extends ui.views.compose.fightcell.fight_heartUI{
    protected readonly defaultMax:number = 5;
    maxHp:number = this.defaultMax;
    set value(v:number){
        for(let i = 0;i < this.defaultMax;i++){
            let star = this[`s${i}`]
            if(i < this.maxHp){
                if(i < v){
                    star.skin = `remote/fight/img_ax.png`;
                }else{
                    star.skin = `remote/fight/img_ax1.png`;
                }
            }else{
                star.skin = "";
            }
        }
    }

    centerLayoutX(){
        let w:number = this.s0.width;
        let gap = this.s1.x - this.s0.x - w;
        let cw = w * this.maxHp;
        let ox = (this.width - cw)/2
        for(let i = 0;i < this.maxHp;i++){
            let star:Laya.Sprite = this[`s${i}`]
            star.x = ox + i * (w + gap);
        }
    }

    /**播放碎心动画 */
    playBroken(i:number){
        let star:Laya.Sprite = this[`s${i}`]
        SpineEffectMgr.playOnce(`o/spine/scene/xinxin/xinxin`,star,star.width/2,star.height/2);
    }
}