import { PercentShape } from "../PercentShape";
import { TowerAvatarView } from "../TowerAvatarView";

export abstract class PercentBarImg extends Laya.Image {
    mScale: number = 1.0;
    monster: TowerAvatarView;
    curParent: Laya.Sprite;
    protected allWidth: number = 54;//54;
    protected allHeight: number = 6;//6;
    private _barShape: PercentShape;
    constructor() {
        super();
        this.sizeGrid = "3,3,3,3";
        this.skin = `remote/fight/jdt_boss_d.png`;
    }

    init(v: number) {
        this.width = this.allWidth * this.mScale;
        this.height = this.allHeight * this.mScale;
        this._barShape = this.createBar();
        this._barShape.width = (this.allWidth - 4) * this.mScale;
        this._barShape.height = (this.allHeight - 4) * this.mScale;
        this._barShape.x = (this.width - this._barShape.width) / 2;
        this._barShape.y = (this.height - this._barShape.height) / 2;
        this._barShape.percent = v;
        this.addChild(this._barShape);
        Laya.timer.frameLoop(1, this, this.onFrameLoop);
    }
    protected abstract createBar():PercentShape;
    protected abstract onFrameLoop();
    dispose() {
        this.curParent = null;
        this.graphics.clear();
        Laya.timer.clear(this, this.onFrameLoop);
        this._barShape.dispose();
        // this.removeSelf();
        this.destroy();
    }
    set percent(v:number){
        this._barShape.percent = v;
    }
}