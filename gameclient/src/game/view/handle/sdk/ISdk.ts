import { SdkPlayerData } from "../weixin/sy-sdk/interface";

export enum ESdkValChange{
    /**等级变化 */
    LevelUp = 1,
    /**战斗力变化 */
    Plus = 2,
    /**进入游戏 */
    EnterGame = 3,
    /**创角 */
    CreateRole = 4,
}
export interface ISizePos{
    x,y,w,h;
}
export function getPosSize(spr:Laya.Sprite):ISizePos{
    // let wx = E.wx;
    // let info = wx.getSystemInfoSync();
    // let w = info.screenWidth;
    // let h = info.screenHeight;
    // // console.log(info);
    // let percent = w / Laya.stage.width;

    // let rw = spr.width * percent;
    // let rh = spr.height * percent;
    // let pos = new Laya.Point();

    // if(spr.parent){
    //     pos = (spr.parent as Laya.Sprite).localToGlobal(new Laya.Point(spr.x,spr.y));
    // }
    // let obj = {} as ISizePos;
    // obj.w = rw;
    // obj.h = rh;
    // obj.x =  pos.x / Laya.stage.width * w;
    // obj.y = pos.y / Laya.stage.height * h;
    // return obj;

    let w,h;
    if(typeof wx != "undefined" && wx){
        let info = wx.getSystemInfoSync();
        w = info.screenWidth;
        h = info.screenHeight;
    }
    else{
        w = Laya.stage.width;
        h = Laya.stage.height;
    }
    // console.log(info);
    let percent = w / Laya.stage.width;

    // console.log("percent:",percent,Laya.Browser.pixelRatio);

    let rw = spr.width * percent;
    let rh = spr.height * percent;

    let pos = new Laya.Point();
    if(spr.parent){
        pos = (spr.parent as Laya.Sprite).localToGlobal(new Laya.Point(spr.x,spr.y));
    }
    let obj = {} as ISizePos;
    obj.w = rw;
    obj.h = rh;
    obj.x =  pos.x / Laya.stage.width * w;
    obj.y = pos.y / Laya.stage.height * h;
    return obj;
}
export interface IAppScene{
    scene:number;
}
export interface ISdk {
    /**是否是白名单 */
    isWhite:boolean;
    /**玩家年龄 */
    age:number;
    /**是否有快捷方式 */
    hasShortcut:boolean;
    /**SDK类型 */
    // type:ESdkType;
    /**加载字体 */
    loadFont(jsonData, _fontLoadEnd: Laya.Handler);
    /**转化字体的font str */
    convertFont(fontName: string): string;

    /**观看视频*/
    lookVideo(callback: (type: 0 | 1 | 2) => void);
    /**数值变化 */
    valChange(type:ESdkValChange,v:number);
    /**
     * @param oderId 订单id
     * @param cny 元
     */
    recharge(oderId:string,cfg:Configs.t_Recharge_dat);

    init(): void;
    login(that,callBack): void;
    setPlayerData(playerData: SdkPlayerData): void;
    getOpenId(): string;
    pay(payData: any): void;
    getSubscribe(templates: string[]): void;
    goShareData(shareQueryParam: string,that?,callBack?:Function): void;
    getWechatNickname(successCallback, failCallback): void;
    /**appid */
    getAppId():string;
    onShow(query: any): void;
    onHide():void;
    // cbsgTunnelOpenType:number;
    /**渠道id */
    cbsgTunnelId:number;
    /**游戏圈数据 */
    getGameClubData(callback: Function): { join: boolean, like: number, publish: number };
    getAuth(callback: Function): any;
    /**客户端类型 */
    clienttype:number;

    /**SDK登录成功之后回调 */
    loginCallBack();
    
    /**是否从侧边栏进入的 */
    isFromSidebarCard;
    /**剪切文本 */
    setCopy(str:string);

    /**是否来自桌面 */
    isFromDesk(obj:IAppScene):boolean;
    /**场景值 */
    scene:string;
    /**添加桌面快捷方式 */
    addShortcut();

    /**前置初始化 */
    preInit(that,func:Function);
    /**重新H5页面刷新游戏 */
    reload();
    /**token的值 */
    getToken();
    /**标题的spine文件夹*/
    // getSpineTitle();
    /**渠道id */
    getChanenlId();
    /**状态栏高度 */
    statusBarHeight:number;
    /**底部状态高度 */
    bottomInset:number;
    /**前往Taptap */
    gotoTapTap(url:string,that?,callBack?:Function);
    /**获取年龄 */
    getAge(that:any,callBack:Function);
    taptapInit();
    canFreeLook:boolean;
    /**tap事件上报 */
    taptapTrack(eventName:string,param?);
    /**检测更新 */
    checkUpdate();
}

export interface IUserInfo{
    /**app头像 */
    avatarUrl:string;
    /**昵称 */
    nickName:string;
}