import {MathUtil} from "./MathUtil";
import Ray = Laya.Ray;
import Vector2 = Laya.Vector2;
import Vector3 = Laya.Vector3;
import Vector4 = Laya.Vector4;

/**3d数学工具类*/
export class Math3dUtil {

    private static _Vec2Temp: Vector2 = null;
    private static _Vec3Temp: Vector3 = null;
    private static _Vec4Temp: Vector4 = null;

    public static get TempVec2(): Vector2 {
        if (!Math3dUtil._Vec2Temp) Math3dUtil._Vec2Temp = new Vector2(0, 0);
        return Math3dUtil._Vec2Temp;
    }

    public static get TempVec3(): Vector3 {
        if (!Math3dUtil._Vec3Temp) Math3dUtil._Vec3Temp = new Vector3(0, 0, 0);
        return Math3dUtil._Vec3Temp;
    }

    public static get TempVec4(): Vector4 {
        if (!Math3dUtil._Vec4Temp) Math3dUtil._Vec4Temp = new Vector4(0, 0, 0, 0);
        return Math3dUtil._Vec4Temp;
    }

    /**转换为水平方向*/
    public static ToHorizontal(vec: Vector3): Vector3 {
        vec.y = 0;
        return vec;
    }

    /**水平距离*/
    public static HorizontalDistance(vec1: Vector3, vec2: Vector3): number {
        let tmp1: Laya.Vector3 = new Laya.Vector3(vec1.x, 0, vec1.z);
        let tmp2: Laya.Vector3 = new Laya.Vector3(vec2.x, 0, vec2.z);
        let v3 = Vec3Sub(tmp1, tmp2);
        let dis = Vector3.scalarLength(v3);
        // Log.Warn("HorizontalDistance:" + dis + "  v1:" + vec1 + "  v2" + vec2);
        return dis;
    }

    /**射线上的一点*/
    public static GetRayPoint(ray: Ray, distance: number): Vector3 {
        return Vec3Add(ray.origin, Vec3Mul(ray.direction, distance));
    }

    /**三维求两点距离 */
    public static Vec3Magnitude(vec1: Vector3, vec2: Vector3): number {
        return Math.sqrt((vec1.x - vec2.x) * (vec1.x - vec2.x) + ((vec1.y - vec2.y) * (vec1.y - vec2.y)) + ((vec1.z - vec2.z) * (vec1.z - vec2.z)));
    }

    /**二维求两点距离 */
    public static Vec2Magnitude(vec1: Vector2, vec2: Vector2): number {
        return Math.sqrt((vec1.x - vec2.x) * (vec1.x - vec2.x) + ((vec1.y - vec2.y) * (vec1.y - vec2.y)));
    }

    /**
         * 根据t值，计算贝塞尔曲线上面相对应的点
         * @param t t值
         * @param p0 起始点
         * @param p1 控制点
         * @param p2 结束点
         * @returns 根据t值计算出来的贝塞尔曲线点
        */
    public static CalculateCubicBezierPoint(t: number, p0: Laya.Vector3, p1: Laya.Vector3, p2: Laya.Vector3) {

        let u: number = 1 - t;
        let tt: number = t * t;
        let uu: number = u * u;

        let p: Laya.Vector3 = new Laya.Vector3();
        Laya.Vector3.scale(p0, uu, p);

        let r_p1: Laya.Vector3 = new Laya.Vector3();
        Laya.Vector3.scale(p1, 2 * u * t, r_p1);
        Laya.Vector3.add(p, r_p1, p);

        let r_p2: Laya.Vector3 = new Laya.Vector3();
        Laya.Vector3.scale(p2, tt, r_p2);
        Laya.Vector3.add(p, r_p2, p);

        return p;
    }


