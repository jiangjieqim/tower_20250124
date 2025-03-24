import {ColorUtil} from "../../../frame/util/ColorUtil";

/**缩放动画脚本*/
export class ScaleAnimComp {

    private scaleBox: Laya.Box;
    private scaleOrginValue: { x: number, y: number };
    private isMouseDown: boolean = false;//按下
    private isMouseOut: boolean = false;//移除
    private _orginAnchor: Laya.Point;

    public set owner(value: any) {
        this.scaleBox = value;
        //自定义的脚本会有时序问题，所以在此添加一个延时
        this.scaleBox.frameOnce(2, this, this.onLoaded);
    }

    private onLoaded(): void {
        this.scaleOrginValue = { x: this.scaleBox.scaleX, y: this.scaleBox.scaleY };
        this.scaleBox.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        this.scaleBox.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
        this.scaleBox.on(Laya.Event.MOUSE_OUT, this, this.onMouseOut);
        // this.scaleBox.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
    }

    /**按下处理*/
    private onMouseDown() {
        this.isMouseDown = true;
        this.isMouseOut = false;
        this.scaleSmall();
    }

    /**抬起处理*/
    private onMouseUp() {
        if (this.isMouseDown)
            this.scaleNormal();
        this.isMouseDown = false;
    }

    /**移出处理*/
    private onMouseOut() {
        if (this.isMouseDown)
            this.scaleNormal();
        this.isMouseDown = false;
        this.isMouseOut = true;
    }

    /**移动处理*/
    private onMouseMove() {
        if (this.isMouseOut) {
            if (this.isHit(this.scaleBox))
                this.scaleSmall();
            else
                this.scaleNormal();
        }
    }

    /**缩小*/
    private scaleSmall() {
        if (this.scaleBox) {
            this.scaleBox.scale(this.scaleOrginValue.x * 0.95, this.scaleOrginValue.y * 0.95);
            this.scaleBox.filters = ColorUtil.CreateColorFilter(1);
        }
    }

    /**默认缩放*/
    private scaleNormal() {
        if (this.scaleBox) {
            this.scaleBox.scale(this.scaleOrginValue.x, this.scaleOrginValue.y);
            this.scaleBox.filters = [];
        }
    }

    /**检测点击*/
    private isHit(checkBox: Laya.Box, extW: number = 0, extH: number = 0) {
        if (checkBox) {
            let touchPos: Laya.Point = checkBox.getMousePoint();
            let touchArea: Laya.Rectangle = new Laya.Rectangle(0 - extW / 2, 0 - extH / 2, checkBox.width + extW, checkBox.height + extH);
            return touchArea.contains(touchPos.x, touchPos.y);
        }
        return false;
    }
}