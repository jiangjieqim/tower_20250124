// import { DebugUtil } from "../../../../../frame/util/DebugUtil";
import { E } from "../../../../G";
import { EAvatarDir } from "../../avatar/AvatarView";
import { EAvatarAnim } from "../../avatar/vos/EAvatarAnim";
import { FightFactory } from "../FightFactory";
import { AnimFrameVo } from "../vos/AnimFrameVo";
import { FightValueConfig } from "../vos/FightValueConfig";
import { ITowerMonster } from "./ITowerMonster";

/**序列帧 
 * 图集用计数器进行回收
*/
export class FrameMonster extends Laya.EventDispatcher implements ITowerMonster{
    private isLoaded:boolean;
    /**关键帧配置 */
    framestr:string;
    anchorX:number = 0.5;
    anchorY:number = 1;
    /**序列帧信息列表 */
    anim:EAvatarAnim;//当前的动作
    curScale:number = 1;
    skeleton: Laya.Image;
    /**每一帧延迟的时间 */
    delayMs:number;
    /**随机序列帧索引号 */
    mRandomIndex:boolean;
    //===========================================
    private _curURL: string;
    private _atlas:string;
    private _index: number = 1;
    private frameList:AnimFrameVo[];
    /**原始速率1  加速>1 减速<1 */
    // private bFast:boolean = false;//是否是加速
    private rateSpeed:number = 1;// 原速度的速率
    private destroyed:boolean = false;
    private _dir:EAvatarDir = EAvatarDir.Left;
    private _isStop:boolean = false;
    private isLoop:boolean = false;
    private callBack:Function;
    private target:any;
    private args:any;
    private sumTime:number = 0;

    constructor() {
        super();
        this.skeleton = new Laya.Image();
        DebugUtil.drawCross(this.skeleton,0,0,20,"#FF00FF");
    }
    play(anim: EAvatarAnim, target?, callBack?, args?, _once?:boolean ,isForce?:boolean,isLoop?:boolean) {
        this.isLoop = isLoop;
        this._isStop = false;
        this.target = target;
        this.callBack = callBack;
        this.args = args;
        this.anim = anim;
        this.updateFrame();
    }

    private updateFrame(){
        if(this.frameList){
            let cur = this.frameList[this.anim];
            if(cur){
                this._index = cur.start;
            }else{
                LogSys.Error(`FrameMonster:${this._curURL},==============>${this.anim}`);
            }
        }
    }

    private onBaseAtlasComplete() {
        E.atlasMgr.load(this._atlas);
        this.isLoaded = true;
        // ResMgr.Ins.load(`${this._curURL}.atlas`);
        //====================================
        this.frameList = FightFactory.getFrameVo(this._curURL,this.framestr);
        //====================================

        this.updateFrame();
        if(!this.destroyed){
            if(this.skeleton){

                this.skeleton.anchorX = this.anchorX;
                this.skeleton.anchorY = this.anchorY;

                // this.skeleton.scaleX = this.curScale * this._dir;
                // this.skeleton.scaleY = this.curScale;
                this.updateScale(this.curScale);
                // 21 / 6
                if(this.mRandomIndex){
                    this.randomIndex();
                }
                this.animplay();
            }
            
            this.event(Laya.Event.COMPLETE);//,this.skeleton
        }
    }

    /**更新缩放值 */
    updateScale(v:number){
        this.curScale = v;
        if(!this.destroyed && this.skeleton){
            this.skeleton.scaleX = this.curScale * this._dir;
            this.skeleton.scaleY = this.curScale;
        }
    }

    animplay(){
        Laya.timer.frameLoop(1, this, this.onLoop);//4
    }

    private randomIndex(){
        if(this.frameList){
            let cur = this.frameList[this.anim];
            if(cur){
                this._index = cur.start + Math.ceil(Math.random() * cur.count);//Make the movement more natural
            }
        }
    }

    /**当前的时间间隔毫秒 */
    getCurMS(){
        let ms = this.delayMs;
        if (!ms) {
            ms = FightValueConfig.delayMS;
        }
        return ms;
    }

    // get realMS(){
    //     let ms:number = this.curMS;
    //     if(this.rateSpeed > 1){
    //         ms = Math.ceil(ms / this.rateSpeed);
    //     }
    //     return ms;
    // }

    private onLoop() {
        this.sumTime += Laya.timer.delta;

        if(this._isStop){
            return;
        }

        let ms = this.getCurMS();
        //检测速度
        let _checkRateSpeed:number = this.rateSpeed;

        if (this.sumTime < ms / _checkRateSpeed) {
        // if(this.sumTime < this.realMS){
            return;
        }
        this.sumTime = 0;

        let cur = this.frameList[this.anim];
        if(!cur){
            // cur = this.frameList[0];
            LogSys.Warn(`${this._curURL} did't found anim ${this.anim}`);
            return;
        }
        let curIndex = cur.start + cur.count;
        if (this._index >= curIndex) {
            if(this.isLoop){
                this._index = cur.start;
            }else{
                this.stop();
                if(this.target){
                    this.callBack.call(this.target,this.args);
                }
            }
        }
        this.updateSkin();

        if(this.rateSpeed > 1){
            let n:number = Math.ceil((this.rateSpeed - 1)/0.25);
            this._index += n;
        }else{
            this._index++;
        }
    }

    private updateSkin() {
        if (this.skeleton) {
            let cur: AnimFrameVo = this.frameList[this.anim];
            if(this.isLoaded){
                this.skeleton.skin = cur.getURL(this._index,this.anim);
            }
        }
    }

    dispose() {
        this.isLoaded = false;
        this.destroyed = true;
        this.framestr = null;
        // this.defaultFrame = false;
        Laya.timer.clear(this, this.onLoop);
        if(this.skeleton){
            this.skeleton.removeSelf();
            this.skeleton.destroy();
            this.skeleton = null;
        }
        // ResMgr.Ins.unload(`${this._curURL}.atlas`);
        // ResMgr.Ins.save(`${this._curURL}.atlas`);
        E.atlasMgr.dispose(this._atlas);
    }

    /**
     * @param url o/framemonster/1
     */
    load(url: string) {
        this._curURL = url;
        this._atlas = `${url}.atlas`;
        Laya.loader.load([{ url: this._atlas, type: Laya.Loader.ATLAS }],new Laya.Handler(this, this.onBaseAtlasComplete));
    }
    /**
     * 暂停
     */
    animpause(){
        Laya.timer.clear(this, this.onLoop);
    }

    stop(){
        this._isStop = true;
    }
    set dir(v:EAvatarDir){
        this._dir = v;
        // this.skeleton.scale(v,v);
        if(this.skeleton){
            this.skeleton.scaleX = v * this.curScale;
        }
    }
    get dir(){
        return this._dir;
    }

    /**设置速率 */
    public playbackRate(v: number) {
        let max: number = FightValueConfig.MaxFastRate;
        if (v >= max) {
            v = max;
        }
        this.rateSpeed = v;
    }
}