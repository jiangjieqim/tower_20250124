import Vector3 = Laya.Vector3;
import Sprite3D = Laya.Sprite3D;
import Tween = Laya.Tween;

import {MathUtil} from "./MathUtil";
import {TweenUtil} from "./TweenUtil";
import { Vec3Util } from "./Vec3Util";
import { TweenEase } from "./TweenEase";

/**贝塞尔曲线类型 */
enum EBezierType {
    Bezier2 = 0,//2次贝塞尔曲线
    Bezier3 = 1,//3次贝塞尔曲线
}
/**3d缓动工具类
 * 
 * todo:这个工具类需要重写!!!!
 * 
*/
export class Tween3dUtil {

    /** 变化倍率 */
    private mult: number;
    /** 缓动目标 */
    private target: any;
    /** pos缓动数据 */
    private targetVect3: Laya.Vector3;
    /** 缓动类型 */
    private tweenType: string;
    /** 缓动动画 */
    private tween: Laya.Tween;
    /** 目标初始位移 */
    private posX: number;
    private posY: number;
    private posZ: number;
    /** 目标初始scale */
    private scaleX: number;
    private scaleY: number;
    private scaleZ: number;
    /** 目标初始euler */
    private eulerX: number;
    private eulerY: number;
    private eulerZ: number;
    /** 完成回调 */
    private completeHandler: Laya.Handler;

    public static _Tween3DData: { [key: string]: Tween3dUtil } = {};

    constructor(target: Laya.Sprite3D, vect3: Laya.Vector3, type: string) {
        this.mult = 0;
        this.target = target;
        this.tweenType = type;

        if (this.tweenType == "position") {
            this.targetVect3 = new Laya.Vector3(
                vect3.x - target.transform.localPosition.x,
                vect3.y - target.transform.localPosition.y,
                vect3.z - target.transform.localPosition.z);
        }
        else if (this.tweenType == "scale") {
            this.targetVect3 = new Laya.Vector3(
                vect3.x - target.transform.localScale.x,
                vect3.y - target.transform.localScale.y,
                vect3.z - target.transform.localScale.z);
        }
        else if (this.tweenType == "euler") {
            this.targetVect3 = new Laya.Vector3(
                vect3.x - target.transform.localRotationEuler.x,
                vect3.y - target.transform.localRotationEuler.y,
                vect3.z - target.transform.localRotationEuler.z);
        }

        this.posX = target.transform.localPosition.x;
        this.posY = target.transform.localPosition.y;
        this.posZ = target.transform.localPosition.z;

        this.scaleX = target.transform.localScale.x;
        this.scaleY = target.transform.localScale.y;
        this.scaleZ = target.transform.localScale.z;

        this.eulerX = target.transform.localRotationEuler.x;
        this.eulerY = target.transform.localRotationEuler.y;
        this.eulerZ = target.transform.localRotationEuler.z;

    }

    /**
     *
     * @param target 缓动对象
     * @param date 缓动数据
     * @param duration 缓动时间
     * @param ease 缓动方式
     * @param complete 完成回调
     * @param delay 延迟
     * @param type 类型
     */
    public static To(target: Sprite3D, vect: Vector3, type = "position", duration = 1000, ease = Laya.Ease.linearNone, complete?: Laya.Handler, update?: Laya.Handler, delay?: number): Tween3dUtil {
        if (target) {
            let tween3D: Tween3dUtil = new Tween3dUtil(target, vect, type);
            tween3D.to(duration, ease, complete, update, delay);

            Tween3dUtil._Tween3DData[target.id + type] = tween3D;
            return tween3D;
        }
    }

    private to(duration, ease, complete: Laya.Handler, update: Laya.Handler, delay: number): void {

        this.completeHandler = complete;

        this.tween = Laya.Tween.to(this, { mult: 1, update: update }, duration, ease, Laya.Handler.create(this, this.OnComplete), delay);

        Laya.timer.frameLoop(1, this, this.onUpdate);
    }

    private onUpdate() {
        if (this.tweenType == "position") {
            this.target.transform.localPosition = new Laya.Vector3(this.posX + this.targetVect3.x * this.mult,
                this.posY + this.targetVect3.y * this.mult, this.posZ + this.targetVect3.z * this.mult);
        }
        else if (this.tweenType == "scale") {
            this.target.transform.localScale = new Laya.Vector3(this.scaleX + this.targetVect3.x * this.mult,
                this.scaleY + this.targetVect3.y * this.mult, this.scaleZ + this.targetVect3.z * this.mult);
        }
        else if (this.tweenType == "euler") {
            this.target.transform.localRotationEuler = new Laya.Vector3(this.eulerX + this.targetVect3.x * this.mult,
                this.eulerY + this.targetVect3.y * this.mult, this.eulerZ + this.targetVect3.z * this.mult);
        }
    }

