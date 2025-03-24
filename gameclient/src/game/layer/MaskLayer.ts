import {LayerBase} from "./LayerBase";
import {LayerEvent} from "./LayerEvent";

/**遮罩层级*/
export class MaskLayer extends LayerBase {

    //#region 静态

    private static DEF_MASK_ALPHA = 0;

    //#endregion

    //#region 实例

    protected _maskEnable: boolean = false;//是否激活遮罩
    // protected _maskSprite: Laya.Sprite = null;//遮罩精灵
    protected _useAnimation: boolean = false;//是否使用动画
    protected _animationComplete: boolean = false;//动画是否完成
    protected _handler: Laya.Handler[] = [];//处理方法

    protected _useCustomMask: boolean = false;//是否使用传入的遮罩
    protected _customMask: Laya.Sprite = null;//传入的遮罩精灵
    protected _customMaskParent: Laya.Sprite = null;//传入遮罩的父节点
    protected _customMaskIndex: number = 0;//传入遮罩的索引值


    constructor(layerid: number, name: string) {
        super(layerid, name);
        this.InitMask();
        this._handler = [];
        this._maskEnable = false;
        this._useAnimation = true;
    }

    /**激活遮罩
     * @param b 是否激活
    */
    public set MaskEnable(b: boolean) {
        // this._maskEnable = b;
        // if (this._maskEnable) {
        //     if (this.numChildren > 0)
        //         super.addChildAt(this._maskSprite, 0);//放到最底层
        // }
        // else {
        //     this._maskSprite.removeSelf();
        // }
    }

    /**设置遮罩透明度
     * @param a 透明度 0-1
    */
    public set MaskAlpha(a: number) {
        // this._maskSprite.alpha = a;
    }

    /**设置使用动画
     * @param b 是否使用动画
    */
    public set UseAnimation(b: boolean) {
        this._useAnimation = b;
    }

    /**动画完成
     * @returns bool 是否完成
    */
    public get AnimationComplete(): boolean {
        return this._animationComplete;
    }


    /**添加子节点
     * @param caller 作用域
     * @param listener 监听事件
     * @param args 传入参数
     * @param alpha 透明度
    */
    public AddChlidWithMaskCall(caller: any, listener: (...args) => void, args: any[] = null, alpha: number = MaskLayer.DEF_MASK_ALPHA) {
        this.MaskEnable = false;
        //透明度
        if (this.MaskAlpha !== MaskLayer.DEF_MASK_ALPHA)
            this.MaskAlpha = alpha;

        this.addChild(caller);
        this._handler.push(Laya.Handler.create(caller, listener, args));
    }

    /**添加子节点
     * @param mask 遮罩
     * @param caller 执行域
     * @param 监听事件
     * @param 传入参数
    */
    public AddChildWithCustomMask(mask: Laya.Sprite, caller: any, listener: (...args) => void, args: any[] = null) {
        if (!mask) return;

        this.MaskEnable = false;
        this._useCustomMask = true;
        this._customMask = mask;
        if (this._customMask.parent) {
            this._customMaskParent = this._customMask.parent as Laya.Sprite;
            this._customMaskIndex = this._customMaskParent.getChildIndex(this._customMask);
        }
        // this._maskSprite.alpha = 0;
        this.addChild(caller);
        this._handler.push(Laya.Handler.create(caller, listener, args));
    }

    /**override 添加子节点*/
    public addChild(node: Laya.Node): Laya.Node {
        this.SuperAddChild(node);
        //添加传入遮罩
        if (this._useCustomMask && this._customMask) {
            super.addChildAt(this._customMask, 0);
        }
        //添加默认遮罩
        if (this._maskEnable) {
            // super.addChildAt(this._maskSprite, 0);
        }
        this.event(LayerEvent.AddChild, this.numChildren);
        return node;
    }

    /**override 移除子节点
     * @param node 子节点
    */
    public removeChild(node: Laya.Node): Laya.Node {
        super.removeChild(node);
        //传入遮罩处理
        if (this.numChildren == 2 && this._useCustomMask) {
            if (this._customMask) {
                if (this._customMaskParent) {
                    this._customMaskParent.addChildAt(this._customMask, this._customMaskIndex);
                }
                this._useCustomMask = false;
                this._customMask = null;
                this._customMaskParent = null;
                this._customMaskIndex = 0;
            }
        }
        //默认遮罩处理
        // if (this.numChildren == 1 && this.getChildAt(0) == this._maskSprite) {
        //     super.removeChild(this._maskSprite);
        //     this._animationComplete = false;
        //     this.MaskAlpha = MaskLayer.DEF_MASK_ALPHA;
        // }
        //派发事件
        this.event(LayerEvent.RemoveChlid, this.numChildren);
        return node;
    }



    /**初始化遮罩
     * -通过graphic绘制一个遮罩
    */
    protected InitMask() {
        // this._maskSprite = new Laya.Sprite();
        // this._maskSprite.graphics.clear();
        // this._maskSprite.graphics.drawRect(0, 0, LayerMgr.stageDesignWidth, LayerMgr.stageDesignHeight, "#000000");
        // this._maskSprite.alpha = MaskLayer.DEF_MASK_ALPHA;
        // this._maskSprite.size(LayerMgr.stageDesignWidth, LayerMgr.stageDesignHeight);
        // this._maskSprite.on(Laya.Event.CLICK, this, this.ApplyClick);
    }

    /**添加子节点
     * @param node 节点
     * @param index 索引
    */
    protected SuperAddChild(node: any, index?: number): Laya.Node {
        //动画处理
        if (this.UseAnimation && !this.AnimationComplete) {
            let sp: Laya.Sprite = node as Laya.Sprite;
            if (sp) {
                let comp: Laya.Component = node as Laya.Component;
                let size: Laya.Point = new Laya.Point();
                if (comp)
                    size.setTo(sp.displayWidth, sp.displayHeight);
                else {
                    let rect: Laya.Rectangle = sp.getBounds();
                    size.setTo(rect.width, rect.height);
                }
                //动画
                Laya.Tween.from(node, { x: sp.x + (size.x >> 1), y: sp.y + (size.y >> 1), ScaleX: 0, ScaleY: 0 }, 300, Laya.Ease.backInOut, Laya.Handler.create(this, () => {
                    this._animationComplete = true;
                    this.event(LayerEvent.AnimationComplete, this.AnimationComplete);
                }));
            }
        }
        // //点击事件
        // this._maskSprite.off(Laya.Event.CLICK, this, this.ApplyClick);
        // Laya.timer.once(1000 * 2, this, () => {
        //     this._maskSprite.on(Laya.Event.CLICK, this, this.ApplyClick);
        // })

        if (index) super.addChildAt(node, index);
        else super.addChild(node);

        return node;
    }

    /**执行点击事件*/
    protected ApplyClick() {
        if (this._handler.length)
            (this._handler.pop() as Laya.Handler).run();
    }


    //#endregion

}