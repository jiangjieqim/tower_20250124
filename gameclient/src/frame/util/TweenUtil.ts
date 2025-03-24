import { TweenEase } from "./TweenEase";
import Tween = Laya.Tween;
import Handler = Laya.Handler;

export class TweenUtil {
    public static ClearAll(tar: any) {
        Tween.clearAll(tar);
    }
    public static Clear(tween: Tween) {
        Tween.clear(tween);
    }

    /**
     * 淡入淡出 滑动动画
     * @param sp 对象
     * @param a 透明度
     * @param t 时间
     * @param ease 缓动函数
     * @param complete 完成回调
     */
    public static Fade(sp: any, a: number, t: number, ease?: TweenEase, complete?: Handler): Tween {
        return Tween.to(sp, { alpha: a }, t, this.getEase(ease), complete);
    }

    /**
     * 尺寸变化 缓动动画
     * @param sp 对象
     * @param x scaleX
     * @param y scaleY
     * @param t 时间
     * @param ease 缓动函数
     * @param complete 完成回调
     */
    public static Scale(sp: any, x: number, y: number, t: number, ease?: TweenEase, complete?: Handler): Tween {
        return Tween.to(sp, { scaleX: x, scaleY: y }, t, this.getEase(ease), complete);
    }

    /**
    * X 尺寸变化 缓动动画
    * @param sp 对象
    * @param x scaleX
    * @param y scaleY
    * @param t 时间
    * @param ease 缓动函数
    * @param complete 完成回调
    */
    public static ScaleX(sp: any, x: number, t: number, ease?: TweenEase, complete?: Function): Tween {
        return Tween.to(sp, { scaleX: x }, t, this.getEase(ease), Handler.create(this, () => {
            if (complete != null) complete();
        }));
    }

    /**
    * Y 尺寸变化 缓动动画
    * @param sp 对象
    * @param x scaleX
    * @param y scaleY
    * @param t 时间
    * @param ease 缓动函数
    * @param complete 完成回调
    */
    public static ScaleY(sp: any, y: number, t: number, ease?: TweenEase, complete?: Function): Tween {

        return Tween.to(sp, { scaleY: y }, t, this.getEase(ease), Handler.create(this, () => {
            if (complete)
                complete();
        }));
    }

    /**
    * 宽度 尺寸变化 缓动动画
    * @param sp 对象
    * @param width width
    * @param t 时间
    * @param ease 缓动函数
    * @param complete 完成回调
    */
    public static ScaleWidth(sp: any, width: number, t: number, ease?: TweenEase, complete?: Function): Tween {

        return Tween.to(sp, { width: width }, t, this.getEase(ease), Handler.create(this, () => {
            if (complete)
                complete();
        }));
    }

    /**
    * 高度 尺寸变化 缓动动画
    * @param sp 对象
    * @param height height
    * @param t 时间
    * @param ease 缓动函数
    * @param complete 完成回调
    */
    public static ScaleHeight(sp: any, height: number, t: number, ease?: TweenEase, complete?: Function): Tween {

        return Tween.to(sp, { height: height }, t, this.getEase(ease), Handler.create(this, () => {
            if (complete)
                complete();
        }));
    }

    /**
     * 位置移动 缓动动画
     * @param sp 对象
     * @param x posx
     * @param y posy
     * @param t 时间
     * @param ease 缓动函数
     * @param complete 完成回调
     */
    public static Move(sp: any, x: number, y: number, t: number, ease?: TweenEase, complete?: Function): Tween {

        return Tween.to(sp, { x: x, y: y }, t, this.getEase(ease), Handler.create(this, () => {
            if (complete)
                complete();
        }));
    }

    /**
     * X位置移动 缓动动画
     * @param sp 对象
     * @param x posx
     * @param t 时间
     * @param ease 缓动函数
     * @param complete 完成回调
     */
    public static MoveX(sp: any, x: number, t: number, ease?: TweenEase, complete?: Handler): Tween {

        return Tween.to(sp, { x: x }, t, this.getEase(ease), complete);
    }

