declare class TimeUtil {
    static Init();

    /**两帧间隔时长 单位：s*/
    static get DeltaTimeS(): number;

    /**固定帧 单位ms*/
    static get FixedDeltaTimeMS(): number;

    /**游戏启动时长 单位：s*/
    static get TimeSinceStartupS(): number

    static get TimeScale(): number;

    static set TimeScale(scale: number);
    /**
     * 秒 00:00:00格式时间
     * @param _time 秒
     * @param _isHour 是否显示小时
     */
    static timeFormatStr(_time: number, _isHour?: boolean): string;

    static getHMS(_sec: number);

    /** 获取服务器当前时间 (秒)*/
    static set serverTimeV(v: number);
    /**
     * 服务器时间戳(秒)
     */
    static get serverTime();

    /**
     * 是否是今天0点之前
     * @param time 秒
     */
    static isNotToday(time: number);

    /**
     * 服务器时间戳(毫秒)
     */
    static get serverTimeMS();

    /**服务器时间文本输出 */
    static get serverTimeOutStr();

    /**开服时间戳 沒有的时候为0*/
    static openTime: number;

    /**00:00:00 转化为秒 */
    static toSecond(str: string, sign?: string);

    /**
     * 時間轉時間戳
     * @param str "2022-08-20 01:16:00";
     * @returns 1660929360000
     */
    static getTimeStamp(str);
    /**
     * @param v 毫秒
     * 1403058804000 -> 2014-06-18 10:33:00
     * 时间戳转时间
     */
    static timestamtoTime(v: number, k?, dk?, tk?, prefix?: string, ms?: boolean): string;

    static timestamtoTime3(v: number): string;

    static timestamtoTime1(v: number, k?, dk?, tk?, hasYear?: boolean): string;

    static timestamtoTime2(v: number): string;
    /**12月24日 12:12 */
    static timesMonthDay(v: number): string;
    static getMonthDay(sec: number);
    /**
     * 1403058804 -> 2014-06-18 10:33:00
     * @param v 秒
     * @param k 
     * @param dk 
     * @param tk 
     */
    static timeToStr(v: number, k?: string, dk?, tk?);
    /**
     * 获取当前时间戳的0点时间戳(毫秒)
     * @param time 
     */
    static GetCurDayZero(time: number);
    /**当前时间的0点时间戳(秒)*/
    static getZeroSecond(time: number);

    /**今日0点的时间戳(秒) */
    static get curZeroTime();//{

    /**当前周几 */
    static getDay()

    static getDayString(day)

    private static getHourMin(t: number);
    /**
     * @param t 秒
     */
    static subTime(t: number);

    /**
     * @param t 秒
     */
    static subTimeCC(t: number);

    /**
     * @param t 秒
     */
    static subTimeC(t: number, min?: string);

    /**
     * 时分秒
     */
    static subTimeHMS(t: number);
    /**
     * 00:27
     */
    static subTimeHMS_EN(t: number);

    static getTimeShow(time: number);
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
    static ShowTime(t: number, serverTime: number);

    /**
     * 获取本周几的时间戳
     * @param dayOfWeek 周几（其中 7 表示星期日，1 表示星期一，以此类推）
     * @param time HH:mm:ss
     * @returns 
     */
    static getUnixByWeek(dayOfWeek, time);
}

declare class Callback {
    private _caller: any;//调用域
    private _callback: Function;//执行方法
    static Create(caller: any, callback: Function): Callback;
    get Caller();
    get CallBack();
    Clear();
    /**执行事件*/
    Invoke(data?: any);
}

declare enum ELogLevel {
    LOG = 1,
    WARN = 2,
    ERROR = 3,
}

/**日志系统 */
declare class LogSys {

    static IsEnable: boolean;//是否开启
    static Level: ELogLevel;// = ELogLevel.LOG;//日志等级

    // static get isWx();

    private static get time();

    static Log(...args: any[]);

    static Info(...args: any[]);

    static Warn(...args: any[]);

