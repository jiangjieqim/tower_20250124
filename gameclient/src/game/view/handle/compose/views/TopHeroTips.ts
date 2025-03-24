// import { DebugUtil } from "../../../../../frame/util/DebugUtil";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { EPageType, EViewType } from "../../../../common/defines/EnumDefine";
import { E } from "../../../../G";
import { ComposeModel } from "../ComposeModel";
import { HeroTipsCtl } from "./HeroTipsCtl";
/**英雄的tips */
export class TopHeroTips extends ViewBase {
    public PageType: EPageType = EPageType.None;
    protected mShowUpdate: boolean = true;
    protected autoFree:boolean = true;
    private _ui: ui.views.compose.ui_top_hero_tipsUI;
    private model: ComposeModel;
    private ctl: HeroTipsCtl = new HeroTipsCtl();
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
    }
    // private clearUI(skin:IHeroTipsSkin){
        // Laya.Loader.clearTextureRes(skin.bg.skin);
        // Laya.Loader.clearTextureRes(skin.bg2.skin);
    // }
    protected onExit(): void {
        // throw new Error("Method not implemented.");
        if(this.ctl){
            this.ctl.onExit();
        }
        // this.clearUI(this._ui.low);
        // this.clearUI(this._ui.high);
        // Laya.timer.clear(this,this.onCheckClose);
    }
    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if (!this.UI) {
            this.UI = this._ui = new ui.views.compose.ui_top_hero_tipsUI();
            this.model = ComposeModel.Ins;
        }
    }

    private onCheckClose(){
        if(initConfig.enable_spine_gpu_test2){
            return;
        }
        if(!E.ViewMgr.isOpenReg(EViewType.ComposeMain)){
            LogSys.Log("check close TopHeroTips...");
            this.Close();
            // E.ViewMgr.Close(EViewType.TopHeroTips);
        }
    }

    protected onInit(): void {
        let uid = this.Data;
        let vo = this.model.getHeroVo(uid);
        if (vo) {
            this._ui.low.visible = false;
            this._ui.high.visible = false;
            let heroIds: number[] = this.model.getHeroIds(uid);
            let offsetX: number;
            let offsetY: number;
            if (heroIds.length > 0) {
                offsetX = 141;
                offsetY = 250;
                this.ctl.skin = this._ui.high;
            } else {
                offsetX = 132;
                offsetY = 186;
                this.ctl.skin = this._ui.low;
            }
            this._ui.height = this.ctl.skin.height;
            this.ctl.skin.visible = true;
            this.ctl.setData(uid, heroIds, offsetX, offsetY);
        } 
    }

    protected onShow(){
        super.onShow();
        Laya.timer.frameLoop(1,this,this.onCheckClose);
    }

    protected SetCenter(): void {
        if (this.UI && !this.UI.destroyed) {
            this.UI.anchorX = this.UI.anchorY = 0.5;
            this.UI.x = this.ViewParent.width >> 1;
            this.UI.y = E.sdk.statusBarHeight + this.UI.height / 2;
            DebugUtil.draw(this.UI, "#ff00ff");
        }
    }
}