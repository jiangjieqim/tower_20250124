import { E } from "../../game/G";

/**日期工具类*/
export class DateUtil {

    /**服务器时间*/
    public static ServerTimeDiff: number = 0;

    /**从1970年以来经过的毫秒数*/
    public static get TimeSince1970(): number {
        let base_date = new Date(1970, 1, 1, 0, 0, 0, 0);
        return (Date.now() - base_date.getTime());
    }

    /**从2009年一阿里经过的毫秒数*/
    public static get TimeSince2009(): number {
        let base_date = new Date(2009, 1, 1, 0, 0, 0, 0);
        return (Date.now() - base_date.getTime());
    }

    /**获取Unix时间*/
    public static GetNowS(): number {
        let now: number = Math.floor(Date.now() / 1000);
        return now + this.ServerTimeDiff;
    }

    /**获取Unix时间*/
    public static GetNowMS(): number {
        let now: number = Math.floor(Date.now());
        return now + this.ServerTimeDiff;
    }

    public static SameMonth(nTime: number, nSecond: number): boolean {
        let now = this.GetNowS();
        let curTime = now - nSecond;
        let date = new Date(curTime * 1000);
        let defineDate: Date = new Date(date.getFullYear(), date.getMonth(), 1);
        let nextTime: number = Math.floor(defineDate.getTime() / 1000) + nSecond;
        return nTime >= nextTime;
    }

    public static SameDayByNow(nTime: number, nSecond: number): boolean {
        let date = new Date();
        let offset = date.getTimezoneOffset() * 60;
        let now = this.GetNowS();
        let day1 = (nTime - offset - nSecond) / 86400;
        let day2 = (now - offset - nSecond) / 86400;
        if (Math.floor(day1) === Math.floor(day2))
            return true;
        return false;
    }

    /**计算从nTime1到nTime2过去了多少天 */
    public static PassedDays(nTime1: number, nTime2: number, nSecondOffset: number = 0): number {
        let date = new Date();
        let offset = date.getTimezoneOffset() * 60;
        let day1 = (nTime1 - offset - nSecondOffset) / 86400;
        let day2 = (nTime2 - offset - nSecondOffset) / 86400;
        return Math.floor(day2) - Math.floor(day1);
    }

    /**计算从start到end的时间间隔(毫秒) */
    public static Timespan(start: Date, end: Date): number {
        let result: number = end.getTime() - start.getTime();
        return result;
    }

    /**判断是否是今天*/
    public static IsToday(str) {
        return new Date(str).toDateString() == new Date().toDateString();
    }

    /**判断是否在今天之前*/
    public static BeforeToday(str) {
        return new Date(str).toDateString() < new Date().toDateString();
    }

    /**判断是否在今天之后*/
    public static AfterToday(str) {
        return new Date(str).toDateString() > new Date().toDateString();
    }

    /**判断是否是时间的最小值(DateTime.MinValue) */
    public static IsMinDate(time: Date): boolean {
        if (time.getTime() == this.MinDate.getTime()) {
            return true;
        }
        return false;
    }

    /**时间最小值 对齐服务器的DateTime.MinValue */
    private static minDate: Date = null;
    public static get MinDate() {
        if (this.minDate == null) this.minDate = new Date("0001-01-01T00:00:00");
        return this.minDate;
    }

    /**
    * 对日期进行格式化， 和C#大致一致 默认yyyy-MM-dd HH:mm:ss
    * 可不带参数 一个日期参数 或一个格式化参数
    * @param date 要格式化的日期
    * @param format 进行格式化的模式字符串
    *     支持的模式字母有：
    *     y:年,
    *     M:年中的月份(1-12),
    *     d:月份中的天(1-31),
    *     H:小时(0-23),
    *     h:小时(0-11),
    *     m:分(0-59),
    *     s:秒(0-59),
    *     f:毫秒(0-999),
    *     q:季度(1-4)
    * @return String
    * @author adswads@gmail.com
    * @example console.log(
            DateUtil.dateFormat(new Date(Date.now()), "yyyy年MM月dd日"));//2021年06月02日
    */
    public static dateFormat(date?: any, format?: string): string {
        //无参数
        if (date == undefined && format == undefined) {
            date = new Date();
            format = "yyyy-MM-dd HH:mm:ss";
        }
        //无日期
        else if (typeof (date) == "string") {
            if (format == undefined) {// 仅有格式
                format = date;
                date = new Date();
            }
            else {//日期为字符串
                let dateStr = date;
                date = new Date(dateStr);
            }
        }
        //无格式化参数
        else if (format === undefined) {
            format = "yyyy-MM-dd HH:mm:ss";
        }
        else { }
        //没有分隔符的特殊处理
        var map = {
            "y": date.getFullYear() + "",//年份
            "M": date.getMonth() + 1 + "", //月份
            "d": date.getDate() + "", //日
            "H": date.getHours(), //小时 24
            "m": date.getMinutes() + "", //分
            "s": date.getSeconds() + "", //秒
            "q": Math.floor((date.getMonth() + 3) / 3) + "", //季度
            "f": date.getMilliseconds() + "" //毫秒
        };
        //小时 12
        if (map["H"] > 12) { map["h"] = map["H"] - 12 + ""; }
        else { map["h"] = map["H"] + ""; }
        map["H"] += "";
        var reg = "yMdHhmsqf";
        var all = "", str = "";
        for (var i = 0, n = 0; i < reg.length; i++) {
            n = format.indexOf(reg[i]);
            if (n < 0) { continue; }
            all = "";
            for (; n < format.length; n++) {
                if (format[n] != reg[i]) {
                    break;
                }
                all += reg[i];
            }
            if (all.length > 0) {
                if (all.length == map[reg[i]].length) {
                    str = map[reg[i]];
                }
                else if (all.length > map[reg[i]].length) {
                    if (reg[i] == "f") {
                        str = map[reg[i]] + this.charString("0", all.length - map[reg[i]].length);
                    }
                    else {
                        str = this.charString("0", all.length - map[reg[i]].length) + map[reg[i]];
                    }
                }
                else {
                    switch (reg[i]) {
                        case "y": str = map[reg[i]].substr(map[reg[i]].length - all.length); break;
                        case "f": str = map[reg[i]].substr(0, all.length); break;
                        default: str = map[reg[i]]; break;
                    }
                }
                format = format.replace(all, str);
            }
        }
        return format;
    }
    /**
        * 返回字符串 为n个char构成
        * @param char 重复的字符
        * @param count 次数
        * @return String
        * @author adswads@gmail.com
        */
    private static charString(char: string, count: number): string {
        var str: string = "";
        while (count--) {
            str += char;
        }
        return str;
    }

