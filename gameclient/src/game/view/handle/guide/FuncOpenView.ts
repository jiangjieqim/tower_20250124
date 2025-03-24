import { ViewBase } from "../../../../frame/view/ViewBase";
import { ui } from "../../../../ui/layaMaxUI";
import { EPageType } from "../../../common/defines/EnumDefine";
import { NoContainerSimpleEffect } from "../avatar/NoContainerSimpleEffect";
import { SpineEffectMgr } from "../avatar/SpineEffectMgr";
import { FuncOpenData } from "./GuideModel";
import { GuideUtils } from "./GuideUtils";
interface IGuideIcon extends Laya.Sprite{
    icon:Laya.Image;
}
/**功能开启 */
export class FuncOpenView extends ViewBase{
    private _ui:ui.views.compose.guide.ui_func_open_viewUI;
    public PageType: EPageType = EPageType.None;
    // protected mDebug:boolean = true;
    protected mHitFull:boolean = true;
    protected mMask:boolean = true;
    protected mMaskClick:boolean = false;
    private tween:Laya.Tween;
    private _targetIcon:IGuideIcon;
    /**动画播放时间 */
    private readonly animTime:number = 500;
    // protected skel: SpineCoreSkel;
    private effect:NoContainerSimpleEffect;
    private iconUrl:string;
    // protected bNextGuideStep:boolean = true;
    private _data:FuncOpenData;
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
    }
    protected onExit(): void {
        // if(this._data.nextStep){
        // GuideModel.Ins.nextGuideStep();
        // }

        // throw new Error("Method not implemented.");
        if(this._targetIcon){
            this._targetIcon.visible = true;
        }
        this.tween.clear();
    
        LogSys.Log(`funcopenview:耗时${Laya.timer.currTimer - this.time}`);
    }
    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if(!this.UI){
            this.UI = this._ui = new ui.views.compose.guide.ui_func_open_viewUI();
            this.tween = new Laya.Tween();
        }
    }
    private time:number = 0;
    protected onInit(): void {
        let _data:FuncOpenData = this.Data;
        this._data = _data;
        this.time =  Laya.timer.currTimer;
        this._ui.icon.scaleX = this._ui.icon.scaleY = 0.1;
        this._ui.icon.x = this._ui.icon.y = 0;

        let _target = GuideUtils.getUIByKeySt(_data.img) as IGuideIcon;//`11-betterBtn`

        this._targetIcon = _target;
        if(!_target){
            LogSys.Error(`not found ${JSON.stringify(_data)}`);
            // return;
        }

        // if(!(_target instanceof Laya.Image)){  
        // LogSys.Error(`必须是引导标识物Laya.Image类型`);
        // return;
        // }


        if(!_target.icon){
            LogSys.Error(`必须是引导标识物具有 icon 接口`);
            return;
        }
        this.iconUrl =  _target.icon.skin//(_target as Laya.Image).skin;

        // this.skel = new SpineCoreSkel();
        // this.skel.once(Laya.Event.COMPLETE, this, this.onCompleteHander);
        // this.skel.play(EAvatarAnim.TowerIdle, this, this.onPlayEnd, undefined, true);
        // this.skel.load(`o/spine/scene/gongneng_jiesuo/gongneng_jiesuo.skel`);
        this.disposeSkel();
        this.effect = SpineEffectMgr.createNoSimpleEffect('o/spine/scene/gongneng_jiesuo/gongneng_jiesuo',this._ui,this._ui.width/2,this._ui.height/2,0);
        this.effect.on(Laya.Event.LABEL,this,this.onLabelEvt);
        this.effect.play(0, false, this, this.onPlayEnd);
    }
    private onLabelEvt(e){
        if (e.name == 'SHOW') {

            let val:string = e.stringValue;
            let arr = val.split("-");
            let _eff = this.effect;
            let time = _eff.duration * (parseInt(arr[0])/parseInt(arr[1])) * 1000;//
            LogSys.Log(`FuncOpenView Scale use time:${time} ms`);

            this._ui.icon.skin = this.iconUrl;
            this.tween.clear();
            this.tween.to(this._ui.icon,{scaleX:1,scaleY:1},time);

            // this._ui.con1.visible = true;
        }
    }
    // private onCompleteHander(){
    //     if(!this.skel.destroyed){
    //         this.skel.on(Laya.Event.LABEL,this,this.onLabelEvt);
    //         if(this._ui){
    //             this._ui.addChild(this.skel.skeleton);
    //             this.skel.skeleton.pos(this._ui.width/2,this._ui.height/2);
    //         }
    //         // this.skel.setSlotImg("shenhua_icon",this.url);
    //     }else{
    //         LogSys.Warn(`FuncOpenView, skel is destoryed...`);
    //     }
    // }
    private disposeSkel() {
        if(this.effect){
            this.effect.dispose();
            this.effect = null;
        }
    }
    private onPlayEnd(){
        this.disposeSkel();
        this.onStartMove();
    }

    private onStartMove(){
        Laya.timer.once(this.animTime,this,this.nextPlay);
        Laya.timer.once(this.animTime * 2,this,this.Close);
    }

    // protected Close(){
    //     GuideModel.Ins.nextGuide();
    //     super.Close();
    //     // this._targetIcon.visible = true;
    // }

    private nextPlay(){
        let _icon = this._ui.icon;
        let _target = this._targetIcon;
        let _startPos = (_icon.parent as Laya.Sprite).localToGlobal(new Laya.Point(_icon.x,_icon.y));
        let _targetPos =  (_target.parent as Laya.Sprite).localToGlobal(new Laya.Point(_target.x,_target.y));
        let sub = new Laya.Point(_targetPos.x - _startPos.x,_targetPos.y - _startPos.y);
        this.tween.to(this._ui.icon,{x:sub.x,y:sub.y},this.animTime);
    }
    
}
// remote/fight/icon_bq.png