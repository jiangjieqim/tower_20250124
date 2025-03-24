import { ui } from "../../../../../../ui/layaMaxUI";
import { BaseMainIcon } from "./BaseMainIcon";
/**顶部按钮 */
export class TopMainIcon extends BaseMainIcon {

    constructor() {
        super();
        this.skin = this.mSkin;
        this.mSkin.tf.visible = false;
    }

    protected get mSkin(): ui.views.main.ui_little_iconUI {
        if (!this.skin) {
            this.skin = new ui.views.main.ui_little_iconUI();
        }
        return this.skin as any;
    }

    public get icon(): Laya.Image {
        return this.mSkin.bg;
    }
}