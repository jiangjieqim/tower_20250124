class CsTimeVo {
    public hour: number;
    public minute: number;
    public sec: number;
    constructor(_time: number) {
        let hour = Math.floor(_time / 3600);
        let minute = Math.floor(_time / 60) % 60;
        let sec = _time % 60;
        this.hour = hour;
        this.minute = minute;
        this.sec = sec;
    }
}

interface ITimeOut {
    day;
    hour;
    minutes;
    sec;
}

/**时间工具*/
export class TimeUtil {
    //游戏启动的时间
    private static _startTime: number = 0;
    //客户端与服务器时间差
    private static _subTime: number;
    public static Init() {
        this._startTime = Laya.timer.currTimer;
    }

    /**两帧间隔时长 单位：s*/
    public static get DeltaTimeS(): number { return Laya.timer.delta * 0.001; }

    /**两帧间隔时长 单位：ms*/
    // public static get DeltaTimeMS(): number { return Laya.timer.delta; }

    /**固定帧 单位ms*/
    public static get FixedDeltaTimeMS(): number { return 20; }

    /**固定帧 单位s*/
    // public static get FixedDeltaTimeS(): number { return TimeUtil.FixedDeltaTimeMS * 0.001; }

    /**当前时间 相对xxxx年开始经过的毫秒数*/
    // public static get Time(): number { return Laya.timer.currTimer; }

    /**游戏启动时长 单位：s*/
    public static get TimeSinceStartupS(): number { return (Laya.timer.currTimer - this._startTime) / 1000.0; }

    /**游戏启动时长 单位：ms*/
    // public static get TimeSinceStartupMS(): number { return (Laya.timer.currTimer - this._startTime); }

    /**游戏启动后经过的帧数*/
    // public static get FrameCount(): number { return Laya.timer.currFrame; }

    public static get TimeScale(): number { return Laya.timer.scale; }

    public static set TimeScale(scale: number) { Laya.timer.scale = scale; }

    /**
     * 秒 00:00:00格式时间
     * @param _time 秒
     * @param _isHour 是否显示小时
     */
    public static timeFormatStr(_time: number, _isHour: boolean = false): string {
        let hour = Math.floor(_time / 3600);
        let minute = Math.floor(_time / 60) % 60;
        let sec = _time % 60;
        if (_isHour) {
            let hideHourZero = true;//隐藏小时中的0
            let v = "0";
            if (hideHourZero) {
                v = "";
            }
            return (hour < 10 ? (v + hour) : hour) + ':' + (minute < 10 ? ('0' + minute) : minute) + ':' + (sec < 10 ? ('0' + sec) : sec);
        }
        else {
            return (minute < 10 ? ('0' + minute) : minute) + ':' + (sec < 10 ? ('0' + sec) : sec);
        }
    }

    public static getHMS(_sec: number) {
        return new CsTimeVo(_sec);
    }

    /** 获取本地与服务器时间差(s减c) */
    // public static csDiffTime(): number {
    // let that = this;
    // return that.cs_time_diff;
    // }

    /** 获取服务器当前时间 (秒)*/
    public static set serverTimeV(v: number) {
        let sub = v - Laya.timer.currTimer / 1000;
        this._subTime = sub;
    }
    /**
     * 服务器时间戳(秒)
     */
    public static get serverTime() {
        // return Math.floor(this._subTime + Laya.timer.currTimer / 1000);
        // return Math.floor((this._subTime + Laya.timer.currTimer)/1000);
        if (isNaN(this.serverTimeMS)) {
            // LogSys.Warn(`use client time...`);
            return (Date.now()) / 1000;
        }
        return Math.ceil(this.serverTimeMS / 1000);
    }