    /**
     * 停止欢动
     * @param target 缓动目标
     * @param type 停止类型
     */
    public static Clear(target: Laya.Sprite3D, type: string) {

        var tween3D = Tween3dUtil._Tween3DData[target.id + type];
        if (tween3D != null) {
            tween3D.clear();

            delete Tween3dUtil._Tween3DData[target.id + type]
        }
        else {
            LogSys.Log(">>>>>>当前目标不存在该缓动类型");
        }
    }

    private clear() {
        Laya.timer.clear(this, this.onUpdate);
        if (this.tween) {
            Laya.Tween.clear(this.tween);
            this.tween = null;
        }
    }

    /**
     * Description:完成回调
     */
    OnComplete() {
        Laya.timer.clear(this, this.onUpdate);
        Laya.Tween.clear(this.tween);
        delete Tween3dUtil._Tween3DData[this.target.id + this.tweenType];
        if (this.completeHandler != null) {
            this.completeHandler.run();
        }
    }

    ////////////////////////// 3D物体移动
    frompostion: Vector3;
    topostion: Vector3;
    moveDistance: Laya.Vector3;
    moveObjcet: Sprite3D;
    moveTime: number = 0;
    moveValue: number = 0;
    tmpdir: Vector3;
    clone3D_Move: Sprite3D;

    // /**
    //  * Sprite3D移动方法至该位置
    //  * @param gameObject 需要移动的3D对象
    //  * @param endPos 移动目标点
    //  * @param playTime 移动总耗时
    //  * @param easeFun 缓动函数 (Laya.Ease) 默认为线性移动
    //  * @param callback 回调函数 
    //  */
    // public onPositionMove(gameObject: Sprite3D, endPos: Vector3, playTime: number, easeFun: Function, callback: Function = null) {

    //     Laya.timer.clear(this, this.positionMoveUpdate);
    //     this.moveDistance = new Vector3(endPos.x - gameObject.transform.position.x, endPos.y - gameObject.transform.position.y, endPos.z - gameObject.transform.position.z);
    //     this.frompostion = gameObject.transform.position;
    //     this.topostion = endPos;
    //     this.moveObjcet = gameObject;
    //     this.moveTime = playTime;
    //     if (playTime == 0) {
    //         this.moveObjcet.transform.position = this.topostion;
    //         return
    //     }
    //     this.clone3D_Move = gameObject.clone() as Sprite3D;
    //     this.clone3D_Move.transform.position = this.frompostion;
    //     this.positionMoveStart()
    //     // Tween.to(this, {  }, playTime, easeFun, Laya.Handler.create(this, this.positionMoveEnd, [callback]))
    //     Tween.to(this.clone3D_Move.transform, { localPositionX: endPos.x, localPositionY: endPos.y, localPositionZ: endPos.z, }, playTime, easeFun, Laya.Handler.create(this, this.positionMoveEnd, [callback]))
    // }

    positionMoveStart() {
        Laya.timer.frameLoop(1, this, this.positionMoveUpdate)
    }
    // positionMoveEnd(callback) {
    //     Laya.timer.clear(this, this.positionMoveUpdate);
    //     this.moveObjcet.transform.position = this.topostion;
    //     if (callback != null)
    //         callback();
    //     this.destroy();
    // }

    positionMoveUpdate() {
        this.moveObjcet.transform.position = this.clone3D_Move.transform.position;

        // this.moveValue = TimeUtil.DeltaTimeS / this.moveTime * 1000;
        // let lastPos = this.moveObjcet.transform.position;
        // let nextPos = new Vector3(
        //     this.frompostion.x + (this.moveDistance.x * this.moveValue),
        //     this.frompostion.y + (this.moveDistance.y * this.moveValue),
        //     this.frompostion.z + (this.moveDistance.z * this.moveValue)
        // )
        // if (V3Help.Magnitude(V3Help.Substrat(nextPos, lastPos)) >= V3Help.Magnitude(V3Help.Substrat(this.topostion, lastPos))) {
        //     Laya.timer.clear(this, this.positionMoveUpdate);
        //     this.moveObjcet.transform.position = this.topostion;
        // }
        // else
        //     this.moveObjcet.transform.position = nextPos;
    }


