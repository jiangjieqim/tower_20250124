import Vector3 = Laya.Vector3;
import Transform3D = Laya.Transform3D;

import {MathUtil} from "./MathUtil";
import {NumberUtil} from "./NumberUtil";

export class Vec3Util {

    static get ZERO(): Vector3 { return new Vector3(0, 0, 0); }
    static get ONE(): Vector3 { return new Vector3(1, 1, 1); }
    static get UP(): Vector3 { return new Vector3(0, 1, 0); }
    static get DOWN(): Vector3 { return new Vector3(0, -1, 0); }
    static get FORWARD(): Vector3 { return new Vector3(0, 0, 1); }
    static get BACK(): Vector3 { return new Vector3(0, 0, -1); }
    static get LEFT(): Vector3 { return new Vector3(1, 0, 0); }
    static get RIGHT(): Vector3 { return new Vector3(-1, 0, 0); }
    static get Gravity(): Vector3 { return new Vector3(0, -10, 0); }
    static get Max(): Vector3 { return new Vector3(10000, 10000, 10000); }
    static get Min(): Vector3 { return new Vector3(-10000, -10000, -10000); }

    public static CMtoM(v3: Vector3) { return new Vector3(v3.x / 100, v3.y / 100, v3.z / 100); }
    public static MtoCM(v3: Vector3) { return new Vector3(v3.x * 100, v3.y * 100, v3.z * 100); }

    /**复制*/
    static Copy(v: Vector3): Vector3 {
        return v.clone() as Vector3;
    }

    /**相加*/
    static Add(v1: Vector3, v2: Vector3): Vector3 {
        let result: Vector3 = new Vector3();
        Vector3.add(v1, v2, result);
        return result;
    }

    /**相减*/
    static Subtract(v1: Vector3, v2: Vector3): Vector3 {
        let result: Vector3 = new Vector3();
        Vector3.subtract(v1, v2, result);
        return result;
    }

    /**向量距离*/
    static Distance(v1: Vector3, v2: Vector3): number {
        // Debug.Log("v1,x:" + v1.x + " y:" + v1.y + " z:" + v1.z);
        // Debug.Log("v2,x:" + v2.x + " y:" + v2.y + " z:" + v2.z);
        return Vector3.distance(v1, v2);
    }

    /**向量缩放*/
    static Scale(v: Vector3, n: number): Vector3 {
        let result: Vector3 = new Vector3();
        Vector3.scale(v, n, result);
        return result;
    }

    /**差值运算*/
    static Lerp(v1: Vector3, v2: Vector3, t: number): Vector3 {
        let result: Vector3 = new Vector3();
        Vector3.lerp(v1, v2, t, result);
        return result;
    }

    /**判断两个向量是否相等
     * -直接使用==来判断v3是否相等是不行的
    */
    static Equals(v1: Vector3, v2: Vector3): boolean {
        return Vector3.equals(v1, v2);
    }

    /**归一化向量*/
    static Normalize(v: Vector3): Vector3 {
        let result: Vector3 = new Vector3();
        Vector3.normalize(v, result);
        return result;
    }

    /**获取向量长度*/
    static Magnitude(v: Vector3): number {
        return Vector3.scalarLength(v);
    }

    /**计算标量长度的平方*/
    static SquardMagnitude(v: Vector3) {
        return Vector3.scalarLengthSquared(v);
    }

    /**两向量点积求夹角*/
    public static DotToAngle(from: Vector3, to: Vector3): number {
        let rad = 0;
        let nor_from: Vector3 = new Vector3();
        let nor_to: Vector3 = new Vector3();
        Vector3.normalize(from, nor_from);
        Vector3.normalize(to, nor_to)
        rad = Math.acos(Vector3.dot(nor_from, nor_to));
        return rad * MathUtil.rad2Deg;
    }

    /**获取右方向*/
    public static GetRight(t: Transform3D): Vector3 {
        let result: Vector3 = new Vector3();
        t.getRight(result);
        return result;
    }

    /**获取前方向*/
    public static GetForward(t: Transform3D): Vector3 {
        let result: Vector3 = new Vector3();
        t.getForward(result);
        return result;
    }

    /**获取上方向*/
    public static GetUp(t: Transform3D): Vector3 {
        let result: Vector3 = new Vector3();
        t.getUp(result);
        return result;
    }

    /**是否零向量*/
    public static IsZero(v: Vector3): boolean {
        if (v.x == 0 && v.y == 0 && v.z == 0)
            return true;
        return false;
    }

    /**向量相乘*/
    public static Multiply(v1: Vector3, v2: Vector3): Vector3 {
        let result: Vector3 = new Vector3(0, 0, 0);
        Vector3.multiply(v1, v2, result);
        return result;
    }

    /**获取两点是否在dis以内 */
    public static GetIsWithinDistance(v1: Vector3, v2: Vector3, dis: number): boolean {
        return Vector3.distance(v1, v2) <= dis;
    }