    /**
     * 是否是今天0点之前
     * @param time 秒
     */
    public static isNotToday(time: number) {
        let zero = this.curZeroTime;
        if (time < zero) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 服务器时间戳(毫秒)
     */
    public static get serverTimeMS() {
        let t = Laya.timer;
        let v = 0;
        if (t) {
            v = Laya.timer.currTimer;
        }
        return (this._subTime == undefined ? 0 : this._subTime) * 1000 + v;
    }

    /**服务器时间文本输出 */
    public static get serverTimeOutStr() {
        let a = this.serverTimeMS;
        // k:string = "-" , dk = " ",tk = ":",prefix:string = "0",
        return isNaN(a) ? ("#client time# " + this.timestamtoTime(Date.now(), "-", " ", ":", ":", true)) : this.timestamtoTime(a, "-", " ", ":", ":", true);
    }

    /**开服时间戳 沒有的时候为0*/
    public static openTime: number;

    /**00:00:00 转化为秒 */
    public static toSecond(str: string, sign: string = ":") {
        let _arr = str.split(sign);
        return parseInt(_arr[0]) * 3600 + parseInt(_arr[1]) * 60 + parseInt(_arr[2]);
    }

    /**
     * 時間轉時間戳
     * @param str "2022-08-20 01:16:00";
     * @returns 1660929360000
     */
    public static getTimeStamp(str) {
        let t = new Date(str.replace(' ', "T") + '+08:00').getTime();
        return t;
    }
    /**
     * @param v 毫秒
     * 1403058804000 -> 2014-06-18 10:33:00
     * 时间戳转时间
     */
    public static timestamtoTime(v: number, k: string = "-", dk = " ", tk = ":", prefix: string = "0", ms: boolean = false): string {
        let date = new Date(v);
        let Y = date.getFullYear() + k;
        let M = (date.getMonth() + 1 < 10 ? prefix + (date.getMonth() + 1) : date.getMonth() + 1) + k;
        let D = date.getDate() + dk;
        let h = date.getHours() + tk;
        let m = date.getMinutes() + tk;
        let s = date.getSeconds();
        return Y + M + D + h + m + s + (ms ? "." + date.getMilliseconds() : "");
    }

    public static timestamtoTime3(v: number): string {
        let date = new Date(v);
        let Y = date.getFullYear() + "年";
        let M = date.getMonth() + 1 + "月";
        let D = date.getDate() + "日";
        return Y + M + D;
    }

    public static timestamtoTime1(v: number, k: string = "-", dk = " ", tk = ":", hasYear: boolean = true): string {
        let date = new Date(v * 1000);
        let Y = date.getFullYear() + k;
        let M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + k;
        let D = date.getDate() < 10 ? "0" + date.getDate() + dk : date.getDate() + dk;
        let h = date.getHours() < 10 ? "0" + date.getHours() + tk : date.getHours() + tk;
        let m = date.getMinutes() < 10 ? "0" + date.getMinutes() + tk : date.getMinutes() + tk;
        let s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        return (hasYear ? Y : "") + M + D + h + m + s;
    }
    public static timestamtoTime2(v: number): string {
        let date = new Date(v * 1000);
        let M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "月";
        let D = date.getDate() < 10 ? "0" + date.getDate() + "日   " : date.getDate() + "日   ";
        let h = date.getHours() < 10 ? "0" + date.getHours() + ":" : date.getHours() + ":";
        let m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        return M + D + h + m;
    }
    /**12月24日 12:12 */
    public static timesMonthDay(v: number): string {
        let date = new Date(v * 1000);
        // let Y = date.getFullYear() + "年";
        let M = (date.getMonth() + 1) + "月";
        let D = date.getDate() + "日";
        let h = date.getHours() + ":";
        let m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        return M + D + " " + h + m;
    }
    public static getMonthDay(sec: number) {
        let date = new Date(sec * 1000);
        let k = "/";
        // let M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + k;
        let M = (date.getMonth() + 1) + k;
        // let D = date.getDate() < 10 ?  "0" + date.getDate() : date.getDate();
        let D = date.getDate();
        return M + D;
    }
    /**
     * 1403058804 -> 2014-06-18 10:33:00
     * @param v 秒
     * @param k 
     * @param dk 
     * @param tk 
     */
    public static timeToStr(v: number, k: string = "-", dk = " ", tk = ":") {
        return this.timestamtoTime(v * 1000);
    }
    /**
     * 获取当前时间戳的0点时间戳(毫秒)
     * @param time 
     */
    public static GetCurDayZero(time: number) {
        let date = new Date(time);
        let t = new Date(date.toLocaleDateString()).getTime();
        return t;
    }
    /**当前时间的0点时间戳(秒)*/
    public static getZeroSecond(time: number) {
        return this.GetCurDayZero(time * 1000) / 1000;
    }

    /**今日0点的时间戳(秒) */
    public static get curZeroTime() {
        return this.getZeroSecond(this.serverTime);
    }

    /**当前周几 */
    public static getDay() {
        let t = this.serverTime;
        let date = new Date(t * 1000);
        let day = date.getDay();
        return day;
    }

    public static getDayString(day) {
        let weeks = ["日", "一", "二", "三", "四", "五", "六"];
        return weeks[day];
    }

    private static getHourMin(t: number): ITimeOut {
        let day = Math.floor(t / 86400);
        let time = t % 86400;
        let a = this.timeFormatStr(time, true).split(":");
        return { day: day, hour: parseInt(a[0]), minutes: parseInt(a[1]), sec: parseInt(a[2]) } as ITimeOut;
    }

    /**
     * @param t 秒
     */
    public static subTime(t: number) {
        if (t < 0) {
            return "";
        }
        if (t < 3600) {
            // 小于1小时 59:40
            return this.timeFormatStr(t);
        }
        else if (t >= 3600 && t < 86400) {
            //小于1天 大于1小时 2:36:22
            return this.timeFormatStr(t, true);
        }
        else if (t >= 86400) {
            // 大于1天 < 7天 --->2天15小时36分钟
            let o: ITimeOut = this.getHourMin(t);
            if (o.minutes > 0) {
                return `${o.day}天${o.hour}小时${o.minutes}分钟`;
            }
            else if (o.hour > 0) {
                return `${o.day}天${o.hour}小时`;
            }
            return `${o.day}天`;
        }
    }

    /**
     * @param t 秒
     */
    public static subTimeCC(t: number) {
        if (t < 0) {
            return "";
        }
        if (t < 3600) {
            // 小于1小时 59:40
            return this.timeFormatStr(t);
        }
        else if (t >= 3600 && t < 86400) {
            //小于1天 大于1小时 2:36:22
            return this.timeFormatStr(t, true);
        }
        else if (t >= 86400) {
            // 大于1天 < 7天 --->2天15小时36分钟
            let o: ITimeOut = this.getHourMin(t);
            if (o.minutes > 0) {
                return `${o.day}天${o.hour}小时`;
            }
            else if (o.hour > 0) {
                return `${o.day}天${o.hour}小时`;
            }
            return `${o.day}天`;
        }
    }

    /**
     * @param t 秒
     */
    public static subTimeC(t: number, min: string = "分") {
        let o: ITimeOut = this.getHourMin(t);
        let st = "";
        if (t >= 60) {
            if (o.day > 0) {
                st += o.day + "天";
            }
            if (o.hour > 0) {
                st += o.hour + "小时";
            }
            if (o.minutes > 0) {
                st += o.minutes + min;
            }
        } else {
            if (t > 0) {
                st = t + "秒";
            }
        }
        return st;
    }

    /**
     * 时分秒
     */
    public static subTimeHMS(t: number) {
        if (t < 0) {
            return "";
        }
        let o = this.getHourMin(t);
        let h = o.hour + o.day * 24;
        if (h > 0) {
            return `${h}时${o.minutes}分${o.sec}秒`;
        }
        if (o.minutes > 0) {
            return `${o.minutes}分${o.sec}秒`;
        }
        return `${o.sec}秒`;
    }

    /**
     * 00:27
     */
    public static subTimeHMS_EN(t: number) {
        let p = ":";
        if (t < 0) {
            return "";
        }
        let o = this.getHourMin(t);
        let h = o.hour + o.day * 24;
        let m = o.minutes;
        m = m < 10 ? "0" + m : m;
        let sec = o.sec < 10 ? "0" + o.sec : o.sec;
        if (h > 0) {
            return `${h < 10 ? "0" + h : h}${p}${m}${p}${sec}`;
        }
        if (o.minutes > 0) {
            return `${m}${p}${sec}`;
        }
        return `00${p}${sec}`;
    }

    public static getTimeShow(time: number) {
        let oneYear: number = 3600 * 24 * 365;
        let oneMonth = oneYear / 12;
        if (time < 60 || time >= 60 && time <= 3600) {
            return Math.ceil(time / 60) + "分钟";
        } else if (time >= 3600 && time < 3600 * 24) {
            return Math.ceil(time / 3600) + "小时";
        } else if (time >= 3600 * 24 && time < oneMonth) {
            return Math.ceil(time / (3600 * 24)) + "天";
        } else if (time >= oneMonth && time < oneYear) {
            return Math.ceil(time / oneMonth) + "月";
        }
        return Math.ceil(time / (oneYear)) + "年";
    }
    /**
    *  发送时间显示规则：							
       每五分钟显示一次时间（参考社交软件）							
       当天的消息（时 分）				展示: 	14:22		
       前一天的消息（昨天 时 分）				展示:	昨天 14:22		
       超过一天、小于一周（星期 时 分）				展示：	星期六 14:22		
       大于一周（显示收发日期的时间）				展示：	8月1日 14:22		
       当消息在上一年时展示出年月日时分				展示：	2021年11月27日 17:10		
    * @param t 时间戳(毫秒)
    * @param serverTime (当前服务器时间)
    */
    public static ShowTime(t: number, serverTime: number) {
        let zero = this.GetCurDayZero(t);
        let curZero = this.GetCurDayZero(serverTime);
        if (zero == curZero) {
            //当天
            // return this.timeFormatStr((t-zero)/1000,true);
            let date = new Date(t);
            let h = date.getHours();
            let m = date.getMinutes();
            return `${h}:${m}`;
        } else {
            let sub = curZero - zero;
            let oneDay = 86400 * 1000;
            if (sub <= oneDay) {
                //前一天
                // return "昨天 "+this.timeFormatStr((t-zero)/1000,true);
                let date = new Date(t);
                let h = date.getHours();
                let m = date.getMinutes();
                return `昨天 ${h}:${m}`;
            } else if (sub > oneDay && sub <= oneDay * 7) {
                let weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
                let date = new Date(t);
                let day = date.getDay();
                let h = date.getHours();
                let m = date.getMinutes();
                let week = weeks[day];
                return `${week} ${h}:${m}`;
            }
            else if (sub > oneDay * 7 && sub < oneDay * 365) {
                let date = new Date(t);
                let M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1);
                let D = date.getDate();
                let h = date.getHours();
                let m = date.getMinutes();
                return `${M}月${D}日 ${h}:${m}`;
            } else {
                let date = new Date(t);
                let Y = date.getFullYear();
                let M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1);
                let D = date.getDate();
                let h = date.getHours();
                let m = date.getMinutes();
                return `${Y}年${M}月${D}日 ${h}:${m}`;
            }
        }
    }

    /**
     * 获取本周几的时间戳
     * @param dayOfWeek 周几（其中 7 表示星期日，1 表示星期一，以此类推）
     * @param time HH:mm:ss
     * @returns 
     */
    public static getUnixByWeek(dayOfWeek, time) {
        // 获取当前日期对象
        let t = this.serverTime;
        var currentDate = new Date(t * 1000);

        // 获取当前星期几（getDay 0 表示星期日，1 表示星期一，以此类推）
        var currentDay = currentDate.getDay() ? currentDate.getDay() : 7;
        let day;
        const now = currentDate.getTime();
        day = new Date(now + (dayOfWeek - currentDay) * 86400000);

        // 设置时间为早上10:30:00
        const [HH, mm, ss] = time.split(':').map(Number);
        day.setHours(HH || 0, mm || 0, ss || 0, 0);

        // 获取时间戳
        var timestamp = Math.round(day.getTime() / 1000);

        return timestamp;
    }

}