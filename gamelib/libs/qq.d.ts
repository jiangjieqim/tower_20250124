// declare module laya.qq.mini {
//   import Handler = laya.utils.Handler;
//   class QQMiniAdapter {
//     static EnvConfig: any;
//     /**全局window对象**/
//     static window: any;
//     static systemInfo: any;
//     static isZiYu: boolean;
//     static isPosMsgYu: boolean;
//     /**是否自动缓存下载的图片跟声音文件，默认为true**/
//     static autoCacheFile: boolean;
//     /**50M缓存容量满时每次清理容量值,默认每次清理5M**/
//     static minClearSize: number;
//     /**本地资源列表**/
//     static nativefiles: Array<any>;
//     /**本地分包资源表**/
//     static subNativeFiles: any;
//     /**本地分包文件目录数组**/
//     static subNativeheads: Array<any>;
//     /**本地分包文件目录映射表**/
//     static subMaps: Array<any>;
//     static AutoCacheDownFile: boolean;
//     static getJson(data: string): any;
//     /**激活微信小游戏适配器*/
//     static enable(): void;
//     /**
//      * 初始化回调
//      * @param isPosMsg 是否需要在主域中自动将加载的文本数据自动传递到子域，默认 false
//      * @param isSon 是否是子域，默认为false
//      */
//     static init(isPosMsg?: boolean, isSon?: boolean): void;
//     /**
//      * 获取url对应的encoding值
//      * @param url 文件路径
//      * @param type 文件类型
//      * @return
//      */
//     static getUrlEncode(url: string, type: string): string;
//     /**
//      * 下载文件
//      * @param fileUrl 文件地址(全路径)
//      * @param fileType 文件类型(image、text、json、xml、arraybuffer、sound、atlas、font)
//      * @param callBack 文件加载回调,回调内容[errorCode码(0成功,1失败,2加载进度)
//      * @param encoding 文件编码默认utf8，非图片文件加载需要设置相应的编码，二进制编码为空字符串
//      */
//     static downLoadFile(fileUrl: string, fileType?: string, callBack?: Handler, encoding?: string): void;
//     /**
//      * 从本地删除文件
//      * @param fileUrl 文件地址(全路径)
//      * @param callBack 回调处理，在存储图片时用到
//      */
//     static remove(fileUrl: string, callBack?: Handler): void;
//     /**
//      * 清空缓存空间文件内容
//      */
//     static removeAll(): void;
//     /**
//      * 判断是否是4M包文件
//      * @param fileUrl 文件地址(全路径)
//      * @return
//      */
//     static hasNativeFile(fileUrl: string): boolean;
//     /**
//      * 判断缓存里是否存在文件
//      * @param fileUrl 文件地址(全路径)
//      * @return
//      */
//     static getFileInfo(fileUrl: string): any;
//     /**
//      * 获取缓存文件列表
//      * @return
//      */
//     static getFileList(): any;
//     static exitMiniProgram(): void;
//     static pixelRatio(): number;
//     static createElement(type: string): any;
//     static createShaderCondition(conditionScript: string): Function;
//     /**
//      * 传递图集url地址到
//      * @param url 为绝对地址
//      */
//     static sendAtlasToOpenDataContext(url: string): void;
//     /**
//      * 发送单张图片到开放数据域
//      * @param url
//      */
//     static sendSinglePicToOpenDataContext(url: string): void;
//     /**
//      * 传递json配置数据到开放数据域
//      * @param url 为绝对地址
//      */
//     static sendJsonDataToDataContext(url: string): void;
//   }
// }

declare namespace qq {
  //#region 补充

  /**创建授权个人信息按钮*/
  export function getUserInfo(obj: any): void;

  export function getSystemInfoSync(): any;

  export function createUserInfoButton(obj: any);
  /**显示分享菜单*/
  export function showShareMenu(): void;
  /**检测右上分享*/
  export function onShareAppMessage(obj: any): void;
  /**自定义按键主动拉起分享*/
  export function shareAppMessage(obj: any): void;

  /**保存图片到相册*/
  export function saveImageToPhotosAlbum(obj: any): void;

  export function previewImage(obj: any): void;

