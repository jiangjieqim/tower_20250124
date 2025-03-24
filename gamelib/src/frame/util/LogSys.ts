// import { TimeUtil } from "../util/TimeUtil";

import { TimeUtil } from "./TimeUtil";

/**日志等级*/
export enum ELogLevel {
    LOG = 1,
    WARN = 2,
    ERROR = 3,
}

/**日志系统 */
export class LogSys {

    public static IsEnable: boolean = false;//是否开启
    public static Level: ELogLevel = ELogLevel.LOG;//日志等级

    private static _isWx:boolean;
    public static get isWx(){
        if(this._isWx == undefined){
            let wx = window['wx'];
            if (wx) {
                
                let o = wx.getSystemInfoSync();
                if (o) {
                    if (o.platform == "devtools") {
                        
                    }else{
                        this._isWx = true;
                    }
                }
            }else{
                this._isWx = false;
            }
        }
        return this._isWx;
    }

    private static get time(){
        // return (Laya.timer ? Laya.timer.currTimer : 0);
        // Laya.timer ? Laya.timer.currTimer : 0
        return TimeUtil.timestamtoTime(Date.now(),"-"," ",":","0",true);

        //let time = TimeUtil.serverTimeMS;
        //return (isNaN(time) ? "":time)  + 
        // return TimeUtil.serverTimeOutStr;
    }

    public static Log(...args: any[]) {
        if (this.CanLog(ELogLevel.LOG)) {
            // let str = (TimeUtil.serverTimeOutStr) + "[Log]";
            console.log(this.time + "\t[Log]", args.toString());
            // E.pushLog("Log " + args.toString());

            // if (E.EventMgr)
            // E.EventMgr.emit(EventID.ONDEBUGLOG, { level: ELogLevel.LOG, log: "[Log]" + args.toString() });
        }
    }

    // public static LogColor(s:string,color:string = "#ff0000"){
    //     if (this.canLog(ELogLevel.LOG)) {
    //         console.log("%c"+s,"color:"+color);
    //     }
    // }

    public static Info(...args: any[]) {
        if (this.CanLog(ELogLevel.LOG)) {
            console.info(this.time + "[Info]", args.toString());
            // E.pushLog("Info "+args.toString());
            // E.EventMgr.emit(EventID.ONDEBUGLOG, { level: ELogLevel.LOG, log: "[Info]" + args.toString() });
        }
    }

    public static Warn(...args: any[]) {
        if (this.CanLog(ELogLevel.WARN)) {
            // console.trace(".");
            console.warn(this.time + "\t[Warn]", args.toString());
            // E.pushLog("Warn "+args.toString());
            // E.EventMgr.emit(EventID.ONDEBUGLOG, { level: ELogLevel.WARN, log: "[Warn]" + args.toString() });
        }
    }

    public static Trace(...arg:any[]){
        if(this.CanLog(ELogLevel.LOG)){
            console.trace(this.time + "\t[Trace]",arg.toString());
        }
    }

    public static Error(...args: any[]) {
        if (this.CanLog(ELogLevel.ERROR)) {
            console.error(this.time + "\t[Error]", args.toString());
            // E.pushLog("Error "+args.toString());
            // E.EventMgr.emit(EventID.ONDEBUGLOG, { level: ELogLevel.WARN, log: "[Error]" + args.toString() });
        }
    }


    public static Json(json: any) {
        if (this.CanLog(ELogLevel.LOG))
            console.log("[Json]", JSON.stringify(json));
    }

    /**是否可以输出日志 */
    public static CanLog(level: ELogLevel) {
        // if (initConfig.no_log) return;
        // if(this.isWx && !debug){
            // return;
        // }
        if(debug){
            return true;
        }
        return LogSys.IsEnable && this.isValidLevel(level); 
    }
    /**是否是有效等级*/
    private static isValidLevel(level: ELogLevel): boolean { if (LogSys.Level <= level) return true; return false; }
}