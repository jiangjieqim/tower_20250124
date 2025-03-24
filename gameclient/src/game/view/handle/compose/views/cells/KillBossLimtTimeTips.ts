import { ViewBase } from "../../../../../../frame/view/ViewBase";
import { ui } from "../../../../../../ui/layaMaxUI";
import { NoContainerSimpleEffect } from "../../../avatar/NoContainerSimpleEffect";
import { SpineEffectMgr } from "../../../avatar/SpineEffectMgr";
import { ComposeModel } from "../../ComposeModel";
/***妖王提示 */
export class KillBossLimtTimeTips extends ViewBase{
    private _ui:ui.views.compose.banner1.ui_kill_boss_bannerUI;
    private _effect:NoContainerSimpleEffect;
    private model:ComposeModel;
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
    }
    protected onExit(): void {
        // throw new Error("Method not implemented.");
        this.disposeEffect();
    }
    protected onFirstInit(): void {
        if(!this.UI){
            this.model = ComposeModel.Ins;
            this.UI = this._ui = new ui.views.compose.banner1.ui_kill_boss_bannerUI();
        }
    }

    private disposeEffect(){
        if(this._effect){
            this._effect.dispose();
            this._effect = null;
        }
    }
    protected onInit(): void {
        this.disposeEffect();
        this._effect = SpineEffectMgr.createNoSimpleEffect('o/spine/succeed/tips_2/Tips2', this._ui, this._ui.width / 2, this._ui.height / 2 + 25, 0);
        this._effect.play(0, false, this, this.onPlayEnd);

        let sub = this.model.nextWaveTime - TimeUtil.serverTime;
        if(sub < 0){
            sub = 0;
        }
        this._ui.timetf.text = `${sub}s`;
    }
    private onPlayEnd(){
        this.Close();
    }
}