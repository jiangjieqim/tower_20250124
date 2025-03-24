import Vector4 = Laya.Vector4;

// import {RandomUtil} from "./RandomUtil";

export class Vec4Util {

    static get ZERO(): Vector4 { return new Vector4(0, 0, 0, 0); }
    static get ONE(): Vector4 { return new Vector4(1, 1, 1, 1); }

    /**复制*/
    static Copy(v: Vector4): Vector4 {
        return v.clone() as Vector4;
    }

    /**相加*/
    static Add(v1: Vector4, v2: Vector4): Vector4 {
        let result: Vector4 = new Vector4();
        Vector4.add(v1, v2, result);
        return result;
    }

    /**相减*/
    static Subtract(v1: Vector4, v2: Vector4): Vector4 {
        let result: Vector4 = new Vector4();
        Vector4.subtract(v1, v2, result);
        return result;
    }

    /**向量距离*/
    static Distance(v1: Vector4, v2: Vector4): number {
        // Debug.Log("v1,x:" + v1.x + " y:" + v1.y + " z:" + v1.z);
        // Debug.Log("v2,x:" + v2.x + " y:" + v2.y + " z:" + v2.z);
        return Vector4.distance(v1, v2);
    }

    /**向量缩放*/
    static Scale(v: Vector4, n: number): Vector4 {
        let result: Vector4 = new Vector4();
        Vector4.scale(v, n, result);
        return result;
    }

    /**差值运算*/
    static Lerp(v1: Vector4, v2: Vector4, t: number): Vector4 {
        let result: Vector4 = new Vector4();
        Vector4.lerp(v1, v2, t, result);
        return result;
    }

    /**判断两个向量是否相等*/
    static Equals(v1: Vector4, v2: Vector4): boolean {
        return Vector4.equals(v1, v2);
    }

    /**归一化向量*/
    static Normalize(v: Vector4): Vector4 {
        let result: Vector4 = new Vector4();
        Vector4.normalize(v, result);
        return result;
    }

    /**是否零向量*/
    public static IsZero(v: Vector4): boolean {
        if (v.x == 0 && v.y == 0 && v.z == 0 && v.w == 0)
            return true;
        return false;
    }

    public static Random(): Laya.Vector4 {
        return new Laya.Vector4(RandomUtil.RandomRound(0, 1), RandomUtil.RandomRound(0, 1), RandomUtil.RandomRound(0, 1), RandomUtil.RandomRound(0, 1));
    }

}