    /**
     * 获取存储贝塞尔曲线点的数组
     * @param startPoint 起始点
     * @param controlPoint 控制点
     * @param endPoint 结束点
     * @param segmentNum 采样点
    */
    public static GetBezierList(startPoint: Laya.Vector3, controlPoint: Laya.Vector3, endPoint: Laya.Vector3, segmentNum: number): Laya.Vector3[] {

        let path: Laya.Vector3[] = [];
        for (let i: number = 1; i <= segmentNum; i++) {
            let t = i / parseFloat(segmentNum.toString());
            let pixel: Laya.Vector3 = this.CalculateCubicBezierPoint(t, startPoint, controlPoint, endPoint);
            ListUtil.Add(path, pixel);
            // Debug.Log("" + path[i - 1]);
        }
        return path;
    }

    /**
    * 将一个向量投射到一个平面上
    * @param panelNormal 平面
    * @param vector 向量
    * @returns 输出没有归一化
   */
    public static ProjectVectorOnPlane(panelNormal: Laya.Vector3, vector: Laya.Vector3): Laya.Vector3 {
        let dot: Laya.Vector3 = new Laya.Vector3();
        Laya.Vector3.scale(panelNormal, Laya.Vector3.dot(vector, panelNormal), dot);
        Laya.Vector3.subtract(vector, dot, dot);
        return dot;//三维转二维
    }


    /**
    * 发射速度
    * @param distance 起点到终点的平面距离
    * @param yOffset 起点到终点的高度差值
    * @param gravity 向下的加速度
    * @param angle 初始发射角度
    */
    public static LaunchSpeed(distance: number, yOffset: number, gravity: number, angle: number) {
        let speed: number = (distance * Math.sqrt(gravity) * Math.sqrt(1 / Math.cos(angle))) / Math.sqrt(2 * distance * Math.sin(angle) + 2 * yOffset * Math.cos(angle));
        return speed;
    }

    /**
     * 发射角度
     * @param speed 初始速度
     * @param distance 距离
     * @param yOffset 偏移值
     * @param gravity 重力值
     * @param angle0 角度0
     * @param angle1 角度1
    */
    public static LaunchAngle(speed: number, distance: number, yOffset: number, gravity: number, angle0: number, angle1: number) {

        angle0 = angle1 = 0;
        let speedSquared = speed * speed;
        let operandA = MathUtil.Pow(speed, 4);
        let operandB = gravity * (gravity * (distance * distance) + (2 * yOffset * speedSquared));

        //不在范围内
        if (operandB > operandA)
            return [false];

        let root = MathUtil.Sqrt(operandA - operandB);
        angle0 = MathUtil.Atan((speedSquared + root) / (gravity * distance));
        angle1 = MathUtil.Atan((speedSquared - root) / (gravity * distance));

        return [true, angle0, angle1];
    }

}

//～～～～～～～～～～～～～～～～～～～～～～～vec2～～～～～～～～～～～～～～～～～～～～～～～//
export function Vec2Add(a: Vector2, b: Vector2): Vector2 {
    return new Vector2(a.x + b.x, a.y + b.y);
}

export function Vec2Sub(a: Vector2, b: Vector2): Vector2 {
    return new Vector2(a.x - b.x, a.y - b.y);
}

export function Vec2Multiply(a: Vector2, b: Vector2): Vector2 {
    return new Vector2(a.x * b.x, a.y * b.y);
}

export function Vec2Mul(a: Vector2, d: number): Vector2 {
    return new Vector2(a.x * d, a.y * d);
}

export function Vec2Div(a: Vector2, d: number): Vector2 {
    return new Vector2(a.x / d, a.y / d);
}

export function Vec2Dot(lhs: Vector2, rhs: Vector2): number {
    return ((lhs.x * rhs.x) + (lhs.y * rhs.y));
}

export function Vec2Project(vector: Vector2, onNormal: Vector2): Vector2 {
    let num: number = Vec2Dot(onNormal, onNormal);
    if (num < 1E-05) {
        return Vector2.ZERO;
    }
    return (Vec2Div(Vec2Mul(onNormal, Vec2Dot(vector, onNormal)), num));
}

