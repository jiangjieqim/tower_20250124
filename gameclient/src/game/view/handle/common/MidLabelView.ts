import { ViewBase } from "../../../../frame/view/ViewBase";
import { ui } from "../../../../ui/layaMaxUI";
import { EPageType } from "../../../common/defines/EnumDefine";
import { E } from "../../../G";
import { ResPath } from "../../../resouce/ResPath";
import mUI = ui.views.common.ui_midlabelUI;

export interface MidLabelCacheData{
    content:string;
    color:string;
}
/**文本提示*/
export class MidLabelView extends ViewBase {
    isCheckTop:boolean = false;
    //#region 静态
    private get timeScale(): number//动画时间缩放比
    {
        /*
        let val = System_RefreshTimeProxy.Ins.getVal(28);
        if (StringUtil.IsNullOrEmpty(val)) {
            return 1;
        }
        return parseFloat(val);
        */
       return 1;
    }
    //#endregion
    public midLabelList: MidLabelCacheData[] = []
    protected checkGuide = false;
    //#region 实例
    private _ui: mUI;
    private _tarY: number = 0;
    protected autoFree = true;
    // PageType = EPageType.MidFloatView;
    PageType = EPageType.None;
    //#region 抽象方法实现

    protected onEnter() {

    }
    protected onExit() {

    }

    protected onFirstInit() {
        if(!this.UI){
            this.UI = this._ui = new mUI();
        }
    }

    protected onInit() {
        this.initUI();
    }

    protected onAddLoadRes() {
        this.addRes(ResPath.View.MidLabel, Laya.Loader.JSON);
    }

    protected onAddEventListener() {

    }

    protected onChangeLanguage() {

    }

    //#endregion

    // private fadeTween2:Laya.Tween;
    private tempTween:Laya.Tween;
    private getTween(){
        if(this.tempTween){
            this.tempTween.clear();
        }else{
            this.tempTween = new Laya.Tween();
        }
    }

    // private tween3:Laya.Tween;
    // private scaleTween:Laya.Tween;
    protected readonly offsetY:number = 100;//100;
    /**显示文本提示*/
    public ShowMidLabel(content: string,color:string) {
        this._ui.lbl_content.text = content;
        this._ui.lbl_content.color = color;
        // this._ui.alpha = 0.65;
        // Laya.timer.clearAll(this);
        // TweenUtil.ClearAll(this._ui.box_content);
        // this._ui.box_content.y = LayerMgr.stageDesignHeight / 2;
        this._ui.box_content.y = this.UI.height / 2;//Laya.stage.height / 2;
        this._tarY = this._ui.box_content.y - this.offsetY;
        this._ui.box_content.alpha = 1;
        // console.log(">>>>>>>>>>>_tarY"+this._tarY);
        // if(this.tween3){
        //     this.tween3.clear();
        // }
        // if(this.fadeTween2){
        //     this.fadeTween2.clear();
        // }
        // Laya.timer.clear(this,this.delayShow);

        // this.AniView.scaleX= this.AniView.scaleY = 0.7;
        // if(this.scaleTween){
        //     this.scaleTween.clear();
        // }
        this.UI.scaleX= this.UI.scaleY = 0.7;
        this.getTween();
        this.tempTween.to(this.UI, { scaleX: 1, scaleY: 1, complete: new Laya.Handler(this, this.onScaleEnd) }, 350 * this.timeScale, Laya.Ease.backOut);
    }

    private onScaleEnd(){
        // this.getTween();
        // this.tempTween.from(this,{complete:Laya.Handler.create(this, this.delayShow)},650);
        Laya.timer.once(650*this.timeScale, this, this.delayShow);
    }
    
    private delayShow(){
        this.getTween();
        this.tempTween.to(this._ui.box_content,{y:this._tarY,alpha:0,complete:Laya.Handler.create(this, this.closeHandler)},500*this.timeScale,Laya.Ease.linearIn);
    }

    private closeHandler(){
        // console.log("complete");
        // console.log(">>>>>>>>>>>## _tarY"+this._ui.box_content.y,"len:"+this.midLabelList.length);

        
        E.ViewMgr.Close(this.ViewType);
        if(this.midLabelList.length > 0){
            while (this.midLabelList.length >= 2) {
                this.midLabelList.shift();
            }
            let node = this.midLabelList.shift();
            E.ViewMgr.midDoOpen(node.content,node.color);
        }
        
    }

    private initUI() {
    }

    //#endregion
}