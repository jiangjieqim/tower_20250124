import { ViewBase } from "../../../../frame/view/ViewBase";
import { ui } from "../../../../ui/layaMaxUI";
import { NoContainerSimpleEffect } from "../avatar/NoContainerSimpleEffect";
import { SpineEffectMgr } from "../avatar/SpineEffectMgr";
import { HeroAvatarView } from "../compose/views/HeroAvatarView";
import { GuideRect } from "./GuideRect";
interface IGuideArrowSkin extends Laya.Sprite{
    tipsbg: Laya.Image;
    tf: Laya.Label;
    anicon: Laya.Sprite;
    arrow1:Laya.Image;
}
class GuideArrowCtl{
    skin:IGuideArrowSkin;
    private readonly heroID:number = 22;
    private initLittleArrowX:number = 0;
    private initXY:Laya.Point = new Laya.Point();
    private _effect:NoContainerSimpleEffect;
    private heroAvatar:HeroAvatarView;
    // private _bg:boolean;
    constructor(skin:IGuideArrowSkin){
        this.skin = skin;
        this.initXY = new Laya.Point(this.skin.tipsbg.x,this.skin.tipsbg.y);
        this.initLittleArrowX = skin.arrow1.x;
    }

    refresh(_cfg:Configs.t_Tasks_Guide_dat){
        if (!StringUtil.IsNullOrEmpty(_cfg.f_info)) {
            this.showAvatar();
            this.skin.tf.text = _cfg.f_info + "";
            this.bgVis = true;
        }else{
            this.bgVis = false;
        }
        this.disposeHandEffect();
        if(_cfg.f_anim != "NULL"){
            this.showHand(_cfg);
        }
        this.arrowOffsetXY(_cfg);
    }
    private showAvatar(){
        this.disposeAvatar();
        this.heroAvatar = ViewBase.createBigHeroAvatar.runWith([this.heroID, this.skin.anicon]);
    }
    private disposeAvatar(){
        if(this.heroAvatar){
            this.heroAvatar.dispose();
            this.heroAvatar = null;
        }
    }
    hide(){
        this.disposeAvatar();
        this.disposeHandEffect();
        this.skin.removeSelf();
    }

    private set bgVis(v:boolean){
        // this._bg = v;
        this.skin.tipsbg.visible = v;
    }

    /**设置手指动画 */
    private showHand(_cfg: Configs.t_Tasks_Guide_dat) {
        let ox: number = 0;
        let oy: number = 0;
        if (!StringUtil.IsNullOrEmpty(_cfg.f_hand_offsetXY)) {
            let arr = _cfg.f_hand_offsetXY.split("|");
            ox = parseInt(arr[0]);
            oy = parseInt(arr[1]);
        }
        // TX_jiantou
        let animKey: string = `Click_1`;
        if (!StringUtil.IsNullOrEmpty(_cfg.f_anim)) {
            animKey = _cfg.f_anim;
        }
        this._effect = SpineEffectMgr.createLoopNoSimpleEffect(`o/spine/scene/${animKey}/${animKey}`, this.skin, this.skin.width / 2 + ox, this.skin.height / 2 + oy);
    }
    private disposeHandEffect(){
        if(this._effect){
            this._effect.dispose();
            this._effect = null;
        }
    }
    private arrowOffsetXY(_cfg:Configs.t_Tasks_Guide_dat){
        let _arrowX:number = 0;
        let _arrowY:number = 0;
        if(!StringUtil.IsNullOrEmpty(_cfg.f_arrow_offsetXY)){
            //  0|275|-1|575
            let arr = _cfg.f_arrow_offsetXY.split("|");
            if(!isNaN(parseInt(arr[0]))){
                _arrowX = parseInt(arr[0]);
            }
            if(!isNaN(parseInt(arr[1]))){
                _arrowY = parseInt(arr[1]);
            }
        }
        this.skin.tipsbg.x = this.initXY.x + this.skin.width / 2 + _arrowX;
        switch(_cfg.f_dir){
            case 1:
                this.skin.tipsbg.y = this.initXY.y + _arrowY + this.skin.height;
                break;
            default:
                this.skin.tipsbg.y = this.initXY.y + _arrowY;
                break;
        }

        this.skin.arrow1.x =  this.initLittleArrowX + (_cfg.f_little_offsetX||0);
    }
}
export class GuideArrowNew{
    private _guideRect:GuideRect = new  GuideRect();
    private bottomCtl:GuideArrowCtl;
    private topCtl:GuideArrowCtl;
    private bottomLeft:GuideArrowCtl;
    private cur:GuideArrowCtl;
    constructor(){
        this.bottomCtl = new GuideArrowCtl(new ui.views.compose.guide.ui_guide_arrow_bottomUI());
        this.topCtl = new GuideArrowCtl(new ui.views.compose.guide.ui_guide_arrow_topUI());
        this.bottomLeft = new GuideArrowCtl(new ui.views.compose.guide.ui_guide_arrow_bottom_rightUI());
    }

    init(_cfg:Configs.t_Tasks_Guide_dat){
        this.bottomCtl.hide();
        this.topCtl.hide();
        let cur:GuideArrowCtl;
        switch(_cfg.f_dir){
            case 1:
                cur = this.topCtl;
                break;
            case 2:
                cur = this.bottomLeft;
                break;
            default:
                cur = this.bottomCtl;
                break;
        }
        this.cur = cur;
    }

    show(_cfg:Configs.t_Tasks_Guide_dat,sp:Laya.Sprite){
        let cur = this.cur;
        
        cur.skin.width = sp.width;
        cur.skin.height = sp.height;

        // if(_cfg.f_showsmallview){
        //     cur.bg = true;
        // }else{
        //     cur.bg = false;
        // }
        this.cur.refresh(_cfg);

        this._guideRect.disposeBtns();
        if(_cfg.f_mask){
            this._guideRect.draw(cur.skin,sp,_cfg);
            cur.skin.parent.addChild(cur.skin);
        }

    }
    hide(){
        // if(this.parent){
        //     this.removeSelf();
        // }
        this.cur.hide();
        this._guideRect.hide();
    }

    get container(){
        return this.cur.skin;
    }
}