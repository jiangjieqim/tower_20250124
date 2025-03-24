import {TweenUtil} from "../../../../frame/util/TweenUtil";

/**向上飘浮文本提示*/
export class FloatLabel {

    private static _ins: FloatLabel;
    public static get Ins() {
        if (!this._ins) this._ins = new FloatLabel();
        return this._ins;
    }

    private lbls: Laya.Label[] = [];

    public Create(pos: Laya.Point, content: string, parent: Laya.Sprite, t: number = 500): void {

        let lbl: Laya.Label = new Laya.Label(content);

        lbl.color = "#ffffff";
        lbl.fontSize = 28;
        lbl.align = "center";
        lbl.valign = "middle";

        parent.addChild(lbl);
        lbl.pos(pos.x, pos.y);
        this.lbls.push(lbl);
        TweenUtil.MoveY(lbl, pos.y - 100, t);
        TweenUtil.Fade(lbl, 0, t, null, Laya.Handler.create(this, () => {
            ListUtil.Remove(this.lbls, lbl);
            lbl.destroy();
        }));
    }
}