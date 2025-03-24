// import { DebugUtil } from "../../../../../frame/util/DebugUtil";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { EPageType } from "../../../../common/defines/EnumDefine";
import { ScreenAdapter } from "../../../../G";

/**
 * 红色预警框
 */
export class RedTips extends ViewBase {
    private _ui: Laya.Image;
    PageType:EPageType = EPageType.None;
    private tw:Laya.Tween;
    private readonly useAnimTime:number = 300;
    protected onAddLoadRes(): void {
    }
    
    protected onExit(): void {
        this.tw.clear();
    }

    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if (!this.UI) {
            this.UI = this._ui = new Laya.Image() as any;
            this._ui.skin = `remote/fight/errred.png`;
            this.tw = new Laya.Tween();
        }
    }

    protected onInit(): void {
        this.onInitAnim();
    }

    private onPlayEnd(){
        this.tw.to(this._ui,{alpha:1.0},this.useAnimTime,null,new Laya.Handler(this,this.onInitAnim));
    }

    private onInitAnim(){
        this.tw.to(this._ui,{alpha:0},this.useAnimTime,null,new Laya.Handler(this,this.onPlayEnd));
    }

    protected SetCenter(): void {
        if (this.UI && !this.UI.destroyed) {
            this._ui.width = ScreenAdapter.UIRefWidth;//Laya.stage.width;
            this._ui.height= Laya.stage.height;
            this.UI.anchorX = this.UI.anchorY = 0.5;
            this.UI.x = this.ViewParent.width >> 1;
            this.UI.y = this.ViewParent.height >> 1;
        }
        DebugUtil.draw(this.UI,"#ff00ff");
    }

}