    /**
     * Sprite3D移动方法至该位置
     * @param gameObject 需要移动的3D对象
     * @param endPos 移动目标点
     * @param playTime 移动总耗时
     * @param easeFun 缓动函数 (Laya.Ease) 默认为线性移动
     * @param callback 回调函数 
     */

    private progress: Function = null;

    // public onPositionMoveReturn(startPos: Vector3, endPos: Vector3, playTime: number, easeFun: Function, progress?: Function, callback: Function = null): TweenHelp3DMove {

    //     Laya.timer.clear(this, this.positionMoveReturnUpdate);
    //     this.moveDistance = Vec3Util.Subtract(endPos, startPos);
    //     this.frompostion = startPos;
    //     this.topostion = endPos;
    //     this.moveTime = playTime;
    //     if (playTime == 0) {
    //         return
    //     }
    //     this.progress = progress;
    //     this.clone3D_Move = new Sprite3D();
    //     this.clone3D_Move.transform.position = this.frompostion;
    //     this.positionMoveReturnStart();
    //     Tween.to(this.clone3D_Move.transform, { localPositionX: endPos.x, localPositionY: endPos.y, localPositionZ: endPos.z, }, playTime, easeFun, Laya.Handler.create(this, this.positionMoveReturnEnd, [callback]))
    //     return this;
    // }

    positionMoveReturnStart() {
        Laya.timer.frameLoop(1, this, this.positionMoveReturnUpdate)
    }
    // positionMoveReturnEnd(callback) {
    //     Laya.timer.clear(this, this.positionMoveReturnUpdate);
    //     if (callback != null)
    //         callback();
    //     this.destroy();
    // }

    positionMoveReturnUpdate() {
        if (this.progress)
            this.progress(this.clone3D_Move.transform.position);
    }

    // public onDestroySelf() {
    //     Laya.timer.clear(this, this.positionMoveUpdate);
    //     Laya.timer.clear(this, this.positionMoveReturnUpdate);
    //     this.destroy();
    // }


    public static ClearAll(tar: any) {
        Tween.clearAll(tar);
    }
    /**
    * 尺寸变化 缓动动画
    *  @param gameObject 需要变化的3D对象
    *  @param x 需要变化的3D对象ScaleX
    *  @param y 需要变化的3D对象ScaleY
    *  @param z 需要变化的3D对象ScaleZ
    */
    public static Scale(gameObject: Sprite3D, x: number, y: number, z: number, time: number, ease?: TweenEase, complete?: Function) {
        Tween.to(gameObject.transform, { localScaleX: x, localScaleY: y, localScaleZ: z }, time, TweenUtil.getEase(ease), Laya.Handler.create(this, () => {
            if (complete != null)
                complete();
        }))
    }

    /**
    * 尺寸X变化 缓动动画
    *  @param gameObject 需要变化的3D对象
    *  @param x 需要变化的3D对象ScaleX
    *  @param t 需要变化的时间
    */
    public static ScaleX(gameObject: Sprite3D, x: number, t: number, ease?: TweenEase, complete?: Function) {
        Tween.to(gameObject.transform, { localScaleX: x }, t, TweenUtil.getEase(ease), Handler.create(this, () => {
            if (complete)
                complete();
        }));
    }

    /**
    * 尺寸Y变化 缓动动画
    *  @param gameObject 需要变化的3D对象
    *  @param y 需要变化的3D对象ScaleY
    *  @param t 需要变化的时间
    */
    public static ScaleY(gameObject: Sprite3D, y: number, t: number, ease?: TweenEase, complete?: Function) {
        Tween.to(gameObject.transform, { localScaleY: y }, t, TweenUtil.getEase(ease), Handler.create(this, () => {
            if (complete)
                complete();
        }));
    }

    /**
    * 尺寸Z变化 缓动动画
    *  @param gameObject 需要变化的3D对象
    *  @param z 需要变化的3D对象ScaleZ
    *  @param t 需要变化的时间
    */
    public static ScaleZ(gameObject: Sprite3D, z: number, t: number, ease?: TweenEase, complete?: Function) {
        Tween.to(gameObject.transform, { localScaleZ: z }, t, TweenUtil.getEase(ease), Handler.create(this, () => {
            if (complete)
                complete();
        }));
    }


