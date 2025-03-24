import {MathUtil} from "./MathUtil";
import Quaternion = Laya.Quaternion;
/**四元数辅助类*/
export class QuatUtil {
    
    static get IDENTITY(): Quaternion { return new Quaternion(0, 0, 0, 1); }

    /**复制*/
    static Copy(r: Quaternion): Quaternion {
        return r.clone() as Quaternion;
    }

    /**
     * 两四元数相乘
     * tip:表示两个旋转的合成，先旋转q1后旋转q2
    */
    static Multiply(q1: Quaternion, q2: Quaternion): Quaternion {
        let qr: Quaternion = new Quaternion();
        Quaternion.multiply(q1, q2, qr);
        return qr;
    }

    /**弧度转角度*/
    static Rad2Deg(rad: number): number {
        return MathUtil.rad2Deg * rad;
    }
    /**角度转弧度*/
    static Deg2Rad(deg: number): number {
        return MathUtil.deg2Rad * deg;
    }

    /**相加*/
    static Add(q1: Quaternion, q2: Quaternion) {
        let result: Quaternion = new Quaternion();
        Quaternion.add(q1, q2, result);
        return result;
    }

}