  /**打开设置*/
  export function openSetting(obj: any);
  /**登录*/
  export function login(obj: any);
  /**获取设置*/
  export function getSetting(obj: any): void;
  /***/
  export function canvasToTempFilePath(obj: any);
  /**获取权限*/
  export function authorize(obj: any);
  /**获取图片信息*/
  export function getImageInfo(obj: any);
  /**下载*/
  export function downloadFile(obj: any);
  /**创建视频*/
  export function createVideo(obj: any): void;


  /**显示弹窗*/
  export function showToast(obj: any): void;

  /**显示Loading*/
  export function showLoading(object: any): void;
  /**隐藏loading*/
  export function hideLoading(): void;

  /**对话窗*/
  export function showModal(object: any): void;

  /**创建banner广告*/
  export function createBannerAd(obj: any): any;
  /**创建激励视频*/
  export function createRewardedVideoAd(obj: any): any;
  /**广告盒子*/
  export function createAppBox(obj: any): any;
  /**插屏广告*/
  export function createInterstitialAd(obj: any): any;

  /**获取到开放域*/
  export function getOpenDataContext(): any;
  /**上传云数据*/
  export function setUserCloudStorage(obj: any): void;
  /**获取小程序启动时的参数*/
  export function getLaunchOptionsSync(): any;
  /**创建音效播放器*/
  export function createInnerAudioContext(): any;
  /**退出小程序*/
  export function exitMiniProgram();
  //#endregion
}

declare namespace wx {
  /**监听回到前台*/
  export function onShow(callback: Function);
  /**取消回到前台监听*/
  export function offShow(callback: Function);
  /**监听到后台*/
  export function onHide(callback: Function);
  /**取消到后台监听*/
  export function offHide(callback: Function);
  /**创建授权个人信息按钮*/
  export function createUserInfoButton(obj: any);
  /**显示分享菜单*/
  export function showShareMenu(): void;
  /**检测右上分享*/
  export function onShareAppMessage(obj: any): void;
  /**自定义按键主动拉起分享*/
  export function shareAppMessage(obj: any): void;

  /**显示弹窗*/
  export function showToast(obj: any): void;
  /**保存图片到相册*/
  export function saveImageToPhotosAlbum(obj: any): void;
  /**打开设置*/
  export function openSetting(obj: any);
  /**登录*/
  export function login(obj: any);
  /**获取设置*/
  export function getSetting(obj: any): void;
  /** */
  export function canvasToTempFilePath(obj: any);
  /**获取权限*/
  export function authorize(obj: any);
  /**获取图片信息*/
  export function getImageInfo(obj: any);
  /**下载*/
  export function downloadFile(obj: any);
  /**Loading*/
  export function showLoading(obj: any): void;
  export function hideLoading(): void;

  /**对话窗*/
  export function showModal(obj: any): void;

  /**创建视频*/
  export function createVideo(obj: any): void;

  /**获取到开放域*/
  export function getOpenDataContext(): any;

  /**获取小程序启动时的参数*/
  export function getLaunchOptionsSync(): any;

  /**创建banner广告*/
  export function createBannerAd(obj: any): any;
  /**创建激励视频*/
  export function createRewardedVideoAd(obj: any): any;
  /**创建格子广告*/
  export function createGridAd(obj: any): any;
  /**创建插屏广告*/
  export function createInterstitialAd(obj: any): any;
  /**创建原生模板广告组件*/
  export function createCustomAd(obj: any): any;

  /**退出小程序*/
  export function exitMiniProgram();

  /**创建一个画布对象*/
  export function createCanvas(): any;
  /**创建一个图片对象*/
  export function createImage(): any;
  /**获取全局唯一的文件管理器*/
  export function getFileSystemManager(): any;

  /**加载字体 */
  export function loadFont(path: string): string;
  /**加载分包*/
  export function loadSubpackage(obj: any): any;

  /**创建音频*/
  export function createInnerAudioContext(): any;
  /**垃圾回收*/
  export function triggerGC();
  /**修改渲染帧率*/
  export function setPreferredFramesPerSecond(fps:number);
}


declare module Laya {
  // class QQMiniAdapter extends laya.qq.mini.QQMiniAdapter {
  // }
}