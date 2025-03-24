
/**数学工具类*/
export class MathUtil {

    public static PI: number = 3.14159274;//圆周率
    public static deg2Rad: number = 0.0174532924;//角度转弧度
    public static rad2Deg: number = 57.29578;//弧度转角度

    /**字节转换M*/
    public static BYTE_TO_M: number = 1 / (1024 * 1024);
    /**字节转换K*/
    public static BYTE_TO_K: number = 1 / (1024);

    /**随机浮点数，随机范围min<=value<max
     * @param min 最小值
     * @param max 最大值
    */
    public static Range(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    /**随机整数，随机范围min<=value<=max
     * @param min 最小值
     * @param max 最大值
    */
    public static RangeInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    /**单位转换
     * @param value 数值
    */
    public static UnitConversion(value: number): string {
        if (value < 1000000)
            return Math.floor(value).toString();
        if (value === 0) return "0";
        let k: number = 1000,
            sizes = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'],
            i = Math.floor(Math.log(value) / Math.log(k));
        let unit: string = '';
        if (i < sizes.length)//长度在设定范围
            unit = sizes[i];
        else {//超出设定范围
            let numLen: number = i - sizes.length;
            unit = String.fromCharCode(97 + numLen % 26);
            for (let idx: number = 0, len: number = 1 + Math.floor(numLen / 65); idx < len; idx++)
                unit = unit + unit;
        }
        return (value / Math.pow(k, i)).toPrecision(3) + ' ' + unit;
    }

    /**获取正负 */
    public static Sign(f: number): number {
        return ((f < 0) ? -1 : 1);
    }

    // /**
    //  * 限定数字在范围区间并返回
    //  * @param num
    //  * @param min
    //  * @param max
    //  * @constructor
    //  */
    // public static Clamp(num: number, min: number, max: number): number {
    //     if (num < min) {
    //         num = min;
    //     } else if (num > max) {
    //         num = max;
    //     }
    //     return num;
    // }

    /**
     * min max 定义一个range
     * 
     * 如果 value 在range内 返回value 
     * 如果 value 小于min 返回 min
     * 如果 value 大于max 返回max
    */
    public static Clamp(value: number, min: number, max: number): number {

        let mMin: number = min < max ? min : max;
        let mMax: number = max > min ? max : min;

        if (value <= mMin)
            return mMin;
        else if (value >= mMax)
            return mMax;
        else
            return value;
    }

    /**限定0-1之间取值*/
    public static Clamp01(value: number): number {
        if (value < 0) return 0;
        if (value > 1) return 1;
        return value;
    }

    /**线性插值*/
    public static Lerp(from: number, to: number, t: number): number {
        return (from + ((to - from) * MathUtil.Clamp01(t)));
    }

    /**线性插值角度*/
    public static LerpAngle(a: number, b: number, t: number): number {
        let num: number = MathUtil.Repeat(b - a, 360);
        if (num > 180) num -= 360;
        return (a + (num * MathUtil.Clamp01(t)));
    }

    /**重复取值 example:t=365 length=180 return=5
     * @param t 变量
     * @param length 周期值
     * @returns 返回去掉整周期后的值
    */
    public static Repeat(t: number, length: number): number {
        return (t - (Math.floor(t / length) * length));
    }


    //#region 随机数


    /**产生随机数
     * @param value1 数值1
     * @param value2 数值2
     * @returns 返回随机值 result>=value1&&result<value2
    */
    public static RandRange(value1: number, value2: number): number {
        let result: number = Math.random() * (value2 - value1) + value1;
        return result;
    }
    /**
     * 产生随机数
     * 结果：x>=param1 && x<=param2
     */
    public static RandRangeInt(value1: number, value2: number): number {
        let result: number = Math.random() * (value2 - value1 + 1) + value1;
        return Math.floor(result);
    }

    /**
     * 从数组中产生随机数[-1,1,2]
     * 结果：-1/1/2中的一个
     */
    public static RandRangeArray<T>(arr: Array<T>): T {
        if (arr.length == 0)
            return null;
        let loc: T = arr[MathUtil.RandRangeInt(0, arr.length - 1)];
        return loc;
    }

    //#endregion

    /**
     * 转换为360度角度
     */
    public static clampDegrees(degrees: number): number {
        while (degrees < 0) degrees = degrees + 360;
        while (degrees >= 360) degrees = degrees - 360;
        return degrees;
    }

    /**
     * 转换为360度弧度
     */
    public static clampRadians(radians: number): number {
        while (radians < 0) radians = radians + 2 * Math.PI;
        while (radians >= 2 * Math.PI) radians = radians - 2 * Math.PI;
        return radians;
    }

    /**
     * 两点间的距离
     */
    public static getDistance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
    }