    // /**最大长度限制*/
    // public ClampMagnitude(v: Vector3, maxlen: number) {
    //     let result: Vector3 = new Vector3();
    //     let maxv:Vector3=new Vector3();
    //     Vector3.normalize(v, maxv);
    //     Vector3.scale(maxv,)
    // }

    public static Random(): Laya.Vector3 {
        return new Laya.Vector3(RandomUtil.RandomRound(0, 1), RandomUtil.RandomRound(0, 1), RandomUtil.RandomRound(0, 1));
    }

    /**获取单位向量 */
    public static GetDirectionNormalized(v3: Vector3): Vector3 {

        let sqrt = Math.sqrt((v3.x - v3.x) * (v3.x - v3.x) + (v3.y - v3.y) * (v3.y - v3.y) + (v3.z - v3.z) * (v3.z - v3.z));

        let unitVecotr: Vector3 = new Vector3(v3.x / sqrt, v3.y / sqrt, v3.z / sqrt);
        return unitVecotr;
    }

    /**范围内随机位置
     * v3:位置  dis:距离
    */
    public static GetRandomPosAround(v3: Vector3, dis: number): Vector3 {
        let randomx: number = RandomUtil.RandomRound(-1, 1);
        let randomz: number = RandomUtil.RandomRound(-1, 1);
        randomx = randomx * dis;
        randomz = randomz * dis;

        return new Vector3(v3.x + randomx, v3.y, v3.z + randomz);
    }

    public static GetMidPos(pos1: Vector3, pos2: Vector3): Vector3 {
        let merge: Vector3 = this.Add(pos1, pos2);
        let mid: Vector3 = new Vector3(merge.x / 2, merge.y / 2, merge.z / 2);
        return mid;
    }

    public static ToString(v3: Vector3, fixed?: number) {
        if (fixed)
            return "x:" + NumberUtil.toFixed(v3.x, fixed) + ",y:" + NumberUtil.toFixed(v3.y, fixed) + ",z:" + NumberUtil.toFixed(v3.z, fixed);
        else
            return "x:" + v3.x + ",y:" + v3.y + ",z:" + v3.z;
    }

    public static ToFloat(v3: Vector3, fixed: number = 0) {
        return new Vector3(NumberUtil.toFixed(v3.x, fixed), NumberUtil.toFixed(v3.y, fixed), NumberUtil.toFixed(v3.z, fixed));
    }

    public static GetMax(v3: Vector3) {
        return MathUtil.GetMaxs([v3.x, v3.y, v3.z]);
    }

    public static GetMaxAbs(v3: Vector3) {
        return MathUtil.GetMaxs([MathUtil.Abs(v3.x), MathUtil.Abs(v3.y), MathUtil.Abs(v3.z)]);
    }


    /**方向向量转欧拉角
     * @param v3 方向单位向量
     * @returns 返回欧拉角
     */
    public static LookRotation(v3: Vector3): Vector3 {
        let euler: Vector3 = new Vector3();
        euler.x = MathUtil.acos(MathUtil.Sqrt((v3.x * v3.x + v3.z + v3.z) / (v3.x * v3.x + v3.y * v3.y + v3.z + v3.z))) * MathUtil.rad2Deg;
        if (v3.y > 0) euler.x = 360 - euler.x;

        euler.y = MathUtil.atan2(v3.z, v3.x) * MathUtil.rad2Deg;
        if (euler.y < 0) euler.y += 180;
        if (v3.x < 0) euler.y += 180;
        euler.z = 0;
        return euler;
    }


    /**
     * 世界坐标转本地坐标
     * @param worldPos 世界坐标
     * @param transform 节点位置
     */
    public static WorldPositionToLocal(worldPos: Vector3, transform: Transform3D) {
        let localPos: Vector3 = Vec3Util.ZERO;
        let localPos2: Vector3 = Vec3Util.ZERO;
        let matr: Laya.Matrix4x4 = new Laya.Matrix4x4();
        transform.worldMatrix.invert(matr);
        // Vector3.transformCoordinate(worldPos, matr, localPos);
        Vector3.transformV3ToV3(worldPos, matr, localPos);
        Vector3.transformCoordinate(worldPos, matr, localPos2);

        // console.log("1. " + JSON.stringify(localPos));
        // console.log("2. " + JSON.stringify(localPos2));
        return localPos;
    }

    /**
     * 本地坐标转世界坐标
     * @param localPos 本地坐标
     * @param transform 节点位置
     */
    public static LocalPositionToWorld(localPos: Vector3, transform: Transform3D) {
        let worldPos: Vector3 = Vec3Util.ZERO;
        let matr: Laya.Matrix4x4 = new Laya.Matrix4x4();
        // transform.worldMatrix.invert(matr);
        Vector3.transformV3ToV3(localPos, matr, worldPos);
        return worldPos;
    }
}