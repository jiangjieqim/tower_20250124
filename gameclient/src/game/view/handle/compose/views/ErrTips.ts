import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { EPageType } from "../../../../common/defines/EnumDefine";
import { SpineCoreSkel } from "../../avatar/spine/SpineCoreSkel";
export interface IErrTipsVo {
    cur: number;
    max: number;
}
/**遇警 */
export class ErrTips extends ViewBase {
    private _ui: ui.views.compose.banner1.ui_err_tipsUI;
    PageType: EPageType = EPageType.None;
    // private con1: Laya.Sprite;
    private skel: SpineCoreSkel;

    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
    }
    protected onExit(): void {
        // throw new Error("Method not implemented.");
        this.clearEffect();
    }
    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if (!this.UI) {
            this.UI = this._ui = new ui.views.compose.banner1.ui_err_tipsUI();
            // this.con1 = new Laya.Sprite();
            // this.con1.x = this._ui.width / 2;
            // this.con1.y = this._ui.height / 2;
        }
    }
    private clearEffect() {
        if (this.skel) {
            this.skel.dispose();
            this.skel = null;
        }
    }
    protected onInit(): void {
        this.clearEffect();
        let vo: IErrTipsVo = this.Data;
        this._ui.countTf.text = `${vo.cur}/${vo.max}`;
        this.skel = new SpineCoreSkel();
        this.skel.once(Laya.Event.COMPLETE, this, this.onCompleteHander);
        // let anim:number = EAvatarAnim.TowerIdle + (this.cfg.f_card_visualeffect - 1);
        this.skel.play(0, this, this.onPlayEnd, undefined, true);
        this.skel.load(`o/spine/succeed/tips_1/Tips1.skel`);
    }

    private onCompleteHander() {
        if (this.skel && this.skel.skeleton) {
            this._ui.addChildAt(this.skel.skeleton, 0);
            this.skel.skeleton.pos(this._ui.width/2 - 70,this._ui.height/2+30);
        }
    }

    private onPlayEnd() {
        this.Close();
    }

}