export function Vec2Min(lhs: Vector2, rhs: Vector2): Vector2 {
    return new Vector2(Math.min(lhs.x, rhs.x), Math.min(lhs.y, rhs.y));
}

export function Vec2Max(lhs: Vector2, rhs: Vector2): Vector2 {
    return new Vector2(Math.max(lhs.x, rhs.x), Math.max(lhs.y, rhs.y));
}

export function Vec2Magnitude(vec: Vector2): number {
    return Math.sqrt((vec.x * vec.x) + (vec.y * vec.y));
}

export function Vec2SqrMagnitude(vec: Vector2): number {
    return (vec.x * vec.x) + (vec.y * vec.y);
}

export function Vec2Normalized(vec: Vector2): Vector2 {
    let magnitude: number = Vec2Magnitude(vec);
    let v: Vector2;
    if (magnitude > 1E-05)
        v = Vec2Div(vec, magnitude);
    else
        v = new Vector2(0, 0);
    return v;
}

export function Vec2Normal(vec: Vector2): void {
    let magnitude: number = Vec2Magnitude(vec);
    if (magnitude > 1E-05) {
        let v: Vector2 = Vec2Div(vec, magnitude);
        Vec2Set(vec, v.x, v.y);
    } else
        Vec2Set(vec, 0, 0);
}

export function Vec2Set(v: Vector2, x: number, y: number): Vector2 {
    v.x = x;
    v.y = y;
    ;
    return v;
}

// export function Vec2Angle(from: Vector2, to: Vector2): number {
//     return (Math.acos(UtilMath.clamp(Vec2Dot(Vec2Normalized(from), Vec2Normalized(to)), -1, 1)) * 57.29578);
// }

export function Vec2ClampMagnitude(vector: Vector2, maxLength): Vector2 {
    if (Vec2SqrMagnitude(vector) > (maxLength * maxLength)) {
        return (Vec2Mul(Vec2Normalized(vector), maxLength));
    }
    return vector;
}

// export function Vec2Lerp(from: Vector2, to: Vector2, t: number): Vector2 {
//     t = UtilMath.clamp(t, 0, 1);
//     return new Vector2(from.x + ((to.x - from.x) * t), from.y + ((to.y - from.y) * t));
// }

export function Vec2MoveTowards(current: Vector2, target: Vector2, maxDistanceDelta: number): Vector2 {
    let vector: Vector2 = Vec2Sub(target, current);
    let magnitude: number = Vec2Magnitude(vector);
    if ((magnitude > maxDistanceDelta) && (magnitude != 0)) {
        return Vec2Add(current, (Vec2Mul(Vec2Div(vector, magnitude), maxDistanceDelta)));
    }
    return target;
}

export function Vec2ToString(vec: Vector2): string {
    return StringUtil.format("({0}, {1})", vec.x, vec.y);
}

//～～～～～～～～～～～～～～～～～～～～～～～vec3～～～～～～～～～～～～～～～～～～～～～～～//
export function Vec3Add(a: Vector3, b: Vector3): Vector3 {
    return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
}

export function Vec3Sub(a: Vector3, b: Vector3): Vector3 {
    return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
}

export function Vec3Multiply(a: Vector3, b: Vector3): Vector3 {
    return new Vector3(a.x * b.x, a.y * b.y, a.z * b.z);
}

export function Vec3Mul(a: Vector3, d: number): Vector3 {
    return new Vector3(a.x * d, a.y * d, a.z * d);
}

export function Vec3Div(a: Vector3, d: number): Vector3 {
    return new Vector3(a.x / d, a.y / d, a.z / d);
}

export function Vec3Cross(lhs: Vector3, rhs: Vector3): Vector3 {
    return new Vector3((lhs.y * rhs.z) - (lhs.z * rhs.y), (lhs.z * rhs.x) - (lhs.x * rhs.z), (lhs.x * rhs.y) - (lhs.y * rhs.x));
}

