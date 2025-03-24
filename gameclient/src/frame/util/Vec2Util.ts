import {MathUtil} from "./MathUtil";
import {NumberUtil} from "./NumberUtil";
import Vector2 = Laya.Vector2;

/**Vector2辅助类*/
export class Vec2Util {

    static get ZERO(): Vector2 { return new Vector2(0, 0); }
    static get ONE(): Vector2 { return new Vector2(1, 1); }


    /**获取点1绕点2旋转n度后的坐标点
     * @param v1 点1
     * @param v2 点2
     * @param angle 旋转角度
     * @returns 返回旋转后的坐标点
     */
    public static GetRotateAround(v1: Vector2, v2: Vector2, angle: number): Vector2 {
        let x = (v1.x - v2.x) * MathUtil.cos(angle) - (v1.y - v2.y) * MathUtil.sin(angle) + v2.x;
        let y = (v1.x - v2.x) * MathUtil.sin(angle) + (v1.y - v2.y) * MathUtil.cos(angle) + v2.y;
        x = NumberUtil.toFixed(x, 2);
        y = NumberUtil.toFixed(y, 2);
        return new Vector2(x, y);
    }

    /**两坐标点间的距离 */
    public static Distance(v1: Vector2, v2: Vector2): number {
        let dx = v2.x - v1.x;
        let dy = v2.y - v1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**复制*/
    public static Copy(v: Vector2): Vector2 {
        return v.clone();
    }

    /**是否相等*/
    public static Equals(v1: Vector2, v2: Vector2): boolean {
        if (v1 == null || v2 == null) {
            return false;
        }
        if (v1.x == v2.x && v1.y == v2.y)
            return true;
        return false;
    }

    /**缩放*/
    static Scale(v: Vector2, n: number): Vector2 {
        let reseult: Vector2 = new Vector2();
        Vector2.scale(v, n, reseult);
        return reseult;
    }

    /**相加*/
    static Add(v1: Vector2, v2: Vector2): Vector2 {
        let result: Vector2 = new Vector2(v1.x + v2.x, v1.y + v2.y);
        return result;
    }

    /**相减*/
    static Subtract(v1: Vector2, v2: Vector2): Vector2 {
        let result: Vector2 = new Vector2(v1.x - v2.x, v1.y - v2.y);
        return result;
    }

    /**向量长度*/
    static Length(v: Vector2): number {
        return Vector2.scalarLength(v);
    }

    /**归一化向量*/
    static Normalize(v: Vector2): Vector2 {
        let result: Vector2 = new Vector2();
        Vector2.normalize(v, result);
        return result;
    }

    /**点积
     * -两向量的夹角
    */
    static Dot(v1: Vector2, v2: Vector2): number {
        return Vector2.dot(v1, v2);
    }

    public static IsNullOrUndefine(v: Vector2): boolean {
        return v == null || v == undefined;
    }

    /**范围内随机位置
     * @param v2 位置 
     * @param dis 距离
     */
    public static GetRandomPosAround(v2: Vector2, dis: number): Vector2 {
        let randomx: number = RandomUtil.RandomRound(-1, 1);
        let randomy: number = RandomUtil.RandomRound(-1, 1);
        randomx = randomx * dis;
        randomy = randomy * dis;

        return new Vector2(v2.x + randomx, v2.y + randomy);
    }


    public static ToString(v2: Vector2, fixed?: number) {
        if (fixed)
            return "x:" + NumberUtil.toFixed(v2.x, fixed) + ",y:" + NumberUtil.toFixed(v2.y, fixed)
        else
            return "x:" + v2.x + ",y:" + v2.y;
    }
}