    /**两点距离平方*/
    public static getSquareDistance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2);
    }

    /**
     * 两点间的弧度：x正方形为0，Y轴向下,顺时针为正
     */
    public static getLineRadians(x1: number, y1: number, x2: number, y2: number): number {
        return Math.atan2(y2 - y1, x2 - x1);
    }

    public static getLineDegree(x1: number, y1: number, x2: number, y2: number): number {
        let degree: number = MathUtil.toDegree(MathUtil.getLineRadians(x1, y1, x2, y2));
        return MathUtil.clampDegrees(degree);
    }

    public static getPointRadians(x: number, y: number): number {
        return Math.atan2(y, x);
    }

    public static getPointDegree(x: number, y: number): number {
        let degree: number = MathUtil.toDegree(MathUtil.getPointRadians(x, y));
        return MathUtil.clampDegrees(degree);
    }

    /**
     * 弧度转化为度
     */
    public static toDegree(radian: number): number {
        return radian * (180.0 / Math.PI);
    }

    /**
     * 度转化为弧度
     */
    public static toRadian(degree: number): number {
        return degree * (Math.PI / 180.0);
    }

    public static moveTowards(current: number, target: number, maxDelta: number): number {
        if (Math.abs(target - current) <= maxDelta) {
            return target;
        }
        return (current + (MathUtil.Sign(target - current) * maxDelta));
    }

    /**
     * 获取一定范围内的随机整数
     * @param min 最小值
     * @param max 最大值
     * @constructor
     */
    public static random(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min) + min);
    }

    /**
     * 二维向量归一化
     * @param x
     * @param y
     */
    public static normalize(x: number, y: number): number {
        return Math.sqrt(x * x + y * y);
    }

    /**
     * 返回两向量夹角
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     */
    public static vectorAngle(x1: number, y1: number, x2: number, y2: number): number {
        if (x1 == x2 && y1 == y2) {
            return;
        }
        var cosAngle = (x1 * x2 + y1 * y2) / (MathUtil.normalize(x1, y1) * MathUtil.normalize(x2, y2));
        var aCosAngle = Math.acos(cosAngle);
        var angle = MathUtil.Rad2Deg(aCosAngle);
        if (x1 / y1 < x2 / y2) angle = - angle;
        return angle;
    }

    /**角度转弧度 */
    public static Deg2Rad(angle: number): number {
        return Laya.Utils.toRadian(angle);
    }

    /**弧度转角度 */
    public static Rad2Deg(radian: number): number {
        return Laya.Utils.toAngle(radian);
    }

    /**正弦 */
    public static sin(angle: number): number {
        var radian = MathUtil.Deg2Rad(angle);
        return Math.sin(radian);
    }

    /**余弦 */
    public static cos(angle: number): number {
        var radian = MathUtil.Deg2Rad(angle);
        return Math.cos(radian);
    }

    /**正切 */
    public static tan(angle: number): number {
        var radian = MathUtil.Deg2Rad(angle);
        return Math.tan(radian);
    }

    /**反正弦 */
    public static asin(angle: number): number {
        var radian = MathUtil.Deg2Rad(angle);
        return Math.asin(radian);
    }

    /**反余弦 */
    public static acos(angle: number): number {
        var radian = MathUtil.Deg2Rad(angle);
        return Math.acos(radian);
    }

    /**反正切 */
    public static atan(angle: number): number {
        var radian = MathUtil.Deg2Rad(angle);
        return Math.atan(radian);
    }

    public static atan2(y: number, x: number): number {
        return Math.atan2(y, x);
    }

    /**绝对值*/
    public static Abs(value: number): number {
        return Math.abs(value);
    }

    /**获取最小值*/
    public static Min(value: number, value2: number): number {
        if (value <= value2)
            return value;
        return value2;
    }

    /**获取最大值*/
    public static Max(value: number, value2: number): number {
        let min = value;
        let max = value2;
        if (min > max) {
            min = value2;
            max = value;
        }

        if (value >= value2)
            return value;
        return value2;
    }

    /**获取最小值*/
    public static Mins(values: number[]): number {
        if (values == null || values.length == 0) return 0;
        let min: number = values[0];
        for (let i: number = 1; i < values.length; i++) {
            if (values[i] < min)
                min = values[i];
        }
        return min;
    }

    /**获取最大值*/
    public static GetMaxs(values: number[]): number {
        if (values == null || values.length == 0) return 0;
        let max: number = values[0];
        for (let i: number = 1; i < values.length; i++) {
            if (values[i] > max)
                max = values[i];
        }
        return max;
    }


    /**数字复制
     * @param num 源数字
     * @param floatCount 保留几位小数 -1=原数字 0=整数
    */
    public static NumberClone(num: number, floatCount: number = -1): number {
        if (floatCount < 0)
            return parseFloat(num.toString());
        else if (floatCount == 0)
            return parseInt(num.toFixed(0));
        else
            return parseFloat(num.toFixed(floatCount));
    }

    /**求2点之间的距离*/
    public static DistanceV2(x1: number, y1: number, x2: number, y2: number): number {
        let dx: number = x1 - x2;
        let dy: number = y1 - y2;
        let distance: number = Math.sqrt(dx * dx + dy * dy);
        return Math.abs(distance);
    }

    /**次幂运算*/
    public static Pow(n: number, p: number): number {
        return Math.pow(n, p);
    }

    /**开平方*/
    public static Sqrt(n: number): number {
        return Math.sqrt(n);
    }

    /**反正切*/
    public static Atan(n: number): number {
        return Math.atan(n);
    }

    /**
     * 平面坐标系，通过三角函数求终点坐标
     * @param startPoint 起点
     * @param angle 角度
     * @param distance 距离
    */
    public static CalNewPointByAngle2(startPoint: Laya.Vector2, angle: number, distance: number) {
        var endPoint: Laya.Vector2 = new Laya.Vector2();
        // 角度转弧度
        var radian = (angle * Math.PI) / 180;
        // 计算新坐标(对于无限接近0的数字，此处没有优化)
        endPoint.x = startPoint.x + distance * Math.sin(radian);
        endPoint.y = startPoint.y + distance * Math.cos(radian);
        return endPoint;
    }

    /**
     *  球面坐标系，通过三角函数求终点坐标
     * @param startPoint (lng,lat,alt) 起点
     * @param angle 角度
     * @param distance 距离
    */
    calNewPointByAngle3(startPoint, angle, distance): Laya.Vector3 {
        var rate = Math.cos(startPoint.lat * Math.PI / 180); // 指定维度球面长度和赤道长度的比率

        var lat_meter = 111111; // 1维度 ≈ 111,111米
        var r = angle * Math.PI / 180.0;
        var x = Math.sin(r) * distance;
        var y = Math.cos(r) * distance;
        x = x / lat_meter / rate; // x偏移量需要根据所在维度进行计算
        y = y / lat_meter;

        return new Laya.Vector3(startPoint.lng + x, startPoint.lat + y, startPoint.alt);
    };

    /**返回比率0.00-1.00*/
    public static getPercent(n: number, m: number): number {
        if (m <= 0) return 1;
        if (n <= 0) return 0;

        if (n > m) return 1;

        return parseFloat((n / m).toFixed(2));
    }


    //#region 精度丢失问题

    // public static toNonExceponential(num: number) {

    //     let m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
    //     return num.toFixed(Math.max(0, (m[1] || '').length - (StringUtil.toFloat(m[2]))));
    // }

    /**乘法 */
    public static floatMultiply(arg1: number, arg2: number) {
        var n1, n2;
        var r1, r2;//小数位
        try {
            r1 = arg1.toString().split(".")[1].length;
        }
        catch (e) {
            r1 = 0;
        }

        try {
            r2 = arg2.toString().split(".")[1].length;
        }
        catch {
            r2 = 0;
        }

        n1 = Number(arg1.toString().replace(".", ""));
        n2 = Number(arg2.toString().replace(".", ""));

        return n1 * n2 / Math.pow(10, r1 + r2);
    }

    /**除法 */
    public static floatDivide(arg1: number, arg2: number) {
        var n1, n2;
        var r1, r2;//小数位
        try {
            r1 = arg1.toString().split(".")[1].length;
        }
        catch (e) {
            r1 = 0;
        }

        try {
            r2 = arg2.toString().split(".")[1].length;
        }
        catch {
            r2 = 0;
        }

        n1 = Number(arg1.toString().replace(".", ""));
        n2 = Number(arg2.toString().replace(".", ""));

        return this.floatMultiply((n1 / n2), Math.pow(10, r2 - r1));
    }

    /**加法 */
    public static floatAdd(arg1: number, arg2: number) {
        var r1, r2, m;
        try {
            r1 = arg1.toString().split(".")[1].length;
        }
        catch (e) {
            r1 = 0;
        }

        try {
            r2 = arg2.toString().split(".")[1].length;
        }
        catch {
            r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2));
        return (this.floatMultiply(arg1, m) + this.floatMultiply(arg2, m)) / m;
    }

    /**减法 */
    public static floatSub(arg1: number, arg2: number) {
        var r1, r2, m, n;
        try {
            r1 = arg1.toString().split(".")[1].length;
        }
        catch (e) {
            r1 = 0;
        }

        try {
            r2 = arg2.toString().split(".")[1].length;
        }
        catch {
            r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2));
        n = (r1 >= r2) ? r1 : r2;
        return ((this.floatMultiply(arg1, m) - this.floatMultiply(arg2, m)) / m).toFixed(n);
    }

    /**取余 */
    public static floatMode(arg1: number, arg2: number) {
        let intNum = arg1 / arg2;
        intNum = intNum < 0 ? Math.ceil(arg1 / arg2) : Math.floor(arg1 / arg2);
        let intVal = this.floatMultiply(intNum, arg2);
        return this.floatSub(arg1, intVal);
    }

    //#endregion

}