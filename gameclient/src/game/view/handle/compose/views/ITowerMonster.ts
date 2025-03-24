import { EAvatarDir } from "../../avatar/AvatarView";
import { EAvatarAnim } from "../../avatar/vos/EAvatarAnim";
/**怪物接口 */
export interface ITowerMonster extends Laya.EventDispatcher{
    skeleton:Laya.Sprite;
    // rateSpeed:number;
    playbackRate(v:number);
    stop();
    dispose();
    dir:EAvatarDir;
    /**当前缩放值 */
    curScale:number;
    /**设置当前的缩放比 */
    updateScale(v:number);
    load(url:string);
    play(anim: EAvatarAnim, target?, callBack?, args?, _once?:boolean ,isForce?:boolean,isLoop?:boolean) ;
    anim: EAvatarAnim;
    // frameCount:number;
    /**暂停动画 */
    animpause();
    /**继续播放动画 */
    animplay();
}