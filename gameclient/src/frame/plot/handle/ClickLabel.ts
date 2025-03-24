
/**点击区域*/
export class ClickLabel extends Laya.Label {

    private _clickCount = 0;
    private _clickCounter = 0;
    private _progCall: Callback;
    private _compCall: Callback;
    private _canClick: boolean;

    /**
     * @param rect x=位置x y=位置y w=宽度 h=高度
     * @param str 字符串
     * @param callback 回调
    */
    constructor(rect: { x: number, y: number, w: number, h: number }, str: string, count: number, prog: Callback, comp: Callback) {
        super();
        this.pos(rect.x, rect.y);
        this.width = rect.w <= 0 ? 1 : rect.w;
        this.height = rect.h <= 0 ? 1 : rect.h;
        this.changeText(str);

        this._clickCount = count;
        this._clickCounter = 0;
        this._progCall = prog;
        this._compCall = comp;

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

