import { E } from "../../G";
import {ResItemGroup} from "../../resouce/ResItemGroup";
import { ResPath } from "../../resouce/ResPath";

/**点击屏幕效果 */
export class ClickScreenEffect extends Laya.Sprite {

    private _resGroup: ResItemGroup;
    private _ani_click: Laya.Animation;
    private _hasLoaded: boolean = false;

    constructor() {
        super();
        this._isEnable = true;
        this._hasLoaded = false;
        this._resGroup = new ResItemGroup();
        this._resGroup.Add(ResPath.Atlas.Anim_Click, Laya.Loader.ATLAS);
        E.ResMgr.LoadGroup(this._resGroup, Callback.Create(this, this.onLoadComplete), null);
    }

    private onLoadComplete(): void {
        this._ani_click = new Laya.Animation();
        this._ani_click.loadAnimation(ResPath.Ani.Click, Laya.Handler.create(this, () => {
            this._ani_click.visible = this._isEnable;
            this.addChild(this._ani_click);
            this._ani_click.visible = false;
            // this._ani_click.zOrder = 100;
            this._hasLoaded = true;
        }, [], true), ResPath.Atlas.Anim_Click);
    }

    private _isEnable: boolean = false;//是否激活
    /**设置是否激活 */
    public SetEnable(b: boolean): void {
        this._isEnable = b;
        if (this._ani_click != null && this._ani_click.visible) {
            this._ani_click.visible = false;
        }
    }

    /**显示效果 */
    public ShowEffect(x: number = Laya.stage.mouseX, y: number = Laya.stage.mouseY): void {
        if (!this._hasLoaded || !this._isEnable) return;

        this.pos(x, y);
        this._ani_click.play(0, false);
        if (this._ani_click != null && !this._ani_click.visible) {
            this._ani_click.visible = true;
        }
    }

}