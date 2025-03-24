/**点击按钮*/
export class ClickImage extends Laya.Image {

    private _clickCount = 0;
    private _clickCounter = 0;
    private _progCall: Callback;
    private _compCall: Callback;
    private _canClick: boolean;
    /**
     * @param skin 图片路径
     * @param rect x:位置x y:位置y w:宽度 h:高度
     * @param click 点击次数
     * @param prog 每次点击回调
     * @param comp 所有点击完成回调
    */
    constructor(skin: string, rect: { x: number, y: number, w: number, h: number }, click: number, prog: Callback, comp: Callback) {
        super();

        this.skin = skin;
        this.pos(rect.x, rect.y);
        this.width = rect.w <= 0 ? 1 : rect.w;
        this.height = rect.h <= 0 ? 1 : rect.h;

        this._clickCount = click;
        this._clickCounter = 0;
        this._progCall = prog;
        this._compCall = comp;
        this._canClick = true;

        this.on(Laya.Event.CLICK, this, this.clickHandle);
    }

    /**点击事件处理*/
    private clickHandle() {
        this._clickCounter++;
        this._progCall?.Invoke();

        if (this._clickCounter >= this._clickCount) {
            this.Destroy(true);
        }
    }


    public Destroy(comp?: boolean) {
        this._canClick = false;
        if (comp)
            this._compCall?.Invoke();
        this.off(Laya.Event.CLICK, this, this.clickHandle, false);
        this.removeSelf();
        this.destroy();
    }

}