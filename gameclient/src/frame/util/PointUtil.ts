import {LayerBase} from "../../game/layer/LayerBase";

/**点 工具类*/
export class PointUtil {

    /**按位置获取两个点之间连线上的某个点位置
     * @param startP 起始点 
     * @param endP 结束点
     * @param pos 要取的点的位置 0-1  pos越接近0，取出的点越靠近起始点
    */
    public static InterPolate(startP: Laya.Point, endP: Laya.Point, pos: number): Laya.Point {
        return new Laya.Point(
            startP.x + (endP.x - startP.x) * pos,
            startP.y + (endP.y - startP.y) * pos,
        );
    }

    /**获取两点之间的距离
     * @param p1 第一个点
     * @param p2 第二个点
     * @returns number 距离
    */
    public static Distance(p1: Laya.Point, p2: Laya.Point): number {
        return Math.sqrt(
            (p1.x - p2.x) * (p1.x - p2.x) +
            (p1.y - p2.y) * (p1.y - p2.y)
        );
    }

    /**获取两组坐标之间的距离
     * @param x1 点1 x坐标
     * @param y1 点1 y坐标
     * @param x2 点2 x坐标
     * @param y2 点2 y坐标
    */
    public static DistanceByAxis(x1: number, y1: number, x2: number, y2: number) {
        return Math.sqrt(
            (x1 - x2) * (x1 - x2) +
            (y1 - y2) * (y1 - y2)
        );
    }

    /**获取p1到p2的方向，p1在左侧时返回1，p1在右侧时返回-1
     * @param p1 点1
     * @param p1 点2
     *@returns number 返回 1 -1
    */
    public static GetDirection(p1: Laya.Point, p2: Laya.Point): number {
        if (p1.x <= p2.x)
            return 1;
        if (p1.x > p2.x)
            return -1;
        return 1;
    }

    /**获取tar在layermgr的全局坐标
     * @param tar 目标
     * @param moveRightNow 是否把tar移到新的位置
    */
    public static localToGlobal(tar: Laya.Sprite, moveRightNow?: boolean): Laya.Point {
        let p: Laya.Point = new Laya.Point(tar.x, tar.y);
        let parent: Laya.Sprite = tar.parent as Laya.Sprite;

        while (parent && !(parent instanceof LayerBase)) {
            //父节点位置
            p.x += parent.x - parent.pivotX - (parent.scrollRect ? parent.scrollRect.x : 0);
            p.y += parent.y - parent.pivotY - (parent.scrollRect ? parent.scrollRect.y : 0);
            parent = parent.parent as Laya.Sprite;
        }
        if (moveRightNow)
            tar.pos(p.x, p.y);

        return p;
    }

    /**保持tar对象的全局位置不变的情况下，计算tar显示对象在新的显示对象容器中的本地位置
     * @param tar
     * @param newParent
     * @param moveRightNow
     * @returns 
    */
    public static ParentToParent(tar: Laya.Sprite, newParent: Laya.Sprite, moveRightNow?: boolean): Laya.Point {
        let p: Laya.Point = PointUtil.localToGlobal(tar);
        let tmpP: Laya.Point = new Laya.Point;
        let parent: Laya.Sprite = newParent;
        while (parent && !(parent instanceof LayerBase)) {
            tmpP.x += parent.x;
            tmpP.y += parent.y;
            parent = parent.parent as Laya.Sprite;
        }
        p.x = p.x - tmpP.x;
        p.y = p.y - tmpP.y;
        if (moveRightNow)
            tar.pos(p.x, p.y);

        return p;
    }

}