    /**添加天数 */
    public static AddDays(date: Date, timespan: number) {
        return new Date(date.getTime() + timespan * 24 * 60 * 60 * 1000);
    }

    /**添加小时数 */
    public static AddHours(date: Date, timespan: number) {
        return new Date(date.getTime() + timespan * 60 * 60 * 1000);
    }

    /**添加分钟数 */
    public static AddMinutes(date: Date, timespan: number) {
        return new Date(date.getTime() + timespan * 60 * 1000);
    }

    /**添加秒数 */
    public static AddSeconds(date: Date, timespan: number) {
        return new Date(date.getTime() + timespan * 1000);
    }

    /**添加时间间隔 */
    public static AddMilliseconds(date: Date, timespan: number): Date {
        return new Date(date.getTime() + timespan);
    }


    /**距离现在的时长(毫秒数)*/
    public static GetTimeSinceNow(date: Date): number {
        if (date == null) return 0;
        if (date.getTime() < Date.now()) {
            return 0;
        }
        return date.getTime() - Date.now();
    }

    //#region 转换

    /**天转换为毫秒 */
    public static DayToMilliseconds(day: number): number {
        let change = 1000 * 60 * 60 * 24;
        return day * change;
    }

    /**毫秒转换为天 */
    public static MillisecondToDays(millisecond: number): number {
        let change = 1000 * 60 * 60 * 24;
        return millisecond / change;
    }

    /**小时转换为毫秒 */
    public static HourToMilliseconds(hour: number): number {
        let change = 1000 * 60 * 60;
        return hour * change;
    }

    /**毫秒转换为小时 */
    public static MillisecondToHours(millisecond: number): number {
        let change = 1000 * 60 * 60;
        return millisecond / change;
    }



    /**时:分:秒*/
    public static Num2HMS(ts: number): string {
        let hh = Math.floor(ts / 1000 / 60 / 60 % 24);
        let mm = Math.floor(ts / 1000 / 60 % 60);
        let ss = Math.floor(ts / 1000 % 60);

        let _hh = hh < 10 ? ("0" + hh) : hh;
        let _mm = mm < 10 ? ("0" + mm) : mm;
        let _ss = ss < 10 ? ("0" + ss) : ss;

        return _hh + ":" + _mm + ":" + _ss;
    }



    /**毫秒转换为"x天x小时x分钟"文本*/
    public static Num2DH(ts: number): string {
        let dd = Math.floor(ts / 1000 / 60 / 60 / 24);
        if (dd >= 10) {
            return dd + this.DayStr;
        }
        else {
            let hh = Math.floor(ts / 1000 / 60 / 60 % 24);
            let mm = Math.floor(ts / 1000 / 60 % 60);
            if (dd <= 0) {
                return hh + this.HourStr + mm + this.MinuteStr;
            }
            if (hh == 0) {
                if (mm == 0) {
                    return dd + this.DayStr;
                }
                else {
                    return dd + this.DayStr + mm + this.MinuteStr;
                }
            }
            return dd + this.DayStr + hh + this.HourStr;
        }
    }

    /**分钟转换为"x时x分"文本*/
    public static M2HM(minute: number): string {
        let hh = Math.floor(minute / 60);
        let mm = Math.floor(minute % 60);
        if (hh == 0) {
            return mm + this.MinuteStr;
        }
        return hh + this.HourStr + mm + this.MinuteStr;
    }

    //#region 时间文本
    // 天
    private static get DayStr() {
        if (E.LangMgr.IsChinese)
            return "天";
        return " days ";
    }

    // 时
    private static get HourStr() {
        if (E.LangMgr.IsChinese)
            return "小时";
        return " hours ";
    }

    // 分
    private static get MinuteStr() {
        if (E.LangMgr.IsChinese)
            return "分钟";
        return " minutes ";
    }
    //#endregion
    //#endregion

}