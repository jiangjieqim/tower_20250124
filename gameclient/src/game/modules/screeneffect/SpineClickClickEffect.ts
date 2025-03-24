import { E } from "../../G";
import {ResItemGroup} from "../../resouce/ResItemGroup";
import { SimpleEffect } from "../../view/handle/avatar/SimpleEffect";

export class SpineBaseClick extends Laya.Sprite{
    // public SetEnable(b: boolean): void {
    // }
    public ShowEffect(x: number = Laya.stage.mouseX, y: number = Laya.stage.mouseY): void {
    }
}

export class SpineClick extends SpineBaseClick {
    private _animList:SimpleEffect[] = [];
    private _resGroup: ResItemGroup;
    private readonly url: string = "o/spine/click/click";
    constructor() {
        super();
        this._resGroup = new ResItemGroup();
        this._resGroup.addSkel(this.url);
        E.ResMgr.LoadGroup(this._resGroup, Callback.Create(this, this.onLoadComplete), null);
    }

    private onLoadComplete(): void {
    }

    // private get showCount(){
    //     let n = 0;
    //     for(let i = 0;i < this._animList.length;i++){
    //         let cell = this._animList[i];
    //         if(cell.anim.container.displayedInStage){
    //             n++;
    //         }
    //     }
    //     return n;
    // }

    private getCanUse(){
        for(let i = 0;i < this._animList.length;i++){
            let cell = this._animList[i];
            if(cell.anim && cell.anim.container && !cell.anim.container.displayedInStage){
                return cell;
            }
        }
    }
    private curTimer:number = 0;
    /**显示特效 */
    public ShowEffect(x: number = Laya.stage.mouseX, y: number = Laya.stage.mouseY): void {
        // LogSys.LogColor(this._animList.length.toString());

        // if(this.showCount > 3){
        // return;
        // }

        if(Laya.timer.currTimer - this.curTimer <= 500){
            // LogSys.Log("勿多点! "+this._animList.length);
            return;
        }
        this.curTimer = Laya.timer.currTimer;

        let cell = this.getCanUse();
        if(cell){
            cell.play(0,false,this,this.playEnd2,[cell]);
            cell.anim.container.pos(x,y);
        }else{
            let  _aniSpine = new SimpleEffect(this, this.url, x, y);
            _aniSpine.play(0, false,this,this.playEnd,[_aniSpine]);
        }
    }

    private playEnd(ani:SimpleEffect){
        this._animList.push(ani);
        ani.remove();
    }
    private playEnd2(ani:SimpleEffect){
        ani.remove();
    }
}

export class SpineClickClickEffect extends SpineBaseClick {
    private _resGroup: ResItemGroup;
    // private _ani_click: Laya.Animation;
    private _aniSpine: SimpleEffect;
    // private _hasLoaded: boolean = false;
    private _isEnable: boolean = false;//是否激活

    private readonly url: string = "o/spine/click/click";
    constructor() {
        super();
        this._isEnable = true;
        // this._hasLoaded = false;
        this._resGroup = new ResItemGroup();
        this._resGroup.addSkel(this.url);
        E.ResMgr.LoadGroup(this._resGroup, Callback.Create(this, this.onLoadComplete), null);
    }

    private onLoadComplete(): void {
        this._aniSpine = new SimpleEffect(this, this.url);
        this._aniSpine.once(Laya.Event.COMPLETE, this, this.onSpineComplete);
    }

    private onSpineComplete() {
        this.refreshView();
    }

    /**设置是否激活 */
    public SetEnable(b: boolean): void {
        this._isEnable = b;
    }
    private play(){
        if(this._aniSpine && this._aniSpine.isLoaded){
            this._aniSpine.play(0);
        }
    }

    private stop(){
        if(this._aniSpine && this._aniSpine.isLoaded){
            this._aniSpine.stop();
        }
    }
    private refreshView() {
        this.SetEnable(this._isEnable);
    }

    /**显示效果 */
    public ShowEffect(x: number = Laya.stage.mouseX, y: number = Laya.stage.mouseY): void {
        if(!this._isEnable){
            this.stop();
            return;
        }
        this.pos(x, y);
        this.play();
    }
}