    static Error(...args: any[]);

    // static Json(json: any) ;

    /**是否可以输出日志 */
    static CanLog(level: ELogLevel);
    /**打印堆栈 */
    static Trace(...arg:any[]);
}

declare enum SERVERTYPE {
    CLOSE = 1,//正常断线
    SELECTTYPE = 2,//选择服务器
    KickNtf = 3,//被踢下线
}
interface IProtoParse {
    // getProtoid():number;
    protoid: number;
    write(b: Laya.Byte): void;
    read(b: Laya.Byte): void;
}
interface IAudioMgr {
    PlayUI(name: string);
}
interface IE {
    EventMgr: EventManager;
    AudioMgr: IAudioMgr;
}
declare class ClientSocket {
    E: IE;
    static HeartMillisecond: number;
    serverType: number;
    getParseObj: Function;
    SetHeartbeatCall(callback: Callback);
    SetReconnectCall(callback: Callback);
    ConnectByUrl(url: string, target, callback);
    //是否是连接状态
    IsConnect(): boolean;
    //发送协议包
    binSendMsg(msg: IProtoParse);
    //关闭socket连接
    close(): void;
}

declare class EventID {
    static readonly WEBSOCKET_MESSAGE: string;             //socket消息
    static readonly WEBSOCKET_CLOSED: string;             //socket关闭
    static readonly WEBSOCKET_ERROR: string;               //socket错误
    static readonly KickNtf: string;
    static readonly ConnectRegist: string;
    static readonly WEBSOCKET_SELECTSERVER: string;
    static readonly PlayerKickTheLineNtf: string;
    static readonly WebClientRegistRsp: string;
    static readonly WebClientLoginRsp: string;
    static readonly ButtonDisable: string;
    static readonly ButtonCtlClick: string;// = "ButtonCtlClick";
    static readonly GameStart:string;
    //清理资源
    static readonly FreeRes: string;
    //纹理被销毁
    static readonly TextureDestroy:string;
}

declare class uint64 {

}

declare class StringUtil {
    /**切割字符串
   * @param value 
   * @param sprelator 标记
  */
    static SplitToString(value: string, sprelator?: string): string[];

    /**切割数字
     * @param value
     * @param sprelator 标记
    */
    static SplitToNumber(value, sprelator?: string): number[];

    private static removeTrailingZeros(num: number);

    static clearCnyDecimal(v: number);

    /**字符串转整形
     * @param str 字符串
    */
    static ParseInt(str: string): number;

    /**字符串转数字
     * @param str 字符串
    */
    static ParseNum(str: string): number;

    /**空字符串*/
    static get Empty(): string;

    /**转整型
     * @param str 数字字符串
     * @param radix 数字基数-进制
     */
    static toInt(str: string, radix?: number): number;
    /**转浮点型
     * @param str 数字字符串
    */
    static toFloat(str: string): number;

    /**
     * 获取字符串真实长度,注：
     * 1.普通数组，字符占1字节；汉子占两个字节
     * 2.如果变成编码，可能计算接口不对
     */
    static getNumBytes(str: string): number;
    /**玩家昵称超过6个字，就变成“XXXXXX...” */
    static convertName(str: string, limit?: number);

    /**
     * 补零
     * @param str
     * @param len
     * @param dir 0-后；1-前
     * @return
     */
    static addZero(str: string, len: number, dir?: number): string;
    /**
     * 去除左右空格
     * @param input
     * @return
     */
    static trim(input: string): string;

    /**
     * 去除左侧空格
     * @param input
     * @return
     */
    static trimLeft(input: string): string

    /**
     * 去除右侧空格
     * @param input
     * @return
     */
    static trimRight(input: string): string;
    /**
     * 分钟与秒格式(如-> 40:15)
     * @param seconds 秒数
     * @return
     */
    static minuteFormat(seconds: number): string;

    /**
     * 时分秒格式(如-> 05:32:20)
     * @param seconds(秒)
     * @return
     */
    static hourFormat(seconds: number): string;