    // /**
    // * 位置移动 缓动动画
    // * @param sp 对象
    // * @param endPos 结束位置
    // * @param t 时间
    // * @param ease 缓动函数
    // * @param complete 完成回调
    // */
    // public static Move(gameObject: Sprite3D, endPos: Vector3, t: number, ease?: TweenEase, complete?: Function) {
    //     new TweenHelp3DMove().onPositionMove(gameObject, endPos, t, TweenUtil.getEase(ease), complete);
    // }


    // /**
    //     * 位置移动 缓动动画(返回每帧的pos)
    //     * @param sp 对象
    //     * @param endPos 结束位置
    //     * @param t 时间
    //     * @param ease 缓动函数
    //     * @param complete 完成回调
    //     */
    // public static ReturnMovePos(startPos: Vector3, endPos: Vector3, t: number, ease?: TweenEase, progress?: Function, complete?: Function): TweenHelp3DMove {
    //     return new TweenHelp3DMove().onPositionMoveReturn(startPos, endPos, t, TweenUtil.getEase(ease), progress, complete);
    // }


    // /**
    //  * 2、3次贝塞尔曲线
    //  * @param gameObject 对象
    //  * @param midPos1 中间位置1
    //  * @param midPos2 中间位置2
    //  * @param endPos 结束位置
    //  * @param t 时间
    //  * @param bezierType 贝塞尔曲线类型 
    //  * @param ease 缓动函数
    //  * @param complete 完成回调
    //  */
    // public static BezierCurveMove(gameObject: Sprite3D, midPos1: Laya.Vector3, midPos2: Laya.Vector3, endPos: Laya.Vector3, t: number, bezierType: EBezierType, ease?: TweenEase, complete?: Function) {
    //     new TweenHelp3DMove().onBezierCurveMove(gameObject, midPos1, midPos2, endPos, t, bezierType, TweenUtil.getEase(ease), complete);
    // }


    /**
    * X轴旋转 缓动动画
    * @param gameObject 对象
    * @param x rotation x
    * @param t 时间
    * @param ease 滑动函数
    * @param complete 完成回调
    */
    public static RotateX(gameObject: Sprite3D, x: number, t: number, ease?: TweenEase, complete?: Function) {
        Tween.to(gameObject.transform, { localRotationX: x }, t, TweenUtil.getEase(ease), Handler.create(this, () => {
            if (complete)
                complete();
        }));
    }

    /**
    * Y轴旋转 缓动动画
    * @param gameObject 对象
    * @param y rotation y
    * @param t 时间
    * @param ease 滑动函数
    * @param complete 完成回调
    */
    public static RotateY(gameObject: Sprite3D, y: number, t: number, ease?: TweenEase, complete?: Function) {
        Tween.to(gameObject.transform, { localRotationY: y }, t, TweenUtil.getEase(ease), Handler.create(this, () => {
            if (complete)
                complete();
        }));
    }

    /**
    * Z轴旋转 缓动动画
    * @param gameObject 对象
    * @param z rotation z
    * @param t 时间
    * @param ease 滑动函数
    * @param complete 完成回调
    */
    public static RotateZ(gameObject: Sprite3D, z: number, t: number, ease?: TweenEase, complete?: Function) {
        Tween.to(gameObject.transform, { localRotationZ: z }, t, TweenUtil.getEase(ease), Handler.create(this, () => {
            if (complete)
                complete();
        }));
    }


    //#region 二次、三次贝塞尔公式

    ////////////////////////// 3D物体 贝塞尔曲线移动  二次、三次贝塞尔公式

    fromPoint: Vector3;     // 起始点
    middlePoint1: Vector3;   // 中间点1
    middlePoint2: Vector3;   // 中间点2
    endPoint: Vector3;     // 终止点
    moveObj: Sprite3D;      // 要移动的物体
    ticker: number = 0;
    playTime: number = 0;
    waitTime: number = 0
    bezierType: EBezierType = EBezierType.Bezier2;//二次贝塞尔曲线

    // /**
    //  * 贝塞尔曲线移动  二次、三次贝塞尔公式
    //  * @param gameObject 需要移动的3D对象
    //  * @param midPos1 移动中间目标1
    //  * @param midPos1 移动中间目标2
    //  * @param endPos 移动目标点
    //  * @param difference 当前时间(0.0~1.0)
    //  * @param playTime 移动总耗时毫秒
    //  * @param callback 回调函数 
    //  */
    // public onBezierCurveMove(gameObject: Sprite3D, midPos1: Vector3, midPos2: Vector3, endPos: Vector3, playTime: number, bezierType: EBezierType, easeFun: Function, callback: Function = null) {

