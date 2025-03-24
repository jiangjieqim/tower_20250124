import Node = Laya.Node;
import Sprite = Laya.Sprite;
import Handler = Laya.Handler;
import Point = Laya.Point;
import Vector2 = Laya.Vector2;

import { LoadUtil } from "../../../frame/util/LoadUtil";
import { TweenUtil } from "../../../frame/util/TweenUtil";
import { GameHelp } from "./GameHelp";
import { TweenEase } from "../../../frame/util/TweenEase";

export class UIHelp {

    /**
     * 本地坐标转世界坐标
     * @param obj 对象
     */
    public static LocalToGlobal(obj: Sprite): Point {

        return this.calLocalToGlobal(obj, new Point());
    }

    private static calLocalToGlobal(obj: Sprite, point: Point): Point {

        if (obj.parent) {

            point.x = point.x + obj.x;
            point.y = point.y + obj.y;
            let s: Sprite = obj.parent as Sprite;
            this.calLocalToGlobal(s, point);
        }
        return point;
    }

    /**
     * 获取未知层级的子物体
     * @param parent 父对象
     * @param childname 子对象名字 
     */
    public static GetChildByName(parent: Node, childname: string): Node {
        for (let i: number = 0; i < parent.numChildren; i++) {

            let child: Node = parent.getChildAt(i);
            if (child.name == childname)
                return child;

            child = UIHelp.GetChildByName(child, childname);
            if (child != null)
                return child;
        }
        return null;
    }

    /**
     * 重新设置ui位置 
     * @param sprite UI对象
     */
    public static ResizeView(sprite: Laya.Sprite): void {

        sprite.size(GameHelp.StageWidth, GameHelp.StageHeight);
        sprite.pos(0, 0);

        for (let i: number = 0; i < sprite.numChildren; i++) {

            let trans = sprite.getChildAt(i) as Laya.Sprite;
            trans.pos(trans.x * GameHelp.CalViewDeviceRatioW, trans.y * GameHelp.CalViewDeviceRatioH);

            // console.log("child:" + trans.name + " pos: x" + trans.x + " y" + trans.y);
        }
    }

    public static SetActive(s: Sprite, b: boolean): void {
        if (s.visible != b)
            s.visible = b;
    }

    public static IsRed(r: number, g: number, b: number): boolean {
        // console.log(" r:" + r + " g:" + g + " b:" + b);

        if (r >= 180 && r <= 255 && g >= 0 && g <= 50 && b >= 0 && b <= 50) {
            //is red
            // console.log(" r:" + r + " g:" + g + " b:" + b);

            return true;
        }
        return false;
    }

    public static IsNull(str: string): boolean {
        return str == "" || str == null || str == "null";
    }

    /**显示(隐藏)Box */
    public static ShowBox(box: Laya.Box, bShow: boolean) {
        if (box.visible == bShow) {
            return;
        }
        box.visible = bShow;
        box.mouseEnabled = bShow;
    }


    /**
     * 初始化列表
     * @param mlist 列表
     * @param handle 列表渲染方式
     * @param hSkin 是否横向滑动
     * @param vSkin 是否纵向滑动
     * @param repeatX 宽度设定数量(0为不限定)
     * @param repeatY 高度设定数量(0为不限定)
     */
    public static InitListHelp(mlist: Laya.List, handle: Laya.Handler, hSkin: boolean, vSkin: boolean, repeatX: number = 0, repeatY: number = 0) {
        // if (!hSkin) { mlist.hScrollBarSkin = ""; }
        // if (!vSkin) { mlist.vScrollBarSkin = ""; }

        if (repeatX != 0) { mlist.repeatX = repeatX; }
        if (repeatY != 0) { mlist.repeatY = repeatY; }

        mlist.renderHandler = handle;
        mlist.array = [];

        // if (bHor || bVer) {
        //     mlist.scrollBar.elasticBackTime = 200;//设置橡皮筋回弹时间。单位为毫秒。
        //     mlist.scrollBar.elasticDistance = 50;
        // }

        mlist.refresh();
    }

    /**初始化Prefab */
    public static InitPrefab<T>(jsonStr: string, parent?: Laya.Node): T {
        let prefab: Laya.Prefab = new Laya.Prefab();
        prefab.json = LoadUtil.GetJson(jsonStr);
        let obj = prefab.create();
        if (parent) parent.addChild(obj);
        return obj.getComponent(Laya.Component) as T;
    }
}

export class UIAnimHelp {

    /**图片缩放动画 */
    public static ImageScaleNormalAnim(img: Laya.Image, callback: Function): void {
        TweenUtil.Scale(img, 1.2, 1.2, 150, TweenEase.backOut, Laya.Handler.create(this, () => {
            TweenUtil.Scale(img, 1, 1, 150, TweenEase.backOut, Laya.Handler.create(this, () => {
                img.scale(1, 1);
                if (callback != null) {
                    callback();
                }
            }))
        }))
    }
    /**图片缩放动画 */
    public static ImageScaleAnim(img: Laya.Image, max: number, callback: Function): void {
        TweenUtil.Scale(img, max, max, 150, TweenEase.backOut, Laya.Handler.create(this, () => {
            TweenUtil.Scale(img, 1, 1, 150, TweenEase.backOut, Laya.Handler.create(this, () => {
                img.scale(1, 1);
                if (callback != null) {
                    callback();
                }
            }))
        }))
    }
    /**UI缩放动画(常规) */
    public static UIScaleNormalAnim(ui: Laya.UIComponent, callback: Function): void {
        TweenUtil.Scale(ui, 1.2, 1.2, 150, TweenEase.backOut, Laya.Handler.create(this, () => {
            TweenUtil.Scale(ui, 1, 1, 150, TweenEase.backOut, Laya.Handler.create(this, () => {
                ui.scale(1, 1);
                if (callback != null) {
                    callback();
                }
            }))
        }))
    }
    /**UI缩放动画 */
    public static UIScaleAnim(ui: Laya.UIComponent, max: number, callback: Function): void {
        TweenUtil.Scale(ui, max, max, 150, TweenEase.backOut, Laya.Handler.create(this, () => {
            TweenUtil.Scale(ui, 1, 1, 150, TweenEase.backOut, Laya.Handler.create(this, () => {
                ui.scale(1, 1);
                if (callback != null) {
                    callback();
                }
            }))
        }))
    }

    /**
     * 弹窗动画
     * @param box 要缩放的弹窗
     * @param start 缩放前的起始比例
     * @param max 缩放时的最大比例
     * @param callback 缩放完成后的回调
     */
    public static BoxScaleAnim(box: Laya.Box, start: number = 0, max: number = 0, callback?: Function): void {
        // 设置初始缩放
        box.scale(start, start);
        // 缩放动画
        TweenUtil.Scale(box, max, max, 300, TweenEase.backOut, Laya.Handler.create(this, () => {
            TweenUtil.Scale(box, 1, 1, 300, TweenEase.backOut, Laya.Handler.create(this, () => {
                box.scale(1, 1);
                if (callback != null) {
                    callback();
                }
            }))
        }));
    }

}