    /**
     * 格式化字符串
     * @param str 需要格式化的字符串，【"杰卫，这里有{0}个苹果，和{1}个香蕉！", 5,10】
     * @param args 参数列表
     */
    static format(str: string, ...args: any[]): string;
    /**
     * 以指定字符开始
     */
    static beginsWith(input: string, prefix: string): boolean;

    /**
     * 以指定字符结束
     */
    static endsWith(input: string, suffix: string): boolean

    /**guid*/
    static getGUIDString(): string

    /**首字母大写
     * @param word 字符串
     */
    static firstUpperCase(word: string): string;

    /**格式化下划线的单词
     * 
     */
    static formatDashWord(word: string, capFirst?: boolean);

    /**
     * 截取字符串
     * @param str 字符串
     * @param start 开始位置
     * @param end 结束位置
     */
    static substring(str: string, start: number, end: number): string;

    // /**
    //  * 截取字符串
    //  * @param str 字符串
    //  * @param start 开始位置
    //  * @param long 截取长度
    //  */
    // static substr(str: string, start: number, long: number): string {
    //     return str.substr(start, long);
    // }

    /**
     * 字符串转对象
     * @param str
     */
    static strToObject(str: string);
    /**
     * 对象转字符串
     * @param obj
     */
    static objToStr(obj: Object): string;

    /**判断字符串是否为null*/
    static IsNullOrEmpty(str: string): boolean;

    /**是否包含字符串
     * @param str 字符串
     * @param item 查询字符串
    */
    static Contains(str: string, item: string): boolean;

    /**检测资源版本
    */
    static CheckResourcesVersion(path: string): string;

    private static readonly numWords: string[];
    /**数字转中文字符0-9
     * @param num 传入数字
    */
    static NumToWord(num: number): string;
    static toChinesNum(num);

    //移除注释/**/
    static replaceComments(data);

    //调用方法，传入字符串和需要返回的字节长度即可
    static CutByteLen(str, len, suffix?);



    /**
     * 大于等于9999显示10k
     * 大于等于99999999显示10m
     * 
     * 
     * @param atlas 是否是中文 
     */
    static val2m(val: number, atlas?: boolean);
    static val3m(val: number, atlas?: boolean);

    static val4m(val: number, atlas?: boolean);

    static val2Atlas(val: number);
    /**货币转化  分转元*/
    static moneyCv(v: number);

    /**0.00% */
    static toPercent(val: number | string);

    static DebugCubeText(s: string, count?: number);
}

declare class RandomUtil {
    static RandomRoundInt(min: number, max: number): number;
    static RandomRound(min: number, max: number): number;
}




/**列表工具类*/
declare class ListUtil {

    /**是否包含*/
    static Contains<T>(lst: T[], item: T): boolean;

    /**是否包含列表*/
    static ContainsArray<T>(lst1: T[], items: T[]): boolean;
    /**添加对象
     * 如果已存在也会继续添加
    */
    static Add<T>(self: T[], item: T): void;

    /**添加对象
     * 如果已存在，则不会重复添加
    */
    static SafeAdd<T>(self: T[], item: T): void;

    /**添加列表*/
    static SafeAddRange<T>(self: T[], items: T[]): void;

    /**添加列表*/
    static AddRange<T>(self: T[], items: T[]): void;

    /**移除对象*/
    static Remove<T>(self: T[], item: T);
    /**通过索引移除对象
     * @param index 索引
    */
    static RemoveAt<T>(self: T[], index: number): any;

    /**
     * 移除列表
     * 从当前列表中移除已包含的对方列表内容
     * @param self 当前列表
     * @param other 对方列表
    */
    static RemoveContainsRange<T>(self: T[], other: T[]): T[];

    /** 从己方移除未在对方列表内的对象
     * @param self 当前列表
     * @param other 对方列表
    */
    static RemoveUnContainsRange<T>(self: T[], other: T[]): T[];
    /**移除列表内所有该对象
     * @param self 当前列表
     * @param item 目标对象
    */
    static RemoveAllCotains<T>(self: T[], item: T): T[];

