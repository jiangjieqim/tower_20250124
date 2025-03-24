import {TweenUtil} from "../../../../frame/util/TweenUtil";

/**向上飘浮道具提示*/
export class FloatProp {

    private static _ins: FloatProp;
    public static get Ins() {
        if (!this._ins) this._ins = new FloatProp();
        return this._ins;
    }

    private boxs: Laya.Box[] = [];

    public Create(pos: Laya.Point, iconUrl: string, content: string, parent: Laya.Sprite, t: number = 500): void {

        let box: Laya.Box = new Laya.Box;

        let icon: Laya.Image = new Laya.Image(iconUrl);
        let lbl: Laya.Label = new Laya.Label(content);

        box.addChild(icon);
        box.addChild(lbl);

        icon.size(50, 50);
        icon.pos(0, 0);

        lbl.pos(50, 0);
        lbl.size(100, 50);
        lbl.color = "#ffffff";
        lbl.fontSize = 28;
        lbl.align = "left";
        lbl.valign = "middle";

        parent.addChild(box);
        box.pos(pos.x, pos.y);
        this.boxs.push(box);
        TweenUtil.MoveY(box, pos.y - 100, t);
        TweenUtil.Fade(box, 0, t, null, Laya.Handler.create(this, () => {
            ListUtil.Remove(this.boxs, box);
            box.destroy();
        }));

    }

    Clear() {
        for (let i = 0; i < this.boxs.length; i++) {
            const element = this.boxs[i];
            element.destroy();
        }
        this.boxs = [];
    }
}