    //     Laya.timer.clear(this, this.bezierCurveMoveUpdate);
    //     this.ticker = 0;
    //     this.moveObj = gameObject;
    //     this.fromPoint = new Vector3(gameObject.transform.position.x, gameObject.transform.position.y, gameObject.transform.position.z);
    //     this.middlePoint1 = midPos1;
    //     this.middlePoint2 = midPos2;
    //     this.endPoint = endPos;
    //     this.waitTime = playTime;
    //     this.playTime = playTime / 1000;
    //     this.bezierType = bezierType;
    //     this.bezierCurveMoveStart()
    //     Laya.Tween.to(this, {}, this.waitTime, easeFun, Laya.Handler.create(this, this.bezierCurveMoveEnd, [callback]))
    // }

    bezierCurveMoveStart() {
        Laya.timer.frameLoop(1, this, this.bezierCurveMoveUpdate)
    }

    bezierCurveMoveUpdate() {
        this.ticker += TimeUtil.DeltaTimeS;
        let t = this.ticker / this.playTime;  // 这里是计算当前已用时间占计划用时间的百分比，当作增量t 时间是秒
        t = MathUtil.Clamp(t, 0, 1);
        let p1: Vector3 = this.fromPoint;
        let p2: Vector3 = this.middlePoint1;
        let p3: Vector3 = this.middlePoint2;
        let p4: Vector3 = this.endPoint;
        let lastPos = this.moveObj.transform.position;
        let nextPos: Vector3 = this.GetCurvePoint(p1, p2, p3, p4, t, this.bezierType);
        if (Vec3Util.Magnitude(Vec3Util.Subtract(nextPos, lastPos)) >= Vec3Util.Magnitude(Vec3Util.Subtract(this.endPoint, lastPos))) {
            this.moveObj.transform.position = this.endPoint;
            Laya.timer.clear(this, this.bezierCurveMoveUpdate);
        }
        else
            this.moveObj.transform.position = nextPos;
        if (t == 1) {
            this.moveObj.transform.position = this.endPoint;
            Laya.timer.clear(this, this.bezierCurveMoveUpdate);
        }
    }

    // bezierCurveMoveEnd(callback) {
    //     Laya.timer.clear(this, this.bezierCurveMoveUpdate);
    //     this.moveObj.transform.position = this.endPoint;
    //     if (callback != null)
    //         callback();
    //     this.destroy();
    // }

    /**
     * @param _p0 起始点
     * @param _p1 中间点1
     * @param _p2 中间点2
     * @param _p3 终止点
     * @param t 当前时间t(0.0~1.0)
     */
    public GetCurvePoint(_p0: Vector3, _p1: Vector3, _p2: Vector3, _p3: Vector3, t: number, bezierType: EBezierType): Vector3 {

        //
        t = MathUtil.Clamp(t, 0, 1.0);
        let x = 0;
        let y = 0;
        let z = 0;
        if (bezierType == EBezierType.Bezier2) {
            x = Math.pow((1 - t), 2) * _p0.x + 2 * t * (1 - t) * _p1.x + Math.pow(t, 2) * _p3.x;
            y = Math.pow((1 - t), 2) * _p0.y + 2 * t * (1 - t) * _p1.y + Math.pow(t, 2) * _p3.y;
            z = Math.pow((1 - t), 2) * _p0.z + 2 * t * (1 - t) * _p1.z + Math.pow(t, 2) * _p3.z;
        }
        else {
            x = Math.pow((1 - t), 3) * _p0.x + 3 * Math.pow((1 - t), 2) * t * _p1.x + 3 * (1 - t) * Math.pow(t, 2) * _p2.x + Math.pow(t, 3) * _p3.x;
            y = Math.pow((1 - t), 3) * _p0.y + 3 * Math.pow((1 - t), 2) * t * _p1.y + 3 * (1 - t) * Math.pow(t, 2) * _p2.y + Math.pow(t, 3) * _p3.y;
            z = Math.pow((1 - t), 3) * _p0.z + 3 * Math.pow((1 - t), 2) * t * _p1.z + 3 * (1 - t) * Math.pow(t, 2) * _p2.z + Math.pow(t, 3) * _p3.z;
        }
        let pos = new Vector3(x, y, z);
        return pos;
    }

    //#endregion

    /**
     * 清理指定目标对象上的所有缓动。
     * @param target 目标对象。
     */
    public ClearAll(target: any) {
        Tween.clearAll(target);
    }

}