    /**复制列表
     * @param lst 目标列表
    */
    static Copy<T>(lst: T[]): T[];

    /**打乱*/
    static Random<T>(lst: T[]): T[];

    /**获取随机一个成员
     * @param lst 列表
     */
    static GetRandomOne<T>(lst: T[]): T;

    /**列表中随机指定数量
     * @param lst 列表
     * @param num 数量
     */
    static RandomNumFromRange<T>(lst: T[], num: number): T[];

    /**列表中随机指定数量的下标
     * @param lst 列表
     * @param num 数量
     */
    static RandomNumIndexFromRange<T>(lst: T[], num: number): number[];

    /**获取指定长度的列表
     * @param lst 列表
     * @param start 起始索引 包含当前位置
     * @param end 结束索引  不包含当前位置
    */
    static GetRange<T>(lst: T[], start: number, end: number): T[];

    /**获取由下标组成的新列表
     * @param lst 列表
     */
    static GetIndexList<T>(lst: T[]): number[];

    /**获取下标
     * @param lst 
     * @param item 
     */
    static GetIndex<T>(lst: T[], item: T): number;

    /**获取对方在己方列表中的下标
     * @param self 
     * @param other 
     */
    static GetContainsIndexList<T>(self: T[], other: T[]): number[];

    /**插入指定位置, 返回一个新列表
     * @param lst 列表
     * @param item 条目
     * @param index 下标位置
     */
    static Insert<T>(lst: T[], item: T, index: number): T[];

    /**列表是否为空*/
    static IsNullOrEmpty<T>(lst: T[]): boolean;
}

declare class TimeCtl {
    protected ticket: number;
    constructor(tf?: Laya.Label);
    setText(v: string);
    /**
     * @param s 剩余的秒
     */
    start(s: number, update?: Laya.Handler, end?: Laya.Handler);
    get tickVal(): number;

    stop();
    dispose();
}

declare class DebugUtil {
    /**紫色 */
    static COLOR_PURPLE: string;
    /**
     * 
     * @param p 
     * @param color 
     * @param w 
     * @param h 
     * @param x 
     * @param y 
     * @param full default false 是否为填充模式 
     * @param lineW 
     */
    static draw(p: Laya.Sprite, color?: string, w?: number, h?: number, x?: number, y?: number, full?: boolean, lineW?: number);
    static drawCross(p: Laya.Sprite, x?: number, y?: number, _size?: number, _color?: string);
    static drawRect(p: Laya.Sprite, x?: number, y?: number, _size?: number, _color?: string);
    static drawCirle(p: Laya.Sprite, x?: number, y?: number, _size?: number, _color?: string);
    static drawTF(view: Laya.Sprite, content: string, color?: string, ox?: number, oy?: number);
    static createTf();
}
/**
 * 时间戳控制器
 */
declare class TimeCheckCtl {
    constructor();
    setTime(ms: number, actionHandler: Laya.Handler);
    delayStart();
    start();
    dispose();
}

declare class EventManager {
    Init(): boolean;
    Clear();
    //发送事件
    emit(eventId: string, data?: any): void;
    //添加普通事件
    on(eventName: string, target: any, callback: Function): void;
    //通过事件名和target移除一个监听器
    off(eventName: string, target: any, callback: any): void;
}

declare class Dictionary<K, V>{

    constructor();

    /**转为json*/
    ToJsonObj(): any;

    /**json转对象*/
    FromJsonObj(obj: any): void;

    /**添加*/
    Add(key, value): boolean;

    /**移除*/
    Remove(key): void;

    /**获取key*/
    Key(value);
    /**获取value*/
    Value(key);

    /**通过条件获取value lst
     * @param value 判断条件
    */
    TryGetValueListByCondition(value);

    /**通过条件获取获取 */
    TryGetAnyByCondition(value);

