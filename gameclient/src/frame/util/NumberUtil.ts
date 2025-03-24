import {MathUtil} from "./MathUtil";

export class NumberUtil {


    /**转小数
   * -保留小数点后几位
   */
    public static toFixed(value: number, p: number): number {
        return StringUtil.ParseNum(value.toFixed(p));
    }
    /**转整数
     * -正数，返回大于等于传入值的取整
     * -负数，返回小于等于传入值的整数
     */
    public static ToInt(value: number): number {
        return value > 0 ? Math.ceil(value) : Math.floor(value);
    }

    /**是否是整数 */
    public static isInt(value: number): boolean { return Math.ceil(value) == value; }
    /**向上取整 */
    public static Ceil(num: number) { return Math.ceil(num); }
    /**向下取整 */
    public static Floor(num: number) { return Math.floor(num); }

    /**获取小数的长度 */
    public static GetDecimalLen(num: number) {
        let len = (Math.floor(num) !== num) ? num.toString().split('.')[1].length : 0;
        return len;
    }

    /**保留有效数值
     * @param num
     * @param size
     */
    public static reserveNumber(num: number, size: number): number {
        let str = String(num);
        let l = str.length;
        let p_index: number = str.indexOf(".");
        if (p_index < 0) {
            return num;
        }
        let ret: string = str.slice(0, p_index + 1);

        let lastNum = l - p_index;
        if (lastNum > size) {
            lastNum = size;
        }
        let lastStr: string = str.slice(p_index + 1, p_index + 1 + lastNum);
        return StringUtil.toFloat(ret + lastStr);
    }

    /**
     * 保留有效数值，不够补0；注意返回的是字符串
     */
    public static reserveNumberWithZero(num: number, size: number): string {
        let str = String(num);
        let l = str.length;
        let p_index: number = str.indexOf(".");
        if (p_index < 0) {//是整数
            str += '.';
            for (let i = 0; i < size; ++i) str += '0';
            return str;
        }
        let ret: string = str.slice(0, p_index + 1);

        let lastNum = l - p_index - 1;
        if (lastNum > size) {//超过
            lastNum = size;
            let lastStr: string = str.slice(p_index + 1, p_index + 1 + lastNum);
            return ret + lastStr;
        } else if (lastNum < size) {//不足补0
            let diff: number = size - lastNum;
            for (let i = 0; i < diff; ++i) str += '0';
            return str;
        } else
            return str;
    }

    /**数字格式化-中文单位*/
    public static formartNumberCN(num: number, fixed: number) {

        if (num < MathUtil.Pow(10, 4))
            return num.toString();
        else if (num < MathUtil.Pow(10, 8))
            return (num / MathUtil.Pow(10, 4)).toFixed(fixed) + "万";
        else if (num < MathUtil.Pow(10, 12))
            return (num / MathUtil.Pow(10, 8)).toFixed(fixed) + "亿";
        else
            return (num / MathUtil.Pow(10, 12)).toFixed(fixed) + "万亿";

    }

    /**
     * 数字格式化
     */
    public static formatNumberShort(num: number, fixed: number = 0) {
        // if (num < MathUtil.Pow(10, 3))
        //     return num.toString();
        // else if (num < MathUtil.Pow(10, 6))
        //     return (num / MathUtil.Pow(10, 3)).toFixed(fixed) + "K";
        // else if (num < MathUtil.Pow(10, 9))
        //     return (num / MathUtil.Pow(10, 6)).toFixed(fixed) + "M";
        // else
        //     return (num / MathUtil.Pow(10, 9)).toFixed(fixed) + "G";

        if (num < MathUtil.Pow(10, 6))
            return this.reserveNumber(num, fixed).toString();// num.toFixed(fixed).toString();
        else if (num < MathUtil.Pow(10, 9))
            return (num / MathUtil.Pow(10, 6)).toFixed(fixed) + "M";
        else if (num < MathUtil.Pow(10, 12))
            return (num / MathUtil.Pow(10, 9)).toFixed(fixed) + "B";
        else if (num < MathUtil.Pow(10, 15))
            return (num / MathUtil.Pow(10, 12)).toFixed(fixed) + "T";
        else {
            return (num / MathUtil.Pow(10, 15)).toFixed(fixed) + "MT";
        }

    }

    /**
     * 科学计数法显示
     * @param num1
     */
    public static bigNumberFormat(num: string, fixed: number = 2) {
        let exts = [
            '', 'K', "M", "G", "T", "P", "E", "Z", "Y", "AA",
            "BB", "CC", 'DD', 'EE', "FF", "GG", "HH", "II",
            "JJ", "KK", 'LL', 'MM', "NN", "OO", "PP", "QQ",
            "RR", "SS", 'TT', 'UU', "VV", "WW", "XX", "YY",
            "ZZ", "aa", 'bb', 'cc', "dd", "ee", "ff", "gg",
            "hh", "ii", 'gg', 'kk', "ll", "mm", "nn", "oo",
            "pp", "qq", 'rr', 'ss', "tt", "uu", "vv", "ww"
        ];

        let t1, t2;
        let n1 = num.indexOf("e+");
        if (n1 == -1) n1 = num.indexOf("E");
        if (n1 && n1 != -1) {
            t1 = parseFloat(num.substr(0, n1));
            t2 = parseInt(num.substr(n1 + 2));

            let ext = Math.floor(t2 / 3);
            let m = t2 % 3;

            return (t1 * Math.pow(10, m)).toFixed(fixed) + exts[ext];
        }
        return num;
    }

    /**
     * 数字相加
     */
    public static bigNumberAdd(num1: string, num2: string) {
        let b = Number(num1) + Number(num2);
        return b.toExponential(4);
    }

    /**
     * 数字相减
     */
    public static bigNumberSub(num1: string, num2: string) {
        let n1 = Number(num1);
        let n2 = Number(num2);
        if (n1 < n2) {
            return null;
        }

        return (n1 - n2).toExponential(4);
    }

    /**
     * 数字相乘法
     */
    public static bigNumberMul(num1: string, num2: number) {
        return (Number(num1) * num2).toExponential(4);
    }

    /**
     * 数字相除
     */
    public static bigNumberDiv(num1: string, num2: number) {
        return (Number(num1) / num2).toExponential(4);
    }

    /**
     * 两个科学计数相除
     */
    public static bigNumberDivDounble(num1: string, num2: string) {
        return (Number(num1) / Number(num2));
    }

    /**
     * 数字显示正负
     * @param num 
     */
    public static numberPorN(num: number): string {
        if (num > 0) {
            return "+" + num;
        }
        else {
            return num.toString();
        }
    }

    /**
     * 数字范围
     * @param num 当前数字
     * @param range 数字范围
     */
    public static numberRange(num: number, range: number): number[] {
        let min = range * Math.floor(num / range);
        let max = min + range - 1;
        let result: number[] = [];
        for (let i = min; i < max; i++) {
            result.push(i);
        }
        return result;
    }

    /**cm 转 m */
    public static CMToM(cm: number) {
        let m = cm * 0.01;
        return m;
    }

    /**m 转 cm */
    public static MToCM(m: number) {
        let cm = m * 100;
        return cm;
    }

    public static Copy(num: number) {
        return parseFloat(num.toString());
    }
}