    /**
     * Y位置移动 缓动动画
     * @param sp 对象
     * @param x posx
     * @param t 时间
     * @param ease 缓动函数
     * @param complete 完成回调
     */
    public static MoveY(sp: any, y: number, t: number, ease?: TweenEase, complete?: Handler): Tween {

        return Tween.to(sp, { y: y }, t, this.getEase(ease), complete);
    }

    /**
     * Z轴旋转 缓动动画
     * @param sp 对象
     * @param z rotation z
     * @param t 时间
     * @param ease 滑动函数
     * @param complete 完成回调
     */
    public static RotateZ(sp: any, z: number, t: number, ease?: TweenEase, complete?: Function): Tween {

        return Tween.to(sp, { rotation: z }, t, this.getEase(ease), Handler.create(this, () => {
            if (complete)
                complete();
        }));
    }

    public static getEase(ease: TweenEase) {
        if (ease == TweenEase.linearNone)
            return Laya.Ease.linearNone;
        else if (ease == TweenEase.linearIn)
            return Laya.Ease.linearIn;
        else if (ease == TweenEase.linearInOut)
            return Laya.Ease.linearInOut;
        else if (ease == TweenEase.linearOut)
            return Laya.Ease.linearOut;
        else if (ease == TweenEase.bounceIn)
            return Laya.Ease.bounceIn;
        else if (ease == TweenEase.bounceInOut)
            return Laya.Ease.bounceInOut;
        else if (ease == TweenEase.bounceOut)
            return Laya.Ease.bounceOut;
        else if (ease == TweenEase.backIn)
            return Laya.Ease.backIn;
        else if (ease == TweenEase.backInOut)
            return Laya.Ease.backInOut;
        else if (ease == TweenEase.backOut)
            return Laya.Ease.backOut;
        else if (ease == TweenEase.elasticIn)
            return Laya.Ease.elasticIn;
        else if (ease == TweenEase.elasticInOut)
            return Laya.Ease.elasticInOut;
        else if (ease == TweenEase.elasticOut)
            return Laya.Ease.elasticOut;
        else if (ease == TweenEase.strongIn)
            return Laya.Ease.strongIn;
        else if (ease == TweenEase.strongInOut)
            return Laya.Ease.strongInOut;
        else if (ease == TweenEase.strongOut)
            return Laya.Ease.strongOut;
        else if (ease == TweenEase.sineInOut)
            return Laya.Ease.sineInOut;
        else if (ease == TweenEase.sineIn)
            return Laya.Ease.sineIn;
        else if (ease == TweenEase.sineOut)
            return Laya.Ease.sineOut;
        else if (ease == TweenEase.quintIn)
            return Laya.Ease.quintIn;
        else if (ease == TweenEase.quintInOut)
            return Laya.Ease.quintInOut;
        else if (ease == TweenEase.quintOut)
            return Laya.Ease.quintOut;
        else if (ease == TweenEase.quartIn)
            return Laya.Ease.quartIn;
        else if (ease == TweenEase.quartInOut)
            return Laya.Ease.quartInOut;
        else if (ease == TweenEase.quartOut)
            return Laya.Ease.quartOut;
        else if (ease == TweenEase.cubicIn)
            return Laya.Ease.cubicIn;
        else if (ease == TweenEase.cubicInOut)
            return Laya.Ease.cubicInOut;
        else if (ease == TweenEase.cubicOut)
            return Laya.Ease.cubicOut;
        else if (ease == TweenEase.quadIn)
            return Laya.Ease.quadIn;
        else if (ease == TweenEase.quadInOut)
            return Laya.Ease.quadInOut;
        else if (ease == TweenEase.quadOut)
            return Laya.Ease.quadOut;
        else if (ease == TweenEase.expoIn)
            return Laya.Ease.expoIn;
        else if (ease == TweenEase.expoInOut)
            return Laya.Ease.expoInOut;
        else if (ease == TweenEase.expoOut)
            return Laya.Ease.expoOut;
        else if (ease == TweenEase.circIn)
            return Laya.Ease.circIn;
        else if (ease == TweenEase.circInOut)
            return Laya.Ease.circInOut;
        else if (ease == TweenEase.circOut)
            return Laya.Ease.circOut;
        return null;
    }

}