    /**通过条件获取key lst*/
    TryGetKeyListByCondition(func);

    /**是否含有key*/
    HasKey(key): boolean;

    /**key 为number 类型 ，可以从小到大从新排序*/
    SortByKey(): boolean;

    /**获取长度*/
    GetLength(): number;

    /**通过索引获取value*/
    GetValueByIndex(idx: number);

    /**通过索引获取key*/
    GetKeyByIndex(idx: number);

    /**获取所有value*/
    Values();

    /**获取所有key*/
    Keys();

    /**清除*/
    Clear(): void;

    /**遍历执行-不会中断*/
    Foreach(func);
}

declare class ButtonCtl {
    /**是否使用按钮控制器失效 */
    static disable: boolean;
    static E: IE;
    skin: Laya.Sprite;
    protected clickHandler: Laya.Handler;
    //  data:any;
    /**是否是用按钮音效果 */
    useSound: boolean;
    bStopPropagation: boolean;
    set visible(v);
    get visible();
    get isOpen();

    set bgSkin(url: string);
    set gray(v: boolean);

    static Create(skin: Laya.Sprite, onClick?: Laya.Handler, scaleAnim?: boolean);
    /**
     * 
     * @param skin 
     * @param that 
     * @param func 
     * @param scaleAnim default true 是否有动画
     * @param args 
     * @param bStopPropagation 
     */
    static CreateBtn(skin: Laya.Sprite, that, func: Function, scaleAnim?: boolean, args?, bStopPropagation?: boolean);
    /**
     * 按钮延时触发(秒)
     */
    setDelayTime(s: number);

    constructor(skin: Laya.Sprite, onClick?: Laya.Handler, scaleAnim?: boolean);
    set mouseEnable(v: boolean);
    set mouseThrough(v: boolean);
    set grayMouseDisable(v: boolean);

    protected playSound();
    setpos(x: number, y: number);
    /**设置可点击碰撞区域 */
    set hitRect(v: Laya.Rectangle);
    setX(v: number);
    getX();
    getY();
    setY(v: number);
    dispose();
}


interface ICheckBoxSkin {
    bg: Laya.Image;
    gou: Laya.Image;
    // content: Laya.Label;
}

declare class CheckBoxCtl {
    //  clickhadnler:Laya.Handler;
    bg: Laya.Image;
    skin: ICheckBoxSkin;
    selectHander: Laya.Handler;
    constructor(skin: ICheckBoxSkin, contentStr?: string);
    set selected(v);
    get selected();
    set visible(v);
    dispose();
    /**失活 */
    set disable(v: boolean);
    set gray(v:boolean);
    checkHandler:Laya.Handler;
}
//=======================================================================================
declare class TabControl{
    static Create(target,selHandler: Function, itemHandler: Function) ;
    selectIndex:number;
    init(items: Laya.Sprite[], selHandler: Laya.Handler, itemHandler?: Laya.Handler) ;
    onItemClick(i:number);
    items: Laya.Sprite[];
    setData(data);
    forceSelectIndex(v:number);
    dispose();

     /**
     * @param skins 
     * @param styles 索引0 选择样式 索引1 未选择的样式
     * @param selectHandler 
     * @param labs "页签2|页签1"
     */
    static createTabCtl(skins:Laya.Sprite[],styles:ITabSelectStyle[],selectHandler:Laya.Handler,labs:string):ITabControl;
}

interface ITabSelectStyle{
    color:string;
    strokeColor:string;
    skin:string;
}
interface ITabControl{
    selectIndex:number;
    dispose();
}
//=======================================================================

declare class HttpUtil{
    public static E:IE;
    public static httpGet(url,callBack:Laya.Handler,errHandler?:Laya.Handler);
    public static httpPost(url,data: any,callBack?:Laya.Handler);
}

declare class LayoutUtil {
    /**横向布局居中*/
    static CenterLayout(container: Laya.Sprite, cellW: number, gap: number, row: number) ;
}