export function Vec3Project(vector: Vector3, onNormal: Vector3): Vector3 {
    let num: number = Vector3.dot(onNormal, onNormal);
    if (num < 1E-05) {
        return new Vector3();
    }
    return (Vec3Div(Vec3Mul(onNormal, Vector3.dot(vector, onNormal)), num));
}

export function Vec3Min(lhs: Vector3, rhs: Vector3): Vector3 {
    return new Vector3(Math.min(lhs.x, rhs.x), Math.min(lhs.y, rhs.y), Math.min(lhs.z, rhs.z));
}

export function Vec3Max(lhs: Vector3, rhs: Vector3): Vector3 {
    return new Vector3(Math.max(lhs.x, rhs.x), Math.max(lhs.y, rhs.y), Math.max(lhs.z, rhs.z));
}

export function Vec3Magnitude(vec: Vector3): number {
    return Math.sqrt((vec.x * vec.x) + (vec.y * vec.y) + (vec.z * vec.z));
}

export function Vec3SqrMagnitude(vec: Vector3): number {
    return (vec.x * vec.x) + (vec.y * vec.y) + (vec.z * vec.z);
}

export function Vec3Normalized(vec: Vector3): Vector3 {
    let magnitude: number = Vector3.scalarLength(vec);
    let v: Vector3;
    if (magnitude > 1E-05)
        v = Vec3Div(vec, magnitude);
    else
        v = new Vector3(0, 0, 0);
    return v;
}

export function Vec3Normal(vec: Vector3): void {
    let magnitude: number = Vector3.scalarLength(vec);
    if (magnitude > 1E-05) {
        let v: Vector3 = Vec3Div(vec, magnitude);
        Vec3Set(vec, v.x, v.y, v.z);
    } else
        Vec3Set(vec, 0, 0, 0);
}

export function Vec3Set(v: Vector3, x: number, y: number, z: number): Vector3 {
    v.x = x;
    v.y = y;
    v.z = z;
    return v;
}

// export function Vec3Angle(from: Vector3, to: Vector3): number {
//     return (Math.acos(UtilMath.clamp(Vector3.dot(Vec3Normalized(from), Vec3Normalized(to)), -1, 1)) * 57.29578);
// }

export function Vec3ClampMagnitude(vector: Vector3, maxLength): Vector3 {
    if (Vector3.scalarLengthSquared(vector) > (maxLength * maxLength)) {
        return (Vec3Mul(Vec3Normalized(vector), maxLength));
    }
    return vector;
}

// export function Vec3Lerp(from: Vector3, to: Vector3, t: number): Vector3 {
//     t = UtilMath.clamp(t, 0, 1);
//     return new Vector3(from.x + ((to.x - from.x) * t), from.y + ((to.y - from.y) * t), from.z + ((to.z - from.z) * t));
// }

export function Vec3MoveTowards(current: Vector3, target: Vector3, maxDistanceDelta: number): Vector3 {
    let vector: Vector3 = Vec3Sub(target, current);
    let magnitude: number = Vector3.scalarLength(vector);
    if ((magnitude > maxDistanceDelta) && (magnitude != 0)) {
        return Vec3Add(current, (Vec3Mul(Vec3Div(vector, magnitude), maxDistanceDelta)));
    }
    return target;
}

export function Vec3ToString(vec: Vector3): string {
    return StringUtil.format("({0}, {1}, {2})", vec.x, vec.y, vec.z);
}

/**
 * 弧度转向量
 * @param    radians    弧度
 */
export function getLineFromRadians(radians: number): Vector2 {
    let x: number = Math.cos(radians);
    let y: number = Math.sin(radians);
    let dir: Vector2 = new Vector2(x, y);
    Vec2Normal(dir);
    return dir;
}